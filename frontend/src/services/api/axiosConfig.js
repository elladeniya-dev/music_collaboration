import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging and logging
axiosInstance.interceptors.request.use(
  (config) => {
    // Log the request for debugging (comment out in production)
    if (config.url && !config.url.includes('unread/count')) {
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    // Ensure credentials are sent with all requests
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging (comment out in production)
    if (response.config.url && !response.config.url.includes('unread/count')) {
      console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Log errors for debugging
    const url = error.config?.url;
    const status = error.response?.status;
    
    if (url && !url.includes('unread/count')) {
      console.log(`⚠️ API Error: ${status} ${url}`);
    }
    
    // Don't auto-redirect on 401 - let components handle auth errors
    // This prevents infinite redirect loops on initial page load
    return Promise.reject(error);
  }
);

export default axiosInstance;
