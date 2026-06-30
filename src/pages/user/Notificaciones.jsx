import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Bell, Check, X, Eye, AlarmClock, CreditCard,
  CheckCircle, Clock, User, DollarSign, Lock, ClipboardList,
  Trash2, Armchair, Megaphone, Mail, AlertTriangle, XCircle,
  Target
} from 'lucide-react';
import { notificationService } from '../../services/notificationService.js';

const typeIcons = {
  RECORDATORIO: AlarmClock,
  PAGO: CreditCard,
  PAGO_CONFIRMADO: CheckCircle,
  CAMBIO_HORARIO: Clock,
  CAMBIO_INSTRUCTOR: User,
  NUEVA_CLASE: Target,
  CANCELACION: XCircle,
  REEMBOLSO: DollarSign,
  BLOQUEO_CUENTA: Lock,
  RESERVA_CONFIRMADA: ClipboardList,
  RESERVA_CANCELADA: Trash2,
  CAMBIO_ESPACIO: Armchair,
  NOTIFICACION_GENERAL: Megaphone,
};

const typeLabels = {
  RECORDATORIO: 'Recordatorio', PAGO: 'Pago', PAGO_CONFIRMADO: 'Pago confirmado',
  CAMBIO_HORARIO: 'Cambio de horario', CAMBIO_INSTRUCTOR: 'Cambio de instructor',
  NUEVA_CLASE: 'Nueva clase', CANCELACION: 'Cancelación', REEMBOLSO: 'Reembolso',
  BLOQUEO_CUENTA: 'Cuenta', RESERVA_CONFIRMADA: 'Reserva', RESERVA_CANCELADA: 'Reserva cancelada',
  CAMBIO_ESPACIO: 'Cambio de espacio', NOTIFICACION_GENERAL: 'Información',
};

