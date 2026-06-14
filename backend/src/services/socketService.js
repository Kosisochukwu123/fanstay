const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

const buildConversationId = (id1, id2) => [id1.toString(), id2.toString()].sort().join('_');

module.exports = function initSocket(io) {
  // Authenticate socket connections using JWT
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.cookie?.split('token=')[1]?.split(';')[0];

      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    // Each user joins a room keyed by their own userId for direct notifications
    socket.join(socket.userId);

    socket.on('send_message', async ({ receiver, text, property }) => {
      try {
        const conversationId = buildConversationId(socket.userId, receiver);

        const message = await Message.create({
          conversationId,
          sender: socket.userId,
          receiver,
          property: property || null,
          text,
        });

        const populated = await message.populate('sender', 'name avatar');

        // Emit to both participants
        io.to(receiver).emit('receive_message', populated);
        io.to(socket.userId).emit('receive_message', populated);

        // Push notification event (bonus feature placeholder)
        io.to(receiver).emit('notification', {
          type: 'new_message',
          message: `New message from ${populated.sender.name}`,
        });
      } catch (err) {
        socket.emit('error_message', { message: 'Failed to send message' });
      }
    });

    socket.on('typing', ({ receiver }) => {
      io.to(receiver).emit('typing', { sender: socket.userId });
    });

    socket.on('disconnect', () => {
      // cleanup if needed
    });
  });
};
