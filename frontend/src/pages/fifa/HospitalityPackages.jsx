// src/pages/fifa/HospitalityPackages.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FIFABanner from '../../components/layout/FIFABanner';
import FIFASectionFooter from '../../components/layout/FIFASectionFooter';
import './fifa.css';

const HospitalityPackages = () => {
  const navigate = useNavigate();

  const packages = [
    {
      name: "Legends Suite",
      price: "$2,500",
      description: "The ultimate VIP experience",
      features: [
        "Premium Category 1 seating",
        "Gourmet 3-course meal",
        "Open bar (premium drinks)",
        "Player appearance access",
        "Official match program",
        "VIP parking pass",
        "Dedicated concierge"
      ],
      popular: true
    },
    {
      name: "Champions Club",
      price: "$1,800",
      description: "Premium matchday experience",
      features: [
        "Category 1 seating",
        "Buffet dining",
        "Complimentary drinks",
        "Lounge access",
        "Match program",
        "Commemorative gift"
      ],
      popular: false
    },
    {
      name: "Fan Zone Experience",
      price: "$800",
      description: "Great value premium access",
      features: [
        "Category 2 seating",
        "Food voucher ($50)",
        "Welcome drink",
        "Fan merchandise pack",
        "Photo opportunities"
      ],
      popular: false
    },
    {
      name: "Group Hospitality",
      price: "Custom",
      description: "Perfect for corporate groups",
      features: [
        "Private suite",
        "Custom catering options",
        "Branding opportunities",
        "Dedicated host",
        "Transfer service available"
      ],
      popular: false
    }
  ];

  return (
    <div className="fifa-page-container">
      <FIFABanner />
      
      <div className="page-content">
        <div className="page-header">
          <h1>Hospitality Packages</h1>
          <p>Elevate your matchday with premium experiences</p>
        </div>

        <div className="packages-grid">
          {packages.map((pkg, idx) => (
            <div key={idx} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
              {pkg.popular && <div className="popular-badge">MOST POPULAR</div>}
              <h2>{pkg.name}</h2>
              <div className="package-price">{pkg.price}</div>
              <p className="package-description">{pkg.description}</p>
              <ul className="package-features">
                {pkg.features.map((feature, i) => (
                  <li key={i}><i className="fas fa-check-circle"></i> {feature}</li>
                ))}
              </ul>
              <button className="book-btn">Book Now →</button>
            </div>
          ))}
        </div>

        <div className="info-section">
          <h3><i className="fas fa-star"></i> Why Choose Hospitality?</h3>
          <div className="benefits-grid">
            <div className="benefit">
              <i className="fas fa-chair"></i>
              <h4>Best Seats</h4>
              <p>Premium locations with unobstructed views</p>
            </div>
            <div className="benefit">
              <i className="fas fa-utensils"></i>
              <h4>Fine Dining</h4>
              <p>World-class catering and open bars</p>
            </div>
            <div className="benefit">
              <i className="fas fa-parking"></i>
              <h4>VIP Parking</h4>
              <p>Priority parking near the stadium</p>
            </div>
            <div className="benefit">
              <i className="fas fa-gift"></i>
              <h4>Exclusive Gifts</h4>
              <p>Commemorative merchandise and gifts</p>
            </div>
          </div>
        </div>

        <button className="back-btn" onClick={() => navigate('/fifa')}>
          ← Back to FIFA World Cup
        </button>
      </div>

      <FIFASectionFooter />
    </div>
  );
};

export default HospitalityPackages;