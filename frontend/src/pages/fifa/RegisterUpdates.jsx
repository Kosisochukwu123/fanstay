// src/pages/RegisterUpdates.jsx
import React, { useState } from 'react';
import FIFABanner from '../../components/layout/FIFABanner';
// import Footer from '../components/layout/Footer';
import FIFASectionFooter from "../../components/layout/FIFASectionFooter";


const RegisterUpdates = () => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState(['tickets']);

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribed:', { email, preferences });
    alert('Successfully registered for updates!');
  };

  return (
    <div className="page-container">
      <FIFABanner />
      <div className="page-content">
        <div className="page-header">
          <h1>Register for Updates</h1>
          <p>Be the first to know about ticket releases, special offers, and tournament news</p>
        </div>
        
        <div className="register-form">
          <form onSubmit={handleSubscribe}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>I'm interested in:</label>
              <div className="checkbox-group">
                <label><input type="checkbox" checked={preferences.includes('tickets')} onChange={() => setPreferences([...preferences, 'tickets'])} /> Ticket Sales</label>
                <label><input type="checkbox" onChange={() => setPreferences([...preferences, 'hospitality'])} /> Hospitality Packages</label>
                <label><input type="checkbox" onChange={() => setPreferences([...preferences, 'merch'])} /> Merchandise</label>
                <label><input type="checkbox" onChange={() => setPreferences([...preferences, 'news'])} /> Tournament News</label>
              </div>
            </div>
            <button type="submit" className="fifa-btn primary">Subscribe Now</button>
          </form>
        </div>
      </div>
      <FIFASectionFooter />
    </div>
  );
};

export default RegisterUpdates;