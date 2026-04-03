import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://13.239.140.67:5001',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;