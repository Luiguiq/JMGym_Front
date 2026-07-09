import { apiRequest } from './api.js';

export const authService = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials), skipAuthRedirect: true }),
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  adminLogin: (credentials) => apiRequest('/auth/admin/login', { method: 'POST', body: JSON.stringify(credentials), skipAuthRedirect: true }),
  adminRegister: (payload) => apiRequest('/auth/admin/register', { method: 'POST', body: JSON.stringify(payload) }),
  forgotPassword: (payload) => apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) }),
  resetPassword: (payload) => apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) }),
};
