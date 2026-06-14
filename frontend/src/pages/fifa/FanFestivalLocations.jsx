// src/pages/FanFestivalLocations.jsx
import React from 'react';
import FIFABanner from '../../components/layout/FIFABanner';
// import Footer from '../components/layout/Footer';
import FIFASectionFooter from "../../components/layout/FIFASectionFooter";


const FanFestivalLocations = () => {
  const locations = [
    { city: "New York", country: "USA", venues: ["Times Square", "Central Park"], dates: "June 11 - July 19" },
    { city: "Los Angeles", country: "USA", venues: ["Hollywood Boulevard", "Santa Monica"], dates: "June 11 - July 19" },
    { city: "Mexico City", country: "Mexico", venues: ["Zócalo", "Angel de Independencia"], dates: "June 11 - July 19" },
    { city: "Toronto", country: "Canada", venues: ["Nathan Phillips Square"], dates: "June 11 - July 19" }
  ];

  return (
    <div className="page-container">
      <FIFABanner />
      <div className="page-content">
        <div className="page-header">
          <h1>FIFA Fan Festival™ Locations</h1>
          <p>Experience the FIFA World Cup™ atmosphere beyond the stadiums</p>
        </div>
        
        <div className="festival-map">
          <div className="map-placeholder">
            <i className="fas fa-map-marked-alt"></i>
            <p>Interactive Map Loading...</p>
          </div>
        </div>
        
        <div className="locations-grid">
          {locations.map((loc, idx) => (
            <div key={idx} className="location-card">
              <h3>{loc.city}, {loc.country}</h3>
              <p><i className="fas fa-location-dot"></i> {loc.venues.join(", ")}</p>
              <p><i className="fas fa-calendar"></i> {loc.dates}</p>
              <button className="fifa-btn secondary">Get Directions</button>
            </div>
          ))}
        </div>
      </div>
      <FIFASectionFooter />
    </div>
  );
};

export default FanFestivalLocations;