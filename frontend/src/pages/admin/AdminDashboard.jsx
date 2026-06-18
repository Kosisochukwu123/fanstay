import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api';
import { PageSkeleton } from '../../components/common/Skeletons';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAnalytics()
      .then((res) => setAnalytics(res.data.analytics))
      .catch((err) => console.error('Error loading analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="container">
      <PageSkeleton />
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header-row">
        <h1>Admin Dashboard</h1>
        <div className="action-buttons">
          <Link to="/admin/users" className="btn">Users</Link>
          <Link to="/admin/properties" className="btn">Listings</Link>
          <Link to="/admin/bookings" className="btn">Bookings</Link>
          <Link to="/admin/hosts" className="btn">Host Applications</Link>
          <Link to="/admin/gift-cards" className="btn btn-highlight">🎁 Gift Cards</Link>
          <Link to="/admin/reviews" className="btn">Reviews</Link>
          <Link to="/admin/settings" className="btn">Site Settings</Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{analytics.totalUsers || 0}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.totalHosts || 0}</div>
          <div className="stat-label">Hosts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.totalGuests || 0}</div>
          <div className="stat-label">Guests</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.totalProperties || 0}</div>
          <div className="stat-label">Listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.totalBookings || 0}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.confirmedBookings || 0}</div>
          <div className="stat-label">Confirmed Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${(analytics.totalRevenue || 0).toFixed(2)}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card stat-card-giftcards">
          <div className="stat-value">{analytics.pendingGiftCards || 0}</div>
          <div className="stat-label">Pending Gift Cards</div>
          <Link to="/admin/gift-cards" className="stat-link">Review →</Link>
        </div>
      </div>

      <h2 style={{ marginBottom: 16, color: 'var(--color-text)' }}>Bookings by Month</h2>
      {analytics.bookingsByMonth?.length === 0 ? (
        <p className="empty-text">No data yet.</p>
      ) : (
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Bookings</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.bookingsByMonth?.map((m) => (
                <tr key={`${m._id.year}-${m._id.month}`}>
                  <td>{m._id.month}/{m._id.year}</td>
                  <td>{m.count || 0}</td>
                  <td>${(m.revenue || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;