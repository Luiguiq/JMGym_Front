import { apiRequest } from './api.js';

export const reservationService = {
  getMyReservations: () => apiRequest('/reservations/me'),
  createReservation: (classId) => apiRequest('/reservations', { method: 'POST', body: JSON.stringify({ classId }) }),
  getAllReservations: () => apiRequest('/reservations'),
  deleteReservation: (id) => apiRequest(`/reservations/${id}`, { method: 'DELETE' }),
};
