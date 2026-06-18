// src/api/adminAPI.js
import api from './api';

export const adminAPI = {
  // ... existing methods

  // ===== GIFT CARD SUBMISSIONS =====
  getGiftCardSubmissions: () => api.get('/admin/gift-card-submissions'),
  
  approveGiftCard: (id, adminNotes = '') => 
    api.put(`/admin/gift-card-submissions/${id}/approve`, { adminNotes }),
  
  rejectGiftCard: (id, adminNotes = '') => 
    api.put(`/admin/gift-card-submissions/${id}/reject`, { adminNotes }),
  
  // ===== CRYPTO ADDRESS MANAGEMENT =====
  getCryptoAddress: () => api.get('/admin/settings/crypto-address'),
  
  updateCryptoAddress: (data) => 
    api.put('/admin/settings/crypto-address', data),
};