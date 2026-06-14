// src/pages/fifa/WorldCupHome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FIFABanner from '../../components/layout/FIFABanner';
import FIFASectionFooter from '../../components/layout/FIFASectionFooter';
import './fifa.css';

const WorldCupHome = () => {
  const navigate = useNavigate();

  const upcomingMatches = [
    { id: 1, title: "Opening Match: Mexico vs Qualifier", date: "June 11, 2026", time: "4:00 PM", venue: "Estadio Azteca, Mexico City", tickets: "on-sale" },
    { id: 2, title: "USA vs England", date: "June 15, 2026", time: "8:00 PM", venue: "SoFi Stadium, Los Angeles", tickets: "on-sale" },
    { id: 3, title: "Brazil vs Germany", date: "June 18, 2026", time: "3:00 PM", venue: "Hard Rock Stadium, Miami", tickets: "on-sale" },
    { id: 4, title: "Argentina vs Spain", date: "June 22, 2026", time: "7:00 PM", venue: "MetLife Stadium, New Jersey", tickets: "coming-soon" },
    { id: 5, title: "France vs Italy", date: "June 25, 2026", time: "5:00 PM", venue: "Mercedes-Benz Stadium, Atlanta", tickets: "coming-soon" },
  ];

  const hostCities = [
    { name: "New York/New Jersey", venue: "MetLife Stadium", capacity: "82,500", country: "USA" },
    { name: "Los Angeles", venue: "SoFi Stadium", capacity: "70,240", country: "USA" },
    { name: "Mexico City", venue: "Estadio Azteca", capacity: "87,523", country: "Mexico" },
    { name: "Toronto", venue: "BMO Field", capacity: "45,736", country: "Canada" },
    { name: "Miami", venue: "Hard Rock Stadium", capacity: "65,326", country: "USA" },
    { name: "Dallas", venue: "AT&T Stadium", capacity: "80,000", country: "USA" },
  ];

  return (
    <div className="fifa-page-container">
      <FIFABanner showNav={true} />
      
      {/* Hero Section */}
      <div className="fifa-hero">
        <div className="hero-content">
          <h1>FIFA World Cup 2026™</h1>
          <p>United by the beautiful game • 16 Host Cities • 48 Teams • 104 Matches</p>
          <div className="hero-buttons">
            <button className="hero-btn primary" onClick={() => navigate('/fifa/tickets')}>
              <i className="fas fa-ticket-alt"></i> Get Tickets Now
            </button>
            <button className="hero-btn secondary" onClick={() => navigate('/fifa/hospitality')}>
              <i className="fas fa-champagne-glasses"></i> View Hospitality
            </button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">48</span>
            <span className="stat-label">Teams</span>
          </div>
          <div className="stat">
            <span className="stat-number">104</span>
            <span className="stat-label">Matches</span>
          </div>
          <div className="stat">
            <span className="stat-number">16</span>
            <span className="stat-label">Cities</span>
          </div>
          <div className="stat">
            <span className="stat-number">3</span>
            <span className="stat-label">Countries</span>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="fifa-section">
        <h2 className="section-title">Plan Your World Cup Journey</h2>
        <div className="cards-grid">
          <div className="fifa-card" onClick={() => navigate('/fifa/tickets')}>
            <div className="card-icon"><i className="fas fa-ticket-alt"></i></div>
            <h3 className="card-title">Tickets</h3>
            <p className="card-description">Secure your seat for the world's biggest sporting event. Multiple categories available.</p>
            <ul className="card-features">
              <li><i className="fas fa-check-circle"></i> General Public Sale</li>
              <li><i className="fas fa-check-circle"></i> Group Tickets</li>
              <li><i className="fas fa-check-circle"></i> Premium Seating</li>
              <li><i className="fas fa-check-circle"></i> Fan Packages</li>
            </ul>
            <button className="fifa-card-btn fifa-card-btn-default">Explore Tickets →</button>
          </div>

          <div className="fifa-card" onClick={() => navigate('/fifa/hospitality')}>
            <div className="card-icon"><i className="fas fa-champagne-glasses"></i></div>
            <h3 className="card-title">Hospitality</h3>
            <p className="card-description">Elevate your matchday with premium experiences and VIP access.</p>
            <ul className="card-features">
              <li><i className="fas fa-check-circle"></i> VIP Lounges</li>
              <li><i className="fas fa-check-circle"></i> Gourmet Dining</li>
              <li><i className="fas fa-check-circle"></i> Player Meet & Greets</li>
              <li><i className="fas fa-check-circle"></i> Exclusive Merchandise</li>
            </ul>
            <button className="fifa-card-btn fifa-card-btn-default">View Packages →</button>
          </div>

          <div className="fifa-card" onClick={() => navigate('/fifa/fan-festival')}>
            <div className="card-icon"><i className="fas fa-music"></i></div>
            <h3 className="card-title">Fan Festival</h3>
            <p className="card-description">Experience the World Cup atmosphere beyond the stadiums.</p>
            <ul className="card-features">
              <li><i className="fas fa-check-circle"></i> Live Music</li>
              <li><i className="fas fa-check-circle"></i> Food Trucks</li>
              <li><i className="fas fa-check-circle"></i> Fan Zones</li>
              <li><i className="fas fa-check-circle"></i> Interactive Games</li>
            </ul>
            <button className="fifa-card-btn fifa-card-btn-default">Find Locations →</button>
          </div>
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="fifa-section">
        <h2 className="section-title">Upcoming Matches</h2>
        <div className="matches-list">
          {upcomingMatches.map((match) => (
            <div key={match.id} className="match-card">
              <div className="match-info">
                <h3>{match.title}</h3>
                <p><i className="fas fa-calendar-alt"></i> {match.date} at {match.time}</p>
                <p><i className="fas fa-map-marker-alt"></i> {match.venue}</p>
              </div>
              <button 
                className={`match-btn ${match.tickets === 'on-sale' ? 'active' : ''}`}
                onClick={() => navigate('/fifa/tickets')}
              >
                {match.tickets === 'on-sale' ? 'Get Tickets →' : 'Coming Soon →'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Host Cities */}
      <div className="fifa-section">
        <h2 className="section-title">Host Cities</h2>
        <div className="cities-grid">
          {hostCities.map((city, idx) => (
            <div key={idx} className="city-card">
              <h3>{city.name}</h3>
              <p><i className="fas fa-stadium"></i> {city.venue}</p>
              <p><i className="fas fa-users"></i> Capacity: {city.capacity}</p>
              <p><i className="fas fa-flag"></i> {city.country}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Essential Services */}
      <div className="fifa-section">
        <h2 className="section-title">Essential Services</h2>
        <div className="services-grid">
          <div className="service-item" onClick={() => navigate('/fifa/register')}>
            <i className="fas fa-id-card"></i>
            <span>FIFA ID Registration</span>
          </div>
          <div className="service-item" onClick={() => navigate('/fifa/resale')}>
            <i className="fas fa-exchange-alt"></i>
            <span>Resale Marketplace</span>
          </div>
          <div className="service-item" onClick={() => navigate('/fifa/transfer')}>
            <i className="fas fa-ticket-transfer"></i>
            <span>Ticket Transfer</span>
          </div>
          <div className="service-item" onClick={() => navigate('/fifa/parking')}>
            <i className="fas fa-parking"></i>
            <span>Parking Passes</span>
          </div>
          <div className="service-item" onClick={() => navigate('/fifa/sales-phases')}>
            <i className="fas fa-chart-line"></i>
            <span>Sales Phases</span>
          </div>
          <div className="service-item" onClick={() => navigate('/fifa/categories')}>
            <i className="fas fa-tags"></i>
            <span>Ticket Categories</span>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="fifa-section">
        <div className="resources-row">
          <div className="resource-card" onClick={() => navigate('/fifa/faq')}>
            <i className="fas fa-question-circle"></i>
            <div>
              <h4>General Public FAQ</h4>
              <p>Answers to common questions about tickets</p>
            </div>
          </div>
          <div className="resource-card" onClick={() => navigate('/fifa/updates')}>
            <i className="fas fa-envelope"></i>
            <div>
              <h4>Register for Updates</h4>
              <p>Get ticket alerts & tournament news</p>
            </div>
          </div>
          <div className="resource-card" onClick={() => navigate('/fifa/legal')}>
            <i className="fas fa-gavel"></i>
            <div>
              <h4>Legal Documents</h4>
              <p>Terms, conditions & policies</p>
            </div>
          </div>
        </div>
      </div>

      <FIFASectionFooter />
    </div>
  );
};

export default WorldCupHome;