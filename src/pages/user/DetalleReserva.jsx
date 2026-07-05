import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reservationService } from '../../services/reservationService.js';
import PageLoader from '../../components/common/PageLoader.jsx';
import { CheckCircle, XCircle, Flag, CreditCard, Clock, AlertTriangle, Undo2, Search, Calendar, Armchair, User } from 'lucide-react';

const MOTIVOS_LABEL = {
  CAMBIO_HORARIO: 'Cambio de horario',
  CAMBIO_INSTRUCTOR: 'Cambio de instructor',
  SALUD: 'Problemas de salud',
  ECONOMICO: 'Motivo econ�mico',
  OTRO: 'Otro motivo',
};

function getReservationStatusStyle(status) {
  switch (status?.toUpperCase()) {
    case 'ACTIVA':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30';
    case 'CANCELADA':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30';
    case 'COMPLETADA':
    case 'FINALIZADA':
      return 'bg-surface text-muted border-border-light';
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30';
  }
}

function getPaymentStatusStyle(status) {
  switch (status?.toUpperCase()) {
    case 'PAGADO':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30';
    case 'PENDIENTE':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30';
    case 'REEMBOLSO_PENDIENTE':
      return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/30';
    case 'REEMBOLSADO':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30';
    default:
      return 'bg-surface text-muted border-border-light';
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
  REEMBOLSO_PENDIENTE: AlertTriangle,
  REEMBOLSADO: Undo2,
};

const HISTORIAL_ICON = {
  RESERVA_CREADA: Calendar,
  PAGO_PENDIENTE: Clock,
  PAGO_CONFIRMADO: CreditCard,
  PAGO_VENCIDO: AlertTriangle,
  PAGO_RECHAZADO: AlertTriangle,
  PAGO_REEMBOLSADO: Undo2,
  RESERVA_CANCELADA: XCircle,
  REEMBOLSO_SOLICITADO: Clock,
  REEMBOLSO_APROBADO: CheckCircle,
  REEMBOLSO_RECHAZADO: XCircle,
  RESERVA_COMPLETADA: CheckCircle,
  RESERVA_FINALIZADA: Flag,
  ASIENTO_CAMBIADO: Armchair,
};

function getHistoryEventStyle(tipoEvento) {
  switch (tipoEvento) {
    case 'PAGO_CONFIRMADO':
    case 'REEMBOLSO_APROBADO':
    case 'RESERVA_COMPLETADA':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30';
    case 'RESERVA_CANCELADA':
    case 'PAGO_RECHAZADO':
    case 'REEMBOLSO_RECHAZADO':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30';
    case 'PAGO_PENDIENTE':
    case 'PAGO_VENCIDO':
    case 'REEMBOLSO_SOLICITADO':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30';
    case 'PAGO_REEMBOLSADO':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30';
    default:
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30';
  }
}

function formatHistoryDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildClassStartDate(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;

  const normalizedTime =
    timeStr.length === 5 ? `${timeStr}:00` : timeStr;

  const result = new Date(`${dateStr}T${normalizedTime}`);

  return Number.isNaN(result.getTime()) ? null : result;
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

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [refundError, setRefundError] = useState('');
  const [refundSuccess, setRefundSuccess] = useState('');

  const motivosCancelacion = [
    { value: 'CAMBIO_HORARIO', label: 'Cambio de horario' },
    { value: 'CAMBIO_INSTRUCTOR', label: 'Cambio de instructor' },
    { value: 'SALUD', label: 'Problemas de salud' },
    { value: 'ECONOMICO', label: 'Motivo econ�mico' },
    { value: 'OTRO', label: 'Otro motivo' },
  ];

  const classStartAt = buildClassStartDate(
    reservation?.fecha_clase,
    reservation?.hora_inicio
  );

  const hasClassStarted = classStartAt
    ? classStartAt <= new Date()
    : false;

  const isRefundPending =
    reservation?.estado_pago === 'REEMBOLSO_PENDIENTE';

  const canChangeSeat =
  reservation?.estado_reserva === 'ACTIVA';

  const canCancel =
    reservation?.estado_reserva === 'ACTIVA' &&
    reservation?.estado_pago === 'PENDIENTE';

  const canRefund =
    reservation?.estado_reserva === 'ACTIVA' &&
    reservation?.estado_pago === 'PAGADO' &&
    reservation?.metodo_pago?.toUpperCase() === 'YAPE';

  const canRequestRefund =
    reservation?.estado_reserva === 'ACTIVA' &&
    reservation?.estado_pago === 'PAGADO' &&
    !hasClassStarted &&
    !isRefundPending;

  const isCanceled = reservation?.estado_reserva === 'CANCELADA';
  const isCompleted =
    reservation?.estado_reserva === 'FINALIZADA' ||
    reservation?.estado_reserva === 'COMPLETADA';
  const historialEstados = reservation?.historial_estados ?? [];

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


  const handleConfirmRefundRequest = async () => {
    if (refunding) return;

    setRefundError('');
    setRefundSuccess('');
    setRefunding(true);
    try {
      const updated = await reservationService.requestRefund(id);
      setReservation(updated);
      setRefundSuccess('Solicitud de reembolso enviada. Sera revisada por un administrador.');
      setShowRefundModal(false);
    } catch (err) {
      setRefundError(err?.message || 'Error al solicitar el reembolso');
    } finally {
      setRefunding(false);
    }
  };

  if (loading) {
    return <PageLoader text="Cargando informaci�n..." />;
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center" role="alert">
          <AlertTriangle className="mx-auto h-10 w-10 text-red-400 mb-3" aria-hidden="true" />
          <p className="text-red-500 font-bold">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-primary-foreground"
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
          <Search className="mx-auto h-10 w-10 text-muted mb-3" />
          <p className="text-secondary font-bold">Reserva no encontrada</p>
          <button
            onClick={() => navigate('/cliente/reservas')}
            className="mt-4 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Mis reservas
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-surface px-5 py-6 pb-36 max-md:landscape:py-4">
      <div className="max-w-3xl mx-auto lg:max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 font-bold text-secondary hover:text-foreground transition"
        >
          ? Volver
        </button>

        <div className="overflow-hidden rounded-[32px] bg-card shadow-[0_15px_40px_rgba(15,86,130,.12)] border border-blue-100/50">
          <div className={`p-8 text-center ${
            isCanceled ? 'bg-red-600' : isCompleted ? 'bg-slate-600' : 'bg-brand-600'
          } text-primary-foreground`}>
            <p className="text-xs uppercase tracking-[4px] opacity-80">Reserva</p>
            <h1 className="mt-3 text-4xl font-black">#{reservation.codigo_reserva}</h1>
            <p className="mt-2 text-primary-foreground/70">Comprobante de reserva</p>
          </div>

          <div className="p-6">
            <h2 className="text-3xl font-black text-foreground">{reservation.className}</h2>

            {reservation.instructor_nombre && (
              <p className="mt-1 text-secondary">Prof. {reservation.instructor_nombre}</p>
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
              <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-4 dark:bg-red-500/10 dark:border-red-500/30">
                <p className="text-xs uppercase font-bold tracking-wider text-red-500 mb-1">Motivo de cancelaci�n</p>
                <p className="font-bold text-red-700 dark:text-red-200">
                  {MOTIVOS_LABEL[reservation.motivo_cancelacion] || reservation.motivo_cancelacion}
                </p>
                {reservation.detalle_cancelacion && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-300">{reservation.detalle_cancelacion}</p>
                )}
              </div>
            )}

            {isCompleted && (
              <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 dark:bg-emerald-500/10 dark:border-emerald-500/30">
                <p className="text-xs uppercase font-bold tracking-wider text-emerald-500 mb-1">Asistencia</p>
                <p className="font-bold text-emerald-700 dark:text-emerald-200">Asististe a esta clase</p>
              </div>
            )}

            {isRefundPending && (
              <div className="mt-4 rounded-2xl bg-orange-50 border border-orange-200 p-4 dark:bg-orange-500/10 dark:border-orange-500/30">
                <p className="text-xs uppercase font-bold tracking-wider text-orange-500 mb-1">
                  Reembolso en revisi�n
                </p>
                <p className="font-bold text-orange-700 dark:text-orange-200">
                  Tu solicitud fue enviada al administrador.
                </p>
              </div>
            )}

            {refundSuccess && (
              <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 dark:bg-emerald-500/10 dark:border-emerald-500/30" role="status">
                <p className="font-bold text-emerald-700 dark:text-emerald-200">{refundSuccess}</p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-xs text-muted uppercase">Fecha</p>
                <p className="font-black text-foreground">
                  <Calendar className="inline-block h-4 w-4 mr-1 -mt-0.5" /> {reservation.fecha_clase}
                </p>
              </div>

              <div className="rounded-2xl bg-surface p-4">
                <p className="text-xs text-muted uppercase">Hora</p>
                <p className="font-black text-foreground">
                  <Clock className="inline-block h-4 w-4 mr-1 -mt-0.5" /> {reservation.hora_inicio}
                </p>
              </div>

              <div className="rounded-2xl bg-surface p-4">
                <p className="text-xs text-muted uppercase">Espacio</p>
                <p className="font-black text-brand-600">{reservation.codigo_espacio}</p>
              </div>

              <div className="rounded-2xl bg-surface p-4">
                <p className="text-xs text-muted uppercase">Monto</p>
                <p className="font-black text-brand-600">S/ {Number(reservation.monto).toFixed(2)}</p>
              </div>

              {reservation.metodo_pago && (
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-xs text-muted uppercase">M�todo de pago</p>
                  <p className="font-black text-foreground">{reservation.metodo_pago}</p>
                </div>
              )}

              <div className="rounded-2xl bg-surface p-4">
                <p className="text-xs text-muted uppercase">Reservado el</p>
                <p className="font-black text-foreground">
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
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-xs text-muted uppercase">Reservado por</p>
                  <p className="font-black text-foreground">
                    <User className="inline-block h-4 w-4 mr-1 -mt-0.5" /> {reservation.usuarioNombre}
                  </p>
                </div>
              )}
            </div>

            {reservation.estado_reserva === 'ACTIVA' && reservation.estado_pago === 'PENDIENTE' && reservation.fecha_limite_pago && (
              <div className="mt-6 rounded-3xl bg-amber-50 border border-amber-200 p-4 text-center dark:bg-amber-500/10 dark:border-amber-500/30">
                <p className="text-xs uppercase font-bold tracking-wider text-amber-600 dark:text-amber-300">Fecha l�mite de pago</p>
                <p className="font-black text-amber-800 text-lg dark:text-amber-200">
                    <Calendar className="inline-block h-5 w-5 mr-1 -mt-0.5" /> {new Date(reservation.fecha_limite_pago).toLocaleDateString('es-PE', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                </p>
              </div>
            )}
            <section className="mt-6 rounded-3xl border border-border-light bg-surface p-5">
              <h3 className="text-xl font-black text-foreground">Historial de la reserva</h3>

              {historialEstados.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-4 text-sm text-secondary">
                  No hay cambios anteriores registrados para esta reserva.
                </div>
              ) : (
                <ol className="mt-5 space-y-4">
                  {historialEstados.map((evento, index) => {
                    const EventIcon = HISTORIAL_ICON[evento.tipo_evento] || CheckCircle;
                    const isLast = index === historialEstados.length - 1;

                    return (
                      <li key={evento.id ?? `${evento.tipo_evento}-${index}`} className="relative flex gap-3 sm:gap-4">
                        {!isLast && (
                          <span className="absolute left-5 top-11 h-[calc(100%+0.25rem)] w-px bg-border" aria-hidden="true" />
                        )}
                        <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${getHistoryEventStyle(evento.tipo_evento)}`}>
                          <EventIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1 rounded-2xl border border-border-light bg-card p-4">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                            <p className="font-black text-foreground">
                              {evento.titulo || 'Cambio registrado'}
                            </p>
                            {evento.fecha_hora && (
                              <time className="text-xs font-semibold text-muted sm:text-right" dateTime={evento.fecha_hora}>
                                {formatHistoryDate(evento.fecha_hora)}
                              </time>
                            )}
                          </div>
                          {evento.descripcion && (
                            <p className="mt-1 text-sm leading-relaxed text-secondary">
                              {evento.descripcion}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

          {canChangeSeat && (
            <button
              onClick={() =>
                navigate(
                  `/cliente/reservas/${reservation.id}/cambiar-asiento`
                )
              }
              className="flex-1 rounded-2xl bg-sky-50 border border-sky-200 py-3.5 font-bold text-sky-700 transition hover:bg-sky-100 dark:bg-card dark:border-sky-500/30 dark:text-sky-300 dark:hover:bg-sky-500/10"
            >
              <Armchair className="inline-block h-5 w-5 mr-1 -mt-0.5" />
              Cambiar asiento
            </button>
          )}

          {canCancel && (
            <button
              onClick={() => {
                setCancelMotivo('OTRO');
                setCancelDetalle('');
                setShowCancelModal(true);
              }}
              className="flex-1 rounded-2xl bg-red-50 border border-red-200 py-3.5 font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/20"
            >
              <XCircle className="inline-block h-5 w-5 mr-1 -mt-0.5" />
              Cancelar reserva
            </button>
          )}

          {canRefund && (
            <button
              onClick={() => {
                setRefundError('');
                setRefundSuccess('');
                setShowRefundModal(true);
              }}
              className="flex-1 rounded-2xl bg-orange-50 border border-orange-200 py-3.5 font-bold text-orange-600 transition hover:bg-orange-100 dark:bg-orange-500/10 dark:border-orange-500/30 dark:text-orange-300 dark:hover:bg-orange-500/20"
            >
              <Undo2 className="inline-block h-5 w-5 mr-1 -mt-0.5" />
              Solicitar reembolso
            </button>
          )}

        </div>
      </div>

      {showCancelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCancelModal(false); }}
        >
          <div
            className="w-full sm:max-w-md rounded-[28px] bg-card shadow-2xl flex flex-col max-h-[90vh] animate-[fadeIn_0.2s_ease-out]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancelar-reserva-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto px-4 sm:px-6 py-4 sm:p-6">
              <div className="text-center">
                <div className="mx-auto mb-2 sm:mb-3 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100 shadow-inner dark:from-red-500/10 dark:to-red-500/20">
                  <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" aria-hidden="true" />
                </div>
                <h3 id="cancelar-reserva-title" className="text-lg sm:text-2xl font-black text-foreground">Cancelar reserva</h3>
                <p className="mt-1 text-xs sm:text-sm text-secondary leading-relaxed px-1">
                  Esta acci�n liberar� tu espacio. Selecciona el motivo de cancelaci�n.
                </p>
              </div>

              <div className={`mt-3 sm:mt-5 rounded-2xl border p-3 sm:p-4 ${
                  cancelMotivo === 'CAMBIO_INSTRUCTOR'
                    ? 'border-amber-200 bg-amber-50/80 dark:border-amber-500/30 dark:bg-amber-500/10'
                    : 'border-border-light bg-surface/80'
                }`}>
                <div className="space-y-2 text-xs sm:text-sm">
                  {reservation.instructor_nombre && (
                    <div className={`flex justify-between gap-2 sm:gap-4 ${
                      cancelMotivo === 'CAMBIO_INSTRUCTOR' ? 'text-amber-800' : ''
                    }`}>
                      <span className="text-muted shrink-0">Instructor</span>
                      <span className="font-bold text-foreground text-right">{reservation.instructor_nombre || 'Instructor por asignar'}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <span className="text-muted shrink-0">Reserva</span>
                    <span className="font-bold text-foreground text-right">#{reservation.codigo_reserva}</span>
                  </div>
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <span className="text-muted shrink-0">Clase</span>
                    <span className="font-bold text-foreground text-right truncate max-w-[140px] sm:max-w-none">{reservation.className}</span>
                  </div>
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <span className="text-muted shrink-0">Fecha</span>
                    <span className="font-bold text-foreground text-right">{reservation.fecha_clase}</span>
                  </div>
                  {reservation.hora_inicio && (
                    <div className="flex justify-between gap-2 sm:gap-4">
                      <span className="text-muted shrink-0">Hora</span>
                      <span className="font-bold text-foreground text-right">{reservation.hora_inicio.slice(0, 5)}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <span className="text-muted shrink-0">Espacio</span>
                    <span className="font-bold text-brand-600 text-right">{reservation.codigo_espacio}</span>
                  </div>
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <span className="text-muted shrink-0">Monto</span>
                    <span className="font-bold text-foreground text-right">S/ {Number(reservation.monto).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-5">
                <label className="text-xs sm:text-sm font-bold text-foreground block mb-2 sm:mb-2.5">Motivo de cancelaci�n</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {motivosCancelacion.map((m) => (
                    <label
                      key={m.value}
                      className={`flex items-center gap-2 sm:gap-2.5 rounded-xl border-2 px-3 py-2 sm:px-3.5 sm:py-3 cursor-pointer transition-all duration-200 ${
                        cancelMotivo === m.value
                          ? 'border-brand-600 bg-primary/10 shadow-sm'
                          : 'border-border-light bg-card hover:border-border hover:bg-surface'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200 ${
                        cancelMotivo === m.value
                           ? 'border-brand-600'
                           : 'border-border'
                      }`}>
                        {cancelMotivo === m.value && (
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-600" />
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
                      <span className="text-xs sm:text-sm font-medium text-foreground leading-tight">{m.label}</span>
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
                    className="w-full rounded-xl border-2 border-border-light bg-card px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition-all duration-200 focus:border-brand-600 focus:ring-2 focus:ring-primary/20 resize-none text-foreground placeholder:text-muted"
                    rows={2}
                  />
                </div>
              )}

              <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={canceling}
                  className="flex-1 rounded-xl sm:rounded-2xl border-2 border-border-light py-3 sm:py-3.5 font-bold text-secondary text-xs sm:text-sm transition-all duration-200 hover:bg-surface hover:border-border active:scale-[0.98] disabled:opacity-60"
                >
                  Mantener reserva
                </button>
                <button
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
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Cancelar
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRefundModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md sm:p-6"
          onClick={(e) => { if (e.target === e.currentTarget && !refunding) setShowRefundModal(false); }}
        >
          <div
            className="w-full max-w-md rounded-[28px] bg-card shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="refund-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-300">
                  <Undo2 className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 id="refund-title" className="text-xl font-black text-foreground">Solicitar reembolso</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">
                  Deseas solicitar el reembolso de esta reserva? La solicitud sera revisada por un administrador.
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-border-light bg-surface p-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="shrink-0 text-muted">Reserva</span>
                  <span className="font-bold text-foreground">#{reservation.codigo_reserva}</span>
                </div>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="shrink-0 text-muted">Clase</span>
                  <span className="max-w-[210px] text-right font-bold text-foreground">{reservation.className}</span>
                </div>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="shrink-0 text-muted">Monto</span>
                  <span className="font-bold text-foreground">S/ {Number(reservation.monto).toFixed(2)}</span>
                </div>
              </div>

              {refundError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300" role="alert">
                  {refundError}
                </div>
              )}

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  disabled={refunding}
                  className="flex-1 rounded-2xl border border-border py-3 text-sm font-bold text-secondary transition hover:bg-surface disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRefundRequest}
                  disabled={refunding}
                  className="flex-1 rounded-2xl bg-orange-600 py-3 text-sm font-bold text-primary-foreground transition hover:bg-orange-700 disabled:opacity-60"
                >
                  {refunding ? 'Enviando...' : 'Confirmar solicitud'}
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
