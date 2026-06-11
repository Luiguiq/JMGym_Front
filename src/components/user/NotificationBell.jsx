import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
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

const typeColors = {
  RECORDATORIO: 'bg-amber-100 text-amber-700',
  PAGO: 'bg-emerald-100 text-emerald-700',
  PAGO_CONFIRMADO: 'bg-emerald-100 text-emerald-700',
  CAMBIO_HORARIO: 'bg-blue-100 text-blue-700',
  CAMBIO_INSTRUCTOR: 'bg-purple-100 text-purple-700',
  NUEVA_CLASE: 'bg-rose-100 text-rose-700',
  CANCELACION: 'bg-red-100 text-red-700',
  REEMBOLSO: 'bg-teal-100 text-teal-700',
  BLOQUEO_CUENTA: 'bg-orange-100 text-orange-700',
  RESERVA_CONFIRMADA: 'bg-sky-100 text-sky-700',
  RESERVA_CANCELADA: 'bg-slate-100 text-slate-700',
  CAMBIO_ESPACIO: 'bg-indigo-100 text-indigo-700',
  NOTIFICACION_GENERAL: 'bg-gray-100 text-gray-700',
};

function formatTime(dateStr) {
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
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
}

function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const fetchUnread = useCallback(async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setUnread(res.count ?? 0);
    } catch {}
  }, []);

  const fetchRecent = useCallback(async () => {
    try {
      const data = await notificationService.getMyNotifications();
      setItems(data.slice(0, 5));
      const unreadCount = data.filter((n) => !n.read).length;
      setUnread(unreadCount);
    } catch {}
  }, []);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  useEffect(() => {
    if (open) fetchRecent();
  }, [open, fetchRecent]);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleMarkAllRead() {
    try {
      await notificationService.markAllAsRead();
      setUnread(0);
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  }

  async function handleMarkRead(id) {
    try {
      await notificationService.markAsRead(id);
      setUnread((prev) => Math.max(0, prev - 1));
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {}
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-white hover:ring-brand-200 sm:h-10 sm:w-10"
        aria-label="Notificaciones"
      >
        <Bell size={18} strokeWidth={2} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-32px)] rounded-2xl border border-slate-100 bg-white shadow-xl sm:w-[380px]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-bold text-slate-800">Notificaciones</h3>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Marcar todo leído
                </button>
              )}
              <button
                onClick={() => { setOpen(false); navigate('/cliente/notificaciones'); }}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Ver todo
              </button>
            </div>
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-slate-400">
                <Bell size={32} strokeWidth={1.5} />
                <p className="mt-2 text-sm">Sin notificaciones</p>
              </div>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    if (!n.read) handleMarkRead(n.id);
                    setOpen(false);
                    if (n.reservationId) {
                      navigate(`/cliente/reservas/${n.reservationId}`);
                    } else {
                      navigate('/cliente/notificaciones');
                    }
                  }}
                  className={`flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${!n.read ? 'bg-brand-50/40' : ''}`}
                >
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${typeColors[n.type] || 'bg-slate-100 text-slate-600'}`}>
                    {typeIcons[n.type] || '📬'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!n.read ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
                        {n.title}
                      </p>
                      {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{n.message}</p>
                    <p className="mt-1 text-[10px] text-slate-400">{formatTime(n.sentAt)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
