import axios, { AxiosInstance, AxiosError } from 'axios';
import { BASE_URL } from '../constants/constants';


const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  onSuccess: (token: string) => void;
  onFailed: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.onFailed(error);
    } else {
      prom.onSuccess(token!);
    }
  });

  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add token to headers if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Skip token refresh for auth endpoints to prevent infinite loops
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      // Token expired - try to refresh
      if (isRefreshing) {
        // Queue the request if refresh is already in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({
            onSuccess: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            onFailed: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No refresh token available, silently logout
        console.log('No refresh token found - logging out silently');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('userData')
        isRefreshing = false;
        return Promise.reject(error);
      }

      return axiosInstance
        .post('/auth/refresh', { refreshToken })
        .then((response: any) => {
          // The response here is already unwrapped (response.data from axios)
          // So if API returns { success: true, data: { token: "..." } }, response = { success: true, data: { token: "..." } }
          // If API returns { success: true, token: "..." }, response = { success: true, token: "..." }
          const newToken = response?.data?.token || response?.token || response?.accessToken || response?.data?.accessToken;

          console.log('Token refresh response:', response);
          console.log('New token extracted:', newToken ? 'Token found' : 'No token found');

          if (!newToken) {
            console.error('Token refresh response structure:', JSON.stringify(response));
            throw new Error('No token in refresh response');
          }

          localStorage.setItem('token', newToken);

          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          processQueue(null, newToken);

          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          console.error('Token refresh failed - logging out silently:', err);
          processQueue(err, null);

          // Silently logout - clear all auth data without redirecting
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('userId');
          localStorage.removeItem('guestCart');

          return Promise.reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Silently logout on 401 errors - clear auth data without redirecting
      // Skip for auth endpoints (login/register failures should not clear existing data)
      console.log('401 error - logging out silently');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
