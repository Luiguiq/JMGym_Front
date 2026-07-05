function buildClassStartDate(reservation) {
  if (!reservation?.fecha_clase || !reservation?.hora_inicio) return null;
  const time = reservation.hora_inicio.length === 5
    ? `${reservation.hora_inicio}:00`
    : reservation.hora_inicio;
  const date = new Date(`${reservation.fecha_clase}T${time}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function claseYaInicio(reservation) {
  const classStart = buildClassStartDate(reservation);
  return classStart ? classStart <= new Date() : false;
}

export function puedeCancelarReserva(reservation) {
  return (
    reservation?.estado_reserva === 'ACTIVA' &&
    reservation?.estado_pago === 'PENDIENTE' &&
    !claseYaInicio(reservation)
  );
}

export function puedeSolicitarReembolso(reservation) {
  return (
    reservation?.metodo_pago?.toUpperCase() === 'YAPE' &&
    reservation?.estado_reserva === 'ACTIVA' &&
    reservation?.estado_pago === 'PAGADO' &&
    !claseYaInicio(reservation)
  );
}

export function puedeCancelarSolicitudReembolso(reservation) {
  return (
    reservation?.metodo_pago?.toUpperCase() === 'YAPE' &&
    reservation?.estado_reserva === 'ACTIVA' &&
    reservation?.estado_pago === 'REEMBOLSO_PENDIENTE' &&
    !claseYaInicio(reservation)
  );
}
