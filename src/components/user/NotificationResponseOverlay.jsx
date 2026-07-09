import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Check } from 'lucide-react';
import { notificationService } from '../../services/notificationService.js';

function NotificationResponseOverlay() {
  const [pending, setPending] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkPending = useCallback(async () => {
    try {
      const all = await notificationService.getMyNotifications();
      const needsResponse = all.find(
        (n) => n.requiresResponse && !n.userResponse
      );
      if (needsResponse && !pending) {
        setPending(needsResponse);
      } else if (!needsResponse && pending) {
        setPending(null);
      }
    } catch {}
  }, [pending]);

  useEffect(() => {
    checkPending();
    const interval = setInterval(checkPending, 15000);
    return () => clearInterval(interval);
  }, [checkPending]);

  const handleRespond = async (respuesta, redirectTo) => {
    if (!pending) return;
    setLoading(true);
    try {
      await notificationService.respondToNotification(pending.id, respuesta);
      setPending(null);
      if (redirectTo) navigate(redirectTo);
    } catch {
      setLoading(false);
    }
  };

  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[28px] bg-card shadow-2xl overflow-hidden animate-in dark:bg-card">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl dark:bg-amber-900/50">
            <AlertTriangle size={32} className="text-amber-600 dark:text-amber-400" />
          </div>

          <h2 className="text-xl font-black text-foreground dark:text-foreground">{pending.title}</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed dark:text-muted-foreground">{pending.message}</p>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => handleRespond('ACEPTADO')}
              disabled={loading}
              className="w-full rounded-2xl bg-primary py-3.5 font-bold text-sm text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : <><Check size={16} className="inline" /> Aceptar cambios</>}
            </button>

            <button
              onClick={() => handleRespond('CANCELADO', '/cliente/clases')}
              disabled={loading}
              className="w-full rounded-2xl border border-border py-3.5 font-bold text-sm text-secondary transition hover:bg-surface disabled:opacity-50 dark:border-border dark:text-muted-foreground dark:hover:bg-border"
            >
              Elegir otra clase disponible
            </button>

            <button
              onClick={() => handleRespond('CANCELADO', '/cliente/reservas')}
              disabled={loading}
              className="w-full rounded-2xl bg-red-50 py-3.5 font-bold text-sm text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
            >
              Anular reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationResponseOverlay;
