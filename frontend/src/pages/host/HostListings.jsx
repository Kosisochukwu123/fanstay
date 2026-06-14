import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { propertyAPI } from '../../api/propertyAPI';
import { PageSkeleton } from '../../components/common/Skeletons';
import '../../styles/dashboard.css';

const HostListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = () => {
    propertyAPI.getMine().then((res) => setProperties(res.data.properties)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await propertyAPI.delete(id);
      toast.success('Listing deleted');
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  if (loading) return <div className="container"><PageSkeleton /></div>;

  return (
    <div className="container dashboard-page">
      <div className="dashboard-header-row">
        <h1>My Listings</h1>
        <Link to="/host/listings/new" className="btn btn-primary">+ New Listing</Link>
      </div>

      {properties.length === 0 ? (
        <p className="empty-text">You haven't created any listings yet.</p>
      ) : (
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Listing</th>
                <th>City</th>
                <th>Price/night</th>
                <th>Status</th>
                <th>Rating</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="table-property-cell">
                      <img src={p.images?.[0]?.url || 'https://placehold.co/60x45'} alt="" />
                      {p.title}
                    </div>
                  </td>
                  <td>{p.location.city}</td>
                  <td>${p.pricePerNight}</td>
                  <td><span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-info'}`}>{p.status}</span></td>
                  <td>{p.rating?.average ? p.rating.average.toFixed(1) : '—'}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/properties/${p._id}`} className="btn btn-secondary">View</Link>
                      <Link to={`/host/listings/${p._id}/edit`} className="btn btn-secondary">Edit</Link>
                      <button className="btn btn-secondary" onClick={() => handleDelete(p._id)}>Delete</button>
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

export default HostListings;