const TYPE_COLORS = {
  RECORDATORIO: 'bg-amber-50 text-amber-600',
  PAGO: 'bg-blue-50 text-blue-600',
  PAGO_CONFIRMADO: 'bg-emerald-50 text-emerald-600',
  CAMBIO_HORARIO: 'bg-purple-50 text-purple-600',
  CAMBIO_INSTRUCTOR: 'bg-cyan-50 text-cyan-600',
  NUEVA_CLASE: 'bg-rose-50 text-rose-600',
  CANCELACION: 'bg-red-50 text-red-600',
  REEMBOLSO: 'bg-teal-50 text-teal-600',
  BLOQUEO_CUENTA: 'bg-orange-50 text-orange-600',
  RESERVA_CONFIRMADA: 'bg-emerald-50 text-emerald-600',
  RESERVA_CANCELADA: 'bg-red-50 text-red-600',
  CAMBIO_ESPACIO: 'bg-indigo-50 text-indigo-600',
  NOTIFICACION_GENERAL: 'bg-surface text-secondary',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const mins = Math.floor((now - d) / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days}d`;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function Notificaciones() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [confirmOverlay, setConfirmOverlay] = useState(null);
  const [responding, setResponding] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  async function handleMarkRead(id) {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {}
  }

  async function handleMarkAllRead() {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  }

  async function handleRespond(id, respuesta) {
    try {
      await notificationService.respondToNotification(id, respuesta);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, userResponse: respuesta, read: true } : n))
      );
    } catch {}
  }

  const filtered = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : filter === 'response'
      ? notifications.filter((n) => n.requiresResponse)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface pb-28">
      <div className="mx-auto max-w-lg px-4 pt-5 sm:px-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-secondary shadow-sm transition hover:bg-surface"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-lg font-bold text-foreground">Notificaciones</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50"
            >
              <Eye size={14} /> Leer todo
            </button>
          )}
        </motion.div>

        {/* Filter chips */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex gap-2 overflow-x-auto"
        >
          {[
            { key: 'all', label: 'Todas' },
            { key: 'unread', label: 'No leídas' },
            { key: 'response', label: 'Requieren respuesta' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition ${
                filter === key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-card text-muted shadow-sm hover:bg-surface'
              }`}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {/* List */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex flex-col items-center gap-3 py-16 text-center"
          >
            <Bell size={48} className="text-muted" />
            <p className="font-bold text-muted">No hay notificaciones</p>
            <p className="text-sm text-muted-foreground">Aquí aparecerán tus notificaciones</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5">
            <AnimatePresence>
              {filtered.map((n, i) => {
                const Icon = typeIcons[n.type] || Mail;
                const colors = TYPE_COLORS[n.type] || 'bg-surface text-secondary';
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`rounded-2xl border p-4 transition ${
                      !n.read ? 'border-blue-100 bg-card shadow-sm' : 'border-border-light bg-card/60'
                    }`}
                  >
                    <div className="flex gap-3">
                      <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors}`}>
                        <Icon size={20} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm ${!n.read ? 'font-bold text-foreground' : 'text-secondary'}`}>
                              {n.title}
                            </p>
                            <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">
                              {typeLabels[n.type] || n.type}
                            </p>
                          </div>
                          {!n.read && (
                            <button
                              onClick={() => handleMarkRead(n.id)}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-blue-50 hover:text-blue-600"
                              title="Marcar como leída"
                            >
                              <Check size={14} />
                            </button>
                          )}
                        </div>

                        <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                          {n.message}
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-muted-foreground">{formatDate(n.sentAt)}</span>

                          {n.requiresResponse && !n.userResponse && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => setConfirmOverlay({ id: n.id, respuesta: 'ACEPTADO', title: n.title, message: n.message })}
                                className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-100"
                              >
                                Aceptar
                              </button>
                              <button
                                onClick={() => setConfirmOverlay({ id: n.id, respuesta: 'CANCELADO', title: n.title, message: n.message })}
                                className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-red-700 transition hover:bg-red-100"
                              >
                                Cancelar
                              </button>
                            </div>
                          )}

                          {n.userResponse && (
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              n.userResponse === 'ACEPTADO' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {n.userResponse === 'ACEPTADO' ? <Check size={12} /> : <X size={12} />}
                              {n.userResponse === 'ACEPTADO' ? 'Aceptado' : 'Cancelado'}
                            </span>
                          )}
                        </div>

                        {n.reservationId && (
                          <button
                            onClick={() => navigate(`/cliente/reservas/${n.reservationId}`)}
                            className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
                          >
                            Ver reserva →
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Confirm overlay */}
      <AnimatePresence>
        {confirmOverlay && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setConfirmOverlay(null)}
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-6 top-1/2 z-50 -translate-y-1/2 rounded-3xl bg-card p-6 shadow-xl"
            >
              <div className="text-center">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
                  confirmOverlay.respuesta === 'ACEPTADO' ? 'bg-emerald-100' : 'bg-amber-100'
                }`}>
                  {confirmOverlay.respuesta === 'ACEPTADO'
                    ? <CheckCircle size={28} className="text-emerald-600" />
                    : <AlertTriangle size={28} className="text-amber-600" />}
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {confirmOverlay.respuesta === 'ACEPTADO' ? '¿Aceptar el cambio?' : '¿Cancelar la reserva?'}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {confirmOverlay.respuesta === 'ACEPTADO'
                    ? 'Tu reserva se actualizará con la nueva información.'
                    : 'El espacio quedará disponible para otros usuarios.'}
                </p>
              </div>
              <div className="mt-4 rounded-2xl bg-surface p-4">
                <p className="text-xs font-bold text-muted">{confirmOverlay.title}</p>
                <p className="mt-1 text-sm text-secondary">{confirmOverlay.message}</p>
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setConfirmOverlay(null)}
                  disabled={responding}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold text-secondary transition hover:bg-surface disabled:opacity-50"
                >
                  Volver
                </button>
                <button
                  onClick={async () => {
                    setResponding(true);
                    await handleRespond(confirmOverlay.id, confirmOverlay.respuesta);
                    setResponding(false);
                    setConfirmOverlay(null);
                  }}
                  disabled={responding}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition disabled:opacity-50 ${
                    confirmOverlay.respuesta === 'ACEPTADO' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {responding ? 'Procesando...' : confirmOverlay.respuesta === 'ACEPTADO' ? 'Sí, aceptar' : 'Sí, cancelar'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

export default Notificaciones;