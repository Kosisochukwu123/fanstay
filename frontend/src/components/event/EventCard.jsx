import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import './EventCard.css';

const EventCard = ({ event }) => {
  const imageUrl = event.image?.url || 'https://placehold.co/400x300?text=Sporting+Event';
  const date = new Date(event.eventDate);

  return (
    <Link to={`/events/${event._id}`} className="event-card">
      <div className="event-card-image-wrap">
        <img src={imageUrl} alt={event.eventName} loading="lazy" />
        <div className="event-date-badge">
          <span className="event-date-day">{date.getDate()}</span>
          <span className="event-date-month">{date.toLocaleString('default', { month: 'short' })}</span>
        </div>
      </div>
      <div className="event-card-body">
        <h3>{event.eventName}</h3>
        <p className="event-meta"><FiMapPin /> {event.stadium}, {event.city}</p>
        <p className="event-meta"><FiCalendar /> {date.toDateString()}</p>
      </div>
    </Link>
  );
};

export default EventCard;
