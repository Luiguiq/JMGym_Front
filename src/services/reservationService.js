import { apiRequest } from './api.js';

function mapReservation(item) {
  return {
    id: item.id_reserva ?? item.id,
    userName: item.usuario_nombre ?? item.userName ?? `Usuario #${item.id_usuario}`,
    className: item.clase?.nombre_clase ?? item.clase_nombre ?? item.className ?? '',
    date: item.fecha_reserva ?? item.fecha_clase ?? item.date ?? '',
    status: item.estado_reserva ?? item.estado ?? item.status ?? '',
    paymentStatus: item.estado_pago ?? item.paymentStatus ?? '',
  };
}

export const reservationService = {
  getMyReservations: () => apiRequest('/reservations/me').then((d) => (d ?? []).map(mapReservation)),
  createReservation: (classId) => apiRequest('/reservations', { method: 'POST', body: JSON.stringify({ classId }) }),
  getAllReservations: () => apiRequest('/reservations').then((d) => (d ?? []).map(mapReservation)),
  deleteReservation: (id) => apiRequest(`/reservations/${id}`, { method: 'DELETE' }),
};
