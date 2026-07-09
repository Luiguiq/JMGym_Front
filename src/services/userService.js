import { apiRequest } from './api.js';

export const userService = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  update: (id, data) => apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  registerByAdmin: (data) => apiRequest('/users/register-by-admin', { method: 'POST', body: JSON.stringify(data) }),
  toggleBlock: (id) => apiRequest(`/users/${id}/toggle-block`, { method: 'PATCH' }),
  getReservations: (id) => apiRequest(`/users/${id}/reservations`),
  getStats: () => apiRequest('/users/stats/totals'),
  getMyProfile: () => apiRequest('/users/me'),
  getMyProfileSafe: () => apiRequest('/users/me', { skipAuthRedirect: true }),
  updateMyProfile: (data) => apiRequest('/users/me', { method: 'PUT', body: JSON.stringify(data) }),
  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Error al subir la imagen');
    return response.json();
  },
};
