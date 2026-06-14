import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../../api';
import { PageSkeleton } from '../../components/common/Skeletons';
import '../../styles/dashboard.css';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    adminAPI.getReviews().then((res) => setReviews(res.data.reviews)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (id, status) => {
    try {
      await adminAPI.moderateReview(id, status);
      toast.success(`Review ${status}`);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to moderate review');
    }
  };

  if (loading) return <div className="container"><PageSkeleton /></div>;

  return (
    <div className="container dashboard-page">
      <h1>Moderate Reviews</h1>

      {reviews.length === 0 ? (
        <p className="empty-text">No reviews found.</p>
      ) : (
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr><th>User</th><th>Property</th><th>Rating</th><th>Comment</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id}>
                  <td>{r.user?.name}</td>
                  <td>{r.property?.title}</td>
                  <td>{r.rating} / 5</td>
                  <td style={{ maxWidth: 300 }}>{r.comment}</td>
                  <td>
                    <span className={`badge ${r.status === 'visible' ? 'badge-success' : r.status === 'flagged' ? 'badge-pending' : 'badge-error'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {r.status !== 'visible' && <button className="btn btn-secondary" onClick={() => handleModerate(r._id, 'visible')}>Restore</button>}
                      {r.status !== 'flagged' && <button className="btn btn-secondary" onClick={() => handleModerate(r._id, 'flagged')}>Flag</button>}
                      {r.status !== 'removed' && <button className="btn btn-secondary" onClick={() => handleModerate(r._id, 'removed')}>Remove</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
