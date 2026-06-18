import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { uploadAPI } from '../api';
import { authAPI } from '../api/authAPI';
import { fetchCurrentUser, setUser } from '../redux/authSlice.js';
import logout from "../redux/authSlice.js";
import AccountSettings from './AccountSettings';
import './Profile.css';
import IMG1 from "../../public/setting-photo-two.jpg";
import IMG2 from "../../public/setting-photo-two.jpeg";

// SVG Icons
const IconHome = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const IconHomeHost = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 3L3 9v12h7v-6h4v6h7V9l-9-6zm6 16h-3v-6H9v6H6v-9l6-4.5 6 4.5v9z"/>
  </svg>
);

const IconSettings = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

const IconHelp = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
  </svg>
);

const IconRefer = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const IconCoHost = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    <path d="M19 14c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h4v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const IconGift = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"/>
  </svg>
);

const IconLegal = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const IconLogout = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
  </svg>
);

const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    walletAddress: user?.walletAddress || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  const handleProfileChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authAPI.updateProfile(form);
      dispatch(setUser(res.data.user));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await authAPI.changePassword(passwordForm);
      toast.success('Password updated');
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    setUploadingAvatar(true);
    try {
      await uploadAPI.uploadAvatar(formData);
      await dispatch(fetchCurrentUser());
      toast.success('Avatar updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleApplyForHost = async () => {
    try {
      const res = await authAPI.applyForHost();
      dispatch(setUser(res.data.user));
      toast.success('Host application submitted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      dispatch(logout());
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  const handleMenuClick = (label, onClick) => {
    if (onClick) {
      onClick();
    } else {
      // Default navigation based on label
      switch(label) {
        case 'Past trips':
          navigate('/trips');
          break;
        case 'Connections':
          navigate('/connections');
          break;
        case 'Become a host':
          handleApplyForHost();
          break;
        case 'Account settings':
          setShowAccountSettings(true);
          break;
        case 'View profile':
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'Privacy':
          navigate('/privacy');
          break;
        case 'Get help':
          navigate('/help');
          break;
        case 'Refer a host':
          navigate('/refer');
          break;
        case 'Find a co-host':
          navigate('/co-host');
          break;
        case 'Gift cards':
          navigate('/gift-cards');
          break;
        case 'Legal':
          navigate('/legal');
          break;
        case 'Log out':
          handleLogout();
          break;
        default:
          break;
      }
    }
  };

  const menuItems = [
    { icon: IconHome, label: 'Past trips' },
    { icon: IconUsers, label: 'Connections' },
    { 
      icon: IconHomeHost, 
      label: 'Become a host', 
      highlight: true, 
      subtitle: "It's easy to start hosting and earn extra income."
    },
    { icon: IconSettings, label: 'Account settings' },
    { icon: IconUser, label: 'View profile' },
    { icon: IconLock, label: 'Privacy' },
    { icon: IconHelp, label: 'Get help' },
    { icon: IconRefer, label: 'Refer a host' },
    { icon: IconCoHost, label: 'Find a co-host' },
    { icon: IconGift, label: 'Gift cards' },
    { icon: IconLegal, label: 'Legal' },
    { icon: IconLogout, label: 'Log out' },
  ];

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper">
              <img
                src={user?.avatar?.url || `https://i.pravatar.cc/120?u=${user?._id}`}
                alt={user?.name}
                className="profile-avatar"
              />
              <label className="avatar-upload-label" htmlFor="avatar-upload">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={uploadingAvatar}
                  className="avatar-input"
                />
              </label>
              {uploadingAvatar && <div className="avatar-uploading">Uploading...</div>}
            </div>
            <div className="profile-name-section">
              <h1 className="profile-name">{user?.name || 'Guest'}</h1>
              <span className="profile-role">{user?.role || 'Guest'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Images */}
      <div className="settings-images">
        <div className="settings-image-card">
          <img src={IMG1} alt="Settings" className="settings-image" />
        </div>
        <div className="settings-image-card">
          <img src={IMG2} alt="Settings" className="settings-image" />
        </div>
      </div>

      {/* Menu */}
      <div className="profile-menu">
        <div className="profile-menu-content">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index} 
                className={`menu-item ${item.highlight ? 'menu-item-highlight' : ''}`}
                onClick={() => handleMenuClick(item.label, item.onClick)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleMenuClick(item.label, item.onClick);
                  }
                }}
              >
                <span className="menu-icon">
                  <IconComponent />
                </span>
                <div className="menu-text">
                  <span className="menu-label">{item.label}</span>
                  {item.subtitle && <span className="menu-subtitle">{item.subtitle}</span>}
                </div>
                {item.highlight && (
                  <span className="menu-arrow">
                    <IconArrowRight />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Settings Slide-out */}
      <AccountSettings 
        isOpen={showAccountSettings} 
        onClose={() => setShowAccountSettings(false)} 
      />

      {/* Settings Section */}
      <div className="profile-settings">
        <div className="settings-card">
          <h2 className="settings-title">Account Settings</h2>
          
          <form className="settings-form" onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                name="name" 
                value={form.name} 
                onChange={handleProfileChange} 
                className="form-input"
                placeholder="Your full name"
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={user?.email} 
                disabled 
                className="form-input form-input-disabled"
              />
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input 
                type="text" 
                name="phone" 
                value={form.phone} 
                onChange={handleProfileChange} 
                className="form-input"
                placeholder="Your phone number"
              />
            </div>
            
            <div className="form-group">
              <label>Wallet Address (for crypto payouts/payments)</label>
              <input 
                type="text" 
                name="walletAddress" 
                value={form.walletAddress} 
                onChange={handleProfileChange} 
                className="form-input"
                placeholder="0x..."
              />
            </div>
            
            <button type="submit" className="btn-save" disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          {/* Password Section */}
          <div className="password-section">
            <button 
              className="btn-password-toggle"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              <span className="password-toggle-icon">
                {showPasswordForm ? '−' : '+'}
              </span>
              Change Password
            </button>
            
            {showPasswordForm && (
              <form className="settings-form" onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    name="currentPassword" 
                    value={passwordForm.currentPassword} 
                    onChange={handlePasswordChange} 
                    className="form-input"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    name="newPassword" 
                    value={passwordForm.newPassword} 
                    onChange={handlePasswordChange} 
                    minLength={8} 
                    className="form-input"
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>
                <button type="submit" className="btn-save btn-save-secondary" disabled={savingPassword}>
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>

          {/* Host Application */}
          {user?.role === 'guest' && (
            <div className="host-section">
              <h3 className="host-title">Become a Host</h3>
              {user.hostApprovalStatus === 'pending' ? (
                <div className="badge badge-pending">Application Pending</div>
              ) : user.hostApprovalStatus === 'rejected' ? (
                <div className="badge badge-rejected">Application Rejected</div>
              ) : (
                <button className="btn-host" onClick={handleApplyForHost}>
                  Apply to Become a Host
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;