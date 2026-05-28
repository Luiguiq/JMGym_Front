import { Link } from 'react-router-dom';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

const benefits = [
  { icon: '💃', title: 'Clases variadas', text: 'Cardio, Zumba, Cuerpo Completo y mas' },
  { icon: '📍', title: 'Elige tu espacio', text: 'Mapa interactivo de salon' },
  { icon: '💳', title: 'Pago rapido', text: 'Yape, transferencia o efectivo' },
];

function Welcome() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 to-brand-100">
      <section className="relative grid min-h-screen content-center gap-7 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.9),transparent_20rem),linear-gradient(180deg,#f8fdff_0%,#e7f6ff_100%)] px-6 py-10 md:grid-cols-[minmax(360px,0.95fr)_minmax(460px,0.85fr)] md:grid-rows-[auto_auto] md:items-center md:gap-x-24 md:px-[8vw] md:py-20 max-w-full overflow-x-hidden">
        <Link className="absolute left-5 top-7 grid h-11 w-11 place-items-center rounded-2xl bg-white/60 text-2xl text-slate-950 md:left-10 md:top-9" to="/">←</Link>

        <div className="mx-auto max-w-md text-center md:row-span-2 md:max-w-xl">
          <img className="mx-auto mb-5 h-24 w-24 rounded-3xl bg-white object-contain shadow-[0_14px_30px_rgba(9,105,163,0.12)] md:h-28 md:w-28" src={logoJmGym} alt="Logo de JMGym" />
          <h1 className="font-display text-4xl font-bold leading-none tracking-tight text-brand-600 md:text-7xl">Bienvenida a JMGym</h1>
          <p className="mt-4 leading-relaxed text-slate-500 md:text-lg">Reserva tus clases de baile favoritas en segundos. Encuentra tu ritmo, elige tu espacio y a bailar!</p>
        </div>

        <div className="mx-auto grid w-full max-w-md gap-4 md:max-w-[620px] md:justify-self-start">
          {benefits.map((benefit) => (
            <article className="flex items-center gap-4 rounded-3xl bg-white/70 p-5 md:gap-6 md:p-7" key={benefit.title}>
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-100 text-xl md:h-16 md:w-16 md:text-2xl" aria-hidden="true">{benefit.icon}</div>
              <div>
                <h2 className="font-extrabold text-slate-900 md:text-xl">{benefit.title}</h2>
                <p className="mt-1 text-sm text-slate-500 md:text-base">{benefit.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto w-full max-w-md text-center md:max-w-[620px] md:justify-self-start">
          <Link className="grid min-h-14 place-items-center rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 font-extrabold text-white shadow-soft md:min-h-16 md:text-lg" to="/cliente/login">Comenzar</Link>
          <p className="mt-3 text-sm text-slate-500 md:text-base">¿Ya tienes cuenta? <Link className="font-extrabold text-brand-600" to="/cliente/login">Inicia sesion</Link></p>
        </div>
      </section>
    </main>
  );
}

export default Welcome;
