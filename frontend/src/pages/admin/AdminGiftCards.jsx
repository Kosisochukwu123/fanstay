import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { paymentAPI } from '../../api/paymentAPI';
import { adminAPI } from '../../api';
import { PageSkeleton } from '../../components/common/Skeletons';
import '../../styles/dashboard.css';

const AdminGiftCards = () => {
  const [pending, setPending] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProvider, setNewProvider] = useState({ name: '', instructions: '' });

  const fetchData = () => {
    Promise.all([paymentAPI.getPendingGiftCards(), adminAPI.getGiftCardProviders()])
      .then(([pendingRes, providersRes]) => {
        setPending(pendingRes.data.payments);
        setProviders(providersRes.data.providers);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReview = async (paymentId, decision) => {
    try {
      await paymentAPI.reviewGiftCard(paymentId, decision);
      toast.success(`Gift card ${decision}`);
      setPending((prev) => prev.filter((p) => p._id !== paymentId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to review gift card');
    }
  };

  const handleAddProvider = async (e) => {
    e.preventDefault();
    try {
      const res = await adminAPI.createGiftCardProvider(newProvider);
      setProviders((prev) => [...prev, res.data.provider]);
      setNewProvider({ name: '', instructions: '' });
      toast.success('Provider added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add provider');
    }
  };

  const handleToggleProvider = async (id, isActive) => {
    try {
      const res = await adminAPI.updateGiftCardProvider(id, { isActive: !isActive });
      setProviders((prev) => prev.map((p) => (p._id === id ? res.data.provider : p)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update provider');
    }
  };

  const handleDeleteProvider = async (id) => {
    if (!window.confirm('Delete this provider?')) return;
    try {
      await adminAPI.deleteGiftCardProvider(id);
      setProviders((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete provider');
    }
  };

  if (loading) return <div className="container"><PageSkeleton /></div>;

  return (
    <div className="container dashboard-page">
      <h1>Gift Card Management</h1>

      <h2 style={{ marginBottom: 16 }}>Pending Reviews</h2>
      {pending.length === 0 ? (
        <p className="empty-text">No gift cards awaiting review.</p>
      ) : (
        <div className="dashboard-table-wrap" style={{ marginBottom: 40 }}>
          <table className="dashboard-table">
            <thead>
              <tr><th>User</th><th>Provider</th><th>Amount</th><th>Card Image</th><th></th></tr>
            </thead>
            <tbody>
              {pending.map((p) => (
                <tr key={p._id}>
                  <td>{p.user?.name} ({p.user?.email})</td>
                  <td>{p.giftCardProvider}</td>
                  <td>${p.amount} {p.currency}</td>
                  <td>
                    {p.giftCardImage?.url && (
                      <a href={p.giftCardImage.url} target="_blank" rel="noopener noreferrer">View Image</a>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-primary" onClick={() => handleReview(p._id, 'approved')}>Approve</button>
                      <button className="btn btn-secondary" onClick={() => handleReview(p._id, 'rejected')}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 style={{ marginBottom: 16 }}>Supported Providers</h2>
      <div className="dashboard-table-wrap" style={{ marginBottom: 24 }}>
        <table className="dashboard-table">
          <thead>
            <tr><th>Name</th><th>Instructions</th><th>Active</th><th></th></tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.instructions}</td>
                <td><span className={`badge ${p.isActive ? 'badge-success' : 'badge-info'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-secondary" onClick={() => handleToggleProvider(p._id, p.isActive)}>
                      {p.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleDeleteProvider(p._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginBottom: 12 }}>Add a New Provider</h3>
      <form onSubmit={handleAddProvider} style={{ maxWidth: 480 }}>
        <div className="form-group">
          <label>Provider name</label>
          <input
            type="text"
            required
            value={newProvider.name}
            onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
            placeholder="e.g. Walmart"
          />
        </div>
        <div className="form-group">
          <label>Instructions</label>
          <textarea
            rows={3}
            value={newProvider.instructions}
            onChange={(e) => setNewProvider({ ...newProvider, instructions: e.target.value })}
            placeholder="Instructions shown to guests when redeeming this gift card"
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Provider</button>
      </form>
    </div>
  );
};

export default AdminGiftCards;
