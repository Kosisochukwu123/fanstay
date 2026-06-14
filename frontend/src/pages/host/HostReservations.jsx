import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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

const HostReservations = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    bookingAPI.getHostBookings().then((res) => setBookings(res.data.bookings)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, status);
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update booking');
    }
  };

  if (loading) return <div className="container"><PageSkeleton /></div>;

  return (
    <div className="container dashboard-page">
      <h1>Reservations</h1>

      {bookings.length === 0 ? (
        <p className="empty-text">No reservations yet.</p>
      ) : (
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Guest</th>
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
                  <td>{b.property?.title}</td>
                  <td>{b.guest?.name}</td>
                  <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                  <td>${b.totalAmount}</td>
                  <td><span className={`badge ${statusBadgeClass(b.paymentStatus)}`}>{b.paymentStatus}</span></td>
                  <td><span className={`badge ${statusBadgeClass(b.bookingStatus)}`}>{b.bookingStatus}</span></td>
                  <td>
                    {b.bookingStatus === 'pending' && (
                      <div className="action-buttons">
                        <button className="btn btn-primary" onClick={() => handleUpdateStatus(b._id, 'confirmed')}>Accept</button>
                        <button className="btn btn-secondary" onClick={() => handleUpdateStatus(b._id, 'rejected')}>Reject</button>
                      </div>
                    )}
                    {b.bookingStatus === 'confirmed' && (
                      <button className="btn btn-secondary" onClick={() => handleUpdateStatus(b._id, 'completed')}>Mark Completed</button>
                    )}
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

export default HostReservations;
