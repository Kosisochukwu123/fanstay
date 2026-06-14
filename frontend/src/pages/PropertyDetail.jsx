import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { propertyAPI } from '../api/propertyAPI';
import { reviewAPI } from '../api';
import ImageGallery from '../components/property/ImageGallery';
import BookingWidget from '../components/booking/BookingWidget';
import MiniMapPreview from '../components/property/MiniMapPreview';
import RatingOverview from '../components/property/RatingOverview';
import HostCard from '../components/property/HostCard';
import { ReviewList, ReviewForm } from '../components/review/Reviews';
import { PageSkeleton } from '../components/common/Skeletons';
import { FiStar, FiUsers, FiHome, FiDroplet, FiAward } from 'react-icons/fi';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([propertyAPI.getOne(id), reviewAPI.getForProperty(id)])
      .then(([propRes, reviewRes]) => {
        setProperty(propRes.data.property);
        setReviews(reviewRes.data.reviews);
      })
      .catch(() => toast.error('Failed to load property'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReviewSubmit = async () => {
    toast.info('Note: reviews can only be submitted for a completed booking of this property.');
  };

  const handleMessageHost = () => {
    if (!isAuthenticated) {
      toast.info('Please log in to message the host');
      navigate('/login');
      return;
    }
    navigate(`/messages/${property.host._id}`);
  };

  const handleToggleFavorite = async () => {
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

  const scrollToReviews = () => {
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div className="container"><PageSkeleton /></div>;
  if (!property) return <div className="container"><p className="empty-text">Property not found.</p></div>;

  const isGuestFavorite = property.rating?.average >= 4.7 && property.rating?.count >= 5;

  return (
    <div className="property-detail">
      {/* Image gallery - mobile carousel + desktop grid */}
      <div className="container">
        <ImageGallery
          images={property.images}
          title={property.title}
          onBack={() => navigate(-1)}
          onFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />
      </div>

      <div className="container property-detail-layout">
        <div className="property-detail-main">
          {/* Title + rating row */}
          <div className="property-detail-header">
            <h1>{property.title}</h1>
            <div className="property-detail-meta">
              {property.rating?.average > 0 && (
                <span className="meta-rating">
                  <FiStar className="filled" /> {property.rating.average.toFixed(2)}
                </span>
              )}
              {isGuestFavorite && (
                <span className="meta-guest-favorite"><FiAward /> Guest favorite</span>
              )}
              <span className="meta-reviews">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              <span className="meta-location">{property.location.city}, {property.location.country}</span>
            </div>
          </div>

          {/* Hosted by row */}
          <div className="property-detail-host-row">
            <div>
              <p className="hosted-by-text">
                Entire rental unit hosted by <strong>{property.host?.name}</strong>
              </p>
              <p className="property-detail-subline">
                {property.maxGuests} guests · {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''} · {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''} · {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
              </p>
            </div>
            <img
              src={property.host?.avatar?.url || `https://i.pravatar.cc/100?u=${property.host?._id}`}
              alt={property.host?.name}
              className="hosted-by-avatar"
            />
          </div>

          {/* Quick facts */}
          <div className="property-quick-facts">
            <span><FiUsers /> {property.maxGuests} guests</span>
            <span><FiHome /> {property.bedrooms} bedrooms</span>
            <span><FiDroplet /> {property.bathrooms} bathrooms</span>
          </div>

          {/* Description */}
          <section className="property-section">
            <h2>About this place</h2>
            <p>{property.description}</p>
          </section>

          {/* Amenities */}
          <section className="property-section">
            <h2>What this place offers</h2>
            <div className="amenities-grid">
              {property.amenities.map((a) => (
                <span key={a} className="amenity-chip">{a}</span>
              ))}
            </div>
          </section>

          {/* Nearby event */}
          {property.nearbyEvent && (
            <section className="property-section">
              <h2>Nearby Event</h2>
              <div className="nearby-event-card">
                <h3>{property.nearbyEvent.eventName}</h3>
                <p>{new Date(property.nearbyEvent.eventDate).toDateString()} — {property.nearbyEvent.city}</p>
              </div>
            </section>
          )}

          {/* Rating overview (Guest favorite / 4.85 block) */}
          <RatingOverview rating={property.rating} reviewCount={reviews.length} onShowReviews={scrollToReviews} />

          {/* Reviews */}
          <section className="property-section" id="reviews-section">
            <h2>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</h2>
            <ReviewList reviews={reviews} totalCount={reviews.length} onShowAll={scrollToReviews} />
            {isAuthenticated && user.role === 'guest' && (
              <ReviewForm onSubmit={handleReviewSubmit} submitting={submittingReview} />
            )}
          </section>

          {/* Host card */}
          <HostCard
            host={property.host}
            propertyRating={property.rating}
            reviewCount={reviews.length}
            onMessage={handleMessageHost}
          />

          {/* Map */}
          <section className="property-section">
            <h2>Where you'll be</h2>
            <MiniMapPreview
              lat={property.coordinates.lat}
              lng={property.coordinates.lng}
              label={property.title}
              city={property.location.city}
              country={property.location.country}
            />
          </section>
        </div>

        {/* Booking sidebar */}
        <div className="property-detail-sidebar">
          <BookingWidget property={property} />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;