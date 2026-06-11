import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Check, X, Eye } from 'lucide-react';
import { notificationService } from '../../services/notificationService.js';

const typeIcons = {
  RECORDATORIO: '⏰',
  PAGO: '💳',
  PAGO_CONFIRMADO: '✅',
  CAMBIO_HORARIO: '🕐',
  CAMBIO_INSTRUCTOR: '👤',
  NUEVA_CLASE: '🎯',
  CANCELACION: '❌',
  REEMBOLSO: '💵',
  BLOQUEO_CUENTA: '🔒',
  RESERVA_CONFIRMADA: '📋',
  RESERVA_CANCELADA: '🗑️',
  CAMBIO_ESPACIO: '🪑',
  NOTIFICACION_GENERAL: '📢',
};

const typeLabels = {
  RECORDATORIO: 'Recordatorio',
  PAGO: 'Pago',
  PAGO_CONFIRMADO: 'Pago confirmado',
  CAMBIO_HORARIO: 'Cambio de horario',
  CAMBIO_INSTRUCTOR: 'Cambio de instructor',
  NUEVA_CLASE: 'Nueva clase',
  CANCELACION: 'Cancelación',
  REEMBOLSO: 'Reembolso',
  BLOQUEO_CUENTA: 'Cuenta',
  RESERVA_CONFIRMADA: 'Reserva',
  RESERVA_CANCELADA: 'Reserva cancelada',
  CAMBIO_ESPACIO: 'Cambio de espacio',
  NOTIFICACION_GENERAL: 'Información',
};

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

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  async function handleMarkRead(id) {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
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
        prev.map((n) =>
          n.id === id
            ? { ...n, userResponse: respuesta, read: true }
            : n
        )
      );
    } catch {}
  }

  const filtered =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : filter === 'response'
        ? notifications.filter((n) => n.requiresResponse)
        : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbff] pb-28">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7fbff] pb-28">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:px-8 xl:max-w-4xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} strokeWidth={2} />
            </button>
            <h1 className="text-lg font-black text-slate-800 sm:text-xl">
              Notificaciones
            </h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                {unreadCount} nuevas
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-brand-50"
            >
              <Eye size={14} />
              Leer todo
            </button>
          )}
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto">
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
                  ? 'bg-[#004aab] text-white shadow'
                  : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 flex flex-col items-center text-slate-400">
            <Bell size={48} strokeWidth={1.5} />
            <p className="mt-3 text-sm font-medium">No hay notificaciones</p>
            <p className="text-xs">Aquí aparecerán tus notificaciones</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`rounded-2xl border p-4 transition ${
                  !n.read
                    ? 'border-brand-100 bg-white shadow-sm'
                    : 'border-slate-100 bg-white/70'
                }`}
              >
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                    {typeIcons[n.type] || '📬'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={`text-sm ${!n.read ? 'font-bold text-slate-800' : 'text-slate-600'}`}
                        >
                          {n.title}
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                          {typeLabels[n.type] || n.type}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {!n.read && (
                          <button
                            onClick={() => handleMarkRead(n.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
                            title="Marcar como leída"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {n.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400">
                        {formatDate(n.sentAt)}
                      </span>

                      {n.requiresResponse && !n.userResponse && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirmOverlay({ id: n.id, respuesta: 'ACEPTADO', title: n.title, message: n.message })}
                            className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            Aceptar cambio
                          </button>
                          <button
                            onClick={() => setConfirmOverlay({ id: n.id, respuesta: 'CANCELADO', title: n.title, message: n.message })}
                            className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-red-700 transition hover:bg-red-100"
                          >
                            Cancelar reserva
                          </button>
                        </div>
                      )}

                      {n.userResponse && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            n.userResponse === 'ACEPTADO'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {n.userResponse === 'ACEPTADO'
                            ? '✓ Cambio aceptado'
                            : '✗ Reserva cancelada'}
                        </span>
                      )}
                    </div>

                    {n.reservationId && (
                      <button
                        onClick={() => navigate(`/cliente/reservas/${n.reservationId}`)}
                        className="mt-2 text-xs font-semibold text-brand-600 hover:text-brand-700"
                      >
                        Ver reserva →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl lg:max-w-lg">
            <div className="text-center">
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
                confirmOverlay.respuesta === 'ACEPTADO'
                  ? 'bg-emerald-100'
                  : 'bg-amber-100'
              }`}>
                {confirmOverlay.respuesta === 'ACEPTADO' ? '✅' : '⚠️'}
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {confirmOverlay.respuesta === 'ACEPTADO'
                  ? '¿Aceptar el cambio?'
                  : '¿Cancelar la reserva?'}
              </h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                {confirmOverlay.respuesta === 'ACEPTADO'
                  ? 'Al aceptar el cambio, tu reserva se actualizará con la nueva información proporcionada por el administrador.'
                  : 'Al cancelar la reserva, el espacio quedará disponible para otros usuarios.'}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                {confirmOverlay.title}
              </p>
              <p className="text-sm text-slate-600">
                {confirmOverlay.message}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmOverlay(null)}
                disabled={responding}
                className="flex-1 rounded-2xl border border-slate-200 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
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
                className={`flex-1 rounded-2xl py-3 font-bold text-white transition disabled:opacity-60 ${
                  confirmOverlay.respuesta === 'ACEPTADO'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {responding
                  ? 'Procesando...'
                  : confirmOverlay.respuesta === 'ACEPTADO'
                    ? 'Sí, aceptar cambio'
                    : 'Sí, cancelar reserva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Hace ${days}d`;
  return d.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default Notificaciones;
