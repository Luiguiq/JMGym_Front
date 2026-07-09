import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle,
  ChevronRight, Loader2
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin({ correo_institucional: correo, password });
      navigate('/admin');
    } catch (err) {
      const msg = err.message || 'Error al iniciar sesión';
      setError(msg);
      setShowErrorModal(true);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh bg-slate-100 overflow-y-auto">
      <div className="pointer-events-none fixed -left-40 -top-40 h-96 w-96 rounded-full bg-brand-500/5 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-96 w-96 rounded-full from-brand-400/5 to-transparent blur-[120px]" />

      <button
        onClick={() => navigate('/')}
        className="fixed left-4 top-4 z-10 flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-sm font-medium text-slate-500 shadow-sm backdrop-blur-sm ring-1 ring-black/5 transition hover:bg-white"
        aria-label="Volver al inicio"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">Volver</span>
      </button>

      <div className="flex min-h-dvh items-center justify-center p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md rounded-2xl bg-white shadow-sm ring-1 ring-black/5 backdrop-blur-sm"
        >
          <motion.div variants={itemVariants} className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg"
              >
                <ShieldCheck size={28} className="text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-slate-900">JMGym</h1>
              <p className="text-sm font-semibold text-slate-500">Panel Administrativo</p>
              <p className="mt-1 text-xs text-slate-400">Acceso seguro</p>
            </div>

            <AnimatePresence>
              {showErrorModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm"
                  onClick={() => setShowErrorModal(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center"
                  >
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-100">
                      <AlertCircle size={28} className="text-red-600" />
                    </div>
                    <h2 className="mt-4 text-lg font-bold text-slate-900">Credenciales incorrectas</h2>
                    <p className="mt-1 text-sm text-slate-500">{error}</p>
                    <button
                      onClick={() => setShowErrorModal(false)}
                      className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white transition hover:bg-red-700"
                    >
                      Intentar de nuevo
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form variants={itemVariants} className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-1.5 text-sm font-semibold text-slate-900">
                Correo institucional
                <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 ring-1 ring-transparent transition-all duration-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:shadow-[0_0_16px_rgba(37,99,235,0.1)]">
                  <Mail size={18} className="text-slate-400" />
                  <input
                    className="h-full w-full bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400/60"
                    type="email"
                    placeholder="admin@jmgym.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </label>

              <label className="grid gap-1.5 text-sm font-semibold text-slate-900">
                Contraseña
                <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 ring-1 ring-transparent transition-all duration-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:shadow-[0_0_16px_rgba(37,99,235,0.1)]">
                  <Lock size={18} className="text-slate-400" />
                  <input
                    className="h-full w-full bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400/60"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-400 transition hover:text-slate-900"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-slate-500">
                  <input
                    className="h-4 w-4 accent-brand-600"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Mantener sesión
                </label>
                <button
                  type="button"
                  className="font-medium text-brand-600 transition hover:text-brand-700"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  <>
                    Iniciar sesión <ChevronRight size={18} />
                  </>
                )}
              </motion.button>
            </motion.form>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="border-t border-slate-200 px-6 py-4 sm:px-8"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                API conectada
              </div>
              <span>v1.0.0</span>
            </div>
            <p className="mt-1 text-xs text-slate-400/60">
              <span className="inline-block align-middle">🔒</span> Conexión cifrada · Servidor en línea
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
