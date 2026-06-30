import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Zap, MapPin, Smartphone, ArrowLeft, Mail, Lock } from 'lucide-react';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

const highlights = [
  {
    icon: <Zap size={24} />,
    title: 'Reserva rápida',
    text: 'Encuentra y reserva clases en pocos pasos.',
  },
  {
    icon: <MapPin size={24} />,
    title: 'Control claro',
    text: 'Selecciona tu espacio y continúa sin confusión.',
  },
  {
    icon: <Smartphone size={24} />,
    title: 'Acceso flexible',
    text: 'Funciona bien en móvil, tablet y escritorio.',
  },
];

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password }, remember);
      navigate('/cliente/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-surface p-3 sm:p-4 lg:p-5">
      <section
        className="
          mx-auto
          grid
          min-h-[calc(100dvh-1.5rem)]
          max-w-7xl
          overflow-hidden
          rounded-[32px]
          bg-card
          shadow-[0_24px_70px_rgba(15,23,42,.08)]
          lg:grid-cols-[0.92fr_1.08fr]
        "
      >
        <aside
          className="
            flex
            flex-col
            justify-between
            gap-6
            bg-gradient-to-br
            from-brand-600
              via-[#0a58ca]
              to-[#1576ff]
            p-6
            text-white
            sm:p-8
            lg:p-10
          "
        >
          <Link
            className="
              grid
              h-12
              w-12
              place-items-center
              rounded-2xl
              bg-white/15
              text-2xl
              font-black
              text-white
              transition
              hover:bg-white/20
            "
            to="/"
            aria-label="Volver al inicio"
          >
            <ArrowLeft size={24} />
          </Link>

          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <img
                className="
                  h-20
                  w-20
                  rounded-3xl
                  bg-white
                  object-contain
                  shadow-[0_12px_28px_rgba(0,0,0,.12)]
                  sm:h-24
                  sm:w-24
                "
                src={logoJmGym}
                alt="Logo de JMGym"
              />

              <div>
                <h1 className="font-display text-4xl font-bold leading-none sm:text-5xl lg:text-6xl">
                  JMGym
                </h1>
                <p className="mt-2 text-sm text-white/85 sm:text-base">
                  Tu espacio de reservas de baile, simple y claro.
                </p>
              </div>
            </div>

            <div className="max-w-xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-white/75">
                Bienvenido
              </p>
              <h2 className="mt-4 max-w-[12ch] font-display text-4xl font-bold leading-[0.95] sm:text-5xl lg:text-6xl">
                Inicia sesión y reserva
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base lg:text-lg">
                Encuentra clases, selecciona espacios y administra tus reservas
                desde una sola plataforma.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="
                  rounded-[24px]
                  bg-white/10
                  p-4
                  ring-1
                  ring-white/10
                  backdrop-blur-sm
                  sm:p-5
                "
              >
                <div className="mb-3 text-2xl">
                  {item.icon}
                </div>
                <h3 className="font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-white/80">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </aside>

        <form
          className="
            flex
            flex-col
            justify-center
            gap-5
            p-6
            sm:p-8
            lg:p-10
          "
          onSubmit={handleSubmit}
        >
          <div>
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Acceder
            </h2>
            <p className="mt-2 text-secondary">
              Continúa con tu cuenta.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          <label className="grid gap-2 font-semibold text-foreground">
            Correo electrónico
            <div className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-brand-100 bg-card px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)] sm:min-h-16">
              <span aria-hidden="true"><Mail size={20} /></span>
              <input
                className="w-full bg-transparent outline-none text-foreground placeholder:text-muted"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>

          <label className="grid gap-2 font-semibold text-foreground">
            Contraseña
            <div className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-brand-100 bg-card px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)] sm:min-h-16">
              <span aria-hidden="true"><Lock size={20} /></span>
              <input
                className="w-full bg-transparent outline-none text-foreground placeholder:text-muted"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-secondary">
            <label className="flex items-center gap-2">
              <input
                className="h-5 w-5 accent-brand-600"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Recordar sesión
            </label>

            <button
              className="font-bold text-brand-600 transition hover:text-brand-700"
              type="button"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            className="
              min-h-14
              rounded-2xl
              bg-brand-600
              font-bold
              text-white
              shadow-soft
              transition
              hover:bg-brand-700
              disabled:cursor-not-allowed
              disabled:opacity-70
              sm:min-h-16
            "
            type="submit"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <Link
            className="
              grid
              min-h-14
              place-items-center
              rounded-2xl
              border-2
              border-brand-600
              font-bold
              text-brand-600
              transition
              hover:bg-brand-50
              sm:min-h-16
            "
            to="/cliente/registro"
          >
            Crear cuenta nueva
          </Link>
        </form>
      </section>
    </main>
  );
}

export default Login;
