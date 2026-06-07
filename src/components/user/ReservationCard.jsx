import { useNavigate } from 'react-router-dom';
import { reservationService } from '../../services/reservationService.js';

function ReservationCard({ reservation, onRefresh }) {
  const navigate = useNavigate();

  const handleCancel = async () => {

    const confirmacion = window.confirm(
      '¿Deseas cancelar esta reserva?'
    );

    if (!confirmacion) return;

    try {

      await reservationService.cancelReservation(
        reservation.id
      );

      alert('Reserva cancelada correctamente');

      if (onRefresh) {
        onRefresh();
      }

    } catch (error) {

      alert(
        error.message ||
        'No se pudo cancelar la reserva'
      );

    }
  };

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
          : reservation.estado_reserva;

  const statusColor =
    reservation.estado_reserva === 'ACTIVA'
      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
      : reservation.estado_reserva === 'CANCELADA'
        ? 'bg-red-50 text-red-600 border-red-200'
        : 'bg-slate-50 text-slate-600 border-slate-200';

  const pagoLabel =
    reservation.estado_pago === 'PAGADO'
      ? 'Pagado'
      : reservation.estado_pago === 'PENDIENTE'
        ? 'Pendiente'
        : reservation.estado_pago === 'VENCIDO'
          ? 'Vencido'
          : reservation.estado_pago;

  const pagoColor =
    reservation.estado_pago === 'PAGADO'
      ? 'bg-green-50 text-green-600 border-green-200'
      : reservation.estado_pago === 'PENDIENTE'
        ? 'bg-amber-50 text-amber-600 border-amber-200'
        : 'bg-red-50 text-red-600 border-red-200';

  return (
    <article className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-extrabold text-slate-800 text-lg capitalize">
            {reservation.className || `Reserva #${reservation.codigo_reserva || ''}`}
          </h3>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
            <span aria-hidden="true">📅</span> {fecha}
          </p>
          {reservation.hora_inicio && (
            <p className="text-sm text-slate-500 mt-0.5">
              🕐 {reservation.hora_inicio.slice(0, 5)} {reservation.duracion_minutos ? `· ${reservation.duracion_minutos} min` : ''}
            </p>
          )}
          {reservation.instructor_nombre && (
            <p className="text-sm text-slate-500 mt-0.5">
              👩‍🏫 {reservation.instructor_nombre}
            </p>
          )}
          {reservation.codigo_espacio && (
            <p className="text-sm text-slate-500 mt-0.5">
              💺 Espacio: {reservation.codigo_espacio}
            </p>
          )}
          {reservation.monto > 0 && (
            <p className="text-sm font-bold text-slate-700 mt-1">
              S/ {Number(reservation.monto).toFixed(2)}
            </p>
          )}
          {reservation.codigo_reserva && (
            <p className="text-xs text-slate-400 mt-1 font-mono">
              N° {reservation.codigo_reserva}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={`font-bold px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider shadow-sm border ${statusColor}`}
          >
            {statusLabel}
          </span>
          <span
            className={`font-bold px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider shadow-sm border ${pagoColor}`}
          >
            {pagoLabel}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <button
          onClick={() =>
            navigate(`/cliente/reservas/${reservation.id}`)
          }
          className="text-xs font-bold text-brand-600 bg-brand-50 px-4 py-2 rounded-xl hover:bg-brand-100 transition"
        >
          Ver detalle
        </button>

        {reservation.estado_reserva === 'ACTIVA' &&
          reservation.estado_pago === 'PENDIENTE' && (

            <button
              onClick={handleCancel}
              className="text-xs font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition"
            >
              Cancelar reserva
            </button>

        )}

      </div>
    </article>
  );
}

export default ReservationCard;
