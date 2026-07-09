import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Search, LogOut, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import React from 'react';
import { notificationService } from '../../services/notificationService.js';
import {
  AlarmClock, CreditCard, CheckCircle, Clock, User, Target,
  XCircle, DollarSign, Lock, ClipboardList, Trash2, Armchair, Megaphone
} from 'lucide-react';

const typeIcons = {
  RECORDATORIO: AlarmClock, PAGO: CreditCard, PAGO_CONFIRMADO: CheckCircle,
  CAMBIO_HORARIO: Clock, CAMBIO_INSTRUCTOR: User, NUEVA_CLASE: Target,
  CANCELACION: XCircle, REEMBOLSO: DollarSign, BLOQUEO_CUENTA: Lock,
  RESERVA_CONFIRMADA: ClipboardList, RESERVA_CANCELADA: Trash2,
  CAMBIO_ESPACIO: Armchair, NOTIFICACION_GENERAL: Megaphone,
};

const typeColors = {
  RECORDATORIO: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  PAGO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  PAGO_CONFIRMADO: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  CAMBIO_HORARIO: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  CAMBIO_INSTRUCTOR: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300',
  NUEVA_CLASE: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
  CANCELACION: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  REEMBOLSO: 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300',
  BLOQUEO_CUENTA: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
  RESERVA_CONFIRMADA: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
  RESERVA_CANCELADA: 'bg-border-light text-secondary dark:bg-surface dark:text-muted',
  CAMBIO_ESPACIO: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
  NOTIFICACION_GENERAL: 'bg-gray-100 text-gray-700 dark:bg-surface dark:text-secondary',
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

const NavbarAdmin = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState([]);
  const [notifPos, setNotifPos] = useState({ top: 0, right: 0 });
  const notifRef = useRef(null);
  const notifBtnRef = useRef(null);

  const fetchAll = useCallback(async () => {
    try {
      const data = await notificationService.getAllNotifications();
      setItems(data.slice(0, 5));
      const unreadCount = data.filter((n) => !n.read).length;
      setUnread(unreadCount);
    } catch {}
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationService.getUnreadCount();
      setUnread(res.count ?? 0);
    } catch {}
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  useEffect(() => {
    if (notifOpen) fetchAll();
  }, [notifOpen, fetchAll]);

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleMarkAllRead() {
    try {
      await notificationService.markAllAsRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      await fetchUnreadCount();
    } catch {}
  }

  async function handleMarkRead(id) {
    try {
      await notificationService.markAsRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      await fetchUnreadCount();
    } catch {}
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8 border-b border-transparent dark:border-border">
      {/* Left - Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-border-light rounded-lg transition-colors dark:hover:bg-card"
          aria-label="Abrir menú de navegación"
        >
          <Menu size={20} className="text-secondary dark:text-secondary" aria-hidden="true" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-border-light rounded-lg px-4 py-2 flex-1 max-w-xs ring-1 ring-transparent dark:bg-card dark:ring-border">
          <Search size={18} className="text-muted-foreground dark:text-muted" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar..."
            aria-label="Buscar en el panel de administración"
            className="bg-transparent border-none outline-none text-sm w-full text-secondary placeholder:text-muted-foreground dark:text-foreground dark:placeholder:text-muted"
          />
        </div>
      </div>

      {/* Right - Notifications & User */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            ref={notifBtnRef}
            onClick={() => {
              if (!notifOpen) {
                const rect = notifBtnRef.current?.getBoundingClientRect();
                if (rect) {
                  const rawRight = window.innerWidth - rect.right;
                  setNotifPos({
                    top: rect.bottom + 8,
                    right: window.innerWidth < 640 ? Math.min(rawRight, 16) : rawRight,
                  });
                }
              }
              setNotifOpen((prev) => !prev);
            }}
            className="relative p-2 hover:bg-border-light rounded-lg transition-colors dark:hover:bg-card"
            aria-label="Notificaciones"
          >
            <Bell size={20} className="text-secondary dark:text-secondary" aria-hidden="true" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-primary-foreground shadow">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {notifOpen && (
            <div style={{ position: 'fixed', top: notifPos.top, right: notifPos.right }} className="z-[9999] sm:left-auto sm:w-[380px] w-[calc(100vw-32px)] left-4 rounded-2xl border border-border-light bg-card shadow-xl dark:border-border dark:bg-card">
              <div className="flex items-center justify-between border-b border-border-light px-4 py-3 dark:border-border">
                <h3 className="text-sm font-bold text-foreground dark:text-foreground">Notificaciones</h3>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button onClick={handleMarkAllRead} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                      Marcar todo leído
                    </button>
                  )}
                  <button onClick={() => { setNotifOpen(false); }} className="text-xs font-semibold text-muted-foreground hover:text-secondary dark:text-muted dark:hover:text-muted-foreground">
                    Cerrar <X size={12} className="inline" />
                  </button>
                </div>
              </div>

              <div className="max-h-[50vh] sm:max-h-[360px] overflow-y-auto">
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
                        setNotifOpen(false);
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
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-2 hover:bg-border-light rounded-lg transition-colors dark:hover:bg-card"
            aria-label="Menú de usuario"
            aria-expanded={showDropdown}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <p className="text-sm font-medium text-foreground dark:text-foreground">{user?.name || 'Admin'}</p>
              <p className="text-xs text-muted dark:text-muted">Administrador</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 sm:static sm:absolute sm:left-auto sm:right-0 sm:top-full sm:translate-y-0 sm:mt-2 bg-card rounded-lg shadow-lg border border-border min-w-44 sm:min-w-48 z-50 dark:bg-card dark:border-border">
              <div className="p-4 border-b border-border dark:border-border">
                <p className="font-medium text-foreground dark:text-foreground">{user?.name}</p>
                <p className="text-sm text-secondary dark:text-muted">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors dark:text-red-300 dark:hover:bg-red-500/10"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarAdmin;
