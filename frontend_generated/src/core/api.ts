import axios from 'axios';
import { useTenantStore } from './tenant';
import { useAuthStore } from './auth';
import { toast } from 'sonner';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
});

// Request Interceptor: Inject Tenant and Auth tokens
api.interceptors.request.use(
  (config) => {
    // 1. Inject Tenant ID
    const { currentTenant } = useTenantStore.getState();
    if (currentTenant) {
      config.headers['X-Tenant-ID'] = currentTenant;
    }

    // 2. Inject Authorization Token
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Normalization
api.interceptors.response.use(
  (response) => {
    // Prevent Vite SPA fallback HTML from being treated as a successful API response
    if (typeof response.data === 'string' && response.data.toLowerCase().includes('<!doctype html>')) {
      return Promise.reject(new Error('API Error: Received HTML instead of JSON. Backend might be down or endpoint is missing.'));
    }

    // If backend wrapped it via TransformInterceptor (has statusCode, message, data)
    if (response.data && response.data.data !== undefined && response.data.statusCode) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    // If successful response interceptor was missing, add it to unwrap the data
    const status = error.response?.status;
    const data = error.response?.data;
    
    // Normalize Error Messages
    let message = 'An unexpected error occurred';
    if (data?.message) {
      message = Array.isArray(data.message) ? data.message[0] : data.message;
    } else if (error.message) {
      message = error.message;
    }

    if (status === 401) {
      toast.error('Session expired. Please log in again.');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (status === 404) {
      toast.error('Resource not found.');
    } else if (status === 422) {
      toast.error(`Validation Error: ${message}`);
    } else if (status === 429) {
      toast.error('Too many requests. Please try again later.');
    } else if (status >= 500) {
      toast.error('Server error. Please contact support.');
    } else if (!status) {
      toast.error('Network error. Please check your connection.');
    } else {
       toast.error(message);
    }

    // Pass the normalized error down
    return Promise.reject(new Error(message));
  }
);
