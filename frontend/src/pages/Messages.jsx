import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { messageAPI } from '../api';
import { useSocket } from '../context/SocketContext';
import { FiSend } from 'react-icons/fi';
import './Messages.css';

const Messages = () => {
  const { userId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const endRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    messageAPI.getConversation(userId).then((res) => setMessages(res.data.messages)).finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if (msg.sender === userId || msg.receiver === userId || msg.sender._id === userId || msg.receiver === userId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('receive_message', handler);
    return () => socket.off('receive_message', handler);
  }, [socket, userId]);

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

  if (loading) return <div className="container"><p>Loading conversation...</p></div>;

  return (
    <div className="container messages-page">
      <h1>Conversation</h1>
      <div className="chat-window">
        <div className="chat-messages">
          {messages.length === 0 && <p className="empty-text">No messages yet. Say hello!</p>}
          {messages.map((m, i) => {
            const senderId = m.sender?._id || m.sender;
            const isMe = senderId === user._id;
            return (
              <div key={m._id || i} className={`chat-bubble ${isMe ? 'me' : 'them'}`}>
                <p>{m.text}</p>
                <span className="chat-time">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        <form className="chat-input-row" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" aria-label="Send"><FiSend /></button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
