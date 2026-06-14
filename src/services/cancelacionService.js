import { apiRequest } from './api.js';

export const cancelacionService = {
  getAll: () =>
    apiRequest('/cancelaciones').then((d) => (d ?? []).map(mapCancelacion)),
};

function mapCancelacion(item) {
  return {
    id: item.id_cancelacion,
    idReserva: item.id_reserva,
    motivo: item.motivo,
    detalle: item.detalle,
    canceladoPor: item.cancelado_por,
    fechaCancelacion: item.fecha_cancelacion,
    codigoReserva: item.codigo_reserva,
    nombreUsuario: item.nombre_usuario,
    nombreClase: item.nombre_clase,
    fechaClase: item.fecha_clase,
  };
}
