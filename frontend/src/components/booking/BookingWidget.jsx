import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { bookingAPI } from '../../api/bookingAPI';
import './BookingWidget.css';

const BookingWidget = ({ property }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))
      : 0;
  const total = nights * property.pricePerNight;

  const handleReserve = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info('Please log in to book this property');
      navigate('/login');
      return;
    }

    if (user.role !== 'guest') {
      toast.info('Only guest accounts can make bookings');
      return;
    }

    if (!checkIn || !checkOut || nights <= 0) {
      toast.error('Please select valid check-in and check-out dates');
      return;
    }

    setSubmitting(true);
    try {
      const res = await bookingAPI.create({
        property: property._id,
        checkIn,
        checkOut,
        guestsCount,
        paymentMethod: 'crypto', // default, can be changed on the payment page
      });
      toast.success('Booking created! Proceed to payment.');
      navigate(`/bookings/${res.data.booking._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-widget">
      <div className="booking-widget-price">
        <span className="price-amount">${property.pricePerNight}</span> <span>/ night</span>
      </div>

      <form onSubmit={handleReserve}>
        <div className="booking-date-row">
          <div className="form-group">
            <label>Check-in</label>
            <input
              type="date"
              required
              value={checkIn}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Check-out</label>
            <input
              type="date"
              required
              value={checkOut}
              min={checkIn || new Date().toISOString().split('T')[0]}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Guests</label>
          <input
            type="number"
            min={1}
            max={property.maxGuests}
            value={guestsCount}
            onChange={(e) => setGuestsCount(Number(e.target.value))}
          />
        </div>

        {nights > 0 && (
          <div className="booking-summary">
            <div className="booking-summary-row">
              <span>${property.pricePerNight} x {nights} night{nights > 1 ? 's' : ''}</span>
              <span>${total}</span>
            </div>
            <div className="booking-summary-row total">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Creating booking...' : 'Reserve'}
        </button>
      </form>
    </div>
  );
};

export default BookingWidget;
