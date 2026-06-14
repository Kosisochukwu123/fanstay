// src/pages/ParkingPasses.jsx
import React from 'react';
import FIFABanner from '../../components/layout/FIFABanner';
// import Footer from '../components/layout/Footer';
import FIFASectionFooter from "../../components/layout/FIFASectionFooter";


const ParkingPasses = () => {
  const stadiums = [
    { name: "MetLife Stadium", location: "New Jersey", passes: 1250, price: "$45" },
    { name: "SoFi Stadium", location: "Los Angeles", passes: 890, price: "$55" },
    { name: "Estadio Azteca", location: "Mexico City", passes: 2100, price: "$30" },
    { name: "Hard Rock Stadium", location: "Miami", passes: 1100, price: "$50" }
  ];

  return (
    <div className="page-container">
      <FIFABanner />
      <div className="page-content">
        <div className="page-header">
          <h1>Parking Passes</h1>
          <p>Secure your parking spot for matchday</p>
        </div>
        
        <div className="parking-grid">
          {stadiums.map((stadium, idx) => (
            <div key={idx} className="parking-card">
              <h3>{stadium.name}</h3>
              <p><i className="fas fa-location-dot"></i> {stadium.location}</p>
              <p><i className="fas fa-parking"></i> Available: {stadium.passes} spots</p>
              <div className="price">{stadium.price}</div>
              <button className="fifa-btn secondary">Reserve Spot</button>
            </div>
          ))}
        </div>
      </div>
      <FIFASectionFooter />
    </div>
  );
};

export default ParkingPasses;