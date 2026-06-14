import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { registerUser, googleLogin, clearError } from '../../redux/authSlice';
import '../../styles/auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', referralCode: '' });
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    dispatch(clearError());
    const result = await dispatch(registerUser(form));
    setSubmitting(false);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Account created! Welcome to FanStay.');
      navigate('/');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await dispatch(googleLogin(credentialResponse.credential));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Welcome to FanStay!');
      navigate('/');
    } else {
      toast.error(result.payload || 'Google sign-in failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="auth-subtitle">Join FanStay and discover stays near the action</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters, with a number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="referralCode">Referral code (optional)</label>
            <input
              type="text"
              id="referralCode"
              name="referralCode"
              value={form.referralCode}
              onChange={handleChange}
              placeholder="e.g. JAMIE001"
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <div className="google-btn-wrap">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google sign-in failed')}
          />
        </div>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
