import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { FiSearch, FiHeart, FiMessageSquare, FiUser, FiX } from 'react-icons/fi';
import { BsBriefcase } from 'react-icons/bs';
import './Navbar.css';

const MobileBottomNav = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [tripsPanelOpen, setTripsPanelOpen] = useState(false);

  const dashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'host') return '/host/dashboard';
    return '/dashboard';
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      <nav className="mobile-bottom-nav">
        <Link to="/" className={`mobile-bottom-nav-item ${isActive('/explore') ? 'active' : ''}`}>
          <FiSearch />
          <span>Explore</span>
        </Link>
        <Link to="/favorites" className={`mobile-bottom-nav-item ${isActive('/favorites') ? 'active' : ''}`}>
          <FiHeart />
          <span>Wishlists</span>
        </Link>
        {/* Trips button - opens slide-out panel instead of navigation */}
        <button 
          className={`mobile-bottom-nav-item mobile-bottom-nav-trips ${isActive('/dashboard') || isActive('/host/dashboard') || isActive('/admin') ? 'active' : ''}`}
          onClick={() => setTripsPanelOpen(true)}
        >
          <BsBriefcase />
          <span>Trips</span>
        </button>
        <Link
          to={isAuthenticated ? '/messages' : '/login'}
          className={`mobile-bottom-nav-item ${isActive('/messages') ? 'active' : ''}`}
        >
          <FiMessageSquare />
          <span>Messages</span>
        </Link>
        <Link
          to={isAuthenticated ? '/profile' : '/login'}
          className={`mobile-bottom-nav-item ${isActive('/profile') || isActive('/login') ? 'active' : ''}`}
        >
          <FiUser />
          <span>{isAuthenticated ? 'Profile' : 'Log in'}</span>
        </Link>
      </nav>

      {/* Trips Slide-out Panel */}
      <div className={`trips-panel-overlay ${tripsPanelOpen ? 'open' : ''}`} onClick={() => setTripsPanelOpen(false)}>
        <div className={`trips-panel ${tripsPanelOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="trips-panel-header">
            <h2>Trips</h2>
            <button className="trips-panel-close" onClick={() => setTripsPanelOpen(false)}>
              <FiX />
            </button>
          </div>
          <div className="trips-panel-content">
            {isAuthenticated ? (
              <>
                <Link to={dashboardLink()} className="trips-panel-item" onClick={() => setTripsPanelOpen(false)}>
                  <BsBriefcase />
                  <div>
                    <h4>Dashboard</h4>
                    <p>View your trips and bookings</p>
                  </div>
                </Link>
                {user?.role === 'host' && (
                  <Link to="/host/dashboard" className="trips-panel-item" onClick={() => setTripsPanelOpen(false)}>
                    <BsBriefcase />
                    <div>
                      <h4>Host Dashboard</h4>
                      <p>Manage your listings</p>
                    </div>
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="trips-panel-item" onClick={() => setTripsPanelOpen(false)}>
                    <BsBriefcase />
                    <div>
                      <h4>Admin Dashboard</h4>
                      <p>Manage platform</p>
                    </div>
                  </Link>
                )}
                <Link to="/bookings" className="trips-panel-item" onClick={() => setTripsPanelOpen(false)}>
                  <BsBriefcase />
                  <div>
                    <h4>My Bookings</h4>
                    <p>View all your reservations</p>
                  </div>
                </Link>
                <Link to="/favorites" className="trips-panel-item" onClick={() => setTripsPanelOpen(false)}>
                  <FiHeart />
                  <div>
                    <h4>Wishlists</h4>
                    <p>Saved properties</p>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <div className="trips-panel-login">
                  <p>Sign in to view your trips</p>
                  <Link to="/login" className="btn btn-primary" onClick={() => setTripsPanelOpen(false)}>
                    Log in
                  </Link>
                  <Link to="/register" className="btn btn-secondary" onClick={() => setTripsPanelOpen(false)}>
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileBottomNav;