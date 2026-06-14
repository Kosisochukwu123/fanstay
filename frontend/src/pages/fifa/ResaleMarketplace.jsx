// src/pages/fifa/ResaleMarketplace.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FIFABanner from '../../components/layout/FIFABanner';
import FIFASectionFooter from '../../components/layout/FIFASectionFooter';
import './fifa.css';

const ResaleMarketplace = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const listings = [
    { id: 1, match: "Opening Match", date: "June 11, 2026", section: "Section 124, Row 12", seats: "Seats 5-6", price: "$650", seller: "Verified Seller", category: "premium" },
    { id: 2, match: "USA vs England", date: "June 15, 2026", section: "Section 205, Row 8", seats: "Seats 12-14", price: "$450", seller: "Verified Seller", category: "standard" },
    { id: 3, match: "Brazil vs Germany", date: "June 18, 2026", section: "Section 108, Row 4", seats: "Seat 1", price: "$380", seller: "Verified Seller", category: "standard" },
    { id: 4, match: "Quarterfinal", date: "July 9, 2026", section: "Premium Club", seats: "Seats 2-4", price: "$1,200", seller: "FIFA Official", category: "premium" },
    { id: 5, match: "Semifinal", date: "July 14, 2026", section: "Section 312, Row 15", seats: "Seats 20-22", price: "$550", seller: "Verified Seller", category: "value" },
    { id: 6, match: "Final Match", date: "July 19, 2026", section: "Section 146, Row 2", seats: "Seats 8-9", price: "$2,800", seller: "Verified Seller", category: "premium" },
  ];

  const filteredListings = filter === 'all' ? listings : listings.filter(l => l.category === filter);

  return (
    <div className="fifa-page-container">
      <FIFABanner />
      
      <div className="page-content">
        <div className="page-header">
          <h1>Official Resale Marketplace</h1>
          <p>Buy and sell verified FIFA World Cup 2026™ tickets safely</p>
        </div>

        <div className="marketplace-filters">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Tickets</button>
          <button className={`filter-btn ${filter === 'premium' ? 'active' : ''}`} onClick={() => setFilter('premium')}>Premium</button>
          <button className={`filter-btn ${filter === 'standard' ? 'active' : ''}`} onClick={() => setFilter('standard')}>Standard</button>
          <button className={`filter-btn ${filter === 'value' ? 'active' : ''}`} onClick={() => setFilter('value')}>Value</button>
        </div>

        <div className="listings-container">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="listing-card">
              <div className="listing-header">
                <h3>{listing.match}</h3>
                <span className="seller-badge">{listing.seller}</span>
              </div>
              <p><i className="fas fa-calendar-alt"></i> {listing.date}</p>
              <p><i className="fas fa-chair"></i> {listing.section}</p>
              <p><i className="fas fa-users"></i> {listing.seats}</p>
              <div className="listing-price">{listing.price}</div>
              <button className="buy-btn">Buy Now →</button>
            </div>
          ))}
        </div>

        <div className="info-section">
          <h3><i className="fas fa-shield-alt"></i> Safe & Secure Marketplace</h3>
          <p>All tickets on the official marketplace are verified by FIFA. Your purchase is protected by our buyer guarantee.</p>
        </div>

        <button className="back-btn" onClick={() => navigate('/fifa')}>
          ← Back to FIFA World Cup
        </button>
      </div>

      <FIFASectionFooter />
    </div>
  );
};

export default ResaleMarketplace;