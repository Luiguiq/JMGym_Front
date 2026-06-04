import { apiRequest } from './api.js';

export const adminService = {
  getAll: () => apiRequest('/admin/users'),
  create: (data) => apiRequest('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
  toggleStatus: (id) => apiRequest(`/admin/users/${id}/toggle-status`, { method: 'PUT' }),
};
