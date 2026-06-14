import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookingAPI } from '../api/bookingAPI';
import { propertyAPI } from '../api/propertyAPI';
import CryptoPayment from '../components/payment/CryptoPayment';
import GiftCardPayment from '../components/payment/GiftCardPayment';
import TripSummaryCard from '../components/booking/TripSummaryCard';
import CheckoutProgressBar from '../components/booking/CheckoutProgressBar';
import { PageSkeleton } from '../components/common/Skeletons';
import { FiX, FiArrowLeft } from 'react-icons/fi';
import './BookingDetail.css';

const statusBadgeClass = (status) => {
  switch (status) {
    case 'confirmed':
    case 'completed':
    case 'paid':
      return 'badge-success';
    case 'pending':
    case 'awaiting_admin_review':
      return 'badge-pending';
    case 'rejected':
    case 'cancelled':
    case 'failed':
      return 'badge-error';
    default:
      return 'badge-info';
  }
};

const TOTAL_STEPS = 2; // 1: Review trip, 2: Payment method

const BookingDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const fetchBooking = () => {
    bookingAPI
      .getOne(id)
      .then((res) => {
        setBooking(res.data.booking);
        setPaymentMethod(res.data.booking.paymentMethod);
        // Property may already be populated; if not, fetch separately
        if (res.data.booking.property?.title) {
          setProperty(res.data.booking.property);
        } else {
          propertyAPI.getOne(res.data.booking.property).then((pRes) => setProperty(pRes.data.property));
        }
      })
      .catch(() => toast.error('Failed to load booking'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      toast.info('Payment received! It may take a few minutes to confirm.');
      setStep(2);
    } else if (searchParams.get('payment') === 'cancelled') {
      toast.warning('Payment was cancelled.');
      setStep(2);
    }
  }, [searchParams]);

  if (loading) return <div className="container"><PageSkeleton /></div>;
  if (!booking) return <div className="container"><p className="empty-text">Booking not found.</p></div>;

  const alreadyPaid = booking.paymentStatus === 'paid';

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button className="checkout-icon-btn" onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))} aria-label="Back">
          {step > 1 ? <FiArrowLeft /> : <FiX />}
        </button>
        <button className="checkout-icon-btn" onClick={() => navigate('/')} aria-label="Close">
          <FiX />
        </button>
      </div>

      <div className="checkout-body">
        {alreadyPaid ? (
          <div className="checkout-step">
            <h1>Booking Confirmed</h1>
            <TripSummaryCard booking={booking} property={property} />
            <div className="booking-status-row">
              <span className={`badge ${statusBadgeClass(booking.bookingStatus)}`}>{booking.bookingStatus}</span>
              <span className={`badge ${statusBadgeClass(booking.paymentStatus)}`}>{booking.paymentStatus}</span>
            </div>
            <p className="checkout-confirmation-note">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>
        ) : step === 1 ? (
          <div className="checkout-step">
            <h1>Review and continue</h1>
            <TripSummaryCard
              booking={booking}
              property={property}
              onChangeDates={() => toast.info('To change dates, cancel this booking and create a new one from the property page.')}
              onChangeGuests={() => toast.info('To change guests, cancel this booking and create a new one from the property page.')}
            />
          </div>
        ) : (
          <div className="checkout-step">
            <h1>Choose how to pay</h1>

            <div className="payment-method-selector">
              <div
                className={`payment-method-option ${paymentMethod === 'crypto' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('crypto')}
              >
                Cryptocurrency
              </div>
              <div
                className={`payment-method-option ${paymentMethod === 'gift_card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('gift_card')}
              >
                Gift Card
              </div>
            </div>

            {paymentMethod === 'crypto' && <CryptoPayment booking={booking} />}
            {paymentMethod === 'gift_card' && <GiftCardPayment booking={booking} onSubmitted={fetchBooking} />}

            {booking.paymentStatus === 'awaiting_admin_review' && (
              <div className="checkout-pending-note">
                <span className="badge badge-pending">Awaiting Review</span>
                <p>Your gift card has been submitted and is awaiting admin approval. You'll receive an email once your booking is confirmed.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {!alreadyPaid && (
        <>
          <CheckoutProgressBar step={step} totalSteps={TOTAL_STEPS} />
          <div className="checkout-footer">
            {step < TOTAL_STEPS ? (
              <button className="btn btn-primary btn-block" onClick={() => setStep(step + 1)}>
                Next
              </button>
            ) : (
              <button className="btn btn-secondary btn-block" onClick={() => setStep(step - 1)}>
                Back to trip details
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingDetail;