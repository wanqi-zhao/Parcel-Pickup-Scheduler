import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://52.63.64.12:5001',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;