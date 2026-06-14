import api from './axios';

export const paymentAPI = {
  createCryptoCharge: (bookingId) => api.post('/payments/crypto/create-charge', { bookingId }),
  getCryptoStatus: (paymentId) => api.get(`/payments/crypto/${paymentId}/status`),
  getGiftCardProviders: () => api.get('/payments/giftcard/providers'),
  submitGiftCard: (formData) =>
    api.post('/payments/giftcard/submit', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getPendingGiftCards: () => api.get('/payments/giftcard/pending'),
  reviewGiftCard: (paymentId, decision, adminNote) =>
    api.put(`/payments/giftcard/${paymentId}/review`, { decision, adminNote }),
  getByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
};
