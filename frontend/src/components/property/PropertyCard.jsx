import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiStar, FiCheckCircle } from 'react-icons/fi';
import { useState } from 'react';
import { propertyAPI } from '../../api/propertyAPI';
import { toast } from 'react-toastify';
import './PropertyCard.css';

const PropertyCard = ({ property, isFavorite: initialFavorite = false }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please log in to save favorites');
      return;
    }
    try {
      const res = await propertyAPI.toggleFavorite(property._id);
      setIsFavorite(res.data.favorited);
    } catch {
      toast.error('Could not update favorites');
    }
  };

  const imageUrl = property.images?.[0]?.url || 'https://placehold.co/400x300?text=FanStay';
  const isGuestFavorite = property.rating?.average >= 4.7 && property.rating?.count >= 5;

  return (
    <Link to={`/properties/${property._id}`} className="property-card">
      <div className="property-card-image-wrap">
        <img src={imageUrl} alt={property.title} loading="lazy" />
        {isGuestFavorite && <span className="guest-favorite-badge">Guest favorite</span>}
        <button className="favorite-btn" onClick={handleFavorite} aria-label="Toggle favorite">
          <FiHeart className={isFavorite ? 'filled' : ''} />
        </button>
        {property.nearbyEvent && (
          <span className="event-tag">
            Near: {property.nearbyEvent.eventName || 'Sporting Event'}
          </span>
        )}
      </div>
      <div className="property-card-body">
        <div className="property-card-top">
          <h3 className="property-title">{property.location?.city}, {property.location?.country}</h3>
          {property.rating?.average > 0 && (
            <span className="property-rating">
              <FiStar /> {property.rating.average.toFixed(1)}
            </span>
          )}
        </div>
        <p className="property-location">{property.title}</p>
        {property.host?.isHostVerified && (
          <span className="verified-badge"><FiCheckCircle /> Verified Host</span>
        )}
        <p className="property-price">
          <strong>${property.pricePerNight}</strong> night
        </p>
      </div>
    </Link>
  );
};

export default PropertyCard;