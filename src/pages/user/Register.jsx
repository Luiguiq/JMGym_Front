import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  ArrowLeft, User, IdCard, Mail, Lock, Eye, EyeOff,
  Zap, CalendarCheck, Dumbbell, Check, ChevronRight, Loader2
} from 'lucide-react';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';
import heroImage from '../../assets/images/jmworkoutport2.jpg';
import { DNI_ERROR_MESSAGE, isValidDni, sanitizeDni } from '../../utils/dni.js';
import { getFriendlyErrorMessage } from '../../utils/userMessages.js';

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
  { icon: <Zap size={18} />, text: 'Reserva en segundos' },
  { icon: <CalendarCheck size={18} />, text: 'Horarios en tiempo real' },
  { icon: <Dumbbell size={18} />, text: 'Instructores certificados' },
];

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [dniError, setDniError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!isValidDni(dni)) {
      setDniError(DNI_ERROR_MESSAGE);
      return;
    }

    setLoading(true);

    try {
      await register({ name, dni, email, password });
      toast.success('Cuenta creada con éxito');
      navigate('/cliente/home');
    } catch (err) {
      const msg = getFriendlyErrorMessage(err, 'No pudimos crear tu cuenta. Revisa tus datos e intenta nuevamente.');
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
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
          to="/cliente/login"
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

      <motion.div variants={itemVariants} className="mt-6 md:mt-10">
        <h1 className="text-3xl font-black leading-tight text-white md:text-4xl">
          Crea tu cuenta
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/70 md:text-base">
          Empieza en menos de un minuto.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-5">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>Paso 1 de 1</span>
          <span>Registro</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-full rounded-full bg-cyan-300" />
        </div>
      </motion.div>

      <motion.form
        variants={itemVariants}
        className="mt-5 grid gap-4"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="rounded-2xl bg-red-500/20 px-4 py-3 text-sm font-bold text-white backdrop-blur-sm">
            {error}
          </div>
        )}

        <label className="grid gap-1.5 font-semibold text-white/90">
          Nombre completo
          <div className="flex h-14 items-center gap-3 rounded-2xl bg-white/15 px-4 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-cyan-300 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.25)]">
            <User size={20} className="text-white/60" />
            <input
              className="h-full w-full bg-transparent text-[16px] text-white outline-none placeholder:text-white/40"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </label>

        <label className="grid gap-1.5 font-semibold text-white/90">
          DNI
          <div
            className={`flex h-14 items-center gap-3 rounded-2xl bg-white/15 px-4 ring-1 backdrop-blur-sm transition-all duration-300 focus-within:ring-2 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.25)] ${
              dniError
                ? 'ring-2 ring-red-400 focus-within:ring-red-400 focus-within:shadow-[0_0_20px_rgba(248,113,113,0.25)]'
                : 'ring-white/20 focus-within:ring-cyan-300'
            }`}
          >
            <IdCard size={20} className="text-white/60" />
            <input
              className="h-full w-full bg-transparent text-[16px] text-white outline-none placeholder:text-white/40"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{8}"
              maxLength={8}
              placeholder="12345678"
              value={dni}
              onChange={(e) => {
                setDni(sanitizeDni(e.target.value));
                setDniError('');
              }}
              aria-invalid={!!dniError}
              aria-describedby={dniError ? 'register-dni-error' : undefined}
              required
            />
          </div>
          {dniError && (
            <p id="register-dni-error" className="text-xs font-bold text-red-300">
              {dniError}
            </p>
          )}
        </label>

        <label className="grid gap-1.5 font-semibold text-white/90">
          Correo electrónico
          <div className="flex h-14 items-center gap-3 rounded-2xl bg-white/15 px-4 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-cyan-300 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.25)]">
            <Mail size={20} className="text-white/60" />
            <input
              className="h-full w-full bg-transparent text-[16px] text-white outline-none placeholder:text-white/40"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-1 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white font-bold text-brand-700 shadow-lg transition-all hover:bg-white/90 hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Creando cuenta...
            </>
          ) : (
            <>
              Crear cuenta <ChevronRight size={20} />
            </>
          )}
        </motion.button>
      </motion.form>

      <motion.p variants={itemVariants} className="mt-5 text-center text-sm text-white/70">
        ¿Ya tienes cuenta?{' '}
        <Link to="/cliente/login" className="font-bold text-white underline underline-offset-2 transition hover:text-cyan-200">
          Iniciar sesión
        </Link>
      </motion.p>

      <motion.ul variants={itemVariants} className="mt-6 grid gap-3">
        {benefits.map((item) => (
          <li key={item.text} className="flex items-center gap-3 text-sm text-white/70">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300/20 text-cyan-200">
              <Check size={14} />
            </span>
            {item.text}
          </li>
        ))}
      </motion.ul>

      <motion.div variants={itemVariants} className="mt-5 flex items-center justify-center gap-4 text-xs text-white/40">
        <span>v1.0</span>
        <span className="h-3 w-px bg-white/20" />
        <Link to="/" className="transition hover:text-white/60">Políticas de privacidad</Link>
        <span className="h-3 w-px bg-white/20" />
        <Link to="/" className="transition hover:text-white/60">Términos</Link>
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
    </main>
    </>
  );
}

export default Register;
