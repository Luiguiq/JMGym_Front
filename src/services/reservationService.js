import { apiRequest } from './api.js';

function mapReservation(item) {
  return {
    id: item.id_reserva,
    codigo_reserva: item.codigo_reserva,
    id_usuario: item.id_usuario,
    id_clase: item.id_clase,
    id_espacio: item.id_espacio,
    validationConflict: item.estado_reserva === 'CANCELADA',
    metodo_pago: item.metodo_pago,
    estado_pago: item.estado_pago,
    estado_reserva: item.estado_reserva,
    status: item.estado_reserva,
    paymentStatus: item.estado_pago,
    monto: item.monto,
    fecha_reserva: item.fecha_reserva,
    fecha_limite_pago: item.fecha_limite_pago,
    fecha_clase: item.fecha_clase,
    qr_checkin: item.qr_checkin,
    className: item.clase?.nombre_clase ?? '',
    hora_inicio: item.clase?.hora_inicio ?? '',
    hora_fin: item.clase?.hora_fin ?? '',
    duracion_minutos: item.clase?.duracion_minutos ?? 0,
    instructor_nombre: item.clase?.instructor_nombre ?? '',
    codigo_espacio: item.espacio?.codigo_espacio ?? '',
  };
}

export const reservationService = {
  getMyReservations: () =>
    apiRequest('/reservations/me').then((d) => (d ?? []).map(mapReservation)),
  getMyReservationDetail: (id) =>
    apiRequest(`/reservations/${id}`).then(mapReservation),
  createReservation: (data) =>
    apiRequest('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAllReservations: () =>
    apiRequest('/reservations').then((d) => (d ?? []).map(mapReservation)),
  cancelReservation: (id) =>
    apiRequest(`/reservations/${id}/cancel`, { method: 'PATCH' }),
  deleteReservation: (id) =>
    apiRequest(`/reservations/${id}`, { method: 'DELETE' }),
};
