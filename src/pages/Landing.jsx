import { Link } from 'react-router-dom';
import logoJmGym from '../assets/logos/logo-jmgym.jpeg';

const features = [
  { icon: '🏋️', title: 'Entrenamiento', text: 'Rutinas personalizadas para todos los niveles.' },
  { icon: '🧘', title: 'Bienestar', text: 'Espacios comodos y ambiente relajado.' },
];

function Landing() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.8),transparent_28rem),linear-gradient(135deg,#eaf8ff_0%,#f2fbff_100%)]">
      <section className="min-h-screen overflow-hidden bg-[#2196d3] md:grid md:grid-rows-[auto_1fr]">
        <header className="flex items-center gap-5 bg-white px-6 py-6 text-xl font-bold md:px-10 md:py-7">
          <img className="h-16 w-16 rounded-3xl bg-white object-contain shadow-[0_12px_28px_rgba(50,38,50,0.14)]" src={logoJmGym} alt="Logo de JMGym" />
          <strong>JMGym</strong>
        </header>

        <div className="px-6 py-8 md:grid md:grid-cols-[1.05fr_0.95fr] md:grid-areas-none md:items-center md:gap-7 md:p-10">
          <div>
            <p className="hidden text-xs font-extrabold uppercase tracking-[0.18em] text-white/70 md:block">Splash screen principal</p>
            <h1 className="max-w-[12ch] font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-white md:text-8xl">Rompe tus limites</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white md:text-xl">Unete a una experiencia fitness moderna, simple y disenada para todas las edades.</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:mt-0 md:grid-cols-1 lg:grid-cols-2">
            {features.map((feature) => (
              <article className="min-h-44 rounded-3xl bg-white p-5 md:min-h-52 md:p-7" key={feature.title}>
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-2xl">{feature.icon}</div>
                <h2 className="font-extrabold md:text-xl">{feature.title}</h2>
                <p className="mt-2 leading-relaxed text-slate-500">{feature.text}</p>
              </article>
            ))}
          </div>

          <section className="mt-5 rounded-[26px] bg-emerald-50 p-6 md:col-start-1 md:mt-7 md:p-9" aria-labelledby="access-title">
            <h2 id="access-title" className="text-3xl font-extrabold tracking-tight md:text-4xl">Selecciona tu acceso</h2>
            <p className="mt-3 leading-relaxed text-slate-800">Ingresa segun tu perfil para acceder a las funciones correspondientes.</p>
            <div className="mt-6 grid gap-3">
              <Link className="grid min-h-14 place-items-center rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 font-extrabold text-white shadow-soft" to="/cliente/bienvenida">👤 Ingresar como Cliente</Link>
              <button className="min-h-14 rounded-2xl border-2 border-indigo-100 bg-white font-extrabold text-slate-800" type="button">🛠️ Ingresar como Administrador</button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Landing;
