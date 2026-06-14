// src/components/fifa/FIFASectionFooter.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FIFASectionFooter.css';

const FIFASectionFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="fifa-section-footer">
      {/* Social Media Links */}
      <div className="fifa-footer-social">
        <i className="fab fa-twitter" onClick={() => window.open('https://twitter.com/fifa', '_blank')}></i>
        <i className="fab fa-facebook-f" onClick={() => window.open('https://facebook.com/fifa', '_blank')}></i>
        <i className="fab fa-instagram" onClick={() => window.open('https://instagram.com/fifa', '_blank')}></i>
        <i className="fab fa-youtube" onClick={() => window.open('https://youtube.com/fifa', '_blank')}></i>
        <i className="fab fa-linkedin-in" onClick={() => window.open('https://linkedin.com/company/fifa', '_blank')}></i>
        <i className="fab fa-whatsapp" onClick={() => window.open('https://whatsapp.com/channel/fifa', '_blank')}></i>
        <i className="fab fa-telegram" onClick={() => window.open('https://t.me/fifa', '_blank')}></i>
        <i className="fab fa-tiktok" onClick={() => window.open('https://tiktok.com/@fifa', '_blank')}></i>
        <i className="fab fa-pinterest" onClick={() => window.open('https://pinterest.com/fifa', '_blank')}></i>
        <i className="fab fa-reddit-alien" onClick={() => window.open('https://reddit.com/r/fifa', '_blank')}></i>
      </div>

      {/* Quick Links */}
      <div className="fifa-footer-links">
        <button onClick={() => navigate('/fifa')}>FIFA World Cup 2026™</button>
        <button onClick={() => navigate('/fifa/tickets')}>Tickets</button>
        <button onClick={() => navigate('/fifa/hospitality')}>Hospitality</button>
        <button onClick={() => navigate('/fifa/faq')}>FAQ</button>
        <button onClick={() => navigate('/fifa/legal')}>Legal</button>
        <button onClick={() => navigate('/fifa/updates')}>Register for Updates</button>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/contact">Contact Us</a>
        <a href="/accessibility">Accessibility</a>
      </div>

      {/* Copyright and Windows Activation */}
      <div className="fifa-footer-copyright">
        <p>© FIFA 2024 - All rights reserved. The FIFA name and logo are protected trademarks.</p>
        <div className="fifa-win-activate">
          <i className="fas fa-window-maximize"></i> Go to Settings to activate Windows
        </div>
      </div>
    </footer>
  );
};

export default FIFASectionFooter;