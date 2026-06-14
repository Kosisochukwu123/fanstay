import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventAPI } from '../api/eventAPI';
import EventCard from '../components/event/EventCard';
import { EventCardSkeleton } from '../components/common/Skeletons';
import './Events.css';

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setLoading(true);
    eventAPI
      .getAll({ search: searchParams.get('search') || undefined, upcoming: true, limit: 24 })
      .then((res) => setEvents(res.data.events))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    setSearchParams(params);
  };

  return (
    <div className="events-page container">
      <div className="events-header">
        <h1>Upcoming Sporting Events</h1>
        <p>Discover major sporting events and find stays nearby.</p>
        <form className="events-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by event name or city"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="events-page-grid">
          {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
        </div>
      ) : events.length === 0 ? (
        <p className="empty-text">No events found.</p>
      ) : (
        <div className="events-page-grid">
          {events.map((event) => <EventCard key={event._id} event={event} />)}
        </div>
      )}
    </div>
  );
};

export default Events;
