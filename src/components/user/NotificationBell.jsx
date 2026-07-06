import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Bell, AlarmClock, CreditCard, CheckCircle, Clock, User, Target, XCircle, DollarSign, Lock, ClipboardList, Trash2, Armchair, Megaphone } from 'lucide-react';
import { notificationService } from '../../services/notificationService.js';

const typeIcons = {
  RECORDATORIO: AlarmClock, PAGO: CreditCard, PAGO_CONFIRMADO: CheckCircle,
  CAMBIO_HORARIO: Clock, CAMBIO_INSTRUCTOR: User, NUEVA_CLASE: Target,
  CANCELACION: XCircle, REEMBOLSO: DollarSign, BLOQUEO_CUENTA: Lock,
  RESERVA_CONFIRMADA: ClipboardList, RESERVA_CANCELADA: Trash2,
  CAMBIO_ESPACIO: Armchair, NOTIFICACION_GENERAL: Megaphone,
};

const typeColors = {
  RECORDATORIO: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300', PAGO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  PAGO_CONFIRMADO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  CAMBIO_HORARIO: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300', CAMBIO_INSTRUCTOR: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300',
  NUEVA_CLASE: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300', CANCELACION: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  REEMBOLSO: 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300', BLOQUEO_CUENTA: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
  RESERVA_CONFIRMADA: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300', RESERVA_CANCELADA: 'bg-border-light text-secondary dark:bg-surface dark:text-muted',
  CAMBIO_ESPACIO: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300', NOTIFICACION_GENERAL: 'bg-gray-100 text-gray-700 dark:bg-surface dark:text-secondary',
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

function NotificationBell({ floating }) {
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
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

  const dropdown = (
    <div className={`${
      floating
        ? 'fixed bottom-[5.5rem] right-5 sm:right-8'
        : ''
    } z-[9999] w-[calc(100vw-32px)] rounded-2xl border border-border-light bg-card shadow-xl sm:w-[380px] dark:border-border dark:bg-card`}
      style={!floating ? { position: 'fixed', top: dropdownPos.top, right: dropdownPos.right } : {}}
    >
      <div className="flex items-center justify-between border-b border-border-light px-4 py-3 dark:border-border">
        <h3 className="text-sm font-bold text-foreground dark:text-foreground">Notificaciones</h3>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button onClick={handleMarkAllRead} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              Marcar todo leído
            </button>
          )}
          <button onClick={() => { setOpen(false); navigate('/cliente/notificaciones'); }} className="text-xs font-semibold text-muted-foreground hover:text-secondary dark:text-muted dark:hover:text-muted-foreground">
            Ver todo
          </button>
        </div>
      </div>

      <div className="max-h-[360px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-muted-foreground dark:text-muted">
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
                navigate(n.reservationId ? `/cliente/reservas/${n.reservationId}` : '/cliente/notificaciones');
              }}
              className={`flex w-full gap-3 px-4 py-3 text-left transition hover:bg-surface dark:hover:bg-border/50 ${!n.read ? 'bg-brand-50/40 dark:bg-brand-500/10' : ''}`}
            >
              <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${typeColors[n.type] || 'bg-border-light text-secondary'}`}>
                {typeIcons[n.type] ? React.createElement(typeIcons[n.type], { size: 16 }) : <Bell size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm ${!n.read ? 'font-bold text-foreground dark:text-foreground' : 'text-secondary dark:text-muted-foreground'}`}>{n.title}</p>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted dark:text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-[10px] text-muted-foreground dark:text-muted">{formatTime(n.sentAt)}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  function handleToggle() {
    if (!floating && !open) {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        setDropdownPos({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right,
        });
      }
    }
    setOpen((prev) => !prev);
  }

  return (
    <div ref={menuRef} className={floating ? '' : 'relative'}>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`relative flex items-center justify-center rounded-full bg-card text-secondary shadow-lg ring-1 ring-border transition hover:ring-brand-200 dark:bg-card dark:text-muted-foreground dark:ring-border ${
          floating
            ? 'h-14 w-14 shadow-[0_8px_24px_rgba(0,0,0,0.15)]'
            : 'h-9 w-9 sm:h-10 sm:w-10 shadow-sm'
        }`}
        aria-label="Notificaciones"
      >
        <Bell size={floating ? 22 : 18} strokeWidth={2} />
        {unread > 0 && (
          <span className={`absolute flex items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-primary-foreground shadow ${
            floating ? '-right-1 -top-1 h-5 min-w-[20px]' : '-right-0.5 -top-0.5 h-4 min-w-[16px]'
          }`}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>
      {open && createPortal(dropdown, document.body)}
    </div>
  );
}

export default NotificationBell;
