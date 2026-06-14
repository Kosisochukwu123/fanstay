import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send/receive httpOnly cookies
});

// Attach token from localStorage as fallback (in addition to cookie)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fanstay_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401s globally (e.g. redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fanstay_token');
    }
    return Promise.reject(error);
  }
);

export default api;
