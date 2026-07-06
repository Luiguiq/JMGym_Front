function buildClassStartDate(reservation) {
  if (!reservation?.fecha_clase || !reservation?.hora_inicio) return null;
  const time = reservation.hora_inicio.length === 5
    ? `${reservation.hora_inicio}:00`
    : reservation.hora_inicio;
  const date = new Date(`${reservation.fecha_clase}T${time}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalize(value) {
  if (value == null) return '';
  return String(value).trim().toUpperCase();
}

function getEstadoReserva(reservation) {
  return normalize(reservation?.estado_reserva ?? reservation?.status);
}

function getEstadoPago(reservation) {
  return normalize(reservation?.estado_pago ?? reservation?.paymentStatus);
}

function getMetodoPago(reservation) {
  return normalize(
    reservation?.metodo_pago ??
    reservation?.metodoPago ??
    reservation?.paymentMethod
  );
}

export function claseYaInicio(reservation) {
  const classStart = buildClassStartDate(reservation);
  return classStart ? classStart <= new Date() : false;
}

export function puedeCancelarReserva(reservation) {
  const estadoReserva = getEstadoReserva(reservation);
  const estadoPago = getEstadoPago(reservation);

  return (
    estadoReserva === 'ACTIVA' &&
    estadoPago === 'PENDIENTE' &&
    !claseYaInicio(reservation)
  );
}

export function puedeSolicitarReembolso(reservation) {
  const metodoPago = getMetodoPago(reservation);
  const estadoReserva = getEstadoReserva(reservation);
  const estadoPago = getEstadoPago(reservation);

  return (
    metodoPago === 'YAPE' &&
    estadoReserva === 'ACTIVA' &&
    estadoPago === 'PAGADO' &&
    !claseYaInicio(reservation)
  );
}

export function puedeCancelarSolicitudReembolso(reservation) {
  const metodoPago = getMetodoPago(reservation);
  const estadoReserva = getEstadoReserva(reservation);
  const estadoPago = getEstadoPago(reservation);

  return (
    metodoPago === 'YAPE' &&
    estadoReserva === 'ACTIVA' &&
    estadoPago === 'REEMBOLSO_PENDIENTE' &&
    !claseYaInicio(reservation)
  );
}
