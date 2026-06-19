import api from './axios';

export const settingsAPI = {
  get: () => api.get('/settings'),
};

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getForProperty: (propertyId) => api.get(`/reviews/property/${propertyId}`),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const messageAPI = {
  getInbox: () => api.get('/messages'),
  getConversation: (userId) => api.get(`/messages/${userId}`),
  send: (data) => api.post('/messages', data),
};

export const hostAPI = {
  getEarnings: () => api.get('/host/earnings'),
};

export const uploadAPI = {
  uploadAvatar: (formData) =>
    api.post('/upload/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const assistantAPI = {
  query: (message) => api.post('/assistant/query', { message }),
};

export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPendingHosts: () => api.get('/admin/hosts/pending'),
  reviewHost: (id, decision) => api.put(`/admin/hosts/${id}/review`, { decision }),
  getProperties: (params) => api.get('/admin/properties', { params }),
  updatePropertyStatus: (id, status) => api.put(`/admin/properties/${id}/status`, { status }),
  getBookings: (params) => api.get('/admin/bookings', { params }),
  getAnalytics: () => api.get('/admin/analytics'),
  getReviews: (params) => api.get('/admin/reviews', { params }),
  moderateReview: (id, status) => api.put(`/admin/reviews/${id}/moderate`, { status }),
  getGiftCardProviders: () => api.get('/admin/giftcard-providers'),
  createGiftCardProvider: (data) => api.post('/admin/giftcard-providers', data),
  updateGiftCardProvider: (id, data) => api.put(`/admin/giftcard-providers/${id}`, data),
  deleteGiftCardProvider: (id) => api.delete(`/admin/giftcard-providers/${id}`),

  // Site settings / theme / content
  updateTheme: (data) => api.put('/admin/settings/theme', data),
  updateHero: (formData) => api.put('/admin/settings/hero', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateHomepageSections: (data) => api.put('/admin/settings/homepage-sections', data),
  updateTestimonials: (testimonials) => api.put('/admin/settings/testimonials', { testimonials }),
  updateInspiration: (inspirationCategories) => api.put('/admin/settings/inspiration', { inspirationCategories }),
  resetSettings: () => api.post('/admin/settings/reset'),

  getGiftCardSubmissions: () =>
  api.get('/admin/gift-card-submissions'),

approveGiftCard: (id, adminNotes = '') =>
  api.put(`/admin/gift-card-submissions/${id}/approve`, { adminNotes }),

rejectGiftCard: (id, adminNotes = '') =>
  api.put(`/admin/gift-card-submissions/${id}/reject`, { adminNotes }),

getCryptoAddress: () =>
  api.get('/admin/settings/crypto-address'),

updateCryptoAddress: (data) =>
  api.put('/admin/settings/crypto-address', data),
};