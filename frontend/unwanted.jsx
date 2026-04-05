import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001',
});

api.interceptors.request.use(
  (config) => {
    let token = '';

    try {
      const savedUser = localStorage.getItem('user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;

      token =
        parsedUser?.token ||
        localStorage.getItem('adminToken') ||
        localStorage.getItem('token') ||
        '';
    } catch {
      token =
        localStorage.getItem('adminToken') ||
        localStorage.getItem('token') ||
        '';
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;