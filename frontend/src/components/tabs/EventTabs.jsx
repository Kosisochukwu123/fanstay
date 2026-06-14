// src/components/tabs/EventsTab.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EventTabs.css";
import FIFASectionFooter from '../layout/FIFASectionFooter';


const EventsTab = ({ events: propEvents }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propEvents && propEvents.length > 0) {
      setEvents(propEvents);
    } else {
      loadEvents();
    }
  }, [propEvents]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      // Try to fetch from API, fallback to mock data
      const response = await fetch("/api/events/upcoming").catch(() => null);
      if (response && response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        // Mock FIFA World Cup 2026™ events
        setEvents(mockEvents);
      }
    } catch (error) {
      console.error("Failed to load events:", error);
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event) => {
    console.log("Event clicked:", event);
    navigate(`/fifa/event/${event.id}`);
  };

  const handleBuyTicket = (event, e) => {
    e.stopPropagation();
    navigate("/fifa/tickets");
  };

  const handleViewAllEvents = () => {
    navigate("/fifa/events/all");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="events-tab-container">
        <div className="loading-events">
          <div className="spinner"></div>
          <p>Loading upcoming events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-tab-container">
      {/* Header with title and view all button */}
      <div className="events-header">
        <h2 className="events-title">
          <i className="fas fa-calendar-alt"></i> Upcoming sporting events
        </h2>
        {events.length > 0 && (
          <button className="view-all-btn" onClick={handleViewAllEvents}>
            View All <i className="fas fa-arrow-right"></i>
          </button>
        )}
      </div>

      {/* Events Carousel / Grid */}
      {events.length > 0 ? (
        <div className="events-carousel">
          {events.map((event) => (
            <div
              key={event.id}
              className="event-card"
              onClick={() => handleEventClick(event)}
            >
              <div className="event-image">
                {event.image ? (
                  <img src={event.image} alt={event.title} />
                ) : (
                  <div className="image-placeholder">
                    <i className="fas fa-futbol"></i>
                    <span>🏆</span>
                  </div>
                )}
                {event.featured && <span className="featured-badge">FEATURED</span>}
                {event.category && (
                  <span className="category-badge">{event.category}</span>
                )}
              </div>
              <div className="event-details">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-meta">
                  <span className="event-date">
                    <i className="far fa-calendar-alt"></i> {formatDate(event.date)}
                  </span>
                  <span className="event-location">
                    <i className="fas fa-map-marker-alt"></i> {event.location}
                  </span>
                  {event.stadium && (
                    <span className="event-stadium">
                      <i className="fas fa-building"></i> {event.stadium}
                    </span>
                  )}
                </div>
                <div className="event-footer">
                  <span
                    className={`event-status status-${event.status || "available"}`}
                  >
                    {event.status === "on-sale"
                      ? "🎟️ Tickets on sale"
                      : event.status === "coming-soon"
                      ? "🔜 Coming soon"
                      : event.status === "sold-out"
                      ? "❌ Sold out"
                      : "✅ Available"}
                  </span>
                  <button
                    className="ticket-btn"
                    onClick={(e) => handleBuyTicket(event, e)}
                    disabled={event.status === "sold-out"}
                  >
                    {event.status === "on-sale"
                      ? "Buy Tickets →"
                      : event.status === "coming-soon"
                      ? "Notify Me →"
                      : "Learn More →"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-events">
          <i className="fas fa-calendar-times"></i>
          <p>No upcoming events right now. Check back soon!</p>
          <button className="refresh-btn" onClick={loadEvents}>
            Refresh Events
          </button>
        </div>
      )}

      {/* FIFA World Cup 2026™ Quick Links - Matching screenshot style */}
      <div className="fifa-quick-links">
        <div className="quick-link-card tickets-card">
          <div className="card-icon">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="card-content">
            <h3>Tickets</h3>
            <p>Start your FIFA World Cup 2026™ journey by exploring ticket options</p>
            <button
              className="link-button"
              onClick={() => navigate("/fifa/tickets")}
            >
              Explore ticket options <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <div className="quick-link-card hospitality-card">
          <div className="card-icon">
            <i className="fas fa-champagne-glasses"></i>
          </div>
          <div className="card-content">
            <h3>Hospitality</h3>
            <p>Lock in seats and level up matchday with a ticket-inclusive hospitality package</p>
            <button
              className="link-button"
              onClick={() => navigate("/fifa/hospitality")}
            >
              View hospitality packages <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* FIFA Services Row */}
      <div className="fifa-services-row">
        <div className="service-block" onClick={() => navigate("/fifa/register")}>
          <i className="fas fa-id-card"></i>
          <span>FIFA ID REGISTRATION</span>
          <small>Create your FIFA ID →</small>
        </div>
        <div className="service-block" onClick={() => navigate("/fifa/resale")}>
          <i className="fas fa-exchange-alt"></i>
          <span>RESALE / EXCHANGE MARKETPLACE</span>
          <small>Official resale →</small>
        </div>
        <div className="service-block" onClick={() => navigate("/fifa/transfer")}>
          <i className="fas fa-ticket-transfer"></i>
          <span>TICKET TRANSFER</span>
          <small>Transfer tickets →</small>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="resources-grid">
        <div className="resource-item" onClick={() => navigate("/fifa/parking")}>
          <i className="fas fa-parking"></i>
          <span>PARKING PASSES</span>
        </div>
        <div className="resource-item" onClick={() => navigate("/fifa/sales-phases")}>
          <i className="fas fa-chart-line"></i>
          <span>SALES PHASES</span>
        </div>
        <div className="resource-item" onClick={() => navigate("/fifa/categories")}>
          <i className="fas fa-tags"></i>
          <span>TICKET PRODUCTS AND CATEGORIES</span>
        </div>
        <div className="resource-item" onClick={() => navigate("/fifa/faq")}>
          <i className="fas fa-question-circle"></i>
          <span>GENERAL PUBLIC FAQ</span>
        </div>
        <div className="resource-item" onClick={() => navigate("/fifa/updates")}>
          <i className="fas fa-envelope"></i>
          <span>REGISTER FOR UPDATES</span>
        </div>
        <div className="resource-item" onClick={() => navigate("/fifa/legal")}>
          <i className="fas fa-gavel"></i>
          <span>LEGAL DOCUMENTS</span>
        </div>
      </div>

      {/* FIFA Fan Festival Banner */}
      <div className="fan-festival-banner">
        <div className="fan-festival-content">
          <h3>
            <i className="fas fa-music"></i> FIFA Fan Festival™
          </h3>
          <p>
            Experience the FIFA World Cup™ atmosphere beyond the stadiums by
            finding your local FIFA Fan Festival™ destination
          </p>
        </div>
        <button
          className="discover-btn"
          onClick={() => navigate("/fifa/fan-festival")}
        >
          Discover locations <i className="fas fa-map-marker-alt"></i>
        </button>
      </div>
    </div>
  );
};

// Mock FIFA World Cup 2026™ Events Data
const mockEvents = [
  {
    id: 1,
    title: "FIFA World Cup 2026™ Opening Match",
    date: "2026-06-11",
    location: "Mexico City",
    stadium: "Estadio Azteca",
    status: "on-sale",
    featured: true,
    category: "World Cup",
    image: null,
  },
  {
    id: 2,
    title: "Group Stage: USA vs England",
    date: "2026-06-15",
    location: "Los Angeles",
    stadium: "SoFi Stadium",
    status: "on-sale",
    featured: false,
    category: "Group Stage",
    image: null,
  },
  {
    id: 3,
    title: "Group Stage: Brazil vs Germany",
    date: "2026-06-18",
    location: "Miami",
    stadium: "Hard Rock Stadium",
    status: "on-sale",
    featured: false,
    category: "Group Stage",
    image: null,
  },
  {
    id: 4,
    title: "Round of 16: Match 1",
    date: "2026-07-02",
    location: "New York/New Jersey",
    stadium: "MetLife Stadium",
    status: "coming-soon",
    featured: false,
    category: "Knockout",
    image: null,
  },
  {
    id: 5,
    title: "Quarterfinal: Match 1",
    date: "2026-07-09",
    location: "Atlanta",
    stadium: "Mercedes-Benz Stadium",
    status: "coming-soon",
    featured: true,
    category: "Knockout",
    image: null,
  },
  {
    id: 6,
    title: "Semifinal: Match 1",
    date: "2026-07-14",
    location: "Dallas",
    stadium: "AT&T Stadium",
    status: "coming-soon",
    featured: false,
    category: "Knockout",
    image: null,
  },
  {
    id: 7,
    title: "FIFA World Cup 2026™ Final",
    date: "2026-07-19",
    location: "New York/New Jersey",
    stadium: "MetLife Stadium",
    status: "coming-soon",
    featured: true,
    category: "Final",
    image: null,
  },
];

export default EventsTab;