import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { reservationService } from '../../services/reservationService.js';
import PageLoader from '../../components/common/PageLoader.jsx';
import {
  ArrowLeft, Calendar, Clock, MapPin, Wallet, CreditCard, Copy, QrCode,
  User, ChevronRight, CheckCircle, XCircle, Flag, AlertTriangle, Undo2, Search, Armchair
} from 'lucide-react';
import QRCode from 'react-qr-code';
import {
  puedeCancelarReserva,
  puedeCancelarSolicitudReembolso,
  puedeSolicitarReembolso,
} from '../../utils/reservationActions.js';
import { getPaymentStatusLabel, getReservationStatusLabel, getTemporalReservationLabel } from '../../utils/reservationPresentation.js';
import { getFriendlyErrorMessage } from '../../utils/userMessages.js';

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

function formatHistoryDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('es-PE', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('T')[0].split('-');
  if (!y || !m || !d) return dateStr;
  const weekday = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][new Date(y, m - 1, d).getDay()];
  const month = ['', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][parseInt(m)];
  return `${weekday}, ${parseInt(d)} de ${month} del ${y}`;
}

function getRemainingTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const normalizedTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  const target = new Date(`${dateStr}T${normalizedTime}`);
  if (Number.isNaN(target.getTime())) return null;
  const diffMs = target.getTime() - Date.now();
  if (diffMs < 0) return null;
  const totalMin = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const minutes = totalMin % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes} min`;
}

function getHeroGradient(status) {
  switch (status?.toUpperCase()) {
    case 'ACTIVA': return 'from-blue-600 to-cyan-500';
    case 'CANCELADA': return 'from-red-600 to-rose-500';
    case 'COMPLETADA':
    case 'FINALIZADA': return 'from-slate-600 to-slate-500';
    default: return 'from-amber-600 to-orange-500';
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
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

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [refundError, setRefundError] = useState('');
  const [refundSuccess, setRefundSuccess] = useState('');
  const [refundMotivo, setRefundMotivo] = useState('ECONOMICO');
  const [refundDetalle, setRefundDetalle] = useState('');
  const [showCancelRefundModal, setShowCancelRefundModal] = useState(false);
  const [cancelingRefundRequest, setCancelingRefundRequest] = useState(false);
  const [cancelRefundError, setCancelRefundError] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  const [remainingTime, setRemainingTime] = useState('');

  const motivosCancelacion = [
    { value: 'CAMBIO_HORARIO', label: 'Cambio de horario' },
    { value: 'CAMBIO_INSTRUCTOR', label: 'Cambio de instructor' },
    { value: 'SALUD', label: 'Problemas de salud' },
    { value: 'ECONOMICO', label: 'Motivo económico' },
    { value: 'OTRO', label: 'Otro motivo' },
  ];

  const isRefundPending = reservation?.estado_pago === 'REEMBOLSO_PENDIENTE';
  const canChangeSeat = reservation?.estado_reserva === 'ACTIVA';
  const canCancel = puedeCancelarReserva(reservation);
  const canRequestRefund = puedeSolicitarReembolso(reservation);
  const canCancelRefundRequest = puedeCancelarSolicitudReembolso(reservation);
  const canShowQR = reservation?.estado_reserva === 'ACTIVA' && (reservation?.estado_pago === 'PAGADO' || reservation?.estado_pago === 'CONFIRMADO') && reservation?.qr_checkin;
  const isCanceled = reservation?.estado_reserva === 'CANCELADA';
  const isCompleted = reservation?.estado_reserva === 'FINALIZADA' || reservation?.estado_reserva === 'COMPLETADA';
  const historialEstados = reservation?.historial_estados ?? [];
  const hasActions = canChangeSeat || canCancel || canRequestRefund || canCancelRefundRequest;

  useEffect(() => {
    reservationService
      .getMyReservationDetail(id)
      .then(setReservation)
      .catch((err) => setError(getFriendlyErrorMessage(err, 'No pudimos cargar el detalle de la reserva. Intenta nuevamente.')))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!reservation?.fecha_clase) return;
    const update = () => {
      const time = getRemainingTime(reservation.fecha_clase, reservation.hora_inicio);
      setRemainingTime(time || '');
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [reservation?.fecha_clase, reservation?.hora_inicio]);

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
      toast.success('Reserva anulada');
    } catch (err) {
      setShowCancelModal(false);
      toast.error(err?.message || 'Error al anular la reserva');
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
      const updated = await reservationService.requestRefund(id, refundMotivo, refundDetalle || null);
      setReservation(updated);
      setRefundSuccess('Solicitud de reembolso enviada. Será revisada por un administrador.');
      setShowRefundModal(false);
      toast.success('Solicitud de reembolso enviada');
    } catch (err) {
      setRefundError(err?.message || 'Error al solicitar el reembolso');
    } finally {
      setRefunding(false);
    }
  };

  const handleConfirmCancelRefundRequest = async () => {
    if (cancelingRefundRequest) return;
    setCancelRefundError('');
    setRefundSuccess('');
    setCancelingRefundRequest(true);
    try {
      const updated = await reservationService.cancelRefundRequest(id);
      setReservation(updated);
      setRefundSuccess('Solicitud anulada. Tu reserva continúa activa.');
      setShowCancelRefundModal(false);
      toast.success('Solicitud de reembolso anulada');
    } catch (err) {
      setCancelRefundError(err?.message || 'No pudimos anular la solicitud de reembolso. Inténtalo nuevamente.');
    } finally {
      setCancelingRefundRequest(false);
    }
  };

  if (loading) return <PageLoader text="Cargando información..." />;

  if (error) {
    return (
      <main className="min-h-dvh flex items-center justify-center p-4">
        <div className="text-center" role="alert">
          <AlertTriangle className="mx-auto h-10 w-10 text-red-400 mb-3" aria-hidden="true" />
          <p className="text-red-500 font-bold">{error}</p>
          <button onClick={() => navigate(-1)} className="mt-4 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-primary-foreground">Volver</button>
        </div>
      </main>
    );
  }

  if (!reservation) {
    return (
      <main className="min-h-dvh flex items-center justify-center p-4">
        <div className="text-center">
          <Search className="mx-auto h-10 w-10 text-muted mb-3" />
          <p className="text-secondary font-bold">Reserva no encontrada</p>
          <button onClick={() => navigate('/cliente/reservas')} className="mt-4 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-primary-foreground">Mis reservas</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-surface pb-40 md:pb-8">
      <div className="mx-auto max-w-3xl px-4 py-5 lg:max-w-5xl lg:px-6 lg:py-8">
        <button onClick={() => navigate('/cliente/reservas')} className="mb-4 flex items-center gap-2 text-sm font-bold text-secondary transition hover:text-foreground">
          <ArrowLeft size={18} />
          Mis reservas
        </button>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
          {/* Hero Card */}
          <motion.div variants={itemVariants}>
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getHeroGradient(reservation.estado_reserva)} p-6 text-white shadow-lg lg:p-8 lg:rounded-[32px]`}>
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-sm ${
                isCompleted
                  ? 'border-white/20 bg-white/10'
                  : isCanceled
                    ? 'border-white/20 bg-white/10'
                    : 'border-white/30 bg-white/20'
              }`}>
                <span className={`h-2 w-2 rounded-full ${isCompleted ? 'bg-white/60' : isCanceled ? 'bg-white/60' : 'bg-white'}`} />
                {getTemporalReservationLabel(reservation)}
              </span>

              <h1 className="mt-3 text-3xl font-black tracking-tight">{reservation.className}</h1>
              {reservation.instructor_nombre && (
                <p className="mt-1 text-white/80">con {reservation.instructor_nombre}</p>
              )}

              {remainingTime && (
                <div className="mt-4 inline-block rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
                  <p className="text-[11px] uppercase tracking-widest opacity-70">Empieza</p>
                  <p className="text-xl font-black">{remainingTime}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div variants={itemVariants}>
            <div className="divide-y divide-border-light rounded-3xl border border-border-light bg-card lg:rounded-[32px]">
              <InfoRow icon={Calendar} label="Fecha" value={formatDate(reservation.fecha_clase)} />
              <InfoRow icon={Clock} label="Hora" value={reservation.hora_inicio?.slice(0, 5)} />
              <InfoRow icon={MapPin} label="Espacio" value={reservation.codigo_espacio} highlight />
              <InfoRow icon={Wallet} label="Precio" value={`S/ ${Number(reservation.monto).toFixed(2)}`} />
              {reservation.metodo_pago && <InfoRow icon={CreditCard} label="Método de pago" value={reservation.metodo_pago} />}
            </div>
          </motion.div>

          {/* Payment deadline alert */}
          {reservation.estado_reserva === 'ACTIVA' && reservation.estado_pago === 'PENDIENTE' && reservation.fecha_limite_pago && (
            <motion.div variants={itemVariants} className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 dark:border-amber-500/30 dark:bg-amber-500/10">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">Fecha límite de pago</p>
              <p className="mt-0.5 font-bold text-amber-800 dark:text-amber-200">
                {formatDate(reservation.fecha_limite_pago)}
              </p>
            </motion.div>
          )}

          {/* Status messages */}
          {isCanceled && reservation.motivo_cancelacion && (
            <motion.div variants={itemVariants} className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-red-500">Motivo de anulación</p>
              <p className="mt-1 font-bold text-red-700">{MOTIVOS_LABEL[reservation.motivo_cancelacion] || reservation.motivo_cancelacion}</p>
              {reservation.detalle_cancelacion && <p className="mt-1 text-sm text-red-600">{reservation.detalle_cancelacion}</p>}
            </motion.div>
          )}

          {isCompleted && (
            <motion.div variants={itemVariants} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Asistencia</p>
              <p className="mt-1 font-bold text-emerald-700">Asististe a esta clase</p>
            </motion.div>
          )}

          {isRefundPending && (
            <motion.div variants={itemVariants} className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-500">Reembolso en revisión</p>
              <p className="mt-1 font-bold text-orange-700">Tu solicitud fue enviada al administrador.</p>
            </motion.div>
          )}

          {refundSuccess && (
            <motion.div variants={itemVariants} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4" role="status">
              <p className="font-bold text-emerald-700">{refundSuccess}</p>
            </motion.div>
          )}

          {/* QR Button */}
          {canShowQR && (
            <motion.div variants={itemVariants}>
              <button onClick={() => setShowQRModal(true)} className="flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50 px-5 py-4 font-bold text-purple-700 transition hover:bg-purple-100 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/20">
                <QrCode size={20} />
                Ver QR de ingreso
              </button>
            </motion.div>
          )}

          {/* Instructor Card */}
          {reservation.instructor_nombre && (
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-4 rounded-3xl border border-border-light bg-card p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-500/20 dark:to-blue-500/20">
                  <User size={24} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">Instructor</p>
                  <p className="truncate text-lg font-black text-foreground">{reservation.instructor_nombre}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Timeline */}
          <motion.div variants={itemVariants}>
            <div className="rounded-3xl border border-border-light bg-card p-5">
              <h3 className="text-lg font-black text-foreground">Historial</h3>
              {historialEstados.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface p-5 text-center text-sm text-muted">
                  Sin cambios registrados
                </div>
              ) : (
                <div className="mt-4 space-y-0">
                  {historialEstados.map((evento, index) => {
                    const EventIcon = HISTORIAL_ICON[evento.tipo_evento] || CheckCircle;
                    const isLast = index === historialEstados.length - 1;
                    return (
                      <motion.div
                        key={evento.id ?? `${evento.tipo_evento}-${index}`}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.06, duration: 0.3 }}
                        className="relative flex gap-4 pb-6 last:pb-0"
                      >
                        {!isLast && <span className="absolute left-[17px] top-9 h-full w-0.5 bg-border" />}
                        <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${getHistoryEventStyle(evento.tipo_evento)}`}>
                          <EventIcon size={16} />
                        </div>
                        <div className="min-w-0 flex-1 pt-1">
                          <p className="text-sm font-bold text-foreground">{evento.titulo || 'Cambio registrado'}</p>
                          {evento.descripcion && <p className="mt-0.5 text-xs text-muted">{evento.descripcion}</p>}
                          {evento.fecha_hora && <p className="mt-0.5 text-[11px] text-muted-foreground">{formatHistoryDate(evento.fecha_hora)}</p>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Code + Copy */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between rounded-3xl border border-border-light bg-card px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Código</p>
                <p className="mt-0.5 font-mono font-bold text-foreground">#{reservation.codigo_reserva}</p>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(reservation.codigo_reserva); toast.success('Código copiado'); }} className="flex items-center gap-1.5 rounded-xl border border-border-light bg-surface px-3.5 py-2 text-sm font-bold text-muted-foreground transition hover:bg-border-light">
                <Copy size={15} />
                Copiar
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Desktop inline actions */}
      {hasActions && (
        <div className="hidden md:block mx-auto max-w-3xl px-4 mt-2">
          <div className="flex flex-wrap gap-3">
            {canChangeSeat && (
              <button onClick={() => navigate(`/cliente/reservas/${reservation.id}/cambiar-asiento`)} className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-6 py-3 font-bold text-sm text-foreground transition hover:bg-border-light">
                <Armchair size={18} />
                Cambiar espacio
              </button>
            )}
            {canCancel && (
              <button onClick={() => { setCancelMotivo('OTRO'); setCancelDetalle(''); setShowCancelModal(true); }} className="flex items-center gap-2 rounded-2xl border-2 border-red-200 bg-red-50 px-6 py-3 font-bold text-sm text-red-500 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20">
                <XCircle size={18} />
                Anular reserva
              </button>
            )}
            {canRequestRefund && (
              <button onClick={() => { setRefundError(''); setRefundSuccess(''); setRefundMotivo('ECONOMICO'); setRefundDetalle(''); setShowRefundModal(true); }} className="flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-6 py-3 font-bold text-sm text-orange-600 transition hover:bg-orange-100 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300 dark:hover:bg-orange-500/20">
                <Undo2 size={18} />
                Solicitar reembolso
              </button>
            )}
            {canCancelRefundRequest && (
              <button onClick={() => { setCancelRefundError(''); setRefundSuccess(''); setShowCancelRefundModal(true); }} className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-3 font-bold text-sm text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20">
                <Clock size={18} />
                Anular solicitud de reembolso
              </button>
            )}
          </div>
        </div>
      )}

      {/* Fixed bottom bar - mobile */}
      {hasActions && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border-light bg-card px-4 py-3 md:hidden" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}>
          <div className="flex gap-3">
            {(canChangeSeat || canRequestRefund || canCancelRefundRequest) && (
              <div className="flex flex-1 flex-col gap-2">
                {canChangeSeat && (
                  <button onClick={() => navigate(`/cliente/reservas/${reservation.id}/cambiar-asiento`)} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3 text-sm font-bold text-foreground transition hover:bg-border-light">
                    <Armchair size={16} />
                    Cambiar espacio
                  </button>
                )}
                {canRequestRefund && (
                  <button onClick={() => { setRefundError(''); setRefundSuccess(''); setRefundMotivo('ECONOMICO'); setRefundDetalle(''); setShowRefundModal(true); }} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-100 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300 dark:hover:bg-orange-500/20">
                    <Undo2 size={16} />
                    Reembolso
                  </button>
                )}
                {canCancelRefundRequest && (
                  <button onClick={() => { setCancelRefundError(''); setRefundSuccess(''); setShowCancelRefundModal(true); }} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20">
                    <Clock size={16} />
                    Anular reembolso
                  </button>
                )}
              </div>
            )}
            {canCancel && (
              <button onClick={() => { setCancelMotivo('OTRO'); setCancelDetalle(''); setShowCancelModal(true); }} className="flex min-w-[120px] items-center justify-center gap-2 rounded-2xl border-2 border-red-200 bg-red-50 py-3 text-sm font-bold text-red-500 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20">
                <XCircle size={16} />
                Anular
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6" onClick={(e) => { if (e.target === e.currentTarget) setShowCancelModal(false); }}>
          <div className="w-full sm:max-w-md lg:max-w-lg rounded-[28px] bg-card shadow-2xl flex flex-col max-h-[90vh]" role="dialog" aria-modal="true" aria-labelledby="cancelar-reserva-title" onClick={(e) => e.stopPropagation()}>
            <div className="overflow-y-auto px-4 sm:px-6 py-4 sm:p-6">
              <div className="text-center">
                <div className="mx-auto mb-2 sm:mb-3 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100 shadow-inner dark:from-red-500/10 dark:to-red-500/20">
                  <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" aria-hidden="true" />
                </div>
                <h3 id="cancelar-reserva-title" className="text-lg sm:text-2xl font-black text-foreground">Anular reserva</h3>
                <p className="mt-1 text-xs sm:text-sm text-secondary leading-relaxed px-1">Esta acción liberará tu espacio. Selecciona el motivo de anulación.</p>
              </div>
              <div className={`mt-3 sm:mt-5 rounded-2xl border p-3 sm:p-4 ${cancelMotivo === 'CAMBIO_INSTRUCTOR' ? 'border-amber-200 bg-amber-50/80 dark:border-amber-500/30 dark:bg-amber-500/10' : 'border-border-light bg-surface/80'}`}>
                <div className="space-y-2 text-xs sm:text-sm">
                  {reservation.instructor_nombre && (
                    <div className={`flex justify-between gap-2 sm:gap-4 ${cancelMotivo === 'CAMBIO_INSTRUCTOR' ? 'text-amber-800' : ''}`}>
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
                <label className="text-xs sm:text-sm font-bold text-foreground block mb-2 sm:mb-2.5">Motivo de anulación</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {motivosCancelacion.map((m) => (
                    <label key={m.value} className={`flex items-center gap-2 sm:gap-2.5 rounded-xl border-2 px-3 py-2 sm:px-3.5 sm:py-3 cursor-pointer transition-all duration-200 ${cancelMotivo === m.value ? 'border-brand-600 bg-primary/10 shadow-sm' : 'border-border-light bg-card hover:border-border hover:bg-surface'}`}>
                      <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200 ${cancelMotivo === m.value ? 'border-brand-600' : 'border-border'}`}>
                        {cancelMotivo === m.value && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-600" />}
                      </div>
                      <input type="radio" name="detalleMotivo" value={m.value} checked={cancelMotivo === m.value} onChange={(e) => setCancelMotivo(e.target.value)} className="sr-only" />
                      <span className="text-xs sm:text-sm font-medium text-foreground leading-tight">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {cancelMotivo === 'OTRO' && (
                <div className="mt-2 sm:mt-3">
                  <textarea value={cancelDetalle} onChange={(e) => setCancelDetalle(e.target.value)} placeholder="Describe el motivo (opcional)..." className="w-full rounded-xl border-2 border-border-light bg-card px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition-all duration-200 focus:border-brand-600 focus:ring-2 focus:ring-primary/20 resize-none text-foreground placeholder:text-muted" rows={2} />
                </div>
              )}
              <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
                <button onClick={() => setShowCancelModal(false)} disabled={canceling} className="flex-1 rounded-xl sm:rounded-2xl border-2 border-border-light py-3 sm:py-3.5 font-bold text-secondary text-xs sm:text-sm transition-all duration-200 hover:bg-surface hover:border-border active:scale-[0.98] disabled:opacity-60">Mantener reserva</button>
                <button onClick={handleCancel} disabled={canceling} className="flex-1 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-500 to-red-600 py-3 sm:py-3.5 font-bold text-primary-foreground text-xs sm:text-sm transition-all duration-200 hover:from-red-600 hover:to-red-700 active:scale-[0.98] shadow-lg shadow-red-200 disabled:opacity-60">
                  {canceling ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Anulando...
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-1.5"><XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Anular</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md sm:p-6" onClick={(e) => { if (e.target === e.currentTarget && !refunding) setShowRefundModal(false); }}>
          <div className="w-full max-w-md lg:max-w-lg rounded-[28px] bg-card shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="refund-title" onClick={(e) => e.stopPropagation()}>
            <div className="max-h-[90vh] overflow-y-auto p-5 sm:p-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-300"><Undo2 className="h-7 w-7" aria-hidden="true" /></div>
                <h3 id="refund-title" className="text-xl font-black text-foreground">Solicitar reembolso</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">Selecciona el motivo del reembolso. La solicitud será revisada por un administrador.</p>
              </div>
              <div className="mt-4 rounded-2xl border border-border-light bg-surface p-4 text-sm">
                <div className="flex justify-between gap-3"><span className="shrink-0 text-muted">Reserva</span><span className="font-bold text-foreground">#{reservation.codigo_reserva}</span></div>
                <div className="mt-2 flex justify-between gap-3"><span className="shrink-0 text-muted">Clase</span><span className="max-w-[210px] text-right font-bold text-foreground">{reservation.className}</span></div>
                <div className="mt-2 flex justify-between gap-3"><span className="shrink-0 text-muted">Monto</span><span className="font-bold text-foreground">S/ {Number(reservation.monto).toFixed(2)}</span></div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-bold text-foreground block mb-2">Motivo del reembolso</label>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
                  {[{ value: 'CAMBIO_HORARIO', label: 'Cambio de horario' }, { value: 'SALUD', label: 'Problemas de salud' }, { value: 'ECONOMICO', label: 'Motivo económico' }, { value: 'OTRO', label: 'Otro motivo' }].map((m) => (
                    <label key={m.value} className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 cursor-pointer transition-all ${refundMotivo === m.value ? 'border-orange-500 bg-orange-50/50 shadow-sm' : 'border-border-light bg-card hover:border-border'}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${refundMotivo === m.value ? 'border-orange-500' : 'border-border'}`}>{refundMotivo === m.value && <div className="w-2 h-2 rounded-full bg-orange-500" />}</div>
                      <input type="radio" name="refundMotivo" value={m.value} checked={refundMotivo === m.value} onChange={(e) => setRefundMotivo(e.target.value)} className="sr-only" />
                      <span className="text-xs sm:text-sm font-medium text-foreground">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {refundMotivo === 'OTRO' && (
                <div className="mt-3">
                  <textarea value={refundDetalle} onChange={(e) => setRefundDetalle(e.target.value)} placeholder="Describe el motivo (opcional)..." className="w-full rounded-xl border-2 border-border-light bg-card px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none text-foreground placeholder:text-muted" rows={2} />
                </div>
              )}
              {refundError && <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300" role="alert">{refundError}</div>}
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => setShowRefundModal(false)} disabled={refunding} className="flex-1 rounded-2xl border border-border py-3 text-sm font-bold text-secondary transition hover:bg-surface disabled:opacity-60">Cancelar</button>
                <button type="button" onClick={handleConfirmRefundRequest} disabled={refunding} className="flex-1 rounded-2xl bg-orange-600 py-3 text-sm font-bold text-primary-foreground transition hover:bg-orange-700 disabled:opacity-60">{refunding ? 'Enviando...' : 'Confirmar solicitud'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Refund Modal */}
      {showCancelRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md sm:p-6" onClick={(e) => { if (e.target === e.currentTarget && !cancelingRefundRequest) setShowCancelRefundModal(false); }}>
          <div className="w-full max-w-md lg:max-w-lg rounded-[28px] bg-card shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="cancel-refund-title" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 sm:p-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300"><Clock className="h-7 w-7" aria-hidden="true" /></div>
                <h3 id="cancel-refund-title" className="text-xl font-black text-foreground">Anular solicitud de reembolso</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">¿Deseas anular la solicitud de reembolso? Tu reserva continuará activa y conservarás tu espacio.</p>
              </div>
              <div className="mt-4 rounded-2xl border border-border-light bg-surface p-4 text-sm">
                <div className="flex justify-between gap-3"><span className="shrink-0 text-muted">Reserva</span><span className="font-bold text-foreground">#{reservation.codigo_reserva}</span></div>
                <div className="mt-2 flex justify-between gap-3"><span className="shrink-0 text-muted">Clase</span><span className="max-w-[210px] text-right font-bold text-foreground">{reservation.className}</span></div>
                <div className="mt-2 flex justify-between gap-3"><span className="shrink-0 text-muted">Espacio</span><span className="font-bold text-brand-600">{reservation.codigo_espacio}</span></div>
              </div>
              {cancelRefundError && <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300" role="alert">{cancelRefundError}</div>}
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => setShowCancelRefundModal(false)} disabled={cancelingRefundRequest} className="flex-1 rounded-2xl border border-border py-3 text-sm font-bold text-secondary transition hover:bg-surface disabled:opacity-60">Mantener solicitud</button>
                <button type="button" onClick={handleConfirmCancelRefundRequest} disabled={cancelingRefundRequest} className="flex-1 rounded-2xl bg-amber-600 py-3 text-sm font-bold text-primary-foreground transition hover:bg-amber-700 disabled:opacity-60">{cancelingRefundRequest ? 'Anulando...' : 'Anular solicitud'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowQRModal(false); }}>
          <div className="w-full max-w-sm rounded-[28px] bg-card shadow-2xl p-6 text-center" role="dialog" aria-modal="true" aria-labelledby="qr-title" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-500/10">
              <QrCode size={24} className="text-purple-600 dark:text-purple-300" />
            </div>
            <h3 id="qr-title" className="text-xl font-black text-foreground">QR de ingreso</h3>
            <p className="mt-1 text-sm text-secondary mb-6">Muestra este código al ingresar al gimnasio.</p>
            <div className="mx-auto flex justify-center p-4 bg-white rounded-2xl shadow-inner w-fit">
              <QRCode value={reservation.qr_checkin} size={200} />
            </div>
            <p className="mt-4 text-[11px] text-muted-foreground">Reserva #{reservation.codigo_reserva}</p>
            <button onClick={() => setShowQRModal(false)} className="mt-6 w-full rounded-2xl bg-brand-600 py-3 font-bold text-primary-foreground transition hover:bg-brand-700">Cerrar</button>
          </div>
        </div>
      )}
    </main>
  );
}

function InfoRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 lg:gap-4 lg:px-6 lg:py-5">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl lg:h-10 lg:w-10 ${highlight ? 'bg-brand-50 text-brand-600' : 'bg-surface text-muted-foreground'}`}>
        <Icon size={17} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted lg:text-[13px]">{label}</p>
        <p className={`truncate font-bold ${highlight ? 'text-brand-600' : 'text-foreground'} lg:text-base`}>{value}</p>
      </div>
    </div>
  );
}

export default DetalleReserva;
