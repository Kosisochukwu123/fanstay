import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiSearch, FiHeart, FiMessageSquare, FiUser } from 'react-icons/fi';
import { BsBriefcase } from 'react-icons/bs';
import './Navbar.css';

const MobileBottomNav = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const dashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'host') return '/host/dashboard';
    return '/dashboard';
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="mobile-bottom-nav">
      <Link to="/" className={`mobile-bottom-nav-item ${isActive('/explore') ? 'active' : ''}`}>
        <FiSearch />
        <span>Explore</span>
      </Link>
      <Link to="/favorites" className={`mobile-bottom-nav-item ${isActive('/favorites') ? 'active' : ''}`}>
        <FiHeart />
        <span>Wishlists</span>
      </Link>
      <Link
        to={isAuthenticated ? dashboardLink() : '/login'}
        className={`mobile-bottom-nav-item ${isActive('/dashboard') || isActive('/host/dashboard') || isActive('/admin') ? 'active' : ''}`}
      >
        <BsBriefcase />
        <span>Trips</span>
      </Link>
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
  );
};

export default MobileBottomNav;