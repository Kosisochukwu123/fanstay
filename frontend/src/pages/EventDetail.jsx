import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { eventAPI } from '../api/eventAPI';
import { propertyAPI } from '../api/propertyAPI';
import PropertyCard from '../components/property/PropertyCard';
import { PropertyCardSkeletonGrid, PageSkeleton } from '../components/common/Skeletons';
import { FiMapPin, FiCalendar } from 'react-icons/fi';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProps, setLoadingProps] = useState(true);

  useEffect(() => {
    eventAPI.getOne(id).then((res) => setEvent(res.data.event)).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!event) return;
    propertyAPI
      .getAll({ event: event.eventName, limit: 8 })
      .then((res) => setProperties(res.data.properties))
      .finally(() => setLoadingProps(false));
  }, [event]);

  if (loading) return <div className="container"><PageSkeleton /></div>;
  if (!event) return <div className="container"><p className="empty-text">Event not found.</p></div>;

  const imageUrl = event.image?.url || 'https://placehold.co/1200x500?text=Sporting+Event';

  return (
    <div className="event-detail">
      <div className="event-detail-banner" style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className="event-detail-overlay" />
        <div className="container event-detail-banner-content">
          <h1>{event.eventName}</h1>
          <p><FiMapPin /> {event.stadium}, {event.city}, {event.country}</p>
          <p><FiCalendar /> {new Date(event.eventDate).toDateString()}</p>
        </div>
      </div>

      <div className="container event-detail-body">
        <section className="event-description">
          <h2>About this event</h2>
          <p>{event.description}</p>
        </section>

        <section className="event-properties">
          <h2>Stays near {event.eventName}</h2>
          {loadingProps ? (
            <PropertyCardSkeletonGrid count={4} />
          ) : properties.length === 0 ? (
            <p className="empty-text">No accommodations listed near this event yet.</p>
          ) : (
            <div className="properties-grid">
              {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default EventDetail;
