import { apiRequest } from './api.js';

export const paymentService = {
  getMyPayments: () =>
    apiRequest('/payments/me').then((d) => (d ?? []).map(mapPayment)),

  initiateYape: (data) =>
    apiRequest('/payments/yape/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  confirmYape: (data) =>
    apiRequest('/payments/yape/confirm', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAllYapePayments: () =>
    apiRequest('/payments/yape/admin').then((d) => (d ?? []).map(mapYapePayment)),
};

function mapPayment(item) {
  return {
    id: item.id_pago,
    idReserva: item.id_reserva,
    metodoPago: item.metodo_pago,
    estado: item.estado,
    monto: item.monto,
    codigoOperacion: item.codigo_operacion,
    fechaPago: item.fecha_pago,
    nombreClase: item.nombre_clase ?? '',
    fechaClase: item.fecha_clase ?? '',
    horaInicio: item.hora_inicio ?? '',
    horaFin: item.hora_fin ?? '',
    codigoReserva: item.codigo_reserva ?? '',
  };
}

function mapYapePayment(item) {
  return {
    id: item.id_yape_pago,
    idUsuario: item.id_usuario,
    idReserva: item.id_reserva,
    celular: item.celular,
    estado: item.estado,
    monto: item.monto,
    fechaCreacion: item.fecha_creacion,
    fechaConfirmacion: item.fecha_confirmacion,
    usuarioNombre: item.usuario_nombre ?? '',
    usuarioCorreo: item.usuario_correo ?? '',
  };
}
