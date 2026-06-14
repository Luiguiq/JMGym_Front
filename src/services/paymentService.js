import { apiRequest } from './api.js';

export const paymentService = {
  getMyPayments: () =>
    apiRequest('/payments/me').then((d) => (d ?? []).map(mapPayment)),
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
