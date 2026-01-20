import axios from 'axios';

// Centralized Axios client for the app. Reads base URL from Vite env or falls back.
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE,
  timeout: 20000,
});

// Attach JWT token from localStorage to every request if present
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore localStorage access errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handling: on 401, emit an event so app-level auth can respond
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem('token');
      } catch (e) {}
      // Broadcast an auth expiration event — AuthProvider or top-level app can listen
      try {
        window.dispatchEvent(new Event('auth:expired'));
      } catch (e) {}
    }
    return Promise.reject(error);
  }
);

export default api;
