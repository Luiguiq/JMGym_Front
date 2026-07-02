import { Apple, ArrowUpRight, CalendarCheck, Dumbbell, MessageCircle, Sparkles, UserCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicFooter from '../components/common/PublicFooter.jsx';
import PublicHeader from '../components/common/PublicHeader.jsx';
import heroBackgroundImage from '../assets/images/jmworkoutparatras.jpg';
import cardioImage from '../assets/images/cardio.jpg';
import trenSuperiorImage from '../assets/images/trensuperior.jpg';

const services = [
  {
    icon: Dumbbell,
    title: 'Plan de entrenamiento',
    eyebrow: 'Ruta fisica',
    text: 'Rutinas pensadas para avanzar con objetivos claros, combinando fuerza, resistencia y tecnica segun tu nivel.',
  },
  {
    icon: Users,
    title: 'Clases grupales',
    eyebrow: 'Energia compartida',
    text: 'Sesiones con ritmo, acompanamiento y motivacion para entrenar en comunidad sin perder el foco personal.',
  },
  {
    icon: Apple,
    title: 'Plan de nutricion',
    eyebrow: 'Habitos reales',
    text: 'Orientacion alimentaria para complementar tu entrenamiento, mejorar tus decisiones diarias y sostener resultados.',
  },
  {
    icon: UserCheck,
    title: 'Personal trainer',
    eyebrow: 'Acompanamiento directo',
    text: 'Entrena con seguimiento personalizado, correccion tecnica y una estrategia ajustada a tu ritmo y objetivo.',
  },
  {
    icon: MessageCircle,
    title: 'Comunidad de WhatsApp',
    eyebrow: 'Siempre conectado',
    text: 'Recibe noticias, novedades, horarios, recordatorios y anuncios importantes para no perderte nada del gimnasio.',
  },
];

function Servicios() {
  return (
    <main className="min-h-screen bg-surface text-foreground">
      <PublicHeader subtitle="Servicios" />

      <div className="animate-page-enter">
        <section
          className="relative overflow-hidden bg-[#07111f] bg-cover bg-center px-5 py-24 text-primary-foreground lg:px-8 lg:py-32"
          style={{ backgroundImage: `linear-gradient(110deg, rgba(7,17,31,.94), rgba(8,47,73,.68), rgba(7,17,31,.86)), url(${heroBackgroundImage})` }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(34,211,238,.24),transparent_30%),radial-gradient(circle_at_78%_0%,rgba(37,99,235,.22),transparent_30%)]" />
          <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.85fr] lg:items-end">
            <div>
              <span className="inline-flex rounded-full border border-cyan-200/30 bg-primary-foreground/8 px-5 py-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-100">
                Servicios JMGym
              </span>
              <h1 className="mt-7 max-w-4xl font-display text-6xl font-black leading-[0.9] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                Todo lo que necesitas para avanzar
              </h1>
            </div>
            <div className="rounded-[34px] border border-primary-foreground/10 bg-primary-foreground/8 p-7 backdrop-blur">
              <Sparkles className="h-8 w-8 text-cyan-200" aria-hidden="true" />
              <p className="mt-5 text-lg leading-8 text-primary-foreground/76">
                Entrena, reserva, acompaniate y mantente conectado con servicios disenados para que tu rutina sea clara, motivadora y sostenible.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
            <div className="sticky top-28 hidden lg:block">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-700">Tu experiencia</p>
              <h2 className="mt-4 text-5xl font-black tracking-[-0.05em]">Una ruta para entrenar mejor</h2>
              <p className="mt-6 leading-8 text-secondary">
                No se trata de sumar servicios aislados. La idea es que cada pieza te ayude a organizarte, entrenar con foco y mantenerte conectado.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-4 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-cyan-400 via-brand-500 to-transparent md:block" />
              <div className="grid gap-6">
                {services.map((service, index) => {
                  const Icon = service.icon;

                  return (
                    <article
                      key={service.title}
                      className="group relative overflow-hidden rounded-[34px] bg-card p-7 shadow-[0_18px_55px_rgba(7,17,31,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_75px_rgba(7,17,31,.14)] md:ml-16 lg:p-8"
                    >
                      <div className="absolute inset-y-0 left-0 w-1 bg-primary opacity-0 transition group-hover:opacity-100" />
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-[#07111f] text-cyan-200 shadow-[0_18px_40px_rgba(7,17,31,.18)] transition duration-300 group-hover:rotate-3 group-hover:scale-105">
                          <Icon className="h-8 w-8" aria-hidden="true" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-black uppercase tracking-[0.22em] text-brand-700">{service.eyebrow}</span>
                            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-brand-700">0{index + 1}</span>
                          </div>
                          <h3 className="mt-3 text-3xl font-black tracking-[-0.03em]">{service.title}</h3>
                          <p className="mt-4 max-w-2xl leading-7 text-secondary">{service.text}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#07111f] px-5 py-20 text-primary-foreground lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-200">Como se conecta todo</p>
              <h2 className="mt-4 max-w-2xl text-5xl font-black tracking-[-0.05em] lg:text-6xl">
                De la reserva al resultado
              </h2>
              <p className="mt-6 max-w-xl leading-8 text-primary-foreground/68">
                Agenda tu clase, entrena con una ruta clara, recibe acompanamiento y mantente informado desde la comunidad.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[30px] border border-primary-foreground/10 bg-primary-foreground/8 p-6">
                <CalendarCheck className="h-8 w-8 text-cyan-200" aria-hidden="true" />
                <p className="mt-5 text-xl font-black">Reserva</p>
                <p className="mt-3 text-sm leading-6 text-primary-foreground/64">Organiza tu asistencia desde el sistema.</p>
              </div>
              <div className="rounded-[30px] bg-primary p-6 text-primary-foreground">
                <Dumbbell className="h-8 w-8" aria-hidden="true" />
                <p className="mt-5 text-xl font-black">Entrena</p>
                <p className="mt-3 text-sm leading-6 text-primary-foreground/90">Sigue un plan y participa en clases activas.</p>
              </div>
              <div className="rounded-[30px] border border-primary-foreground/10 bg-primary-foreground/8 p-6">
                <ArrowUpRight className="h-8 w-8 text-cyan-200" aria-hidden="true" />
                <p className="mt-5 text-xl font-black">Progresa</p>
                <p className="mt-3 text-sm leading-6 text-primary-foreground/64">Ajusta habitos y vuelve por el siguiente reto.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[42px] bg-card shadow-[0_28px_80px_rgba(7,17,31,.12)] lg:grid-cols-[1fr_.9fr]">
            <div className="p-8 lg:p-12">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-700">Empieza hoy</p>
              <h2 className="mt-5 max-w-2xl text-5xl font-black tracking-[-0.05em] lg:text-6xl">Elige tu punto de partida</h2>
              <p className="mt-6 max-w-xl leading-8 text-secondary">
                Puedes ingresar al sistema para reservar o revisar la sede antes de visitarnos.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/cliente/login" className="rounded-full bg-[#07111f] px-7 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-brand-700">
                  Ingresar cliente
                </Link>
                <Link to="/sede" className="rounded-full border border-border px-7 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-foreground transition hover:border-brand-700 hover:text-brand-700">
                  Ver sede
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-[#07111f] p-4 lg:p-5">
              <img src={trenSuperiorImage} alt="Plan de entrenamiento" className="h-full min-h-72 rounded-[30px] object-cover" />
              <img src={cardioImage} alt="Entrenamiento cardio" className="h-full min-h-72 rounded-[30px] object-cover" />
            </div>
          </div>
        </section>
      </div>

      <PublicFooter />
    </main>
  );
}

export default Servicios;
