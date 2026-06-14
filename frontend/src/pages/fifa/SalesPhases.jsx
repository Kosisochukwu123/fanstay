// src/pages/SalesPhases.jsx
import React from 'react';
import FIFABanner from '../../components/layout/FIFABanner';
// import Footer from '../components/layout/Footer';
import FIFASectionFooter from "../../components/layout/FIFASectionFooter";


const SalesPhases = () => {
  const phases = [
    { phase: "Phase 1 - Priority Access", dates: "January 15 - January 30, 2025", status: "Completed" },
    { phase: "Phase 2 - General Public Sale", dates: "March 1 - March 15, 2025", status: "Upcoming" },
    { phase: "Phase 3 - Secondary Sale", dates: "May 10 - May 25, 2025", status: "Upcoming" },
    { phase: "Phase 4 - Last Minute", dates: "June 1 - June 10, 2026", status: "Upcoming" }
  ];

  return (
    <div className="page-container">
      <FIFABanner />
      <div className="page-content">
        <div className="page-header">
          <h1>Ticket Sales Phases</h1>
          <p>Plan your ticket purchase with our phased sales schedule</p>
        </div>
        
        <div className="timeline">
          {phases.map((phase, idx) => (
            <div key={idx} className={`timeline-item ${phase.status === 'Completed' ? 'completed' : ''}`}>
              <div className="timeline-marker">{idx + 1}</div>
              <div className="timeline-content">
                <h3>{phase.phase}</h3>
                <p>{phase.dates}</p>
                <span className={`status-badge ${phase.status.toLowerCase()}`}>{phase.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FIFASectionFooter />
    </div>
  );
};

export default SalesPhases;