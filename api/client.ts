import axios from 'axios';
import { StorageService } from '@/lib/storageService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = StorageService.getItem<string>('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = StorageService.getItem<string>('refresh_token');
      if (!refreshToken) {
        StorageService.clearAll();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, refreshToken, {
          headers: { 'Content-Type': 'application/json' },
        });

        const { access_token, refresh_token, expires_in } = response.data;
        StorageService.setItem('access_token', access_token);
        StorageService.setItem('refresh_token', refresh_token);
        StorageService.setItem('expires_in', expires_in);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch {
        StorageService.clearAll();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
