import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { messageAPI } from '../api';
import { useSocket } from '../context/SocketContext';
import { FiSend } from 'react-icons/fi';
import './Messages.css'; // Make sure this path is correct

const Messages = () => {
  const { userId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const endRef = useRef(null);

  // Fetch Conversation
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    messageAPI.getConversation(userId)
      .then((res) => setMessages(res.data.messages))
      .finally(() => setLoading(false));
  }, [userId]);

  // Socket Handler
  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      // Check if message belongs to this conversation
      const isSender = msg.sender === userId || msg.sender?._id === userId;
      const isReceiver = msg.receiver === userId; // Assuming receiver is ID string in socket payload
      
      if (isSender || isReceiver) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('receive_message', handler);
    return () => socket.off('receive_message', handler);
  }, [socket, userId]);

  // Auto Scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (socket) {
      socket.emit('send_message', { receiver: userId, text: input.trim() });
    } else {
      messageAPI.send({ receiver: userId, text: input.trim() }).then((res) => {
        setMessages((prev) => [...prev, res.data.message]);
      });
    }
    setInput('');
  };

  if (loading) return (
    <div className="airbnb-container">
      <div className="skeleton-loader">Loading...</div>
    </div>
  );

  return (
    <div className="airbnb-container">
      {/* Header */}
      <div className="messages-header">
        <h1>Messages</h1>
        <p className="header-subtitle">Guest / Host messages</p>
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✉️</div>
              <h2>You don't have any messages</h2>
              <p>Messages from your trips and hosts will appear here.</p>
            </div>
          ) : (
            messages.map((m, i) => {
              const senderId = m.sender?._id || m.sender;
              const isMe = senderId === user._id;
              
              return (
                <div key={m._id || i} className={`chat-bubble-container ${isMe ? 'me' : 'them'}`}>
                  <div className="chat-bubble">
                    <p className="message-text">{m.text}</p>
                    <span className="chat-time">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>

        {/* Input Area */}
        <form className="chat-input-area" onSubmit={handleSend}>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Message your host..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="send-button" 
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <FiSend />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Messages;