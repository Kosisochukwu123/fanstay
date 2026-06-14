import { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
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

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getBookings({ limit: 50 }).then((res) => setBookings(res.data.bookings)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><PageSkeleton /></div>;

  return (
    <div className="container dashboard-page">
      <h1>All Bookings</h1>

      <div className="dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Guest</th>
              <th>Host</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.property?.title}</td>
                <td>{b.guest?.name}</td>
                <td>{b.host?.name}</td>
                <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                <td>${b.totalAmount}</td>
                <td><span className={`badge ${statusBadgeClass(b.paymentStatus)}`}>{b.paymentStatus}</span></td>
                <td><span className={`badge ${statusBadgeClass(b.bookingStatus)}`}>{b.bookingStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
