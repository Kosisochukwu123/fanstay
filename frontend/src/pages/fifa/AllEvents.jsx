// src/pages/AllEvents.jsx
import React from 'react';
import FIFABanner from '../../components/layout/FIFABanner';
// import Footer from '../components/layout/Footer';
import FIFASectionFooter from "../../components/layout/FIFASectionFooter";


const AllEvents = () => {
  const allEvents = [
    { title: "FIFA World Cup 2026™ Opening Match", date: "June 11, 2026", venue: "Estadio Azteca, Mexico City" },
    { title: "Group Stage Match 1", date: "June 12, 2026", venue: "SoFi Stadium, Los Angeles" },
    { title: "Group Stage Match 2", date: "June 13, 2026", venue: "MetLife Stadium, New Jersey" },
    { title: "Round of 16", date: "July 2, 2026", venue: "Various Locations" },
    { title: "Quarterfinals", date: "July 9-10, 2026", venue: "Various Locations" },
    { title: "Semifinals", date: "July 14-15, 2026", venue: "Various Locations" },
    { title: "FIFA World Cup 2026™ Final", date: "July 19, 2026", venue: "MetLife Stadium, New Jersey" }
  ];

  return (
    <div className="page-container">
      <FIFABanner />
      <div className="page-content">
        <div className="page-header">
          <h1>All FIFA World Cup 2026™ Events</h1>
          <p>Complete schedule of matches and events</p>
        </div>
        
        <div className="events-list">
          {allEvents.map((event, idx) => (
            <div key={idx} className="event-list-item">
              <div className="event-date-badge">{event.date}</div>
              <div className="event-details">
                <h3>{event.title}</h3>
                <p><i className="fas fa-map-marker-alt"></i> {event.venue}</p>
              </div>
              <button className="fifa-btn small">Details</button>
            </div>
          ))}
        </div>
      </div>
      <FIFASectionFooter />
    </div>
  );
};

export default AllEvents;