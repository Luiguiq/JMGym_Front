import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ChevronRight, Phone, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import yapeLogo from '../../assets/images/yapelogo.png';

const STEPS = ['phone', 'code', 'result'];

function YapeVinculacionModal({ onClose }) {
  const { vincularYape } = useAuth();
  const [step, setStep] = useState('intro');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handlePhoneSubmit = () => {
    const clean = phone.replace(/\s/g, '');
    if (clean.length !== 9 || !/^9\d{8}$/.test(clean)) {
      setError('Ingresa un número válido de 9 dígitos (ej: 987654321)');
      return;
    }
    setError('');
    setStep('code');
  };

  const handleCodeSubmit = () => {
    const clean = code.trim();
    if (clean.length !== 6 || !/^\d{6}$/.test(clean)) {
      setError('Ingresa un código de 6 dígitos');
      return;
    }
    setError('');
    setStep('result');
    vincularYape(phone.replace(/\s/g, ''));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[28px] bg-card shadow-2xl overflow-hidden dark:bg-card"
      >
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-border-light text-muted hover:bg-border hover:text-secondary transition-colors dark:bg-surface dark:hover:bg-border"
          >
            <X size={16} />
          </button>

          {step === 'intro' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-500/10">
                <img src={yapeLogo} alt="Yape" className="h-9 w-9 object-contain" />
              </div>
              <h2 className="text-xl font-black text-foreground">Vincula tu cuenta Yape</h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Paga tus clases al instante desde el app sin necesidad de efectivo.
              </p>

              <div className="mt-3 rounded-xl bg-blue-50 p-4 text-left dark:bg-blue-500/10">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-300" />
                  <div>
                    <p className="text-sm font-bold text-blue-800 dark:text-blue-200">Beneficios</p>
                    <ul className="mt-1 list-inside list-disc text-xs text-blue-600 dark:text-blue-400 space-y-0.5">
                      <li>Pago rápido desde tu celular</li>
                      <li>Sin necesidad de llevar efectivo</li>
                      <li>Confirmación instantánea de tu reserva</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => setStep('phone')}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 font-bold text-white shadow-lg shadow-purple-500/25 transition hover:from-purple-700 hover:to-purple-500"
                >
                  Vincular Yape ahora
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={onClose}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl font-semibold text-muted transition hover:text-secondary"
                >
                  Ahora no
                </button>
              </div>
            </div>
          )}

          {step === 'phone' && (
            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-500/10">
                <img src={yapeLogo} alt="Yape" className="h-9 w-9 object-contain" />
              </div>
              <h3 className="text-center text-xl font-bold text-foreground">Tu número de celular</h3>
              <p className="mt-1 text-center text-sm text-muted">El número asociado a tu cuenta Yape.</p>

              {error && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{error}</div>
              )}

              <div className="mt-5">
                <label className="grid gap-2 font-semibold text-foreground">
                  Número de celular
                  <div className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-brand-100 bg-card px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)] dark:border-border dark:bg-surface">
                    <Phone size={20} className="text-muted" />
                    <input
                      className="w-full bg-transparent text-lg font-bold tracking-widest text-foreground outline-none placeholder:text-muted"
                      type="tel"
                      inputMode="numeric"
                      placeholder="987 654 321"
                      maxLength={9}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                    />
                  </div>
                </label>
              </div>

              <button
                onClick={handlePhoneSubmit}
                disabled={phone.length !== 9}
                className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 font-bold text-white shadow-lg shadow-purple-500/25 transition hover:from-purple-700 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continuar
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 'code' && (
            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-500/10">
                <img src={yapeLogo} alt="Yape" className="h-9 w-9 object-contain" />
              </div>
              <h3 className="text-center text-xl font-bold text-foreground">Código de verificación</h3>
              <p className="mt-1 text-center text-sm text-muted">
                Ingresa el código de 6 dígitos que aparece en tu Yape.
              </p>

              {error && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{error}</div>
              )}

              <div className="mt-5">
                <label className="grid gap-2 font-semibold text-foreground">
                  Código Yape
                  <div className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-brand-100 bg-card px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)] dark:border-border dark:bg-surface">
                    <input
                      className="w-full bg-transparent text-center text-2xl font-bold tracking-[0.3em] text-foreground outline-none placeholder:text-muted"
                      type="text"
                      inputMode="numeric"
                      placeholder="000000"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                    />
                  </div>
                </label>
              </div>

              <button
                onClick={handleCodeSubmit}
                disabled={code.length !== 6}
                className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 font-bold text-white shadow-lg shadow-purple-500/25 transition hover:from-purple-700 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Verificar y vincular
                <ShieldCheck size={18} />
              </button>
            </div>
          )}

          {step === 'result' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
                <Check size={36} className="text-green-600 dark:text-green-300" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-bold text-foreground">¡Yape vinculado!</h3>
              <p className="mt-1 text-sm text-muted">Tu cuenta Yape se vinculó exitosamente.</p>
              <p className="mt-2 text-xs text-muted-foreground">Ya puedes pagar tus clases al instante desde Yape.</p>

              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-left dark:border-green-500/20 dark:bg-green-500/10">
                <div className="flex items-start gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-green-600 dark:text-green-300" />
                  <div>
                    <p className="text-sm font-bold text-green-800 dark:text-green-200">Listo</p>
                    <p className="mt-0.5 text-xs text-green-600 dark:text-green-400">
                      La próxima vez que reserves una clase, podrás elegir Yape como método de pago.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 font-bold text-white shadow-lg shadow-green-500/25 transition hover:from-green-700 hover:to-emerald-500"
              >
                Listo
                <Check size={18} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default YapeVinculacionModal;
