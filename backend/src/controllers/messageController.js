const Message = require('../models/Message');
const { asyncHandler } = require('../middleware/errorMiddleware');

const buildConversationId = (id1, id2) => [id1.toString(), id2.toString()].sort().join('_');

// @desc    Get conversation history with another user
// @route   GET /api/messages/:userId
// @access  Private
exports.getConversation = asyncHandler(async (req, res) => {
  const conversationId = buildConversationId(req.user._id, req.params.userId);

  const messages = await Message.find({ conversationId }).sort('createdAt');

  // Mark messages sent to me as read
  await Message.updateMany(
    { conversationId, receiver: req.user._id, read: false },
    { $set: { read: true } }
  );

  res.status(200).json({ success: true, messages });
});

// @desc    Get list of conversations for current user (inbox)
// @route   GET /api/messages
// @access  Private
exports.getInbox = asyncHandler(async (req, res) => {
  const messages = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$conversationId',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$receiver', req.user._id] }, { $eq: ['$read', false] }] },
              1,
              0,
            ],
          },
        },
      },
    },
    { $sort: { 'lastMessage.createdAt': -1 } },
    // Determine the "other" participant (whichever of sender/receiver isn't the current user)
    {
      $addFields: {
        otherUserId: {
          $cond: [
            { $eq: ['$lastMessage.sender', req.user._id] },
            '$lastMessage.receiver',
            '$lastMessage.sender',
          ],
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'otherUserId',
        foreignField: '_id',
        as: 'otherUser',
      },
    },
    { $unwind: { path: '$otherUser', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        unreadCount: 1,
        'lastMessage.text': 1,
        'lastMessage.createdAt': 1,
        'lastMessage.sender': 1,
        'lastMessage.receiver': 1,
        'otherUser._id': 1,
        'otherUser.name': 1,
        'otherUser.avatar': 1,
        'otherUser.role': 1,
      },
    },
  ]);

  res.status(200).json({ success: true, conversations: messages });
});

// @desc    Send a message (REST fallback; primary path is via Socket.IO)
// @route   POST /api/messages
// @access  Private
exports.sendMessage = asyncHandler(async (req, res) => {
  const { receiver, text, property } = req.body;

  const conversationId = buildConversationId(req.user._id, receiver);

  const message = await Message.create({
    conversationId,
    sender: req.user._id,
    receiver,
    property: property || null,
    text,
  });

  res.status(201).json({ success: true, message });
});
