import { Link, useNavigate } from 'react-router-dom';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

function Login() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    navigate('/cliente/home');
  }

  return (
    <main className="min-h-screen bg-slate-50 md:grid md:place-items-center md:bg-gradient-to-b md:from-brand-50 md:to-brand-100">
      <section className="min-h-screen bg-slate-50 md:grid md:w-full md:grid-cols-[minmax(360px,0.85fr)_minmax(460px,0.75fr)] md:items-center md:gap-x-28 md:bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.9),transparent_26rem),linear-gradient(180deg,#f7fcff_0%,#e8f7ff_100%)] md:px-[8vw] md:py-16">
        <header className="relative grid justify-items-center rounded-b-[34px] bg-gradient-to-br from-brand-500 to-brand-600 px-6 py-9 text-center text-white md:min-h-[560px] md:content-center md:rounded-[38px] md:shadow-soft">
          <Link className="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-2xl" to="/cliente/bienvenida">←</Link>
          <img className="mb-4 h-24 w-24 rounded-2xl bg-white object-contain shadow-xl md:h-28 md:w-28" src={logoJmGym} alt="Logo de JMGym" />
          <h1 className="font-display text-4xl font-bold md:text-7xl">JMGym</h1>
          <p className="mt-2 text-white/90 md:text-xl">¡Bienvenida de vuelta!</p>
        </header>

        <form className="mx-auto grid w-full max-w-xl gap-5 px-6 py-8 md:m-0 md:max-w-[620px] md:p-0" onSubmit={handleSubmit}>
          <div>
            <h2 className="font-display text-4xl font-bold text-slate-800 md:text-5xl">Inicia sesion</h2>
            <p className="mt-2 text-slate-500 md:text-lg">Ingresa tus datos para continuar.</p>
          </div>

          <label className="grid gap-2 font-bold text-slate-500">
            DNI o correo electronico
            <div className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-brand-100 bg-white px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)] md:min-h-16">
              <span aria-hidden="true">🪪</span>
              <input className="w-full bg-transparent outline-none" type="text" placeholder="12345678 o tu correo" />
            </div>
          </label>

          <label className="grid gap-2 font-bold text-slate-500">
            Contraseña
            <div className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-brand-100 bg-white px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)] md:min-h-16">
              <span aria-hidden="true">🔒</span>
              <input className="w-full bg-transparent outline-none" type="password" placeholder="Tu contraseña" />
            </div>
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 md:text-base">
            <label className="flex items-center gap-2"><input className="h-5 w-5 accent-brand-600" type="checkbox" defaultChecked /> Recordar sesion</label>
            <button className="font-extrabold text-brand-600" type="button">¿Olvidaste tu contraseña?</button>
          </div>

          <div className="grid gap-3">
            <button className="min-h-14 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 font-extrabold text-white shadow-soft md:min-h-16 md:text-lg" type="submit">Ingresar</button>
            <Link className="grid min-h-14 place-items-center rounded-2xl border-2 border-brand-600 bg-white font-extrabold text-brand-600 md:min-h-16 md:text-lg" to="/cliente/registro">Crear cuenta nueva</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Login;
