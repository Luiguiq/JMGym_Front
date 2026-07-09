const RESERVATION_STATUS_LABELS = {
  ACTIVA: 'Activa',
  CANCELADA: 'Anulada',
  FINALIZADA: 'Finalizada',
  COMPLETADA: 'Completada',
};

const PAYMENT_STATUS_LABELS = {
  PAGADO: 'Pagado',
  PENDIENTE: 'Pago pendiente',
  VENCIDO: 'Pago vencido',
  REEMBOLSO_PENDIENTE: 'Reembolso en revisión',
  REEMBOLSADO: 'Reembolsado',
};

function normalize(value) {
  return String(value ?? '').trim().toUpperCase();
}

function buildClassDate(reservation) {
  if (!reservation?.fecha_clase) return null;
  const time = reservation?.hora_inicio || '00:00';
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  const date = new Date(`${reservation.fecha_clase}T${normalizedTime}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getReservationStatusLabel(status) {
  const key = normalize(status);
  return RESERVATION_STATUS_LABELS[key] || status || 'Sin estado';
}

export function getPaymentStatusLabel(status) {
  const key = normalize(status);
  return PAYMENT_STATUS_LABELS[key] || status || 'Sin estado de pago';
}

export function getTemporalReservationLabel(reservation) {
  const state = normalize(reservation?.estado_reserva ?? reservation?.status);
  const paymentState = normalize(reservation?.estado_pago ?? reservation?.paymentStatus);

  if (state === 'CANCELADA') return 'Anulada';
  if (state === 'FINALIZADA' || state === 'COMPLETADA') return 'Clase finalizada';
  if (paymentState === 'REEMBOLSO_PENDIENTE') return 'Reembolso en revisión';
  if (paymentState === 'REEMBOLSADO') return 'Reembolsada';

  const classStart = buildClassDate(reservation);
  if (!classStart) return getReservationStatusLabel(state);

  const diffMs = classStart.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const classEnd = reservation?.hora_fin
    ? new Date(`${reservation.fecha_clase}T${reservation.hora_fin.length === 5 ? `${reservation.hora_fin}:00` : reservation.hora_fin}`)
    : null;

  if (classEnd && !Number.isNaN(classEnd.getTime()) && Date.now() >= classStart && Date.now() <= classEnd) {
    return 'En curso';
  }

  if (diffMinutes < 0) {
    const daysAgo = Math.max(1, Math.floor(Math.abs(diffMinutes) / 1440));
    return daysAgo === 1 ? 'Finalizó hace 1 día' : `Finalizó hace ${daysAgo} días`;
  }

  if (diffMinutes < 60) return `Empieza en ${Math.max(1, diffMinutes)} minutos`;

  const diffDays = Math.ceil(diffMinutes / 1440);
  if (diffDays === 1) return 'Empieza mañana';
  return `Empieza en ${diffDays} días`;
}
