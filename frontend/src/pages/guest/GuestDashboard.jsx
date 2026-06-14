import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../../api/bookingAPI';
import { PageSkeleton } from '../../components/common/Skeletons';
import '../../styles/dashboard.css';

const statusBadgeClass = (status) => {
  switch (status) {
    case 'confirmed':
    case 'completed':
    case 'paid':
      return 'badge-success';
    case 'pending':
      return 'badge-pending';
    case 'rejected':
    case 'cancelled':
    case 'failed':
      return 'badge-error';
    default:
      return 'badge-info';
  }
};

const GuestDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.getMine().then((res) => setBookings(res.data.bookings)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><PageSkeleton /></div>;

  return (
    <div className="container dashboard-page">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="empty-text">You haven't made any bookings yet. <Link to="/explore">Explore stays</Link></p>
      ) : (
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="table-property-cell">
                      <img src={b.property?.images?.[0]?.url || 'https://placehold.co/60x45'} alt="" />
                      {b.property?.title}
                    </div>
                  </td>
                  <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                  <td>${b.totalAmount}</td>
                  <td><span className={`badge ${statusBadgeClass(b.paymentStatus)}`}>{b.paymentStatus}</span></td>
                  <td><span className={`badge ${statusBadgeClass(b.bookingStatus)}`}>{b.bookingStatus}</span></td>
                  <td><Link to={`/bookings/${b._id}`} className="btn btn-secondary">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GuestDashboard;
