import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reservationService } from '../../services/reservationService.js';
import PageLoader from '../../components/common/PageLoader.jsx';
import { CheckCircle, XCircle, Flag, CreditCard, Clock, AlertTriangle, Undo2, Search, Calendar, Armchair, User } from 'lucide-react';

const MOTIVOS_LABEL = {
  CAMBIO_HORARIO: 'Cambio de horario',
  CAMBIO_INSTRUCTOR: 'Cambio de instructor',
  SALUD: 'Problemas de salud',
  ECONOMICO: 'Motivo económico',
  OTRO: 'Otro motivo',
};

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
    case 'REEMBOLSADO':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

function StatusIcon({ icon: Icon, className }) {
  return Icon ? <Icon className={className} /> : null;
}

const STATUS_ICON = {
  ACTIVA: CheckCircle,
  CANCELADA: XCircle,
  FINALIZADA: Flag,
  COMPLETADA: CheckCircle,
};

const PAGO_ICON = {
  PAGADO: CreditCard,
  PENDIENTE: Clock,
  VENCIDO: AlertTriangle,
  REEMBOLSADO: Undo2,
};

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
    { value: 'CAMBIO_INSTRUCTOR', label: 'Cambio de instructor' },
    { value: 'SALUD', label: 'Problemas de salud' },
    { value: 'ECONOMICO', label: 'Motivo económico' },
    { value: 'OTRO', label: 'Otro motivo' },
  ];

  const canCancel = reservation?.estado_reserva === 'ACTIVA';
  const isCanceled = reservation?.estado_reserva === 'CANCELADA';
  const isCompleted = reservation?.estado_reserva === 'FINALIZADA' || reservation?.estado_reserva === 'COMPLETADA';

  useEffect(() => {
    reservationService
      .getMyReservationDetail(id)
      .then(setReservation)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    setCanceling(true);
    try {
      await reservationService.cancelReservation(id, cancelMotivo, cancelDetalle || null);
      setShowCancelModal(false);
      setReservation((prev) => ({
        ...prev,
        estado_reserva: 'CANCELADA',
        status: 'CANCELADA',
        motivo_cancelacion: cancelMotivo,
        detalle_cancelacion: cancelDetalle || null,
        fecha_cancelacion: new Date().toISOString(),
      }));
    } catch (err) {
      setShowCancelModal(false);
      alert(err?.message || 'Error al cancelar la reserva');
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return <PageLoader text="Cargando información..." />;
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-red-400 mb-3" />
          <p className="text-red-500 font-bold">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-xl bg-[#004aab] px-6 py-2.5 text-sm font-bold text-white"
          >
            Volver
          </button>
        </div>
      </main>
    );
  }

  if (!reservation) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Search className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <p className="text-slate-600 font-bold">Reserva no encontrada</p>
          <button
            onClick={() => navigate('/cliente/reservas')}
            className="mt-4 rounded-xl bg-[#004aab] px-6 py-2.5 text-sm font-bold text-white"
          >
            Mis reservas
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fcff_0%,#edf8ff_100%)] px-5 py-6 pb-24">
      <div className="max-w-3xl mx-auto lg:max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 font-bold text-slate-700 hover:text-slate-900 transition"
        >
          ← Volver
        </button>

        <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_15px_40px_rgba(15,86,130,.12)] border border-sky-100">
          <div className={`p-8 text-center ${
            isCanceled ? 'bg-red-600' : isCompleted ? 'bg-slate-700' : 'bg-[#004aab]'
          } text-white`}>
            <p className="text-xs uppercase tracking-[4px] opacity-80">Reserva</p>
            <h1 className="mt-3 text-4xl font-black">#{reservation.codigo_reserva}</h1>
            <p className="mt-2 text-white/70">Comprobante de reserva</p>
          </div>

          <div className="p-6">
            <h2 className="text-3xl font-black text-slate-900">{reservation.className}</h2>

            {reservation.instructor_nombre && (
              <p className="mt-1 text-slate-500">Prof. {reservation.instructor_nombre}</p>
            )}

            <div className="flex flex-wrap gap-3 mt-5">
              <span className={`px-4 py-2 rounded-full border text-sm font-bold ${getReservationStatusStyle(reservation.estado_reserva)}`}>
                <StatusIcon icon={STATUS_ICON[reservation.estado_reserva]} className="inline-block h-4 w-4 mr-1 -mt-0.5" /> {reservation.estado_reserva}
              </span>

              {reservation.estado_pago && (
                <span className={`px-4 py-2 rounded-full border text-sm font-bold ${getPaymentStatusStyle(reservation.estado_pago)}`}>
                  <StatusIcon icon={PAGO_ICON[reservation.estado_pago]} className="inline-block h-4 w-4 mr-1 -mt-0.5" /> {reservation.estado_pago}
                </span>
              )}
            </div>

            {isCanceled && reservation.motivo_cancelacion && (
              <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-4">
                <p className="text-xs uppercase font-bold tracking-wider text-red-500 mb-1">Motivo de cancelación</p>
                <p className="font-bold text-red-700">
                  {MOTIVOS_LABEL[reservation.motivo_cancelacion] || reservation.motivo_cancelacion}
                </p>
                {reservation.detalle_cancelacion && (
                  <p className="mt-1 text-sm text-red-600">{reservation.detalle_cancelacion}</p>
                )}
              </div>
            )}

            {isCompleted && (
              <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                <p className="text-xs uppercase font-bold tracking-wider text-emerald-500 mb-1">Asistencia</p>
                <p className="font-bold text-emerald-700">Asististe a esta clase</p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-xs text-slate-500 uppercase">Fecha</p>
                <p className="font-black text-slate-800">
                  <Calendar className="inline-block h-4 w-4 mr-1 -mt-0.5" /> {reservation.fecha_clase}
                </p>
              </div>

              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-xs text-slate-500 uppercase">Hora</p>
                <p className="font-black text-slate-800">
                  <Clock className="inline-block h-4 w-4 mr-1 -mt-0.5" /> {reservation.hora_inicio}
                </p>
              </div>

              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-xs text-slate-500 uppercase">Espacio</p>
                <p className="font-black text-[#004aab]">{reservation.codigo_espacio}</p>
              </div>

              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-xs text-slate-500 uppercase">Monto</p>
                <p className="font-black text-[#004aab]">S/ {Number(reservation.monto).toFixed(2)}</p>
              </div>

              {reservation.metodo_pago && (
                <div className="rounded-2xl bg-sky-50 p-4">
                  <p className="text-xs text-slate-500 uppercase">Método de pago</p>
                  <p className="font-black text-slate-800">{reservation.metodo_pago}</p>
                </div>
              )}

              <div className="rounded-2xl bg-sky-50 p-4">
                <p className="text-xs text-slate-500 uppercase">Reservado el</p>
                <p className="font-black text-slate-800">
                  <Calendar className="inline-block h-4 w-4 mr-1 -mt-0.5" /> {new Date(reservation.fecha_reserva).toLocaleDateString('es-PE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {reservation.usuarioNombre && (
                <div className="rounded-2xl bg-sky-50 p-4">
                  <p className="text-xs text-slate-500 uppercase">Reservado por</p>
                  <p className="font-black text-slate-800">
                    <User className="inline-block h-4 w-4 mr-1 -mt-0.5" /> {reservation.usuarioNombre}
                  </p>
                </div>
              )}
            </div>

            {reservation.qr_url && (
              <div className="mt-6 rounded-3xl border border-sky-100 p-6 text-center">
                <h3 className="font-black text-slate-800 mb-4">Código QR</h3>
                <img
                  src={reservation.qr_url}
                  alt="QR Reserva"
                  className="w-48 h-48 mx-auto rounded-2xl"
                />
                <p className="mt-3 text-xs text-slate-400">Presenta este código al ingresar a la clase</p>
              </div>
            )}

            {reservation.estado_reserva === 'ACTIVA' && reservation.estado_pago === 'PENDIENTE' && reservation.fecha_limite_pago && (
              <div className="mt-6 rounded-3xl bg-amber-50 border border-amber-200 p-4 text-center">
                <p className="text-xs uppercase font-bold tracking-wider text-amber-600">Fecha límite de pago</p>
                <p className="font-black text-amber-800 text-lg">
                    <Calendar className="inline-block h-5 w-5 mr-1 -mt-0.5" /> {new Date(reservation.fecha_limite_pago).toLocaleDateString('es-PE', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                </p>
              </div>
            )}
          </div>
        </div>

        {canCancel && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate(`/cliente/reservas/${reservation.id}/cambiar-asiento`)}
              className="flex-1 rounded-2xl bg-sky-50 border border-sky-200 py-3.5 font-bold text-sky-700 transition hover:bg-sky-100"
            >
              <Armchair className="inline-block h-5 w-5 mr-1 -mt-0.5" /> Cambiar asiento
            </button>
            <button
              onClick={() => { setCancelMotivo('OTRO'); setCancelDetalle(''); setShowCancelModal(true); }}
              className="flex-1 rounded-2xl bg-red-50 border border-red-200 py-3.5 font-bold text-red-600 transition hover:bg-red-100"
            >
              <XCircle className="inline-block h-5 w-5 mr-1 -mt-0.5" /> Cancelar reserva
            </button>
          </div>
        )}
      </div>

      {showCancelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCancelModal(false); }}
        >
          <div
            className="w-full sm:max-w-md rounded-[28px] bg-white shadow-2xl flex flex-col max-h-[90vh] animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto px-4 sm:px-6 py-4 sm:p-6">
              <div className="text-center">
                <div className="mx-auto mb-2 sm:mb-3 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100 shadow-inner">
                  <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900">Cancelar reserva</h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed px-1">
                  Esta acción liberará tu espacio. Selecciona el motivo de cancelación.
                </p>
              </div>

              <div className={`mt-3 sm:mt-5 rounded-2xl border p-3 sm:p-4 ${
                  cancelMotivo === 'CAMBIO_INSTRUCTOR'
                    ? 'border-amber-200 bg-amber-50/80'
                    : 'border-slate-100 bg-slate-50/80'
                }`}>
                <div className="space-y-2 text-xs sm:text-sm">
                  {reservation.instructor_nombre && (
                    <div className={`flex justify-between gap-2 sm:gap-4 ${
                      cancelMotivo === 'CAMBIO_INSTRUCTOR' ? 'text-amber-800' : ''
                    }`}>
                      <span className="text-slate-500 shrink-0">Instructor</span>
                      <span className="font-bold text-slate-800 text-right">{reservation.instructor_nombre}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <span className="text-slate-500 shrink-0">Reserva</span>
                    <span className="font-bold text-slate-800 text-right">#{reservation.codigo_reserva}</span>
                  </div>
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <span className="text-slate-500 shrink-0">Clase</span>
                    <span className="font-bold text-slate-800 text-right truncate max-w-[140px] sm:max-w-none">{reservation.className}</span>
                  </div>
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <span className="text-slate-500 shrink-0">Fecha</span>
                    <span className="font-bold text-slate-800 text-right">{reservation.fecha_clase}</span>
                  </div>
                  {reservation.hora_inicio && (
                    <div className="flex justify-between gap-2 sm:gap-4">
                      <span className="text-slate-500 shrink-0">Hora</span>
                      <span className="font-bold text-slate-800 text-right">{reservation.hora_inicio.slice(0, 5)}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <span className="text-slate-500 shrink-0">Espacio</span>
                    <span className="font-bold text-[#004aab] text-right">{reservation.codigo_espacio}</span>
                  </div>
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <span className="text-slate-500 shrink-0">Monto</span>
                    <span className="font-bold text-slate-800 text-right">S/ {Number(reservation.monto).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-2 sm:mb-2.5">Motivo de cancelación</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {motivosCancelacion.map((m) => (
                    <label
                      key={m.value}
                      className={`flex items-center gap-2 sm:gap-2.5 rounded-xl border-2 px-3 py-2 sm:px-3.5 sm:py-3 cursor-pointer transition-all duration-200 ${
                        cancelMotivo === m.value
                          ? 'border-[#004aab] bg-blue-50/70 shadow-sm'
                          : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200 ${
                        cancelMotivo === m.value
                          ? 'border-[#004aab]'
                          : 'border-slate-300'
                      }`}>
                        {cancelMotivo === m.value && (
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#004aab]" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="detalleMotivo"
                        value={m.value}
                        checked={cancelMotivo === m.value}
                        onChange={(e) => setCancelMotivo(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-xs sm:text-sm font-medium text-slate-700 leading-tight">{m.label}</span>
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
                    className="w-full rounded-xl border-2 border-slate-100 bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition-all duration-200 focus:border-[#004aab] focus:ring-2 focus:ring-blue-100 resize-none"
                    rows={2}
                  />
                </div>
              )}

              <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={canceling}
                  className="flex-1 rounded-xl sm:rounded-2xl border-2 border-slate-100 py-3 sm:py-3.5 font-bold text-slate-600 text-xs sm:text-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-200 active:scale-[0.98] disabled:opacity-60"
                >
                  Mantener reserva
                </button>
                <button
                  onClick={handleCancel}
                  disabled={canceling}
                  className="flex-1 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-500 to-red-600 py-3 sm:py-3.5 font-bold text-white text-xs sm:text-sm transition-all duration-200 hover:from-red-600 hover:to-red-700 active:scale-[0.98] shadow-lg shadow-red-200 disabled:opacity-60"
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
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Cancelar
                    </span>
                  )}
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
