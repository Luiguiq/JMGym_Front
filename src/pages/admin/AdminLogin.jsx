import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin({ correo_institucional: correo, password });
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 md:grid md:place-items-center md:bg-gradient-to-b md:from-brand-50 md:to-brand-100">
      <section className="min-h-screen bg-slate-50 md:grid md:w-full md:grid-cols-[minmax(360px,0.85fr)_minmax(460px,0.75fr)] md:items-center md:gap-x-28 md:bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.9),transparent_26rem),linear-gradient(180deg,#f7fcff_0%,#e8f7ff_100%)] md:px-[8vw] md:py-16 max-w-full overflow-x-hidden">
        <header className="relative grid justify-items-center rounded-b-[34px] bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-9 text-center text-white md:min-h-[560px] md:content-center md:rounded-[38px] md:shadow-soft">
          <Link className="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-2xl" to="/">←</Link>
          <img className="mb-4 h-24 w-24 rounded-2xl bg-white object-contain shadow-xl md:h-28 md:w-28" src={logoJmGym} alt="Logo de JMGym" />
          <h1 className="font-display text-4xl font-bold md:text-7xl">JMGym</h1>
          <p className="mt-2 text-white/90 md:text-xl">Panel de Administracion</p>
        </header>

        <form className="mx-auto grid w-full max-w-xl gap-5 px-6 py-8 md:m-0 md:max-w-[620px] md:p-0" onSubmit={handleSubmit}>
          <div>
            <h2 className="font-display text-4xl font-bold text-slate-800 md:text-5xl">Admin Login</h2>
            <p className="mt-2 text-slate-500 md:text-lg">Ingresa tus credenciales de administrador.</p>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          <label className="grid gap-2 font-bold text-slate-500">
            Correo institucional
            <div className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-brand-100 bg-white px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)] md:min-h-16">
              <span aria-hidden="true">✉️</span>
              <input className="w-full bg-transparent outline-none" type="email" placeholder="admin@jmgym.com" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
            </div>
          </label>

          <label className="grid gap-2 font-bold text-slate-500">
            Contraseña
            <div className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-brand-100 bg-white px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)] md:min-h-16">
              <span aria-hidden="true">🔒</span>
              <input className="w-full bg-transparent outline-none" type="password" placeholder="Tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </label>

          <button className="min-h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 font-extrabold text-white shadow-soft disabled:opacity-60 md:min-h-16 md:text-lg" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar como Admin'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;
