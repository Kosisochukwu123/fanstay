// src/pages/admin/AdminGiftCards.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../../api';
import './AdminGiftCards.css';

const AdminGiftCards = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoNetwork, setCryptoNetwork] = useState('USDT (ERC-20)');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    fetchSubmissions();
    fetchCryptoAddress();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await adminAPI.getGiftCardSubmissions();
      setSubmissions(res.data.submissions);
    } catch (error) {
      toast.error('Failed to load gift card submissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCryptoAddress = async () => {
    try {
      const res = await adminAPI.getCryptoAddress();
      setCryptoAddress(res.data.address);
      setNewAddress(res.data.address);
      setCryptoNetwork(res.data.network || 'USDT (ERC-20)');
    } catch (error) {
      // Use default if not set
      setCryptoAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
      setNewAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
    }
  };

  const handleUpdateAddress = async () => {
    try {
      await adminAPI.updateCryptoAddress({ address: newAddress, network: cryptoNetwork });
      setCryptoAddress(newAddress);
      setIsEditingAddress(false);
      toast.success('Crypto address updated successfully');
    } catch (error) {
      toast.error('Failed to update crypto address');
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveGiftCard(id);
      toast.success('Gift card approved');
      fetchSubmissions();
    } catch (error) {
      toast.error('Failed to approve gift card');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminAPI.rejectGiftCard(id);
      toast.success('Gift card rejected');
      fetchSubmissions();
    } catch (error) {
      toast.error('Failed to reject gift card');
    }
  };

  const getFilteredSubmissions = () => {
    if (filter === 'all') return submissions;
    return submissions.filter(s => s.status === filter);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-pending',
      approved: 'badge-approved',
      rejected: 'badge-rejected'
    };
    return badges[status] || 'badge-pending';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-giftcards">
      <div className="admin-header">
        <h1>Gift Card Submissions</h1>
        <div className="admin-actions">
          <select 
            className="filter-select"
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="refresh-btn" onClick={fetchSubmissions}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Crypto Address Management */}
      <div className="crypto-management">
        <h2>Payment Settings</h2>
        <div className="crypto-address-card">
          <div className="address-header">
            <h3>USDT Wallet Address</h3>
            {!isEditingAddress ? (
              <button 
                className="edit-address-btn"
                onClick={() => setIsEditingAddress(true)}
              >
                ✏️ Edit
              </button>
            ) : (
              <button 
                className="cancel-edit-btn"
                onClick={() => {
                  setIsEditingAddress(false);
                  setNewAddress(cryptoAddress);
                }}
              >
                Cancel
              </button>
            )}
          </div>
          
          {!isEditingAddress ? (
            <div className="address-display">
              <code>{cryptoAddress}</code>
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard?.writeText(cryptoAddress);
                  toast.success('Address copied');
                }}
              >
                📋 Copy
              </button>
            </div>
          ) : (
            <div className="address-edit">
              <div className="form-group">
                <label>Network</label>
                <input 
                  type="text"
                  value={cryptoNetwork}
                  onChange={(e) => setCryptoNetwork(e.target.value)}
                  className="network-input"
                />
              </div>
              <div className="form-group">
                <label>Wallet Address</label>
                <input 
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="address-input"
                  placeholder="Enter wallet address"
                />
              </div>
              <div className="edit-actions">
                <button 
                  className="save-address-btn"
                  onClick={handleUpdateAddress}
                >
                  💾 Save Address
                </button>
              </div>
              <div className="address-info">
                <p>⚠️ This address will be shown to users when they select crypto payment.</p>
              </div>
            </div>
          )}
          <div className="network-info">
            <span>Network: <strong>{cryptoNetwork}</strong></span>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="submissions-list">
        {getFilteredSubmissions().length === 0 ? (
          <div className="empty-state">
            <p>No gift card submissions found</p>
          </div>
        ) : (
          <div className="submissions-grid">
            {getFilteredSubmissions().map((sub) => (
              <div key={sub._id} className="submission-card">
                <div className="submission-header">
                  <span className={`status-badge ${getStatusBadge(sub.status)}`}>
                    {sub.status}
                  </span>
                  <span className="submission-date">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="submission-details">
                  <div className="detail-row">
                    <span className="label">User:</span>
                    <span className="value">{sub.user?.name || 'Unknown'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{sub.user?.email || 'Unknown'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Match:</span>
                    <span className="value">{sub.match?.name || 'Not specified'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Category:</span>
                    <span className="value">{sub.category || 'Not specified'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Amount:</span>
                    <span className="value">${sub.giftCardAmount || 'N/A'}</span>
                  </div>
                </div>

                {/* Gift Card Image */}
                {sub.giftCardImage && (
                  <div className="giftcard-image-container">
                    <img 
                      src={sub.giftCardImage} 
                      alt="Gift Card"
                      className="giftcard-image"
                      onClick={() => setSelectedSubmission(sub)}
                    />
                    <button 
                      className="view-image-btn"
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      🔍 View Full Image
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                {sub.status === 'pending' && (
                  <div className="action-buttons">
                    <button 
                      className="approve-btn"
                      onClick={() => handleApprove(sub._id)}
                    >
                      ✅ Approve
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleReject(sub._id)}
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}

                {/* Admin Notes */}
                {sub.adminNotes && (
                  <div className="admin-notes">
                    <span className="notes-label">Admin Notes:</span>
                    <p>{sub.adminNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedSubmission && selectedSubmission.giftCardImage && (
        <div className="image-modal" onClick={() => setSelectedSubmission(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="image-modal-close"
              onClick={() => setSelectedSubmission(null)}
            >
              ×
            </button>
            <img 
              src={selectedSubmission.giftCardImage} 
              alt="Gift Card Full View"
            />
            <div className="image-modal-info">
              <p><strong>User:</strong> {selectedSubmission.user?.name}</p>
              <p><strong>Match:</strong> {selectedSubmission.match?.name}</p>
              <p><strong>Amount:</strong> ${selectedSubmission.giftCardAmount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGiftCards;