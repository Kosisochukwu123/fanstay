import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Lottie from 'lottie-react';
import { FiMenu, FiUser, FiX, FiHome, FiHeart, FiCalendar, FiMessageCircle, FiSettings, FiLogOut, FiGlobe, FiHelpCircle, FiDollarSign } from 'react-icons/fi';
import SearchBar, { SearchBarCompact } from './SearchBar';
import SearchModal from './SearchModal';
import './HeroSearch.css';

import homeAnimation from '../animations/home.json';
import soccerBallAnimation from '../animations/soccer-ball.json';
import ticketAnimation from '../animations/bell.json';

const SUB_TABS = [
  { key: 'stays', label: 'Homes', animation: homeAnimation },
  { key: 'events', label: 'Events', animation: soccerBallAnimation },
  { key: 'tickets', label: 'Services', animation: ticketAnimation },
];

const HeroSearch = ({ backgroundImage, activeTab = 'stays', onTabChange, logoText = 'FanStay', onMenuClick }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [isCompact, setIsCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const lottieRefs = {
    stays: useRef(null),
    events: useRef(null),
    tickets: useRef(null),
  };

  // Pure scroll-based check: once the sticky bar's top edge has reached
  // its pinned position (equal to the CSS `top` offset), switch to compact.
  useEffect(() => {
    const handleScroll = () => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      // 1px tolerance for sub-pixel scroll values
      setIsCompact(rect.top <= 1);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (hoveredTab && lottieRefs[hoveredTab]?.current) {
      lottieRefs[hoveredTab].current.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredTab]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target) &&
          menuButtonRef.current &&
          !menuButtonRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (menuOpen && event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

  const handleMouseLeave = (key) => {
    setHoveredTab(null);
    if (lottieRefs[key]?.current) {
      lottieRefs[key].current.stop();
    }
  };

  const handleTabClick = (tab) => {
    onTabChange?.(tab.key);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = (action) => {
    setMenuOpen(false);
    if (action === 'becomeHost') {
      // Navigate to host page or trigger host flow
      window.location.href = '/host';
    } else if (action === 'referHost') {
      // Navigate to refer page
      window.location.href = '/refer';
    } else if (action === 'notifications') {
      // Open notifications
      console.log('Open notifications');
    } else if (action === 'account') {
      // Navigate to account settings
      window.location.href = '/account';
    } else if (action === 'languages') {
      // Open language settings
      console.log('Open language settings');
    } else if (action === 'help') {
      // Open help center
      window.location.href = '/help';
    } else if (action === 'logout') {
      // Handle logout
      console.log('Logout');
    }
  };

  return (
    <div
      ref={barRef}
      className={`hero-search ${isCompact ? 'is-compact' : ''}`}
      style={!isCompact && backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {/* Top row: Homes / Events / Tickets tabs */}
      <div className="hero-search-inner container">
        <div className="hero-sub-tabs">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`hero-sub-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
              onMouseEnter={() => setHoveredTab(tab.key)}
              onMouseLeave={() => handleMouseLeave(tab.key)}
            >
              {!isCompact && (
                <div className="hero-sub-tab-icon-wrapper">
                  <Lottie
                    lottieRef={lottieRefs[tab.key]}
                    animationData={tab.animation}
                    loop={true}
                    autoplay={activeTab === tab.key}
                    className="hero-sub-tab-lottie"
                    rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                  />
                </div>
              )}
              <span className="hero-sub-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom row: logo | search bar | hamburger + profile (desktop only) */}
      <div className="hero-search-bottom-row container">
        <Link to="/" className="hero-search-logo">{logoText}</Link>

        <div className="hero-search-center">
          <div className="hero-search-desktop">
            <SearchBar />
          </div>
          <div className="hero-search-mobile">
            <SearchBarCompact onClick={() => setModalOpen(true)} />
          </div>
        </div>

        <div className="hero-search-menu-wrapper">
          <button 
            ref={menuButtonRef}
            className={`hero-search-menu-btn ${menuOpen ? 'active' : ''}`} 
            onClick={toggleMenu} 
            aria-label="Open menu"
          >
            <FiMenu />
            <span className="hero-search-menu-avatar">
              {user?.avatar?.url ? <img src={user.avatar.url} alt={user.name} /> : <FiUser />}
            </span>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div ref={menuRef} className="hero-search-dropdown">
              {/* User info section */}
              {user && (
                <div className="hero-search-dropdown-user">
                  <div className="dropdown-user-avatar">
                    {user?.avatar?.url ? <img src={user.avatar.url} alt={user.name} /> : <FiUser size={24} />}
                  </div>
                  <div className="dropdown-user-info">
                    <div className="dropdown-user-name">{user?.name || 'Guest User'}</div>
                    <div className="dropdown-user-email">{user?.email || 'user@example.com'}</div>
                  </div>
                </div>
              )}

              {/* Menu items */}
              <div className="hero-search-dropdown-section">
                <button 
                  className="hero-search-dropdown-item"
                  onClick={() => handleMenuItemClick('becomeHost')}
                >
                  <FiHome />
                  <span>Become a host</span>
                </button>
                <button 
                  className="hero-search-dropdown-item"
                  onClick={() => handleMenuItemClick('referHost')}
                >
                  <FiHeart />
                  <span>Refer a Host</span>
                </button>
              </div>

              <div className="hero-search-dropdown-divider" />

              <div className="hero-search-dropdown-section">
                <button 
                  className="hero-search-dropdown-item"
                  onClick={() => handleMenuItemClick('notifications')}
                >
                  <FiMessageCircle />
                  <span>Notifications</span>
                </button>
                <button 
                  className="hero-search-dropdown-item"
                  onClick={() => handleMenuItemClick('account')}
                >
                  <FiSettings />
                  <span>Account settings</span>
                </button>
                <button 
                  className="hero-search-dropdown-item"
                  onClick={() => handleMenuItemClick('languages')}
                >
                  <FiGlobe />
                  <span>Languages & currency</span>
                </button>
                <button 
                  className="hero-search-dropdown-item"
                  onClick={() => handleMenuItemClick('help')}
                >
                  <FiHelpCircle />
                  <span>Help Center</span>
                </button>
              </div>

              <div className="hero-search-dropdown-divider" />

              <div className="hero-search-dropdown-section">
                <button 
                  className="hero-search-dropdown-item logout"
                  onClick={() => handleMenuItemClick('logout')}
                >
                  <FiLogOut />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalOpen && <SearchModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default HeroSearch;