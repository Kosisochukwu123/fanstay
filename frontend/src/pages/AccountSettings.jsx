import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { authAPI } from '../api/authAPI';
import { setUser } from '../redux/authSlice';
import { toggleTheme } from '../redux/themeSlice';
import './AccountSettings.css';

// SVG Icons
const IconArrowBack = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const IconPersonalInfo = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const IconLoginSecurity = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

const IconPrivacy = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
  </svg>
);

const IconNotifications = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
  </svg>
);

const IconPayments = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
  </svg>
);

const IconLanguages = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
  </svg>
);

const IconBookingPermissions = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const IconAppearance = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 3C8.13 3 5 6.13 5 10c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm3 11.8V16h-6v-1.2C7.6 13.35 6.38 11.59 6.13 9.89c.25-.48.69-.86 1.22-1.05.41-.15.85-.24 1.31-.27.72-.05 1.43.17 2.01.59.43.31.85.69 1.18 1.13.2.26.47.43.8.51.41.1.84.02 1.19-.22.3-.2.54-.5.69-.84.25-.54.28-1.15.08-1.71-.14-.38-.42-.72-.79-.94.49.04.95.21 1.34.51.4.3.7.72.87 1.2.17.48.17 1.01.01 1.49-.11.31-.29.59-.52.81-.34.33-.8.5-1.28.47-.61-.04-1.17-.33-1.55-.78-.38-.45-.57-1.04-.52-1.64.12-.93.24-1.87.34-2.8.04-.36-.03-.72-.19-1.04-.16-.32-.4-.58-.69-.77-.36-.24-.78-.37-1.21-.37-.33 0-.65.07-.95.21-.41.19-.77.49-1.02.86-.25.37-.39.8-.39 1.24 0 .44.14.87.41 1.23.27.36.64.65 1.06.83.29.13.61.18.93.15.25-.02.5-.1.73-.22.34-.18.62-.46.81-.79.15-.26.23-.56.23-.86 0-.3-.08-.59-.23-.85-.09-.16-.19-.31-.31-.45.12-.06.24-.1.37-.1.13 0 .25.04.37.1.12.06.23.14.33.24.17.17.3.39.37.63.07.24.07.5 0 .74-.07.24-.2.46-.37.63-.17.17-.39.3-.63.37-.24.07-.5.07-.74 0-.24-.07-.46-.2-.63-.37-.11-.11-.2-.23-.26-.37.09-.17.13-.36.13-.55 0-.19-.04-.38-.13-.55-.09-.17-.22-.32-.38-.44-.16-.12-.35-.2-.55-.23-.2-.03-.4 0-.59.08-.19.08-.36.2-.5.36-.14.16-.25.35-.31.56-.06.21-.07.43-.03.64.04.21.12.41.24.58.12.17.27.31.45.42.18.11.38.18.58.21.06.02.12.03.18.05.06.02.12.03.18.03.12 0 .24.02.36.07.12.05.24.13.34.24.1.11.18.24.23.38.05.14.07.29.06.44-.03.04-.07.08-.11.11-.04.03-.08.05-.12.07-.05.02-.1.05-.16.06-.06.01-.12.01-.18 0-.06-.01-.12-.03-.18-.06-.06-.03-.12-.07-.17-.12-.05-.05-.09-.1-.12-.16-.03-.06-.05-.13-.05-.2 0-.16.06-.32.17-.45.04-.04.08-.08.13-.11.05-.03.1-.05.15-.06.05-.01.1-.01.15 0 .05.01.09.03.13.06.04.03.07.06.1.1.02.03.04.05.07.06.03.01.05.02.08.02.06 0 .12-.03.16-.08.04-.05.06-.11.06-.18 0-.07-.02-.13-.06-.18-.04-.05-.09-.09-.16-.11-.07-.02-.14-.02-.21 0-.07.02-.13.06-.18.11-.05.05-.08.11-.08.18 0 .07.02.14.07.2.05.06.12.1.2.12.08.02.16.02.24 0 .08-.02.15-.06.2-.12.05-.06.08-.13.08-.2 0-.1-.03-.2-.08-.28-.05-.08-.12-.15-.2-.19-.08-.04-.17-.06-.26-.06h-.03c-.05 0-.1.01-.15.02-.05.01-.1.03-.14.06-.04.03-.08.07-.11.11-.03.04-.05.09-.06.14-.01.05-.01.1 0 .15.01.05.03.1.06.14.03.04.07.07.11.09.04.02.09.04.14.04.09 0 .18-.03.25-.09.07-.06.11-.14.11-.23 0-.09-.04-.17-.11-.23-.07-.06-.16-.09-.25-.09-.09 0-.18.03-.25.09-.07.06-.11.14-.11.23 0 .09.04.17.11.23.07.06.16.09.25.09.09 0 .18-.03.25-.09.07-.06.11-.14.11-.23 0-.09-.04-.17-.11-.23-.07-.06-.16-.09-.25-.09zm-3 2.2c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
  </svg>
);

