import './CheckoutProgressBar.css';

/**
 * Segmented progress bar for multi-step checkout flows.
 * step: current step (1-indexed), totalSteps: number of segments
 */
const CheckoutProgressBar = ({ step, totalSteps = 2 }) => {
  return (
    <div className="checkout-progress-bar">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className={`checkout-progress-segment ${i < step ? 'filled' : ''}`} />
      ))}
    </div>
  );
};

export default CheckoutProgressBar;