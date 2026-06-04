import { apiRequest } from './api.js';

export const userService = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  update: (id, data) => apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  registerByAdmin: (data) => apiRequest('/users/register-by-admin', { method: 'POST', body: JSON.stringify(data) }),
  toggleBlock: (id) => apiRequest(`/users/${id}/toggle-block`, { method: 'PATCH' }),
  getReservations: (id) => apiRequest(`/users/${id}/reservations`),
  getStats: () => apiRequest('/users/stats/totals'),
};
