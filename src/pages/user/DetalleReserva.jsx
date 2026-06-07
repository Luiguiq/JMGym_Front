import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reservationService } from '../../services/reservationService.js';

function getReservationStatusStyle(status) {

  switch (status?.toUpperCase()) {

    case 'ACTIVA':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';

    case 'CANCELADA':
      return 'bg-red-50 text-red-700 border-red-200';

    case 'COMPLETADA':
    case 'FINALIZADA':
      return 'bg-slate-100 text-slate-700 border-slate-200';

    default:
      return 'bg-amber-50 text-amber-700 border-amber-200';
  }
}

function getPaymentStatusStyle(status) {

  switch (status?.toUpperCase()) {

    case 'PAGADO':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';

    case 'PENDIENTE':
      return 'bg-amber-50 text-amber-700 border-amber-200';

    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

function DetalleReserva() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

    reservationService
      .getMyReservationDetail(id)
      .then(setReservation)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-50 flex items-center justify-center">

        <div className="text-center">

          <div className="
            w-12
            h-12
            border-4
            border-[#004aab]
            border-t-transparent
            rounded-full
            animate-spin
            mx-auto
          " />

          <p className="mt-4 text-slate-500">
            Cargando reserva...
          </p>

        </div>

      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        {error}
      </main>
    );
  }

  if (!reservation) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Reserva no encontrada
      </main>
    );
  }

  return (

    <main className="
      min-h-screen
      bg-[linear-gradient(180deg,#f7fcff_0%,#edf8ff_100%)]
      px-5
      py-6
      pb-24
    ">

      <div className="max-w-2xl mx-auto">

        {/* Header */}

        <button
          onClick={() => navigate(-1)}
          className="
            mb-5
            flex
            items-center
            gap-2
            font-bold
            text-slate-700
          "
        >
          ← Volver
        </button>

        {/* Ticket */}

        <div className="
          overflow-hidden
          rounded-[32px]
          bg-white
          shadow-[0_15px_40px_rgba(15,86,130,.12)]
          border
          border-sky-100
        ">

          {/* Hero */}

          <div className="
            bg-[#004aab]
            text-white
            p-8
            text-center
          ">

            <p className="
              text-xs
              uppercase
              tracking-[4px]
              opacity-80
            ">
              Reserva
            </p>

            <h1 className="
              mt-3
              text-4xl
              font-black
            ">
              #{reservation.codigo_reserva}
            </h1>

            <p className="
              mt-2
              text-sky-100
            ">
              Comprobante de reserva
            </p>

          </div>

          {/* Clase */}

          <div className="p-6">

            <h2 className="
              text-3xl
              font-black
              text-slate-900
            ">
              {reservation.className}
            </h2>

            <p className="
              mt-1
              text-slate-500
            ">
              Prof. {reservation.instructor_nombre}
            </p>

            {/* Estados */}

            <div className="
              flex
              flex-wrap
              gap-3
              mt-5
            ">

              <span
                className={`
                  px-4
                  py-2
                  rounded-full
                  border
                  text-sm
                  font-bold
                  ${getReservationStatusStyle(
                    reservation.estado_reserva
                  )}
                `}
              >
                {reservation.estado_reserva}
              </span>

              <span
                className={`
                  px-4
                  py-2
                  rounded-full
                  border
                  text-sm
                  font-bold
                  ${getPaymentStatusStyle(
                    reservation.estado_pago
                  )}
                `}
              >
                {reservation.estado_pago}
              </span>

            </div>

            {/* Datos */}

            <div className="
              mt-6
              grid
              grid-cols-2
              gap-4
            ">

              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-xs text-slate-500 uppercase">
                  Fecha
                </p>

                <p className="font-black text-slate-800">
                  📅 {reservation.fecha_clase}
                </p>
              </div>

              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-xs text-slate-500 uppercase">
                  Hora
                </p>

                <p className="font-black text-slate-800">
                  🕗 {reservation.hora_inicio}
                </p>
              </div>

              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-xs text-slate-500 uppercase">
                  Espacio
                </p>

                <p className="
                  font-black
                  text-[#004aab]
                ">
                  {reservation.codigo_espacio}
                </p>
              </div>

              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-xs text-slate-500 uppercase">
                  Monto
                </p>

                <p className="
                  font-black
                  text-[#004aab]
                ">
                  S/ {Number(reservation.monto).toFixed(2)}
                </p>
              </div>

            </div>

            {/* QR */}

            {reservation.qr_url && (

              <div className="
                mt-6
                rounded-3xl
                border
                border-sky-100
                p-6
                text-center
              ">

                <h3 className="
                  font-black
                  text-slate-800
                  mb-4
                ">
                  Código QR
                </h3>

                <img
                  src={reservation.qr_url}
                  alt="QR Reserva"
                  className="
                    w-48
                    h-48
                    mx-auto
                  "
                />

              </div>

            )}

            {/* Cancelar */}

            {(reservation.estado_reserva === 'ACTIVA' ||
              reservation.estado_reserva === 'PENDIENTE') && (

              <div className="mt-8">

                <button
                  className="
                    w-full
                    rounded-2xl
                    bg-red-50
                    border
                    border-red-200
                    py-4
                    font-bold
                    text-red-700
                    transition
                    hover:bg-red-100
                  "
                >
                  Cancelar reserva
                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </main>

  );
}

export default DetalleReserva;