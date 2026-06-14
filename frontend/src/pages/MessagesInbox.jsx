import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { messageAPI } from '../api';
import { PageSkeleton } from '../components/common/Skeletons';
import './MessagesInbox.css';

/**
 * Inbox view at /messages - lists all conversations for the current user,
 * each linking to the full chat at /messages/:userId.
 * Matches Airbnb's "Messages" entry in the nav/menu.
 */
const MessagesInbox = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    messageAPI
      .getInbox()
      .then((res) => setConversations(res.data.conversations))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><PageSkeleton /></div>;

  return (
    <div className="container messages-inbox-page">
      <h1>Messages</h1>

      {conversations.length === 0 ? (
        <p className="empty-text">
          You don't have any messages yet. Start a conversation from a property or event page.
        </p>
      ) : (
        <ul className="conversation-list">
          {conversations.map((conv) => {
            const other = conv.otherUser;
            if (!other) return null;
            const isUnread = conv.unreadCount > 0;

            return (
              <li key={conv._id}>
                <Link to={`/messages/${other._id}`} className={`conversation-item ${isUnread ? 'unread' : ''}`}>
                  <img
                    src={other.avatar?.url || `https://i.pravatar.cc/100?u=${other._id}`}
                    alt={other.name}
                    className="conversation-avatar"
                  />
                  <div className="conversation-info">
                    <div className="conversation-top-row">
                      <strong>{other.name}</strong>
                      <span className="conversation-time">
                        {new Date(conv.lastMessage.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="conversation-preview">{conv.lastMessage.text}</p>
                  </div>
                  {isUnread && <span className="conversation-unread-badge">{conv.unreadCount}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MessagesInbox;