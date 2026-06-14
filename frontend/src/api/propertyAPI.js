import api from './axios';

export const propertyAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getOne: (id) => api.get(`/properties/${id}`),
  create: (formData) =>
    api.post('/properties', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) =>
    api.put(`/properties/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/properties/${id}`),
  deleteImage: (id, publicId) => api.delete(`/properties/${id}/images/${encodeURIComponent(publicId)}`),
  updateAvailability: (id, availabilityCalendar) =>
    api.put(`/properties/${id}/availability`, { availabilityCalendar }),
  getMine: () => api.get('/properties/host/mine'),
  toggleFavorite: (id) => api.post(`/properties/${id}/favorite`),
  getFavorites: () => api.get('/properties/favorites/mine'),
};
