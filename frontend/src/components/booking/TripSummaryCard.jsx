import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import './TripSummaryCard.css';

/**
 * Trip summary card shown on the "Review and continue" checkout step.
 * booking: booking object (with populated property)
 * onChangeDates / onChangeGuests: callbacks for "Change" links
 */
const TripSummaryCard = ({ booking, property, onChangeDates, onChangeGuests }) => {
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  const nights = Math.ceil(
    (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)
  );
  const subtotal = nights * (property?.pricePerNight || 0);
  const serviceFee = Math.round(subtotal * 0.1 * 100) / 100; // example 10% service fee
  const total = booking.totalAmount;

  return (
    <div className="trip-summary-card">
      <div className="trip-summary-header">
        <img
          src={property?.images?.[0]?.url || 'https://placehold.co/120x90'}
          alt={property?.title}
          className="trip-summary-image"
        />
        <div>
          <h3>{property?.title}</h3>
          {property?.rating?.average > 0 && (
            <span className="trip-summary-rating">
              <FiStar className="filled" /> {property.rating.average.toFixed(1)} ({property.rating.count})
            </span>
          )}
        </div>
      </div>

      <div className="trip-summary-row">
        <div>
          <strong>Dates</strong>
          <p>
            {new Date(booking.checkIn).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            {' – '}
            {new Date(booking.checkOut).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        {onChangeDates && (
          <button className="btn btn-secondary trip-summary-change-btn" onClick={onChangeDates}>Change</button>
        )}
      </div>

      <div className="trip-summary-row">
        <div>
          <strong>Guests</strong>
          <p>{booking.guestsCount} guest{booking.guestsCount !== 1 ? 's' : ''}</p>
        </div>
        {onChangeGuests && (
          <button className="btn btn-secondary trip-summary-change-btn" onClick={onChangeGuests}>Change</button>
        )}
      </div>

      <div className="trip-summary-row">
        <div>
          <strong>Total price</strong>
          <p>${total.toFixed(2)} {booking.currency} including all fees</p>
        </div>
        <button className="btn btn-secondary trip-summary-change-btn" onClick={() => setShowPriceDetails(!showPriceDetails)}>
          Details
        </button>
      </div>

      {showPriceDetails && (
        <div className="trip-price-breakdown">
          <div className="price-breakdown-row">
            <span>${property?.pricePerNight} x {nights} night{nights !== 1 ? 's' : ''}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="price-breakdown-row">
            <span>Service fee</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
          <div className="price-breakdown-row total">
            <span>Total ({booking.currency})</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="trip-summary-cancellation">
        <strong>Free cancellation</strong>
        <p>
          Cancel before check-in for a full refund. Once your stay begins, FanStay's standard
          cancellation policy applies.
        </p>
      </div>
    </div>
  );
};

export default TripSummaryCard;