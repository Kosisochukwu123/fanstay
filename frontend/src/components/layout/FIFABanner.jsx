// src/components/layout/FIFABanner.jsx
import React from 'react';
import './FIFABanner.css';

const FIFABanner = ({ showNav = true, activePage = '' }) => {
  return (
    <div className="fifa-banner-container">
      {/* Top Utility Bar */}
      <div className="top-utility-bar">
        <div className="utility-links">
          <a href="/rewards" className="utility-link">FIFA Rewards</a>
          <a href="/plus" className="utility-link">FIFA+</a>
          <a href="/store" className="utility-link">FIFA Store</a>
          <a href="/collect" className="utility-link">FIFA Collect</a>
        </div>
        <div className="language-selector">
          <i className="fas fa-globe"></i>
          <span>English</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>

      {/* Main FIFA Logo Banner */}
      <div className="main-logo-banner">
        <div className="logo-wrapper">
          <div className="fifa-logo">
            <span className="fifa-letter">F</span>
            <span className="fifa-letter">I</span>
            <span className="fifa-letter">F</span>
            <span className="fifa-letter">A</span>
            <span className="fifa-trademark">™</span>
          </div>
          <div className="logo-tagline">GOVERNING BODY OF WORLD FOOTBALL</div>
        </div>
        <div className="worldcup-badge-header">
          <i className="fas fa-trophy"></i>
          <span>FIFA World Cup 2026™</span>
        </div>
      </div>

      {/* Main Navigation */}
      {showNav && (
        <nav className="main-navigation">
          <div className="nav-container">
            <a href="/" className={`nav-item ${activePage === 'home' ? 'active' : ''}`}>
              <i className="fas fa-home"></i> Home
            </a>
            <a href="/worldcup-2026" className={`nav-item ${activePage === 'worldcup' ? 'active' : ''}`}>
              <i className="fas fa-futbol"></i> FIFA World Cup 2026™
            </a>
            <a href="/matches" className={`nav-item ${activePage === 'matches' ? 'active' : ''}`}>
              <i className="fas fa-calendar-alt"></i> Matches
            </a>
            <a href="/standings" className={`nav-item ${activePage === 'standings' ? 'active' : ''}`}>
              <i className="fas fa-chart-simple"></i> Standings
            </a>
            <a href="/teams" className={`nav-item ${activePage === 'teams' ? 'active' : ''}`}>
              <i className="fas fa-users"></i> Teams & Stats
            </a>
            <a href="/latest" className={`nav-item ${activePage === 'latest' ? 'active' : ''}`}>
              <i className="fas fa-newspaper"></i> Latest
            </a>
            <a href="/fantasy" className={`nav-item ${activePage === 'fantasy' ? 'active' : ''}`}>
              <i className="fas fa-gamepad"></i> Fantasy & Gaming
            </a>
            <a href="/tickets" className={`nav-item ${activePage === 'tickets' ? 'active' : ''}`}>
              <i className="fas fa-ticket-alt"></i> Tickets
            </a>
            <a href="/more" className="nav-item">
              <i className="fas fa-ellipsis-h"></i> MORE
            </a>
          </div>
        </nav>
      )}
    </div>
  );
};

export default FIFABanner;