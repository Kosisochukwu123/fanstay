import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { hostAPI } from '../../api';
import { PageSkeleton } from '../../components/common/Skeletons';
import '../../styles/dashboard.css';

const HostDashboard = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hostAPI.getEarnings().then((res) => setEarnings(res.data.earnings)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><PageSkeleton /></div>;

  return (
    <div className="container dashboard-page">
      <div className="dashboard-header-row">
        <h1>Host Dashboard</h1>
        <div className="action-buttons">
          <Link to="/host/listings" className="btn btn-secondary">My Listings</Link>
          <Link to="/host/reservations" className="btn btn-secondary">Reservations</Link>
          <Link to="/host/listings/new" className="btn btn-primary">+ New Listing</Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">${earnings.totalEarnings.toFixed(2)}</div>
          <div className="stat-label">Total Earnings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{earnings.propertiesCount}</div>
          <div className="stat-label">Active Listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{earnings.bookingsCount}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{earnings.pendingBookings}</div>
          <div className="stat-label">Pending Approvals</div>
        </div>
      </div>

      <h2 style={{ marginBottom: 16 }}>Monthly Earnings</h2>
      {earnings.earningsByMonth.length === 0 ? (
        <p className="empty-text">No earnings data yet.</p>
      ) : (
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr><th>Period</th><th>Bookings</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              {earnings.earningsByMonth.map((m) => (
                <tr key={`${m._id.year}-${m._id.month}`}>
                  <td>{m._id.month}/{m._id.year}</td>
                  <td>{m.count}</td>
                  <td>${m.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HostDashboard;
