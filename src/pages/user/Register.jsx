import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

const highlights = [
  { title: 'Rápido', text: 'Crear tu cuenta toma poco tiempo' },
  { title: 'Claro', text: 'Formulario simple y entendible' },
  { title: 'Seguro', text: 'Tus datos quedan protegidos' },
];

function AuthField({
  icon,
  label,
  name,
  placeholder,
  type = 'text',
  value,
  onChange,
  autoComplete,
  required = true,
}) {
  return (
    <label className="grid gap-2 font-semibold text-slate-600">
      <span>{label}</span>
      <div className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-brand-100 bg-white px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)] sm:min-h-16">
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
        <input
          className="w-full bg-transparent outline-none placeholder:text-slate-300"
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
        />
      </div>
    </label>
  );
}

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    dni: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(form);
      navigate('/cliente/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7fbff] px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative overflow-hidden rounded-[36px] bg-[#004aab] p-8 text-white shadow-[0_20px_60px_rgba(0,74,171,.18)] sm:p-10 lg:min-h-[680px] lg:p-12">
          <Link
            className="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-2xl font-black text-white transition hover:bg-white/20"
            to="/cliente/login"
          >
            ←
          </Link>

          <div className="mt-10 flex h-full flex-col justify-center gap-8 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <img
                className="h-24 w-24 rounded-3xl bg-white object-contain shadow-[0_12px_28px_rgba(0,0,0,.12)] sm:h-28 sm:w-28"
                src={logoJmGym}
                alt="Logo de JMGym"
              />
            </div>

            <div>
              <h1 className="font-display text-5xl font-bold leading-none sm:text-6xl">
                JMGym
              </h1>
              <p className="mt-3 max-w-md text-lg text-white/85">
                Tu espacio de reservas de baile, simple y claro.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {highlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[22px] bg-white/10 p-4 text-left ring-1 ring-white/10"
                >
                  <h2 className="font-bold text-white">{item.title}</h2>
                  <p className="mt-1 text-sm text-white/80">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </aside>

        <form
          className="rounded-[36px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,.08)] ring-1 ring-slate-100 sm:p-8 lg:p-12 flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <div>
            <h2 className="font-display text-4xl font-bold text-black sm:text-5xl">
              Crear cuenta
            </h2>
            <p className="mt-2 max-w-md text-slate-500">
              Únete y reserva tus clases favoritas.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          <AuthField
            icon="👤"
            label="Nombre completo"
            name="name"
            placeholder="María García López"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />

          <AuthField
            icon="🪪"
            label="DNI"
            name="dni"
            placeholder="12345678"
            value={form.dni}
            onChange={handleChange}
            autoComplete="off"
          />

          <AuthField
            icon="✉️"
            label="Correo electrónico"
            name="email"
            type="email"
            placeholder="maria@correo.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <AuthField
            icon="🔒"
            label="Contraseña"
            name="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />

          <label className="flex items-start gap-3 leading-relaxed text-slate-500">
            <input
              className="mt-1 h-5 w-5 shrink-0 accent-brand-600"
              type="checkbox"
              defaultChecked
              required
            />
            <span>
              Acepto los{' '}
              <button className="font-extrabold text-brand-600" type="button">
                términos y condiciones
              </button>{' '}
              y la{' '}
              <button className="font-extrabold text-brand-600" type="button">
                política de privacidad
              </button>
            </span>
          </label>

          <button
            className="w-full flex items-center justify-center min-h-14 rounded-2xl bg-brand-600 font-bold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-16"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>

          <p className="text-center text-slate-500">
            ¿Ya tienes cuenta?{' '}
            <Link className="font-extrabold text-brand-600" to="/cliente/login">
              Inicia sesión
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;