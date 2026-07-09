import { createContext, useContext, useMemo, useState } from 'react';
import { CheckCircle, Info, X, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: {
    icon: CheckCircle,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  error: {
    icon: XCircle,
    className: 'border-red-200 bg-red-50 text-red-700',
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-700',
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const showToast = (message, type = 'info', duration = 3500) => {
    const id = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => removeToast(id), duration);
  };

  const value = useMemo(() => ({
    showToast,
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    info: (message, duration) => showToast(message, 'info', duration),
  }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6 sm:w-full">
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
          const Icon = style.icon;

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-bold shadow-lg backdrop-blur ${style.className}`}
              role="status"
            >
              <Icon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p className="min-w-0 flex-1 leading-5">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 opacity-60 transition hover:opacity-100"
                aria-label="Cerrar notificación"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
}
