import { apiRequest } from './api.js';

export const genreService = {
  getAll: () => apiRequest('/genres'),
  getById: (id) => apiRequest(`/genres/${id}`),
  create: (data) => apiRequest('/genres', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/genres/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/genres/${id}`, {
    method: 'DELETE',
  }),
};
