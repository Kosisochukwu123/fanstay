// src/pages/fifa/TicketsPortal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FIFABanner from '../../components/layout/FIFABanner';
import FIFASectionFooter from '../../components/layout/FIFASectionFooter';
import './fifa.css';

const TicketsPortal = () => {
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState(null);

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
                <button className="fifa-btn-primary">Select</button>
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
    </div>
  );
};

export default TicketsPortal;