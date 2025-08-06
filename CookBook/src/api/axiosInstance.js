import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5090';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  config => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('userData'));
      if (userData && userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    } catch (error) {
      console.error('Error parsing user data from sessionStorage:', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;