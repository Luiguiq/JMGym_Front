import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Check, Clock, MapPin, User,
  Wallet, ShieldCheck, ChevronRight, Dumbbell
} from 'lucide-react';
import { classService } from '../../services/classService.js';
import { reservationService } from '../../services/reservationService.js';
import yapeLogo from '../../assets/images/yapelogo.png';

const PAYMENT_METHODS = [
  {
    id: 'YAPE',
    name: 'Yape',
    desc: 'Pago inmediato desde tu celular',
    icon: <img src={yapeLogo} alt="Yape" className="h-8 w-8 object-contain" />,
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    ring: 'ring-purple-200 dark:ring-purple-500/30',
    text: 'text-purple-700 dark:text-purple-300',
  },
  {
    id: 'EFECTIVO',
    name: 'Efectivo',
    desc: 'Paga en recepción antes de la clase',
    icon: <Wallet size={24} className="text-emerald-600 dark:text-emerald-300" />,
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    ring: 'ring-emerald-200 dark:ring-emerald-500/30',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
];

function PagoClase() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const seatCode = location.state?.seatCode || 'Pendiente';
  const seatId = location.state?.seatId;

  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!seatId) { navigate(`/cliente/clases/${id}`); return; }
    classService.getClassById(id)
      .then(setClassInfo)
      .catch((err) => setError('Error al cargar la clase: ' + err.message))
      .finally(() => setLoading(false));
  }, [id, seatId, navigate]);

  const handleConfirm = async () => {
    setProcessing(true);
    setError('');
    try {
      await reservationService.createReservation({
        classId: Number(id),
        seatId: Number(seatId),
        paymentMethod: method,
      });
      navigate('/cliente/reservas', { replace: true });
    } catch (err) {
      setProcessing(false);
      const msg = err?.message || '';
      if (msg.includes('Ya tienes una reserva activa para esa fecha')) {
        setError('Ya tienes una clase reservada para esa fecha. Si deseas reservar esta clase, primero cancela la reserva anterior.');
        return;
      }
      setError(msg);
    }
  };

  const selectedMethod = PAYMENT_METHODS.find((pm) => pm.id === method);
  const isDisabled = !method || processing;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Cargando método de pago...</p>
        </div>
      </main>
    );
  }

  if (!classInfo) return null;

  return (
    <main className="min-h-dvh bg-surface pb-40 max-md:landscape:pb-6">
      <div className="mx-auto max-w-lg px-4 pt-5 sm:px-5 max-md:landscape:pt-3">

        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
          <button
            onClick={() => navigate(-1)}
            className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-secondary"
          >
            <ArrowLeft size={16} /> Método de pago
          </button>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-500/10 dark:text-red-300"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reservation summary */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-primary-foreground shadow-sm">
              <Dumbbell size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">{classInfo.name}</p>
              <div className="flex flex-wrap items-center gap-x-3 text-[12px] text-muted">
                <span className="inline-flex items-center gap-1"><User size={12} /> Prof. {classInfo.trainer}</span>
                <span className="inline-flex items-center gap-1"><Clock size={12} /> {classInfo.time}</span>
                <span className="inline-flex items-center gap-1"><MapPin size={12} /> {seatCode}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-3 rounded-2xl bg-primary/10 p-4 shadow-sm dark:border dark:border-primary/20 dark:bg-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">Total a pagar</p>
              <p className="text-3xl font-black text-foreground">S/ {Number(classInfo.price || 0).toFixed(2)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-sm">
              <Wallet size={22} className="text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <p className="mt-1 text-[12px] text-blue-500 dark:text-blue-300">Incluye registro, reserva y acceso a la clase</p>
        </motion.div>

        {/* Payment methods */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-5"
        >
          <p className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">Selecciona un método</p>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((pm, i) => {
              const selected = method === pm.id;
              const disabled = false;
              return (
                <motion.button
                  key={pm.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  whileTap={!disabled ? { scale: 0.98 } : {}}
                  whileHover={!disabled ? { scale: 1.01 } : {}}
                  onClick={() => !disabled && setMethod(pm.id)}
                  disabled={disabled}
                  className={`relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                    selected
                      ? 'border-blue-500 bg-primary/10 shadow-md dark:border-blue-400 dark:bg-primary/10'
                      : disabled
                        ? 'border-border-light bg-card opacity-50'
                        : 'border-border-light bg-card shadow-sm hover:border-border'
                  }`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${pm.bg} ring-1 ${pm.ring}`}>
                    {pm.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold ${selected ? 'text-blue-700 dark:text-blue-300' : 'text-foreground'}`}>{pm.name}</p>
                      {pm.badge && (
                        <span className="rounded-full bg-border px-2 py-[1px] text-[10px] font-bold text-muted">{pm.badge}</span>
                      )}
                    </div>
                    <p className={`text-[13px] ${selected ? 'text-blue-600 dark:text-blue-300' : 'text-muted'}`}>{pm.desc}</p>
                  </div>
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    selected ? 'scale-110 border-blue-600 bg-blue-600' : 'border-border'
                  }`}>
                    <AnimatePresence>
                      {selected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check size={14} className="text-primary-foreground" strokeWidth={3} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Trust */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 flex items-center gap-2 text-[12px] text-muted-foreground"
        >
          <ShieldCheck size={14} className="text-muted-foreground" />
          Pago seguro — tus datos están protegidos
        </motion.div>

        <div className="h-4" />
      </div>

      {/* ─── Fixed bottom bar ─── */}
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl border-t border-border-light bg-card/95 px-5 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-4 shadow-xl backdrop-blur-md sm:px-6 max-md:landscape:static max-md:landscape:mt-5 max-md:landscape:rounded-3xl max-md:landscape:border max-md:landscape:pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total</p>
            <p className="text-xl font-black text-blue-600">S/ {Number(classInfo.price || 0).toFixed(2)}</p>
          </div>
          <motion.button
            whileTap={isDisabled ? {} : { scale: 0.97 }}
            onClick={handleConfirm}
            disabled={isDisabled}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-sm transition ${
              isDisabled
                ? 'cursor-not-allowed bg-border text-muted-foreground'
                : 'bg-blue-600 text-primary-foreground shadow-[0_16px_36px_rgba(37,99,235,0.22)] hover:bg-blue-700'
            }`}
          >
            {processing
              ? 'Reservando...'
              : method
                ? `Pagar con ${selectedMethod?.name || method}`
                : 'Selecciona un método'}
            {!processing && method && <ChevronRight size={16} />}
          </motion.button>
        </div>
      </div>
    </main>
  );
}

export default PagoClase;
