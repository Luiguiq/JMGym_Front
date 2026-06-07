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
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">

            <span className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-slate-50
              px-3
              py-1
              text-slate-600
              font-medium
            ">
              📅 {fecha}
            </span>

            {reservation.hora_inicio && (
              <span className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-slate-50
                px-3
                py-1
                text-slate-600
                font-medium
              ">
                🕐 {reservation.hora_inicio.slice(0, 5)}
              </span>
            )}

            {reservation.codigo_espacio && (
              <span className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-sky-50
                px-3
                py-1
                font-bold
                text-[#004aab]
              ">
                💺 {reservation.codigo_espacio}
              </span>
            )}

          </div>
          {reservation.monto > 0 && (

            <div
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                rounded-2xl
                bg-sky-50
                border
                border-sky-100
                px-4
                py-2
              "
            >

              <span className="text-lg">
                💳
              </span>

              <div>

                <p className="
                  text-[10px]
                  uppercase
                  font-bold
                  tracking-wider
                  text-slate-500
                ">
                  Total
                </p>

                <p className="
                  text-xl
                  font-black
                  text-[#004aab]
                  leading-none
                ">
                  S/ {Number(reservation.monto).toFixed(2)}
                </p>

              </div>

            </div>

          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">

          <span
            className={`
              inline-flex
              items-center
              justify-center
              rounded-full
              px-3
              py-1
              text-[11px]
              font-extrabold
              uppercase
              tracking-wide
              border
              ${statusColor}
            `}
          >
            <>
              {reservation.estado_reserva === 'ACTIVA' && '✅ '}
              {reservation.estado_reserva === 'CANCELADA' && '❌ '}
              {reservation.estado_reserva === 'FINALIZADA' && '🏁 '}
              {statusLabel}
            </>
          </span>

          <span
            className={`
              inline-flex
              items-center
              justify-center
              rounded-full
              px-3
              py-1
              text-[11px]
              font-extrabold
              uppercase
              tracking-wide
              border
              ${pagoColor}
            `}
          >
            <>
              {reservation.estado_pago === 'PAGADO' && '💳 '}
              {reservation.estado_pago === 'PENDIENTE' && '⏳ '}
              {reservation.estado_pago === 'VENCIDO' && '⚠️ '}
              {pagoLabel}
            </>
          </span>

        </div>
      </div>

      <div
        className="
          mt-4
          flex
          gap-3
          border-t
          border-slate-100
          pt-4y
        "
      >

        <button
          onClick={() =>
            navigate(`/cliente/reservas/${reservation.id}`)
          }
          className="
            flex-1
            rounded-xl
            bg-brand-50
            py-2.5
            text-xs
            font-bold
            text-[#004aab]
            transition
            hover:bg-brand-100
          "
        >
          🔍 Ver detalle
        </button>

        {reservation.estado_reserva === 'ACTIVA' &&
          reservation.estado_pago === 'PENDIENTE' && (

            <button
              onClick={handleCancel}
              className="
                flex-1
                rounded-xl
                bg-red-50
                py-2.5
                text-xs
                font-bold
                text-red-600
                transition
                hover:bg-red-100
              "
            >
              ❌ Cancelar
            </button>

        )}

      </div>
    </article>
  );
}

export default ReservationCard;
