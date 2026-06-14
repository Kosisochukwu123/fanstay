import { FiStar } from 'react-icons/fi';
import './Reviews.css';

export const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p className="empty-text">No reviews yet. Be the first to leave one!</p>;
  }

  return (
    <div className="review-list">
      {reviews.map((review) => (
        <div key={review._id} className="review-card">
          <div className="review-header">
            <img
              src={review.user?.avatar?.url || `https://i.pravatar.cc/100?u=${review.user?._id}`}
              alt={review.user?.name}
            />
            <div>
              <h4>{review.user?.name}</h4>
              <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="review-rating">
              <FiStar /> {review.rating}
            </div>
          </div>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export const ReviewForm = ({ onSubmit, submitting }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rating = Number(formData.get('rating'));
    const comment = formData.get('comment');
    onSubmit({ rating, comment });
    e.target.reset();
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Your rating</label>
        <select name="rating" required defaultValue="5">
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} star{r > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Your review</label>
        <textarea name="comment" required rows={4} placeholder="Share your experience..." />
      </div>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};
