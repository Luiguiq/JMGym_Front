import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import { authService } from '../../services/authService.js';
import { userService } from '../../services/userService.js';
import {
  ArrowLeft, Mail, Lock, Eye, EyeOff, X, Zap, CalendarCheck, Bell, Loader2, ChevronRight
} from 'lucide-react';
import { getFriendlyErrorMessage } from '../../utils/userMessages.js';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';
import heroImage from '../../assets/images/jmworkoutport2.jpg';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const benefits = [
  { icon: <Zap size={22} />, title: 'Reserva en segundos', text: 'Encuentra y aparta tu clase al instante' },
  { icon: <CalendarCheck size={22} />, title: 'Horarios en tiempo real', text: 'Disponibilidad actualizada al minuto' },
  { icon: <Bell size={22} />, title: 'Recibe recordatorios', text: 'Nunca pierdas una clase' },
];

function Login() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ identifier, password }, remember);
      const profile = await userService.getMyProfileSafe();
      if (profile.estado === 'BLOQUEADO') {
        logout();
        toast.error('Tu cuenta ha sido bloqueada. Contacta al administrador.');
        return;
      }
      navigate('/cliente/home');
    } catch (err) {
      const msg = getFriendlyErrorMessage(err, 'No pudimos iniciar sesión. Revisa tus credenciales e intenta nuevamente.');
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotSubmit(event) {
    event.preventDefault();
    setForgotLoading(true);
    setForgotMessage('');

    try {
      const res = await authService.forgotPassword({ correo: forgotEmail });
      const msg = res.mensaje || 'Revisa tu correo para continuar.';
      setForgotMessage(msg);
      toast.success(msg);
    } catch (err) {
      const msg = err.message;
      setForgotMessage(msg);
      toast.error(msg);
    } finally {
      setForgotLoading(false);
    }
  }

  const formContent = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col px-5 py-5 md:min-h-dvh md:py-8 md:pl-10 md:pr-16"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Link
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white transition hover:bg-white/25"
          to="/"
          aria-label="Volver al inicio"
        >
          <ArrowLeft size={20} />
        </Link>
        <motion.img
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-14 w-14 rounded-2xl bg-white object-contain p-2 shadow md:h-16 md:w-16"
          src={logoJmGym}
          alt="JMGym"
        />
        <span className="font-serif text-xl font-bold text-white md:text-2xl">JMGym</span>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-8 md:mt-12">
        <h1 className="text-4xl font-black leading-[0.9] text-white md:text-5xl">
          Entrena sin
          <br />
          <span className="text-cyan-200">límites</span>
        </h1>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70 md:text-base">
          Reserva clases, elige tu espacio y controla tus entrenamientos.
        </p>
      </motion.div>

      <motion.form
        variants={itemVariants}
        className="mt-6 grid gap-4 md:mt-8"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="rounded-2xl bg-red-500/20 px-4 py-3 text-sm font-bold text-white backdrop-blur-sm">
            {error}
          </div>
        )}

        <label className="grid gap-1.5 font-semibold text-white/90">
          Correo electrónico
          <div className="flex h-14 items-center gap-3 rounded-2xl bg-white/15 px-4 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-cyan-300 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.25)]">
            <Mail size={20} className="text-white/60" />
            <input
              className="h-full w-full bg-transparent text-[16px] text-white outline-none placeholder:text-white/40"
              type="text"
              placeholder="tu@correo.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
        </label>

        <label className="grid gap-1.5 font-semibold text-white/90">
          Contraseña
          <div className="flex h-14 items-center gap-3 rounded-2xl bg-white/15 px-4 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-cyan-300 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.25)]">
            <Lock size={20} className="text-white/60" />
            <input
              className="h-full w-full bg-transparent text-[16px] text-white outline-none placeholder:text-white/40"
              type={showPassword ? 'text' : 'password'}
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-white/50 transition hover:text-white/80"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/80">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              className="h-4 w-4 accent-cyan-300"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Recordar sesión
          </label>

          <button
            className="font-bold text-white/90 transition hover:text-white"
            type="button"
            onClick={() => setShowForgot(true)}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white font-bold text-brand-700 shadow-lg transition-all hover:bg-white/90 hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Ingresando...
            </>
          ) : (
            <>
              Ingresar <ChevronRight size={20} />
            </>
          )}
        </motion.button>
      </motion.form>

      <motion.p variants={itemVariants} className="mt-5 text-center text-sm text-white/70">
        ¿No tienes cuenta?{' '}
        <Link to="/cliente/registro" className="font-bold text-white underline underline-offset-2 transition hover:text-cyan-200">
          Crear cuenta
        </Link>
      </motion.p>

      <motion.div variants={itemVariants} className="mt-6 grid gap-3 md:grid-cols-3">
        {benefits.map((item) => (
          <motion.article
            key={item.title}
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur-sm transition hover:bg-white/15"
          >
            <div className="mb-2 text-cyan-200">{item.icon}</div>
            <h3 className="text-sm font-bold text-white">{item.title}</h3>
            <p className="mt-0.5 text-xs text-white/60">{item.text}</p>
          </motion.article>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="mt-5 flex items-center justify-center gap-4 text-xs text-white/40">
        <span>v1.0</span>
        <span className="h-3 w-px bg-white/20" />
        <Link to="/" className="transition hover:text-white/60">Políticas de privacidad</Link>
        <span className="h-3 w-px bg-white/20" />
        <Link to="/" className="transition hover:text-white/60">Términos</Link>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-4 text-center">
        <Link
          to="/admin/login"
          className="text-xs text-white/40 transition hover:text-white/70"
        >
          ¿Eres administrador? <span className="font-semibold">Ingresa aquí →</span>
        </Link>
      </motion.div>
    </motion.div>
  );

  return (
    <>
    <div className="fixed inset-0 bg-gradient-to-br from-brand-600 via-[#0a58ca] to-[#1576ff]">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-300/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full from-blue-400/10 to-transparent blur-[120px]" />
    </div>

    <main className="relative z-10 min-h-dvh md:overflow-hidden">
      <div className="grid min-h-dvh md:grid-cols-[1fr_1fr]">
        <div className="flex flex-col md:overflow-y-auto">
          {formContent}
        </div>

        <aside className="relative hidden overflow-hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600/60 via-brand-600/20 to-transparent" />
          <img
            className="h-full w-full object-cover"
            src={heroImage}
            alt="Personas entrenando en JMGym"
          />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-md ring-1 ring-white/20">
              <p className="text-lg font-bold text-white">
                Únete a +500 personas que ya entrenan con nosotros
              </p>
              <div className="mt-3 flex items-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1">⭐ 4.9</span>
                <span className="h-4 w-px bg-white/20" />
                <span>15 clases diarias</span>
                <span className="h-4 w-px bg-white/20" />
                <span>98% asistencia</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-lg sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-slate-900">Restablecer contraseña</h3>
              <button
                className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-50"
                type="button"
                onClick={() => { setShowForgot(false); setForgotMessage(''); setForgotEmail(''); }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleForgotSubmit} className="grid gap-5">
              <label className="grid gap-2 font-semibold text-slate-900">
                Correo
                <div className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-brand-100 bg-white px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)]">
                  <span aria-hidden="true"><Mail size={20} /></span>
                  <input
                    className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                    type="email"
                    placeholder="tu@correo.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
              </label>

              {forgotMessage && (
                <div
                  className="rounded-2xl border px-4 py-3 text-sm font-bold"
                  style={{
                    borderColor: forgotMessage.includes('Revisa') || forgotMessage.includes('Si el correo') ? '#bbf7d0' : '#fecaca',
                    backgroundColor: forgotMessage.includes('Revisa') || forgotMessage.includes('Si el correo') ? '#f0fdf4' : '#fef2f2',
                    color: forgotMessage.includes('Revisa') || forgotMessage.includes('Si el correo') ? '#166534' : '#dc2626',
                  }}
                >
                  {forgotMessage}
                </div>
              )}

              <button
                className="min-h-14 rounded-2xl bg-brand-600 font-bold text-primary-foreground shadow-lg transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={forgotLoading}
              >
                {forgotLoading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </main>
    </>
  );
}

export default Login;
