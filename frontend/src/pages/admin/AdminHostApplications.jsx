import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../../api';
import { PageSkeleton } from '../../components/common/Skeletons';
import '../../styles/dashboard.css';

const AdminHostApplications = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = () => {
    adminAPI.getPendingHosts().then((res) => setUsers(res.data.users)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReview = async (id, decision) => {
    try {
      await adminAPI.reviewHost(id, decision);
      toast.success(`Host application ${decision}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to review application');
    }
  };

  if (loading) return <div className="container"><PageSkeleton /></div>;

  return (
    <div className="container dashboard-page">
      <h1>Pending Host Applications</h1>

      {users.length === 0 ? (
        <p className="empty-text">No pending applications.</p>
      ) : (
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Applied</th><th></th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-primary" onClick={() => handleReview(u._id, 'approved')}>Approve</button>
                      <button className="btn btn-secondary" onClick={() => handleReview(u._id, 'rejected')}>Reject</button>
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

export default AdminHostApplications;
