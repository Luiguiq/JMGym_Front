import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reservationService } from '../../services/reservationService.js';
import PageLoader from '../../components/common/PageLoader.jsx';

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

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelMotivo, setCancelMotivo] = useState('OTRO');
  const [cancelDetalle, setCancelDetalle] = useState('');

  const motivosCancelacion = [
    { value: 'CAMBIO_HORARIO', label: 'Cambio de horario' },
    { value: 'SALUD', label: 'Problemas de salud' },
    { value: 'ECONOMICO', label: 'Motivo económico' },
    { value: 'CAMBIO_SECTOR', label: 'Cambio de sector' },
    { value: 'OTRO', label: 'Otro motivo' },
  ];

  const canCancel = reservation?.estado_reserva === 'ACTIVA';

  useEffect(() => {

    reservationService
      .getMyReservationDetail(id)
      .then(setReservation)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  }, [id]);

  if (loading) {
    return (
      <PageLoader
        text="Cargando información..."
      />
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

      <div className="max-w-3xl mx-auto lg:max-w-4xl">

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
              grid-cols-1
              gap-4
              sm:grid-cols-2
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
          </div>

        </div>

        {/* Cancel button */}
        {canCancel && (
          <div className="mt-6 text-center">
            <button
              onClick={() => { setCancelMotivo('OTRO'); setCancelDetalle(''); setShowCancelModal(true); }}
              className="w-full rounded-2xl bg-red-50 border border-red-200 py-3.5 font-bold text-red-600 transition hover:bg-red-100"
            >
              ❌ Cancelar reserva
            </button>
          </div>
        )}

      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
          <div className="w-full max-w-md rounded-[28px] bg-white shadow-2xl lg:max-w-lg flex flex-col max-h-[90vh]">
            <div className="overflow-y-auto p-5 sm:p-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-amber-100 text-2xl sm:text-3xl">
                  ⚠️
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Cancelar reserva
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                  Esta acción liberará tu espacio. Selecciona el motivo de cancelación.
                </p>
              </div>

              <div className="mt-4 sm:mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 shrink-0">Reserva</span>
                    <span className="font-bold text-slate-800 text-right">#{reservation.codigo_reserva}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 shrink-0">Clase</span>
                    <span className="font-bold text-slate-800 text-right truncate max-w-[180px] sm:max-w-none">{reservation.className}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 shrink-0">Fecha</span>
                    <span className="font-bold text-slate-800 text-right">{reservation.fecha_clase}</span>
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
                <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-2">
                  Motivo de cancelación
                </label>
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
                        name="detalleMotivo"
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
                  onClick={async () => {
                    setCanceling(true);
                    try {
                      await reservationService.cancelReservation(id, cancelMotivo, cancelDetalle || null);
                      setShowCancelModal(false);
                      setReservation((prev) => ({ ...prev, estado_reserva: 'CANCELADA', status: 'CANCELADA' }));
                    } catch (err) {
                      setShowCancelModal(false);
                      alert(err?.message || 'Error al cancelar la reserva');
                    } finally {
                      setCanceling(false);
                    }
                  }}
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

    </main>

  );
}

export default DetalleReserva;