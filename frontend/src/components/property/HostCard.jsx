import { FiCheckCircle, FiMessageSquare } from 'react-icons/fi';
import './HostCard.css';

const HostCard = ({ host, propertyRating, reviewCount, onMessage }) => {
  if (!host) return null;

  const yearsHosting = host.createdAt
    ? Math.max(1, new Date().getFullYear() - new Date(host.createdAt).getFullYear())
    : 1;

  return (
    <section className="host-card-section">
      <h2>Meet your host</h2>
      <div className="host-card">
        <div className="host-card-top">
          <div className="host-avatar-wrap">
            <img
              src={host.avatar?.url || `https://i.pravatar.cc/120?u=${host._id}`}
              alt={host.name}
              className="host-avatar"
            />
            {host.isHostVerified && <span className="host-verified-icon"><FiCheckCircle /></span>}
          </div>
          <h3>{host.name}</h3>
          {host.isHostVerified && <span className="host-superhost-label"><FiCheckCircle /> Superhost</span>}
        </div>

        <div className="host-stats">
          <div className="host-stat">
            <strong>{reviewCount}</strong>
            <span>Reviews</span>
          </div>
          <div className="host-stat">
            <strong>{propertyRating?.average?.toFixed(2) || '—'}★</strong>
            <span>Rating</span>
          </div>
          <div className="host-stat">
            <strong>{yearsHosting}</strong>
            <span>Years hosting</span>
          </div>
        </div>
      </div>

      {host.isHostVerified && (
        <div className="host-superhost-info">
          <h4>{host.name} is a Superhost</h4>
          <p>Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
        </div>
      )}

      <button className="btn btn-secondary host-message-btn" onClick={onMessage}>
        <FiMessageSquare /> Message Host
      </button>
    </section>
  );
};

export default HostCard;