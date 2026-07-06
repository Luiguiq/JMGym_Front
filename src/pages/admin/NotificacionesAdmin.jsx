import React, { useEffect, useState } from 'react';
import { Bell, Send, Users, Calendar, AlarmClock, CreditCard, CheckCircle, Clock, User, Target, XCircle, DollarSign, Lock, ClipboardList, Trash2, Armchair, Megaphone, Check } from 'lucide-react';
import { notificationService } from '../../services/notificationService.js';
import { classService } from '../../services/classService.js';
import { userService } from '../../services/userService.js';

const typeIcons = {
  RECORDATORIO: AlarmClock, PAGO: CreditCard, PAGO_CONFIRMADO: CheckCircle,
  CAMBIO_HORARIO: Clock, CAMBIO_INSTRUCTOR: User, NUEVA_CLASE: Target,
  CANCELACION: XCircle, REEMBOLSO: DollarSign, BLOQUEO_CUENTA: Lock,
  RESERVA_CONFIRMADA: ClipboardList, RESERVA_CANCELADA: Trash2,
  CAMBIO_ESPACIO: Armchair, NOTIFICACION_GENERAL: Megaphone,
};

const tipoOptions = [
  { value: 'NOTIFICACION_GENERAL', label: 'General' },
  { value: 'RECORDATORIO', label: 'Recordatorio' },
  { value: 'NUEVA_CLASE', label: 'Nueva clase' },
  { value: 'CANCELACION', label: 'Cancelación' },
  { value: 'CAMBIO_HORARIO', label: 'Cambio de horario' },
  { value: 'CAMBIO_INSTRUCTOR', label: 'Cambio de instructor' },
];

function NotificacionesAdmin() {
  const [tab, setTab] = useState('send');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState('NOTIFICACION_GENERAL');
  const [target, setTarget] = useState('all');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    classService.getAllForAdmin().then(setClasses).catch(() => {});
    userService.getAll().then(setUsers).catch(() => {});
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const data = await notificationService.getAllNotifications();
      setNotifications(data);
    } catch {} finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!titulo.trim() || !mensaje.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const payload = {
        titulo: titulo.trim(),
        mensaje: mensaje.trim(),
        tipo,
        all_users: target === 'all',
        user_ids: target === 'user' && selectedUserId ? [parseInt(selectedUserId)] : null,
        class_id: target === 'class' && selectedClassId ? parseInt(selectedClassId) : null,
      };
      const res = await notificationService.sendNotification(payload);
      setResult(res);
      setTitulo('');
      setMensaje('');
      loadNotifications();
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-black text-foreground sm:text-2xl">Notificaciones</h1>
        <p className="mt-1 text-sm text-muted">Gestiona y envía notificaciones a los usuarios</p>
      </div>

      <div className="mb-6 flex gap-2">
        {[
          { key: 'send', label: 'Enviar', icon: Send },
          { key: 'history', label: 'Historial', icon: Bell },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
              tab === key
                ? 'bg-primary text-primary-foreground shadow'
                : 'bg-card text-secondary ring-1 ring-border hover:bg-surface'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'send' ? (
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border-light sm:p-6">
          <h2 className="mb-4 text-base font-bold text-foreground">Nueva notificación</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-secondary">Tipo</label>
              <div className="flex flex-wrap gap-2">
                {tipoOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setTipo(value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      tipo === value
                        ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-300 dark:bg-primary/15 dark:text-blue-300 dark:ring-primary/30'
                        : 'bg-surface text-muted ring-1 ring-border hover:bg-border-light dark:text-secondary dark:hover:bg-card'
                    }`}
                  >
                    {typeIcons[value] ? React.createElement(typeIcons[value], { size: 14 }) : <Megaphone size={14} />} {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-secondary">Destinatarios</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'Todos los usuarios', icon: Users },
                  { value: 'class', label: 'Usuarios de una clase', icon: Calendar },
                  { value: 'user', label: 'Usuario específico', icon: Users },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTarget(value)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      target === value
                        ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-300 dark:bg-primary/15 dark:text-blue-300 dark:ring-primary/30'
                        : 'bg-surface text-muted ring-1 ring-border hover:bg-border-light dark:text-secondary dark:hover:bg-card'
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>

              {target === 'class' && (
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="mt-2 w-full rounded-xl border-0 bg-surface px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-brand-300"
                >
                  <option value="">Seleccionar clase...</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.fecha}
                    </option>
                  ))}
                </select>
              )}

              {target === 'user' && (
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="mt-2 w-full rounded-xl border-0 bg-surface px-3 py-2 text-sm ring-1 ring-border focus:ring-2 focus:ring-brand-300"
                >
                  <option value="">Seleccionar usuario...</option>
                  {users.map((u) => (
                    <option key={u.id_usuario} value={u.id_usuario}>
                      {u.nombre_completo} - {u.correo}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-secondary">Título</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Recordatorio importante"
                className="w-full rounded-xl border-0 bg-surface px-3 py-2.5 text-sm ring-1 ring-border focus:ring-2 focus:ring-brand-300"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-secondary">Mensaje</label>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                rows={3}
                placeholder="Escribe el mensaje de la notificación..."
                className="w-full rounded-xl border-0 bg-surface px-3 py-2.5 text-sm ring-1 ring-border focus:ring-2 focus:ring-brand-300"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!titulo.trim() || !mensaje.trim() || sending}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <Send size={16} />
              )}
              {sending ? 'Enviando...' : 'Enviar notificación'}
            </button>

            {result && (
              <div
                className={`rounded-xl p-3 text-sm font-medium ${
                  result.error
                    ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                }`}
              >
                {result.error || result.message}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border-light sm:p-6">
          <h2 className="mb-4 text-base font-bold text-foreground">Historial de notificaciones</h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-muted-foreground">
              <Bell size={36} strokeWidth={1.5} />
              <p className="mt-2 text-sm">Sin notificaciones enviadas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0, 100).map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 rounded-xl bg-surface p-3 transition hover:bg-border-light dark:hover:bg-card"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card text-base shadow-sm">
                    {typeIcons[n.type] ? React.createElement(typeIcons[n.type], { size: 16 }) : <Bell size={16} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-secondary">{n.title}</p>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(n.sentAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted">
                      {n.message}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>Usuario #{n.userId}</span>
                       <span><Check size={12} className="inline" /> {n.read ? 'Leído' : 'No leído'}</span>
                      {n.requiresResponse && (
                        <span>
                          {n.userResponse
                            ? `Resp: ${n.userResponse}`
                            : 'Pendiente respuesta'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default NotificacionesAdmin;
