import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservationService } from '../../services/reservationService.js';

const MOTIVOS_LABEL = {
  CAMBIO_HORARIO: 'Cambio de horario',
  SALUD: 'Problemas de salud',
  ECONOMICO: 'Motivo económico',
  CAMBIO_SECTOR: 'Cambio de sector',
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
    { value: 'SALUD', label: 'Problemas de salud' },
    { value: 'ECONOMICO', label: 'Motivo económico' },
    { value: 'CAMBIO_SECTOR', label: 'Cambio de sector' },
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
      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
      : reservation.estado_reserva === 'CANCELADA'
        ? 'bg-red-50 text-red-600 border-red-200'
        : 'bg-slate-50 text-slate-600 border-slate-200';

  const statusIcon =
    reservation.estado_reserva === 'ACTIVA'
      ? '✅'
      : reservation.estado_reserva === 'CANCELADA'
        ? '❌'
        : reservation.estado_reserva === 'FINALIZADA'
          ? '🏁'
          : '✅';

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
      ? 'bg-green-50 text-green-600 border-green-200'
      : reservation.estado_pago === 'PENDIENTE'
        ? 'bg-amber-50 text-amber-600 border-amber-200'
        : 'bg-red-50 text-red-600 border-red-200';

  const pagoIcon =
    reservation.estado_pago === 'PAGADO'
      ? '💳'
      : reservation.estado_pago === 'PENDIENTE'
        ? '⏳'
        : reservation.estado_pago === 'VENCIDO'
          ? '⚠️'
          : '🔙';

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
      <article className={`rounded-3xl bg-white p-5 border border-slate-100 ${
        isHistory ? 'shadow-sm' : 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-extrabold text-slate-800 text-lg capitalize">
              {reservation.className || `Reserva #${reservation.codigo_reserva || ''}`}
            </h3>

            {reservation.instructor_nombre && (
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Prof. {reservation.instructor_nombre}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-slate-600 font-medium">
                📅 {fecha}
              </span>

              {reservation.hora_inicio && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-slate-600 font-medium">
                  🕐 {reservation.hora_inicio.slice(0, 5)}
                </span>
              )}

              {reservation.codigo_espacio && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 font-bold text-[#004aab]">
                  💺 {reservation.codigo_espacio}
                </span>
              )}
            </div>

            {reservation.monto > 0 && !isHistory && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-sky-50 border border-sky-100 px-4 py-2">
                <span className="text-lg">💳</span>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Total</p>
                  <p className="text-xl font-black text-[#004aab] leading-none">
                    S/ {Number(reservation.monto).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {reservation.monto > 0 && isHistory && (
              <p className="mt-2 text-xs font-bold text-slate-400">
                S/ {Number(reservation.monto).toFixed(2)}
              </p>
            )}

            {/* Cancel reason for history */}
            {reservation.estado_reserva === 'CANCELADA' && reservation.motivo_cancelacion && (
              <div className="mt-3 rounded-xl bg-red-50 border border-red-100 px-3 py-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-red-400">Motivo de cancelación</p>
                <p className="text-xs font-semibold text-red-700">
                  {MOTIVOS_LABEL[reservation.motivo_cancelacion] || reservation.motivo_cancelacion}
                  {reservation.detalle_cancelacion && `: ${reservation.detalle_cancelacion}`}
                </p>
              </div>
            )}

            {/* Completed/Finalized badge */}
            {(reservation.estado_reserva === 'FINALIZADA' || reservation.estado_reserva === 'COMPLETADA') && (
              <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Asistencia confirmada</p>
                <p className="text-xs font-semibold text-emerald-700">Asististe a esta clase</p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide border ${statusColor}`}>
              {statusIcon} {statusLabel}
            </span>

            {reservation.estado_pago && (
              <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide border ${pagoColor}`}>
                {pagoIcon} {pagoLabel}
              </span>
            )}
          </div>
        </div>

        {feedback && (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium ${
              feedback.toLowerCase().includes('cancelada')
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}
          >
            {feedback}
          </div>
        )}

        <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4">
          <button
            onClick={() => navigate(`/cliente/reservas/${reservation.id}`)}
            className="flex-1 rounded-xl bg-brand-50 py-2.5 text-xs font-bold text-[#004aab] transition hover:bg-brand-100"
          >
            🔍 Ver detalle
          </button>

          {canCancel && (
            <button
              onClick={handleOpenCancel}
              className="flex-1 rounded-xl bg-red-50 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
            >
              ❌ Cancelar
            </button>
          )}
        </div>
      </article>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
          <div className="w-full max-w-md rounded-[28px] bg-white shadow-2xl lg:max-w-lg flex flex-col max-h-[90vh]">
            <div className="overflow-y-auto p-5 sm:p-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-amber-100 text-2xl sm:text-3xl">
                  ⚠️
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">Cancelar reserva</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                  Esta reserva está pendiente de pago. Puedes cancelarla ahora y liberar el espacio.
                </p>
              </div>

              <div className="mt-4 sm:mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 shrink-0">Clase</span>
                    <span className="font-bold text-slate-800 text-right truncate max-w-[200px] sm:max-w-none">{reservation.className}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 shrink-0">Fecha</span>
                    <span className="font-bold text-slate-800 text-right">{fecha}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 shrink-0">Espacio</span>
                    <span className="font-bold text-[#004aab] text-right">{reservation.codigo_espacio}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 shrink-0">Monto</span>
                    <span className="font-bold text-slate-800 text-right">S/ {Number(reservation.monto).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-2">Motivo de cancelación</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {motivosCancelacion.map((m) => (
                    <label
                      key={m.value}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3 cursor-pointer transition ${
                        cancelMotivo === m.value
                          ? 'border-[#004aab] bg-blue-50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="motivo"
                        value={m.value}
                        checked={cancelMotivo === m.value}
                        onChange={(e) => setCancelMotivo(e.target.value)}
                        className="accent-[#004aab] shrink-0"
                      />
                      <span className="text-xs sm:text-sm font-medium text-slate-700 leading-tight">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {cancelMotivo === 'OTRO' && (
                <div className="mt-3">
                  <textarea
                    value={cancelDetalle}
                    onChange={(e) => setCancelDetalle(e.target.value)}
                    placeholder="Describe el motivo (opcional)..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-[#004aab] focus:ring-2 focus:ring-blue-100 resize-none"
                    rows={2}
                  />
                </div>
              )}

              <div className="mt-5 sm:mt-6 flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={canceling}
                  className="flex-1 rounded-2xl border border-slate-200 py-2.5 sm:py-3 font-bold text-slate-700 text-xs sm:text-sm transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Mantener reserva
                </button>
                <button
                  onClick={handleCancel}
                  disabled={canceling}
                  className="flex-1 rounded-2xl bg-[#004aab] py-2.5 sm:py-3 font-bold text-white text-xs sm:text-sm transition hover:opacity-90 disabled:opacity-60"
                >
                  {canceling ? 'Cancelando...' : 'Sí, cancelar'}
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