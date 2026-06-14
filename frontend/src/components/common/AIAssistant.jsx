import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { assistantAPI } from '../../api';
import './AIAssistant.css';

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm your FanStay travel assistant. Ask me about upcoming events or where to stay!" },
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { from: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const res = await assistantAPI.query(userMessage);
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text: res.data.reply,
          properties: res.data.properties,
          events: res.data.events,
        },
      ]);
    } catch {
      setMessages((prev) => [...prev, { from: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant">
      {open && (
        <div className="ai-window">
          <div className="ai-header">
            <span>FanStay Assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close assistant"><FiX /></button>
          </div>
          <div className="ai-body">
            {messages.map((m, i) => (
              <div key={i} className={`ai-message ${m.from}`}>
                <p>{m.text}</p>
                {m.events?.length > 0 && (
                  <div className="ai-suggestions">
                    {m.events.map((ev) => (
                      <Link key={ev._id} to={`/events/${ev._id}`} className="ai-suggestion-chip">
                        {ev.eventName}
                      </Link>
                    ))}
                  </div>
                )}
                {m.properties?.length > 0 && (
                  <div className="ai-suggestions">
                    {m.properties.map((p) => (
                      <Link key={p._id} to={`/properties/${p._id}`} className="ai-suggestion-chip">
                        {p.title} — ${p.pricePerNight}/night
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="ai-message bot"><p>Thinking...</p></div>}
            <div ref={endRef} />
          </div>
          <form className="ai-input-row" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask about events or stays..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" aria-label="Send"><FiSend /></button>
          </form>
        </div>
      )}
      <button className="ai-toggle" onClick={() => setOpen(!open)} aria-label="Open travel assistant">
        {open ? <FiX /> : <FiMessageCircle />}
      </button>
    </div>
  );
};

export default AIAssistant;
