// src/components/layout/Footer.jsx - Simplified version matching your original structure
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiGlobe, 
  FiYoutube, 
  FiLinkedin, 
  FiMapPin, 
  FiHeart, 
  FiShield, 
  FiHeadphones, 
  FiTrendingUp, 
  FiUsers, 
  FiHome, 
  FiCalendar, 
  FiAward, 
  FiBriefcase, 
  FiGift, 
  FiFileText, 
  FiLock
} from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'MXN'];

const Footer = () => {
  const { lang, changeLang, available } = useLanguage();
  const [currency, setCurrency] = useState('USD');
  const [langOpen, setLangOpen] = useState(false);

  return (
    <footer className="footer">
      {/* Main Footer Links - Keeping your original structure */}
      <div className="container footer-inner">
        {/* Column 1 - Support */}
        <div className="footer-col">
          <h4>Support</h4>
          <Link to="/faq">Help Center</Link>
          <Link to="/contact">Get help with a safety issue</Link>
          <Link to="/contact">AirCover</Link>
          <Link to="/contact">Travel insurance</Link>
          <Link to="/contact">Anti-discrimination</Link>
          <Link to="/contact">Disability support</Link>
          <Link to="/contact">Cancellation options</Link>
          <Link to="/contact">Report a neighborhood concern</Link>
        </div>

        {/* Column 2 - Hosting */}
        <div className="footer-col">
          <h4>Hosting</h4>
          <Link to="/register">List your property</Link>
          <Link to="/host/dashboard">Host Dashboard</Link>
          <Link to="/contact">FanStay your home</Link>
          <Link to="/contact">AirCover for Hosts</Link>
          <Link to="/contact">Hosting resources</Link>
          <Link to="/contact">Community forum</Link>
          <Link to="/contact">Hosting responsibly</Link>
          <Link to="/contact">Find a co-host</Link>
          <Link to="/contact">Refer a host</Link>
        </div>

        {/* Column 3 - FanStay */}
        <div className="footer-col">
          <h4>FanStay</h4>
          <Link to="/explore?event=World+Cup">2026 World Cup stays</Link>
          <Link to="/contact">Newsroom</Link>
          <Link to="/contact">Careers</Link>
          <Link to="/contact">Investors</Link>
          <Link to="/contact">Gift cards</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <div className="footer-bottom-left">
            <span>&copy; {new Date().getFullYear()} FanStay, Inc.</span>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Your Privacy Choices</Link>
          </div>

          <div className="footer-bottom-right">
            <div className="footer-lang-currency">
              <button className="footer-lang-btn" onClick={() => setLangOpen(!langOpen)}>
                <FiGlobe /> {lang.toUpperCase()}
              </button>
              {langOpen && (
                <ul className="footer-lang-dropdown">
                  {available.map((l) => (
                    <li key={l}>
                      <button onClick={() => { changeLang(l); setLangOpen(false); }}>
                        {l.toUpperCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <select
                className="footer-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                aria-label="Currency"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="footer-socials">
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="YouTube"><FiYoutube /></a>
              <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="#" aria-label="TikTok"><FaTiktok /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;