const AccountSettings = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedSection, setSelectedSection] = useState('personal-information');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setSavingPassword(true);
    try {
      const { currentPassword, newPassword } = passwordForm;
      await authAPI.changePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const menuItems = [
    { id: 'personal-information', icon: IconPersonalInfo, label: 'Personal information' },
    { id: 'login-security', icon: IconLoginSecurity, label: 'Login & security' },
    { id: 'privacy', icon: IconPrivacy, label: 'Privacy' },
    { id: 'notifications', icon: IconNotifications, label: 'Notifications' },
    { id: 'payments', icon: IconPayments, label: 'Payments' },
    { id: 'languages', icon: IconLanguages, label: 'Languages & currency' },
    { id: 'booking-permissions', icon: IconBookingPermissions, label: 'Booking permissions' },
    { id: 'appearance', icon: IconAppearance, label: 'Appearance' },
  ];

  const renderPersonalInformation = () => (
    <div className="settings-content">
      <h2 className="settings-content-title">Personal information</h2>
      
      <div className="info-group">
        <div className="info-row">
          <div className="info-label">Legal name</div>
          <div className="info-value">{user?.name || 'Not set'}</div>
          <button className="info-action-btn">Edit</button>
        </div>
        
        <div className="info-row">
          <div className="info-label">Preferred first name</div>
          <div className="info-value">Not provided</div>
          <button className="info-action-btn">Add</button>
        </div>
        
        <div className="info-row">
          <div className="info-label">Email address</div>
          <div className="info-value">{user?.email || 'Not set'}</div>
          <button className="info-action-btn">Edit</button>
        </div>
        
        <div className="info-row info-row-phone">
          <div className="info-label">Phone numbers</div>
          <div className="info-value">
            <span>Add a number so confirmed guests and hosts can get in touch. You can add other numbers and choose how they're used.</span>
          </div>
          <button className="info-action-btn">Add</button>
        </div>
      </div>

      <button className="settings-done-btn">Done</button>
    </div>
  );

  const renderLoginSecurity = () => (
    <div className="settings-content">
      <h2 className="settings-content-title">Login & security</h2>
      
      <div className="info-group">
        <div className="info-row">
          <div className="info-label">Email</div>
          <div className="info-value">{user?.email || 'Not set'}</div>
          <button className="info-action-btn">Edit</button>
        </div>
        
        <div className="info-row">
          <div className="info-label">Password</div>
          <div className="info-value">••••••••</div>
          <button 
            className="info-action-btn" 
            onClick={() => setShowPasswordSection(!showPasswordSection)}
          >
            {showPasswordSection ? 'Cancel' : 'Change'}
          </button>
        </div>
        
        {showPasswordSection && (
          <div className="password-change-section">
            <form className="password-form" onSubmit={handlePasswordSubmit}>
              <div className="password-form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="password-input"
                  placeholder="Enter current password"
                  required
                />
              </div>
              
              <div className="password-form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="password-input"
                  placeholder="Enter new password (min 8 characters)"
                  required
                  minLength={8}
                />
              </div>
              
              <div className="password-form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="password-input"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              
              <div className="password-form-actions">
                <button 
                  type="button" 
                  className="password-cancel-btn"
                  onClick={() => setShowPasswordSection(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="password-save-btn"
                  disabled={savingPassword}
                >
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <button className="settings-done-btn">Done</button>
    </div>
  );

  const renderPrivacy = () => (
    <div className="settings-content">
      <h2 className="settings-content-title">Privacy</h2>
      <div className="info-group">
        <div className="privacy-settings">
          <div className="privacy-option">
            <label className="privacy-label">Profile visibility</label>
            <select className="privacy-select">
              <option>Public</option>
              <option>Private</option>
              <option>Only guests</option>
            </select>
          </div>
          
          <div className="privacy-option">
            <label className="privacy-label">Show email address</label>
            <select className="privacy-select">
              <option>Only hosts</option>
              <option>Everyone</option>
              <option>No one</option>
            </select>
          </div>
          
          <div className="privacy-option">
            <label className="privacy-label">Show phone number</label>
            <select className="privacy-select">
              <option>Only hosts</option>
              <option>Everyone</option>
              <option>No one</option>
            </select>
          </div>
        </div>
      </div>
      <button className="settings-done-btn">Done</button>
    </div>
  );

  const renderNotifications = () => (
    <div className="settings-content">
      <h2 className="settings-content-title">Notifications</h2>
      <div className="info-group">
        <div className="notification-toggle">
          <div className="toggle-row">
            <span className="toggle-label">Booking confirmations</span>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="toggle-row">
            <span className="toggle-label">Messages</span>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="toggle-row">
            <span className="toggle-label">Promotions</span>
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="toggle-row">
            <span className="toggle-label">Host updates</span>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
      <button className="settings-done-btn">Done</button>
    </div>
  );

  const renderPayments = () => (
    <div className="settings-content">
      <h2 className="settings-content-title">Payments</h2>
      <div className="info-group">
        <div className="payment-methods">
          <div className="payment-row">
            <span className="payment-label">Default payment method</span>
            <span className="payment-value">Visa ending in 4242</span>
            <button className="info-action-btn">Edit</button>
          </div>
          
          <div className="payment-row">
            <span className="payment-label">Wallet address</span>
            <span className="payment-value">{user?.walletAddress || 'Not set'}</span>
            <button className="info-action-btn">Add</button>
          </div>
          
          <div className="payment-row">
            <span className="payment-label">Payout method</span>
            <span className="payment-value">Bank transfer</span>
            <button className="info-action-btn">Edit</button>
          </div>
        </div>
      </div>
      <button className="settings-done-btn">Done</button>
    </div>
  );

  const renderLanguages = () => (
    <div className="settings-content">
      <h2 className="settings-content-title">Languages & currency</h2>
      <div className="info-group">
        <div className="language-settings">
          <div className="language-row">
            <span className="language-label">Language</span>
            <select className="language-select">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          
          <div className="language-row">
            <span className="language-label">Currency</span>
            <select className="language-select">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>NGN (₦)</option>
            </select>
          </div>
          
          <div className="language-row">
            <span className="language-label">Time zone</span>
            <select className="language-select">
              <option>GMT (UTC+0)</option>
              <option>EST (UTC-5)</option>
              <option>CET (UTC+1)</option>
              <option>WAT (UTC+1)</option>
            </select>
          </div>
        </div>
      </div>
      <button className="settings-done-btn">Done</button>
    </div>
  );

  const renderBookingPermissions = () => (
    <div className="settings-content">
      <h2 className="settings-content-title">Booking permissions</h2>
      <div className="info-group">
        <div className="permission-settings">
          <div className="permission-row">
            <div className="permission-info">
              <span className="permission-label">Instant booking</span>
              <span className="permission-desc">Allow guests to book without approval</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="permission-row">
            <div className="permission-info">
              <span className="permission-label">Guest requirements</span>
              <span className="permission-desc">Require guests to have verified ID</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="permission-row">
            <div className="permission-info">
              <span className="permission-label">Booking window</span>
              <span className="permission-desc">Allow bookings up to 6 months in advance</span>
            </div>
            <select className="permission-select">
              <option>1 month</option>
              <option>3 months</option>
              <option>6 months</option>
              <option>12 months</option>
            </select>
          </div>
        </div>
      </div>
      <button className="settings-done-btn">Done</button>
    </div>
  );

  const renderAppearance = () => (
    <div className="settings-content">
      <h2 className="settings-content-title">Appearance</h2>
      <div className="info-group">
        <div className="appearance-settings">
          <div className="appearance-row">
            <div className="appearance-info">
              <span className="appearance-label">Theme</span>
              <span className="appearance-desc">
                {mode === 'dark' ? 'Dark mode is currently active' : 'Light mode is currently active'}
              </span>
            </div>
            <button 
              className="appearance-toggle-btn"
              onClick={handleThemeToggle}
            >
              <span className="appearance-toggle-icon">
                {mode === 'dark' ? '🌙' : '☀️'}
              </span>
              <span className="appearance-toggle-text">
                Switch to {mode === 'dark' ? 'Light' : 'Dark'} Mode
              </span>
            </button>
          </div>
          
          <div className="appearance-preview">
            <div className="preview-label">Preview</div>
            <div className={`preview-box ${mode}`}>
              <div className="preview-header">
                <div className="preview-logo">FanStay</div>
                <div className="preview-actions">
                  <span className="preview-dot"></span>
                  <span className="preview-dot"></span>
                </div>
              </div>
              <div className="preview-body">
                <div className="preview-card"></div>
                <div className="preview-card"></div>
                <div className="preview-card"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="settings-done-btn">Done</button>
    </div>
  );

  const renderContent = () => {
    switch(selectedSection) {
      case 'personal-information':
        return renderPersonalInformation();
      case 'login-security':
        return renderLoginSecurity();
      case 'privacy':
        return renderPrivacy();
      case 'notifications':
        return renderNotifications();
      case 'payments':
        return renderPayments();
      case 'languages':
        return renderLanguages();
      case 'booking-permissions':
        return renderBookingPermissions();
      case 'appearance':
        return renderAppearance();
      default:
        return renderPersonalInformation();
    }
  };

  // Desktop view - full page
  if (!isMobile) {
    return (
      <div className="account-settings-desktop">
        <div className="account-settings-container">
          <div className="account-settings-sidebar">
            <h2 className="sidebar-title">Account settings</h2>
            <ul className="sidebar-menu">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li 
                    key={item.id}
                    className={`sidebar-menu-item ${selectedSection === item.id ? 'active' : ''}`}
                    onClick={() => setSelectedSection(item.id)}
                  >
                    <span className="menu-item-icon">
                      <IconComponent />
                    </span>
                    <span className="menu-item-label">{item.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="account-settings-main">
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  // Mobile view - slide out panel
  return (
    <>
      {isOpen && (
        <div className="account-settings-overlay" onClick={onClose}></div>
      )}
      <div className={`account-settings-mobile ${isOpen ? 'open' : ''}`}>
        <div className="account-settings-header">
          <button className="header-back-btn" onClick={onClose}>
            <IconArrowBack />
          </button>
          <h2 className="header-title">Account settings</h2>
          <button className="header-close-btn" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        
        <div className="account-settings-body">
          <div className="mobile-menu">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={item.id}
                  className={`mobile-menu-item ${selectedSection === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedSection(item.id)}
                >
                  <span className="menu-item-icon">
                    <IconComponent />
                  </span>
                  <span className="menu-item-label">{item.label}</span>
                  <span className="menu-item-arrow">›</span>
                </div>
              );
            })}
          </div>
          
          <div className="mobile-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSettings;