import api from './axios';

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMine: () => api.get('/bookings/my'),
  getHostBookings: () => api.get('/bookings/host'),
  getOne: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, bookingStatus) => api.put(`/bookings/${id}/status`, { bookingStatus }),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};
