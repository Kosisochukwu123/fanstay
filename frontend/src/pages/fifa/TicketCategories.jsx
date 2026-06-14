// src/pages/TicketCategories.jsx
import React from 'react';
import FIFABanner from '../../components/layout/FIFABanner';
// import Footer from '../components/layout/Footer';
import FIFASectionFooter from "../../components/layout/FIFASectionFooter";


const TicketCategories = () => {
  const categories = [
    { name: "Category 1", price: "$850", features: ["Center Circle View", "Premium Seating", "Match Program", "Digital Commemorative Ticket"] },
    { name: "Category 2", price: "$550", features: ["Sideline View", "Reserved Seating", "Digital Ticket", "Fan Pack"] },
    { name: "Category 3", price: "$350", features: ["Corner/End View", "Reserved Seating", "Digital Ticket"] },
    { name: "Category 4", price: "$200", features: ["Behind Goal", "Reserved Seating"] },
    { name: "Accessible Seating", price: "Varies", features: ["Wheelchair Accessible", "Companion Seats", "Dedicated Entry"] }
  ];

  return (
    <div className="page-container">
      <FIFABanner />
      <div className="page-content">
        <div className="page-header">
          <h1>Ticket Products & Categories</h1>
          <p>Choose the perfect matchday experience for you</p>
        </div>
        
        <div className="categories-table">
          {categories.map((cat, idx) => (
            <div key={idx} className="category-row">
              <div className="category-name">{cat.name}</div>
              <div className="category-price">{cat.price}</div>
              <div className="category-features">
                {cat.features.map((feat, i) => <span key={i} className="feature">{feat}</span>)}
              </div>
              <button className="fifa-btn small">Select</button>
            </div>
          ))}
        </div>
      </div>
      <FIFASectionFooter />
    </div>
  );
};

export default TicketCategories;