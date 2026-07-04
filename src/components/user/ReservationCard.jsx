import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Flag, CreditCard, Clock, Undo2, Calendar, MapPin, Search, User, AlertTriangle } from 'lucide-react';
import { reservationService } from '../../services/reservationService.js';

const MOTIVOS_LABEL = {
  CAMBIO_HORARIO: 'Cambio de horario',
  CAMBIO_INSTRUCTOR: 'Cambio de instructor',
  SALUD: 'Problemas de salud',
  ECONOMICO: 'Motivo económico',
  OTRO: 'Otro motivo',
};

function ReservationCard({ reservation, onRefresh }) {
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [cancelMotivo, setCancelMotivo] = useState('OTRO');
  const [cancelDetalle, setCancelDetalle] = useState('');

  const isHistory = !['ACTIVA'].includes(reservation.estado_reserva);

  const motivosCancelacion = [
    { value: 'CAMBIO_HORARIO', label: 'Cambio de horario' },
    { value: 'CAMBIO_INSTRUCTOR', label: 'Cambio de instructor' },
    { value: 'SALUD', label: 'Problemas de salud' },
    { value: 'ECONOMICO', label: 'Motivo económico' },
    { value: 'OTRO', label: 'Otro motivo' },
  ];

  const canCancel =
    reservation.estado_reserva === 'ACTIVA' &&
    reservation.estado_pago === 'PENDIENTE';

  const fecha = reservation.fecha_clase
    ? new Date(reservation.fecha_clase + 'T00:00:00').toLocaleDateString('es-PE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : 'Fecha pendiente';

  const statusLabel =
    reservation.estado_reserva === 'ACTIVA'
      ? 'Activa'
      : reservation.estado_reserva === 'CANCELADA'
        ? 'Cancelada'
        : reservation.estado_reserva === 'FINALIZADA'
          ? 'Finalizada'
          : reservation.estado_reserva === 'COMPLETADA'
            ? 'Completada'
            : reservation.estado_reserva;

  const statusColor =
    reservation.estado_reserva === 'ACTIVA'
      ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30'
      : reservation.estado_reserva === 'CANCELADA'
        ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30'
        : 'bg-surface text-secondary border-border';

  const statusIcon =
    reservation.estado_reserva === 'ACTIVA'
      ? <CheckCircle className="w-3.5 h-3.5" />
      : reservation.estado_reserva === 'CANCELADA'
        ? <XCircle className="w-3.5 h-3.5" />
        : reservation.estado_reserva === 'FINALIZADA'
          ? <Flag className="w-3.5 h-3.5" />
          : <CheckCircle className="w-3.5 h-3.5" />;

  const pagoLabel =
    reservation.estado_pago === 'PAGADO'
      ? 'Pagado'
      : reservation.estado_pago === 'PENDIENTE'
        ? 'Pendiente'
        : reservation.estado_pago === 'VENCIDO'
          ? 'Vencido'
          : reservation.estado_pago === 'REEMBOLSADO'
            ? 'Reembolsado'
            : reservation.estado_pago;

  const pagoColor =
    reservation.estado_pago === 'PAGADO'
      ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/30'
      : reservation.estado_pago === 'PENDIENTE'
        ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30'
        : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30';

  const pagoIcon =
    reservation.estado_pago === 'PAGADO'
      ? <CreditCard className="w-3.5 h-3.5" />
      : reservation.estado_pago === 'PENDIENTE'
        ? <Clock className="w-3.5 h-3.5" />
        : reservation.estado_pago === 'VENCIDO'
          ? <AlertTriangle className="w-3.5 h-3.5" />
          : <Undo2 className="w-3.5 h-3.5" />;

  const handleOpenCancel = () => {
    if (!canCancel || canceling) return;
    setFeedback('');
    setCancelMotivo('OTRO');
    setCancelDetalle('');
    setShowCancelModal(true);
  };

  const handleCancel = async () => {
    setCanceling(true);
    setFeedback('');

    try {
      await reservationService.cancelReservation(reservation.id, cancelMotivo, cancelDetalle || null);

      setShowCancelModal(false);
      setFeedback('Reserva cancelada. El espacio quedó disponible nuevamente.');

      if (onRefresh) {
        setTimeout(() => onRefresh(), 700);
      }
    } catch (error) {
      const rawMessage = error?.message || '';
      const friendlyMessage = rawMessage.includes('Error al cancelar')
        ? 'No se pudo cancelar la reserva en este momento. Intenta nuevamente en unos segundos.'
        : rawMessage || 'No se pudo cancelar la reserva.';

      setFeedback(friendlyMessage);
      setShowCancelModal(false);
    } finally {
      setCanceling(false);
    }
  };

  return (
    <>
      <article className={`rounded-3xl bg-card p-5 border border-border-light ${
        isHistory ? 'shadow-sm' : 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-extrabold text-foreground text-lg capitalize">
              {reservation.className || `Reserva #${reservation.codigo_reserva || ''}`}
            </h3>

            {reservation.instructor_nombre && (
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Prof. {reservation.instructor_nombre}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-secondary font-medium">
                <Calendar className="inline-block w-4 h-4" /> {fecha}
              </span>

              {reservation.hora_inicio && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-secondary font-medium">
                  <Clock className="inline-block w-4 h-4" /> {reservation.hora_inicio.slice(0, 5)}
                </span>
              )}

              {reservation.codigo_espacio && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 font-bold text-primary dark:bg-sky-500/10 dark:text-sky-300">
                  <MapPin className="inline-block w-4 h-4" /> {reservation.codigo_espacio}
                </span>
              )}
            </div>

            {reservation.monto > 0 && !isHistory && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-sky-50 border border-sky-100 px-4 py-2 dark:bg-card dark:border-sky-500/30">
                <span className="text-lg text-primary dark:text-sky-300"><CreditCard className="inline-block w-5 h-5" /></span>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-700 dark:text-muted-foreground">Total</p>
                  <p className="text-xl font-black text-primary leading-none dark:text-sky-300">
                    S/ {Number(reservation.monto).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {reservation.monto > 0 && isHistory && (
              <p className="mt-2 text-xs font-bold text-muted-foreground">
                S/ {Number(reservation.monto).toFixed(2)}
              </p>
            )}

            {/* Cancel reason for history */}
            {reservation.estado_reserva === 'CANCELADA' && reservation.motivo_cancelacion && (
              <div className="mt-3 rounded-xl bg-red-50 border border-red-100 px-3 py-2 dark:bg-red-500/10 dark:border-red-500/30">
                <p className="text-[10px] uppercase font-bold tracking-wider text-red-400">Motivo de cancelación</p>
                <p className="text-xs font-semibold text-red-700 dark:text-red-200">
                  {MOTIVOS_LABEL[reservation.motivo_cancelacion] || reservation.motivo_cancelacion}
                  {reservation.detalle_cancelacion && `: ${reservation.detalle_cancelacion}`}
                </p>
              </div>
            )}

            {/* Completed/Finalized badge */}
            {(reservation.estado_reserva === 'FINALIZADA' || reservation.estado_reserva === 'COMPLETADA') && (
              <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2 dark:bg-emerald-500/10 dark:border-emerald-500/30">
                <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Asistencia confirmada</p>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-200">Asististe a esta clase</p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide border ${statusColor}`}>
              {statusIcon} {statusLabel}
            </span>

            {reservation.estado_pago && (
              <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide border ${pagoColor}`} aria-label={`Estado del pago: ${pagoLabel}`}>
                {pagoIcon} {pagoLabel}
              </span>
            )}
          </div>
        </div>

        {feedback && (
          <div
            role="alert"
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium ${
              feedback.toLowerCase().includes('cancelada')
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200'
                : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200'
            }`}
          >
            {feedback}
          </div>
        )}

        <div className="mt-4 flex gap-3 border-t border-border-light pt-4">
          <button
            type="button"
            onClick={() => navigate(`/cliente/reservas/${reservation.id}`)}
            aria-label={`Ver detalle de la reserva ${reservation.codigo_reserva || ''}`}
            className="flex-1 rounded-xl bg-brand-50 py-2.5 text-xs font-bold text-primary transition hover:bg-brand-100 dark:bg-primary/10 dark:text-blue-300 dark:hover:bg-primary/15"
          >
            <Search className="inline-block w-3.5 h-3.5 mr-1" /> Ver detalle
          </button>

          {canCancel && (
            <button
              type="button"
              onClick={handleOpenCancel}
              aria-label={`Cancelar la reserva ${reservation.codigo_reserva || ''}`}
              className="flex-1 rounded-xl bg-red-50 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
            >
              <XCircle className="inline-block w-3.5 h-3.5 mr-1" /> Cancelar
            </button>
          )}
        </div>
      </article>

      {showCancelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCancelModal(false); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-reserva-title"
            className="w-full sm:max-w-md rounded-[28px] bg-card shadow-2xl flex flex-col max-h-[90vh] animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto px-4 sm:px-6 py-4 sm:p-6">
              <div className="text-center">
                <div className="mx-auto mb-2 sm:mb-3 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100 shadow-inner dark:from-red-500/10 dark:to-red-500/20">
                  <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" aria-hidden="true" />
                </div>
                <h3 id="cancel-reserva-title" className="text-lg sm:text-2xl font-black text-foreground">Cancelar reserva</h3>
                <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed px-1">
                  ¿Estás seguro? Esta acción no se puede deshacer. Al cancelar, el espacio{' '}
                  <span className="font-bold text-secondary">{reservation.codigo_espacio}</span> quedará disponible.
                </p>
              </div>

              <div className={`mt-3 sm:mt-5 rounded-2xl border p-3 sm:p-4 ${
                  cancelMotivo === 'CAMBIO_INSTRUCTOR'
                    ? 'border-amber-200 bg-amber-50/80 dark:border-amber-500/30 dark:bg-amber-500/10'
                    : 'border-border-light bg-surface/80'
                }`}>
                <div className="space-y-2 text-xs sm:text-sm">
                  {reservation.instructor_nombre && (
                    <div className={`flex items-center gap-2.5 sm:gap-3 ${
                      cancelMotivo === 'CAMBIO_INSTRUCTOR' ? 'text-amber-800' : ''
                    }`}>
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <span className="font-semibold">Prof. {reservation.instructor_nombre}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="font-semibold text-foreground">{fecha}</span>
                  </div>
                  {reservation.hora_inicio && (
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <span className="font-semibold text-foreground">{reservation.hora_inicio.slice(0, 5)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="font-bold text-primary">{reservation.codigo_espacio}</span>
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="font-semibold text-foreground">S/ {Number(reservation.monto).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-5">
                <label className="text-xs sm:text-sm font-bold text-secondary block mb-2 sm:mb-2.5">Motivo de cancelación</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {motivosCancelacion.map((m) => (
                    <label
                      key={m.value}
                      className={`flex items-center gap-2 sm:gap-2.5 rounded-xl border-2 px-3 py-2 sm:px-3.5 sm:py-3 cursor-pointer transition-all duration-200 ${
                        cancelMotivo === m.value
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-border-light bg-card hover:border-border hover:bg-surface'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200 ${
                        cancelMotivo === m.value
                          ? 'border-primary'
                          : 'border-border'
                      }`}>
                        {cancelMotivo === m.value && (
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="motivo"
                        value={m.value}
                        checked={cancelMotivo === m.value}
                        onChange={(e) => setCancelMotivo(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-xs sm:text-sm font-medium text-secondary leading-tight">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {cancelMotivo === 'OTRO' && (
                <div className="mt-2 sm:mt-3 animate-[fadeIn_0.2s_ease-out]">
                  <textarea
                    value={cancelDetalle}
                    onChange={(e) => setCancelDetalle(e.target.value)}
                    placeholder="Describe el motivo (opcional)..."
                    className="w-full rounded-xl border-2 border-border-light bg-card px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                    rows={2}
                  />
                </div>
              )}

              <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  disabled={canceling}
                  className="flex-1 rounded-xl sm:rounded-2xl border-2 border-border-light py-3 sm:py-3.5 font-bold text-secondary text-xs sm:text-sm transition-all duration-200 hover:bg-surface hover:border-border active:scale-[0.98] disabled:opacity-60"
                >
                  Mantener reserva
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={canceling}
                  className="flex-1 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-500 to-red-600 py-3 sm:py-3.5 font-bold text-primary-foreground text-xs sm:text-sm transition-all duration-200 hover:from-red-600 hover:to-red-700 active:scale-[0.98] shadow-lg shadow-red-200 disabled:opacity-60"
                >
                  {canceling ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Cancelando...
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" /> Cancelar
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReservationCard;