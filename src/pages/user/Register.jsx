import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', dni: '', email: '', password: '' });
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
    <main className="min-h-screen bg-slate-50 md:grid md:place-items-center md:bg-gradient-to-b md:from-brand-50 md:to-brand-100">
      <section className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),transparent_22rem),linear-gradient(180deg,#fbfdff_0%,#edf8ff_100%)] px-6 py-8 md:grid md:w-full md:grid-cols-[minmax(360px,0.8fr)_minmax(500px,0.85fr)] md:items-center md:gap-x-28 md:bg-[radial-gradient(circle_at_16%_20%,rgba(255,255,255,0.92),transparent_26rem),linear-gradient(180deg,#f7fcff_0%,#e8f7ff_100%)] md:px-[8vw] md:py-16 max-w-full overflow-x-hidden">
        <aside className="relative grid gap-6 pt-7 md:min-h-[560px] md:content-center md:gap-9 md:rounded-[38px] md:bg-gradient-to-br md:from-brand-500 md:to-brand-600 md:p-14 md:text-white md:shadow-soft">
          <Link className="absolute -left-2 top-0 grid h-11 w-11 place-items-center rounded-2xl bg-white/70 text-2xl text-slate-950 md:left-7 md:top-7 md:bg-white/15 md:text-white" to="/cliente/login">←</Link>
          <div className="flex items-center justify-center gap-3 text-left md:justify-start md:gap-5">
            <img className="h-16 w-16 rounded-2xl bg-white object-contain shadow-soft md:h-28 md:w-28 md:rounded-3xl" src={logoJmGym} alt="Logo de JMGym" />
            <div>
              <h1 className="font-display text-3xl font-bold text-brand-600 md:text-7xl md:text-white">JMGym</h1>
              <p className="text-sm text-slate-500 md:text-lg md:text-white/85">Gimnasio Ritmo Vital</p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-4xl font-bold text-slate-800 md:text-5xl md:text-white">Crear cuenta</h2>
            <p className="mt-2 text-slate-500 md:text-lg md:text-white/85">Unete y reserva tus clases favoritas.</p>
          </div>
        </aside>

        <form className="mx-auto mt-6 grid w-full max-w-xl gap-4 md:m-0 md:max-w-[620px] md:gap-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          <InputField icon="👤" label="Nombre completo" name="name" placeholder="Maria Garcia Lopez" value={form.name} onChange={handleChange} required />
          <InputField icon="🪪" label="DNI" name="dni" placeholder="12345678" value={form.dni} onChange={handleChange} required />
          <InputField icon="✉️" label="Correo electronico" name="email" placeholder="maria@correo.com" type="email" value={form.email} onChange={handleChange} required />
          <InputField icon="🔒" label="Contraseña" name="password" placeholder="Minimo 8 caracteres" type="password" value={form.password} onChange={handleChange} required />

          <label className="mt-1 flex items-start gap-3 leading-relaxed text-slate-500">
            <input className="mt-1 h-5 w-5 shrink-0 accent-brand-600" type="checkbox" defaultChecked required />
            <span>Acepto los <button className="font-extrabold text-brand-600" type="button">terminos y condiciones</button> y la <button className="font-extrabold text-brand-600" type="button">politica de privacidad</button></span>
          </label>

          <div className="mt-3 grid gap-5 text-center">
            <button className="min-h-14 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 font-extrabold text-white shadow-soft disabled:opacity-60 md:min-h-16 md:text-lg" type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarme'}
            </button>
            <p className="text-slate-500">¿Ya tienes cuenta? <Link className="font-extrabold text-brand-600" to="/cliente/login">Inicia sesion</Link></p>
          </div>
        </form>
      </section>
    </main>
  );
}

function InputField({ icon, label, name, placeholder, type = 'text', value, onChange, required }) {
  return (
    <label className="grid gap-2 font-bold text-slate-500">
      {label}
      <div className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-brand-100 bg-white px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)] md:min-h-16">
        <span aria-hidden="true">{icon}</span>
        <input className="w-full bg-transparent outline-none" type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} required={required} />
      </div>
    </label>
  );
}

export default Register;
