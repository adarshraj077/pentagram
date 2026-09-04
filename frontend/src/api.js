import axios from 'axios';

let apiUrl = import.meta.env.VITE_API_URL || '/api';
if (apiUrl !== '/api' && !apiUrl.endsWith('/api')) {
  apiUrl = `${apiUrl.replace(/\/+$/, '')}/api`;
}
export const API_URL = apiUrl;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear localStorage and reload if unauthorized
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
