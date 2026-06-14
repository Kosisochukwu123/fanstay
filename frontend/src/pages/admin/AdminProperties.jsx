import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../../api';
import { PageSkeleton } from '../../components/common/Skeletons';
import '../../styles/dashboard.css';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = () => {
    adminAPI.getProperties({ limit: 50 }).then((res) => setProperties(res.data.properties)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await adminAPI.updatePropertyStatus(id, status);
      toast.success('Listing status updated');
      fetchProperties();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update listing');
    }
  };

  if (loading) return <div className="container"><PageSkeleton /></div>;

  return (
    <div className="container dashboard-page">
      <h1>Manage Listings</h1>

      <div className="dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Host</th>
              <th>City</th>
              <th>Price</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.host?.name}</td>
                <td>{p.location.city}</td>
                <td>${p.pricePerNight}</td>
                <td><span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-info'}`}>{p.status}</span></td>
                <td>
                  <select value={p.status} onChange={(e) => handleStatusChange(p._id, e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending_review">Pending Review</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProperties;
