import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { uploadAPI } from '../api';
import { authAPI } from '../api/authAPI';
import { fetchCurrentUser, setUser } from '../redux/authSlice';
import '../styles/dashboard.css';
import '../styles/forms.css';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: user?.name || '',
    walletAddress: user?.walletAddress || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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

  return (
    <div className="container dashboard-page">
      <h1>Profile Settings</h1>

      <div className="profile-avatar-row">
        <img
          src={user?.avatar?.url || `https://i.pravatar.cc/120?u=${user?._id}`}
          alt={user?.name}
          className="profile-avatar"
        />
        <div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} disabled={uploadingAvatar} />
          {uploadingAvatar && <p>Uploading...</p>}
        </div>
      </div>

      <form className="listing-form" onSubmit={handleProfileSubmit} style={{ marginTop: 24 }}>
        <h2>Basic Info</h2>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleProfileChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={user?.email} disabled />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="text" name="phone" value={form.phone} onChange={handleProfileChange} />
        </div>
        <div className="form-group">
          <label>Wallet Address (for crypto payouts/payments)</label>
          <input type="text" name="walletAddress" value={form.walletAddress} onChange={handleProfileChange} placeholder="0x..." />
        </div>
        <button type="submit" className="btn btn-primary" disabled={savingProfile}>
          {savingProfile ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <form className="listing-form" onSubmit={handlePasswordSubmit} style={{ marginTop: 40 }}>
        <h2>Change Password</h2>
        <div className="form-group">
          <label>Current Password</label>
          <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} minLength={8} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={savingPassword}>
          {savingPassword ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      {user?.role === 'guest' && (
        <div style={{ marginTop: 40 }}>
          <h2>Become a Host</h2>
          {user.hostApprovalStatus === 'pending' ? (
            <span className="badge badge-pending">Application Pending</span>
          ) : user.hostApprovalStatus === 'rejected' ? (
            <span className="badge badge-error">Application Rejected</span>
          ) : (
            <button className="btn btn-primary" onClick={handleApplyForHost}>Apply to Become a Host</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
