import { useEffect, useState } from 'react';
import { getConsent, setConsent } from '../../utils/consent';
import './CookieConsent.css';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setConsent('accepted');
    setVisible(false);
  };

  const handleReject = () => {
    setConsent('rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent">
      <p>
        We use cookies and local caching to keep you signed in and make images load faster on
        repeat visits. You can accept or reject non-essential caching.
      </p>
      <div className="cookie-consent-actions">
        <button className="btn btn-secondary" onClick={handleReject}>Reject</button>
        <button className="btn btn-primary" onClick={handleAccept}>Accept</button>
      </div>
    </div>
  );
};

export default CookieConsent;