// src/pages/fifa/FIFAIDRegistration.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FIFABanner from '../../components/layout/FIFABanner';
import FIFASectionFooter from '../../components/layout/FIFASectionFooter';
import './fifa.css';

const FIFAIDRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    country: '',
    birthDate: '',
    acceptTerms: false
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration submitted:', formData);
    alert('FIFA ID registration successful! Please check your email to verify your account.');
    navigate('/fifa');
  };

  return (
    <div className="fifa-page-container">
      <FIFABanner />
      
      <div className="page-content">
        <div className="page-header">
          <h1>FIFA ID Registration</h1>
          <p>Create your FIFA ID to access tickets, rewards, and exclusive content</p>
        </div>

        <div className="registration-container">
          <div className="registration-info">
            <h3>Why create a FIFA ID?</h3>
            <ul>
              <li><i className="fas fa-ticket-alt"></i> Purchase official World Cup tickets</li>
              <li><i className="fas fa-gift"></i> Access FIFA Rewards program</li>
              <li><i className="fas fa-exchange-alt"></i> Use ticket resale marketplace</li>
              <li><i className="fas fa-bell"></i> Receive personalized updates</li>
              <li><i className="fas fa-users"></i> Manage group bookings</li>
            </ul>
          </div>

          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Confirm Email *</label>
                <input type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Country of Residence *</label>
                <select name="country" value={formData.country} onChange={handleChange} required>
                  <option value="">Select Country</option>
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Mexico">Mexico</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Spain">Spain</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Argentina">Argentina</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group checkbox">
              <label>
                <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})} required />
                I agree to the <a href="/fifa/legal">Terms & Conditions</a> and <a href="/fifa/legal">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="submit-btn">Create FIFA ID →</button>
          </form>
        </div>

        <div className="login-prompt">
          <p>Already have a FIFA ID? <button onClick={() => navigate('/login')}>Sign In Here</button></p>
        </div>

        <button className="back-btn" onClick={() => navigate('/fifa')}>
          ← Back to FIFA World Cup
        </button>
      </div>

      <FIFASectionFooter />
    </div>
  );
};

export default FIFAIDRegistration;