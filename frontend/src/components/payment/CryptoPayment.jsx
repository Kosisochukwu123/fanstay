import { useState } from 'react';
import { toast } from 'react-toastify';
import { paymentAPI } from '../../api/paymentAPI';
import { FiExternalLink } from 'react-icons/fi';
import './Payment.css';

const CryptoPayment = ({ booking, onPaymentInitiated }) => {
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);

  const handleCreateCharge = async () => {
    setLoading(true);
    try {
      const res = await paymentAPI.createCryptoCharge(booking._id);
      setCheckoutUrl(res.data.checkoutUrl);
      onPaymentInitiated?.(res.data.payment);
      // Open Coinbase Commerce checkout in a new tab
      window.open(res.data.checkoutUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create crypto charge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-panel">
      <h3>Pay with Cryptocurrency</h3>
      <p className="payment-description">
        Complete your payment securely via Coinbase Commerce. You can pay with Bitcoin, Ethereum, USDC, and other supported currencies.
      </p>
      <div className="payment-amount">
        <span>Total due:</span>
        <strong>${booking.totalAmount} {booking.currency}</strong>
      </div>

      <button className="btn btn-primary btn-block" onClick={handleCreateCharge} disabled={loading}>
        {loading ? 'Creating checkout...' : 'Pay with Crypto'}
      </button>

      {checkoutUrl && (
        <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="checkout-link">
          <FiExternalLink /> Open checkout page
        </a>
      )}

      <p className="payment-note">
        After completing payment, your booking will be automatically confirmed once Coinbase Commerce verifies the transaction (usually within a few minutes).
      </p>
    </div>
  );
};

export default CryptoPayment;
