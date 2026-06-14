import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { paymentAPI } from '../../api/paymentAPI';
import './Payment.css';

const GiftCardPayment = ({ booking, onSubmitted }) => {
  const [providers, setProviders] = useState([]);
  const [provider, setProvider] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    paymentAPI.getGiftCardProviders().then((res) => {
      setProviders(res.data.providers);
      if (res.data.providers.length > 0) setProvider(res.data.providers[0].name);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!provider || !giftCardCode || !image) {
      toast.error('Please fill in all fields and upload an image of your gift card');
      return;
    }

    const formData = new FormData();
    formData.append('bookingId', booking._id);
    formData.append('provider', provider);
    formData.append('giftCardCode', giftCardCode);
    formData.append('giftCardImage', image);

    setSubmitting(true);
    try {
      await paymentAPI.submitGiftCard(formData);
      toast.success('Gift card submitted for admin review');
      setSubmitted(true);
      onSubmitted?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit gift card');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="payment-panel">
        <h3>Gift Card Submitted</h3>
        <p className="payment-description">
          Your gift card has been submitted and is awaiting admin review. Your booking will be confirmed
          automatically once approved. You'll receive an email confirmation.
        </p>
        <span className="badge badge-pending">Awaiting Review</span>
      </div>
    );
  }

  return (
    <div className="payment-panel">
      <h3>Pay with Gift Card</h3>
      <p className="payment-description">
        Select a supported gift card provider, enter your code, and upload a photo of the card.
        Our team will verify and approve your payment.
      </p>
      <div className="payment-amount">
        <span>Total due:</span>
        <strong>${booking.totalAmount} {booking.currency}</strong>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Gift card provider</label>
          <select value={provider} onChange={(e) => setProvider(e.target.value)} required>
            {providers.length === 0 && <option value="">No providers available</option>}
            {providers.map((p) => (
              <option key={p._id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Gift card code</label>
          <input
            type="text"
            value={giftCardCode}
            onChange={(e) => setGiftCardCode(e.target.value)}
            placeholder="Enter the code printed on the card"
            required
          />
        </div>

        <div className="form-group">
          <label>Gift card image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Gift Card'}
        </button>
      </form>
    </div>
  );
};

export default GiftCardPayment;
