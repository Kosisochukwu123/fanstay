import { FiAward } from 'react-icons/fi';
import './RatingOverview.css';

const RATING_CATEGORIES = [
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'accuracy', label: 'Accuracy' },
  { key: 'checkin', label: 'Check-in' },
  { key: 'communication', label: 'Communication' },
  { key: 'location', label: 'Location' },
  { key: 'value', label: 'Value' },
];

const RatingOverview = ({ rating, reviewCount, onShowReviews }) => {
  const isGuestFavorite = rating?.average >= 4.7 && reviewCount >= 5;

  return (
    <div className="rating-overview">
      {isGuestFavorite ? (
        <>
          <div className="rating-overview-laurels">
            <FiAward className="laurel left" />
            <span className="rating-overview-score">{rating.average.toFixed(2)}</span>
            <FiAward className="laurel right" />
          </div>
          <h3>Guest favorite</h3>
          <p className="rating-overview-sub">
            This home is in the <strong>top tier</strong> of eligible listings based on ratings,
            reviews, and reliability.
          </p>
        </>
      ) : (
        <div className="rating-overview-simple">
          <span className="rating-overview-score">{rating?.average?.toFixed(2) || 'New'}</span>
          {rating?.average > 0 && <span>· {reviewCount} review{reviewCount !== 1 ? 's' : ''}</span>}
        </div>
      )}

      <button className="btn btn-secondary rating-reviews-link" onClick={onShowReviews}>
        Show all {reviewCount} review{reviewCount !== 1 ? 's' : ''}
      </button>
    </div>
  );
};

export default RatingOverview;