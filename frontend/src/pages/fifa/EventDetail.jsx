// src/pages/EventDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import FIFABanner from '../../components/layout/FIFABanner';
// import Footer from '../components/layout/Footer';
import FIFASectionFooter from "../../components/layout/FIFASectionFooter";


const EventDetail = () => {
  const { id } = useParams();
  
  const event = {
    title: "FIFA World Cup 2026™ Opening Match",
    date: "June 11, 2026",
    time: "4:00 PM",
    location: "Estadio Azteca, Mexico City",
    description: "Witness history as the FIFA World Cup 2026™ kicks off with an spectacular opening ceremony followed by the first match featuring host nation Mexico."
  };

  return (
    <div className="page-container">
      <FIFABanner />
      <div className="page-content">
        <div className="event-detail-container">
          <h1>{event.title}</h1>
          <div className="event-info-card">
            <p><i className="fas fa-calendar-alt"></i> {event.date} at {event.time}</p>
            <p><i className="fas fa-map-marker-alt"></i> {event.location}</p>
            <p>{event.description}</p>
            <div className="event-actions">
              <button className="fifa-btn primary">Buy Tickets</button>
              <button className="fifa-btn secondary">Add to Calendar</button>
            </div>
          </div>
        </div>
      </div>
      <FIFASectionFooter />
    </div>
  );
};

export default EventDetail;