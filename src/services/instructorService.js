import { apiRequest } from './api.js';

export const instructorService = {
  getAll: () => apiRequest('/instructors'),
  getById: (id) => apiRequest(`/instructors/${id}`),
  create: (data) => apiRequest('/instructors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/instructors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/instructors/${id}`, { method: 'DELETE' }),
};
