import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMenu, FiSun, FiMoon, FiGlobe, FiHeart, FiUser, FiMessageSquare } from 'react-icons/fi';
import { BsBriefcase } from 'react-icons/bs';
import { GiSoccerBall } from 'react-icons/gi';
import { MdOutlineSportsBaseball, MdOutlineEventSeat } from 'react-icons/md';
import { logoutUser } from '../../redux/authSlice';
import { toggleTheme } from '../../redux/themeSlice';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import './Navbar.css';

const CATEGORY_TABS = [
  { key: 'stays', label: 'Stays', icon: <FiUser />, to: '/explore' },
  { key: 'events', label: 'Events', icon: <GiSoccerBall />, to: '/events' },
  { key: 'tickets', label: 'Match Tickets', icon: <MdOutlineEventSeat />, to: '/events', badge: 'NEW' },
  { key: 'experiences', label: 'Experiences', icon: <MdOutlineSportsBaseball />, to: '/explore', badge: 'NEW' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, lang, changeLang, available } = useLanguage();
  const { settings } = useSiteSettings();
  const logoText = settings?.theme?.logoText || 'FanStay';

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setMenuOpen(false);
    navigate('/');
  };

  const dashboardLink = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'host') return '/host/dashboard';
    return '/dashboard';
  };

  return (
    <header className="navbar">
      {/* Top row: logo, category tabs, user actions */}
      <div className="navbar-top">
        <div className="container navbar-top-inner">
          <Link to="/" className="navbar-logo">
            <span className="logo-mark">{logoText}</span>
          </Link>

          <nav className="category-tabs">
            {CATEGORY_TABS.map((tab) => (
              <Link key={tab.key} to={tab.to} className="category-tab">
                <span className="category-tab-icon">{tab.icon}</span>
                <span className="category-tab-label">
                  {tab.label}
                  {tab.badge && <span className="category-tab-badge">{tab.badge}</span>}
                </span>
              </Link>
            ))}
          </nav>

          <div className="navbar-actions">
            {user?.role === 'guest' || !isAuthenticated ? (
              <Link to={isAuthenticated ? '/profile' : '/register'} className="btn btn-secondary become-host-link">
                Become a host
              </Link>
            ) : null}

            <div className="lang-switcher">
              <button className="icon-btn" onClick={() => setLangOpen(!langOpen)} aria-label="Change language">
                <FiGlobe />
              </button>
              {langOpen && (
                <ul className="lang-dropdown">
                  {available.map((l) => (
                    <li key={l}>
                      <button
                        className={l === lang ? 'active' : ''}
                        onClick={() => {
                          changeLang(l);
                          setLangOpen(false);
                        }}
                      >
                        {l.toUpperCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className="icon-btn" onClick={() => dispatch(toggleTheme())} aria-label="Toggle dark mode">
              {mode === 'dark' ? <FiSun /> : <FiMoon />}
            </button>

            <button className="user-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
              <FiMenu />
              <span className="user-menu-avatar">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt={user.name} />
                ) : (
                  <FiUser />
                )}
              </span>
            </button>

           {menuOpen && (
              <ul className="user-dropdown">
                {isAuthenticated ? (
                  <>
                    <li><Link to="/favorites" onClick={() => setMenuOpen(false)}><FiHeart /> {t('favorites') || 'Wishlists'}</Link></li>
                    <li><Link to={dashboardLink()} onClick={() => setMenuOpen(false)}><BsBriefcase /> Trips</Link></li>
                    <li><Link to="/messages" onClick={() => setMenuOpen(false)}><FiMessageSquare /> Messages</Link></li>
                    <li><Link to="/profile" onClick={() => setMenuOpen(false)}><FiUser /> Profile</Link></li>
                    <li className="divider" />
                    <li><button onClick={handleLogout}>{t('logout')}</button></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" onClick={() => setMenuOpen(false)}>{t('login')}</Link></li>
                    <li><Link to="/register" onClick={() => setMenuOpen(false)}>{t('signup')}</Link></li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;