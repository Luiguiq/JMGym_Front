import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Check, Clock, MapPin, User,
  Wallet, ShieldCheck, ChevronRight, Dumbbell,
  Smartphone, KeyRound, Loader2, AlertCircle,
  Phone, CreditCard,
} from 'lucide-react';
import { classService } from '../../services/classService.js';
import { reservationService } from '../../services/reservationService.js';
import { paymentService } from '../../services/paymentService.js';
import { fidelizacionService } from '../../services/fidelizacionService.js';
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

const STEPS = ['phone', 'connecting', 'code', 'verifying', 'result'];

function PagoClase() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const seatCode = location.state?.seatCode || 'Pendiente';
  const seatId = location.state?.seatId;

  const [classInfo, setClassInfo] = useState(null);
  const [fidelizacion, setFidelizacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const [yapeStep, setYapeStep] = useState(null);
  const [yapePhone, setYapePhone] = useState('');
  const [yapeCode, setYapeCode] = useState('');
  const [yapeId, setYapeId] = useState(null);
  const [yapeError, setYapeError] = useState('');

  useEffect(() => {
    if (!seatId) { navigate(`/cliente/clases/${id}`); return; }
    Promise.all([
      classService.getClassById(id),
      fidelizacionService.getMiFidelizacion().catch(() => null),
    ])
      .then(([cls, fid]) => {
        setClassInfo(cls);
        setFidelizacion(fid);
      })
      .catch((err) => setError('Error al cargar la clase: ' + err.message))
      .finally(() => setLoading(false));
  }, [id, seatId, navigate]);

  const resetYape = () => {
    setYapeStep(null);
    setYapePhone('');
    setYapeCode('');
    setYapeId(null);
    setYapeError('');
  };

  const handleConfirm = async () => {
    if (method === 'YAPE') {
      setYapeStep('phone');
      return;
    }

    setProcessing(true);
    setError('');
    try {
      const reservation = await reservationService.createReservation({
        classId: Number(id),
        seatId: Number(seatId),
        paymentMethod: method,
      });
      navigate(`/cliente/reservas/${reservation.id}`, { replace: true });
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

  const handlePhoneSubmit = async () => {
    const clean = yapePhone.replace(/\s/g, '');
    if (clean.length !== 9 || !/^9\d{8}$/.test(clean)) {
      setYapeError('Ingresa un número válido de 9 dígitos (ej: 987654321)');
      return;
    }
    setYapeError('');
    setYapeStep('connecting');

    try {
      const res = await paymentService.initiateYape({
        celular: clean,
        id_clase: Number(id),
        id_espacio: Number(seatId),
        monto: precioBase,
      });
      setYapeId(res.id_yape_pago);
      await new Promise((r) => setTimeout(r, 1500));
      setYapeStep('code');
    } catch (err) {
      setYapeError(err.message || 'Error al conectar con Yape');
      setYapeStep('phone');
    }
  };

  const handleCodeSubmit = async () => {
    const clean = yapeCode.trim();
    if (clean.length !== 6 || !/^\d{6}$/.test(clean)) {
      setYapeError('Ingresa un código de 6 dígitos');
      return;
    }
    setYapeError('');
    setYapeStep('verifying');

    try {
      const res = await paymentService.confirmYape({
        id_yape_pago: yapeId,
        codigo: clean,
      });
      await new Promise((r) => setTimeout(r, 1500));

      if (res.estado === 'APROBADO') {
        setYapeStep('result');
        setTimeout(() => navigate(`/cliente/reservas/${res.id_reserva}`, { replace: true }), 2000);
      } else {
        setYapeError(res.mensaje || 'Pago rechazado. Intenta nuevamente.');
        setYapeStep('code');
      }
    } catch (err) {
      setYapeError(err.message || 'Error al confirmar el pago');
      setYapeStep('code');
    }
  };

  const descuentoPct = fidelizacion?.descuento_porcentaje || 0;
  const precioBase = Number(classInfo.price || 0);
  const precioFinal = descuentoPct > 0 ? Math.round(precioBase * (100 - descuentoPct)) / 100 : precioBase;

  const selectedMethod = PAYMENT_METHODS.find((pm) => pm.id === method);
  const isDisabled = !method || processing || yapeStep !== null;

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

  const yapeFlowContent = (
    <motion.div
      key={yapeStep}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-5 space-y-5"
    >
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        {[{ s: 'phone', n: 1 }, { s: 'code', n: 2 }, { s: 'result', n: 3 }].map((step, i) => {
          const done = STEPS.indexOf(yapeStep) > STEPS.indexOf(step.s);
          const current = yapeStep === step.s || (step.s === 'code' && yapeStep === 'connecting') || (step.s === 'result' && (yapeStep === 'verifying' || yapeStep === 'result'));
          return (
            <div key={step.s} className="flex items-center gap-2">
              {i > 0 && <div className={`h-px w-8 ${done ? 'bg-purple-500' : 'bg-border-light'}`} />}
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                done
                  ? 'bg-purple-500 text-white'
                  : current
                    ? 'border-2 border-purple-500 bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300'
                    : 'border-2 border-border-light text-muted'
              }`}>
                {done ? <Check size={14} strokeWidth={3} /> : step.n}
              </div>
            </div>
          );
        })}
      </div>

      {/* Phone step */}
      {yapeStep === 'phone' && (
        <div className="rounded-2xl border-2 border-purple-100 bg-card p-6 shadow-sm dark:border-purple-500/20 dark:bg-card">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-500/10">
            <Smartphone size={28} className="text-purple-600 dark:text-purple-300" />
          </div>
          <h3 className="text-center text-xl font-bold text-foreground">Ingresa tu número Yape</h3>
          <p className="mt-1 text-center text-sm text-muted">El número de celular asociado a tu cuenta Yape.</p>

          {yapeError && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{yapeError}</div>
          )}

          <div className="mt-5">
            <label className="grid gap-2 font-semibold text-foreground">
              Número de celular
              <div className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-brand-100 bg-card px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)] dark:border-border dark:bg-surface">
                <span aria-hidden="true"><Phone size={20} className="text-muted" /></span>
                <input
                  className="w-full bg-transparent text-lg font-bold tracking-widest text-foreground outline-none placeholder:text-muted"
                  type="tel"
                  inputMode="numeric"
                  placeholder="987 654 321"
                  maxLength={9}
                  value={yapePhone}
                  onChange={(e) => setYapePhone(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>
            </label>
          </div>

          <button
            onClick={handlePhoneSubmit}
            disabled={yapePhone.length !== 9}
            className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 font-bold text-white shadow-lg shadow-purple-500/25 transition hover:from-purple-700 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continuar
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Connecting step */}
      {yapeStep === 'connecting' && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-purple-100 bg-card p-10 shadow-sm dark:border-purple-500/20 dark:bg-card">
          <div className="relative mb-6">
            <div className="h-20 w-20 animate-spin rounded-full border-[3px] border-purple-100 border-t-purple-500 dark:border-purple-500/20 dark:border-t-purple-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Smartphone size={28} className="text-purple-500" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-foreground">Conectando con Yape...</h3>
          <p className="mt-1 text-sm text-muted">Esto tomará solo unos segundos.</p>
        </div>
      )}

      {/* Code step */}
      {yapeStep === 'code' && (
        <div className="rounded-2xl border-2 border-purple-100 bg-card p-6 shadow-sm dark:border-purple-500/20 dark:bg-card">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-500/10">
            <KeyRound size={28} className="text-purple-600 dark:text-purple-300" />
          </div>
          <h3 className="text-center text-xl font-bold text-foreground">Código de confirmación</h3>
          <p className="mt-1 text-center text-sm text-muted">
            Ingresa el código de 6 dígitos que aparecerá en tu Yape.
          </p>

          {yapeError && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{yapeError}</div>
          )}

          <div className="mt-5">
            <label className="grid gap-2 font-semibold text-foreground">
              Código Yape
              <div className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-brand-100 bg-card px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)] dark:border-border dark:bg-surface">
                <span aria-hidden="true"><CreditCard size={20} className="text-muted" /></span>
                <input
                  className="w-full bg-transparent text-center text-2xl font-bold tracking-[0.3em] text-foreground outline-none placeholder:text-muted"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  value={yapeCode}
                  onChange={(e) => setYapeCode(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>
            </label>
          </div>

          <div className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-[12px] text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            <strong>Mock:</strong> Cualquier código de 6 dígitos funciona, excepto <strong>000000</strong>.
          </div>

          <button
            onClick={handleCodeSubmit}
            disabled={yapeCode.length !== 6}
            className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 font-bold text-white shadow-lg shadow-purple-500/25 transition hover:from-purple-700 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirmar pago
            <ShieldCheck size={18} />
          </button>

          <button
            onClick={resetYape}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl font-semibold text-muted transition hover:text-secondary"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Verifying step */}
      {yapeStep === 'verifying' && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-purple-100 bg-card p-10 shadow-sm dark:border-purple-500/20 dark:bg-card">
          <div className="relative mb-6">
            <div className="h-20 w-20 animate-spin rounded-full border-[3px] border-purple-100 border-t-purple-500 dark:border-purple-500/20 dark:border-t-purple-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={28} className="text-purple-500" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-foreground">Verificando pago...</h3>
          <p className="mt-1 text-sm text-muted">No cierres esta ventana.</p>
        </div>
      )}

      {/* Result step */}
      {yapeStep === 'result' && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-green-100 bg-card p-10 shadow-sm dark:border-green-500/20 dark:bg-card">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
            <Check size={36} className="text-green-600 dark:text-green-300" strokeWidth={3} />
          </div>
          <h3 className="text-xl font-bold text-foreground">¡Pago exitoso!</h3>
          <p className="mt-1 text-sm text-muted">S/{precioFinal.toFixed(2)} pagado con Yape</p>
          <p className="mt-4 text-xs text-muted">Redirigiendo a tus reservas...</p>
          <div className="mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-green-100 dark:bg-green-500/20">
            <motion.div
              className="h-full rounded-full bg-green-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'linear' }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <main className="min-h-dvh bg-surface pb-40 max-md:landscape:pb-6">
      <div className="mx-auto max-w-lg px-4 pt-5 sm:px-5 max-md:landscape:pt-3">

        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
          <button
            onClick={() => yapeStep ? resetYape() : navigate(-1)}
            className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-secondary"
          >
            <ArrowLeft size={16} /> {yapeStep ? 'Volver a métodos' : 'Método de pago'}
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
              {descuentoPct > 0 ? (
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-foreground">S/ {precioFinal.toFixed(2)}</p>
                  <p className="text-base font-semibold text-muted-foreground line-through">S/ {precioBase.toFixed(2)}</p>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700 dark:bg-green-500/20 dark:text-green-300">
                    -{descuentoPct}%
                  </span>
                </div>
              ) : (
                <p className="text-3xl font-black text-foreground">S/ {precioBase.toFixed(2)}</p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-sm">
              <Wallet size={22} className="text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          {descuentoPct > 0 && (
            <p className="mt-1 text-[12px] font-semibold text-green-600 dark:text-green-400">
              Descuento de {fidelizacion?.nivel || ''} ({descuentoPct}%) aplicado
            </p>
          )}
          <p className="mt-1 text-[12px] text-blue-500 dark:text-blue-300">Incluye registro, reserva y acceso a la clase</p>
        </motion.div>

        {/* Payment methods - only show when not in yape flow */}
        {!yapeStep && (
          <>
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
                  return (
                    <motion.button
                      key={pm.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.04 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setMethod(pm.id)}
                      className={`relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                        selected
                          ? 'border-blue-500 bg-primary/10 shadow-md dark:border-blue-400 dark:bg-primary/10'
                          : 'border-border-light bg-card shadow-sm hover:border-border'
                      }`}
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${pm.bg} ring-1 ${pm.ring}`}>
                        {pm.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold ${selected ? 'text-blue-700 dark:text-blue-300' : 'text-foreground'}`}>{pm.name}</p>
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
              Revisa el método y el importe antes de confirmar.
            </motion.div>
          </>
        )}

        {/* Yape flow */}
        {yapeStep && yapeFlowContent}

        <div className="h-4" />
      </div>

      {/* Fixed bottom bar - only show when not in yape flow */}
      {!yapeStep && (
        <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl border-t border-border-light bg-card/95 px-5 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-4 shadow-xl backdrop-blur-md sm:px-6 max-md:landscape:static max-md:landscape:mt-5 max-md:landscape:rounded-3xl max-md:landscape:border max-md:landscape:pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-xl font-black text-blue-600">S/ {precioFinal.toFixed(2)}</p>
                {descuentoPct > 0 && (
                  <p className="text-[13px] font-semibold text-muted-foreground line-through">S/ {precioBase.toFixed(2)}</p>
                )}
              </div>
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
      )}
    </main>
  );
}

export default PagoClase;
