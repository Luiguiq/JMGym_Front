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
    qr_url: item.qr_url ?? item.qr_checkin ?? null,
    motivo_cancelacion: item.motivo_cancelacion ?? null,
    detalle_cancelacion: item.detalle_cancelacion ?? null,
    fecha_cancelacion: item.fecha_cancelacion ?? null,
    historial_estados: item.historial_estados ?? [],
    className: item.clase?.nombre_clase ?? '',
    hora_inicio: item.clase?.hora_inicio ?? '',
    hora_fin: item.clase?.hora_fin ?? '',
    duracion_minutos: item.clase?.duracion_minutos ?? 0,
    instructor_nombre: item.clase?.instructor_nombre ?? '',
    codigo_espacio: item.espacio?.codigo_espacio ?? '',
    userName: item.usuario?.nombre_completo ?? item.usuarioNombre ?? '',
    usuarioNombre: item.usuario?.nombre_completo ?? item.usuarioNombre ?? '',
    usuarioCorreo: item.usuario?.correo ?? '',
    userPhoto: item.usuario?.foto_perfil ?? '',
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
    }).then(mapReservation),
  getAllReservations: () =>
    apiRequest('/reservations').then((d) => (d ?? []).map(mapReservation)),
  markAsPaid: (id) =>
    apiRequest(`/reservations/${id}/mark-paid`, {
      method: 'PATCH',
    }).then(mapReservation),
  changeSeat: (id, seatId) =>
    apiRequest(`/reservations/${id}/seat`, {
      method: 'PATCH',
      body: JSON.stringify({ seat_id: seatId }),
    }),
  cancelReservation: (id, motivo, detalle) =>
    apiRequest(`/reservations/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ motivo, detalle }),
    }),
  requestRefund: (id, motivo, detalle) =>
    apiRequest(`/reservations/${id}/refund-request`, {
      method: 'PATCH',
      body: JSON.stringify({ motivo, detalle }),
    }).then(mapReservation),
  cancelRefundRequest: (id) =>
    apiRequest(`/reservations/${id}/refund-request/cancel`, {
      method: 'PATCH',
    }).then(mapReservation),
  approveRefund: (id) =>
    apiRequest(`/reservations/${id}/refund-approve`, {
      method: 'PATCH',
    }).then(mapReservation),
  deleteReservation: (id, motivo, detalle) =>
    apiRequest(`/reservations/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ motivo, detalle }),
    }),
};
