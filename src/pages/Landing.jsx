import { Link } from 'react-router-dom';
import PublicFooter from '../components/common/PublicFooter.jsx';
import PublicHeader from '../components/common/PublicHeader.jsx';
import logoJmGym from '../assets/logos/logo-jmgym.jpeg';
import cardioImage from '../assets/images/cardio.jpg';
import heroBackgroundImage from '../assets/images/jmworkoutparatras.jpg';
import sedeBackgroundImage from '../assets/images/jmworkoutport2.jpg';
import trenSuperiorImage from '../assets/images/trensuperior.jpg';
import zumbaImage from '../assets/images/zumba.jpg';

const programs = [
  {
    title: 'Strength',
    text: 'Entrenamientos de fuerza para construir masa muscular, tecnica y confianza en cada sesion.',
    image: trenSuperiorImage,
  },
  {
    title: 'Cardio Burn',
    text: 'Sesiones dinamicas para elevar tu resistencia, acelerar tu energia y mejorar tu condicion fisica.',
    image: cardioImage,
  },
  {
    title: 'Dance Fit',
    text: 'Ritmo, coordinacion y movimiento para entrenar con intensidad sin perder la diversion.',
    image: zumbaImage,
  },
];

const services = [
  {
    title: 'Plan de entrenamiento',
    text: 'Rutinas organizadas para avanzar con objetivos claros y sesiones pensadas para tu nivel.',
  },
  {
    title: 'Clases grupales',
    text: 'Entrena con energia, acompanamiento y una agenda variada de actividades durante la semana.',
  },
  {
    title: 'Reserva de espacios',
    text: 'Gestiona tu asistencia desde el sistema digital y asegura tu lugar antes de llegar al gimnasio.',
  },
  {
    title: 'Seguimiento fitness',
    text: 'Mantente conectado con tus clases, reservas y proximos entrenamientos desde cualquier dispositivo.',
  },
];

const extraServices = [
  'Personal trainer',
  'Asesoria fitness',
  'Comunidad JMGym',
  'Gestion para administradores',
];

const gymAddress = 'Av. Conde de Lemos 420, Callao 07006';

function Landing() {
  return (
    <main className="min-h-screen bg-[#07111f] text-primary-foreground">
      <PublicHeader />

      <section
        id="inicio"
        className="relative grid min-h-[calc(100vh-81px)] place-items-center overflow-hidden bg-cover bg-center px-5 py-20 text-center"
        style={{ backgroundImage: `linear-gradient(110deg, rgba(7,17,31,.88), rgba(8,47,73,.58), rgba(7,17,31,.9)), url(${heroBackgroundImage})` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,.2),transparent_28%),radial-gradient(circle_at_78%_0%,rgba(37,99,235,.24),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07111f] to-transparent" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-[44px] bg-primary/35 blur-3xl" />
            <img
              src={logoJmGym}
              alt="Logo JMGym"
              className="relative h-36 w-36 rounded-[42px] bg-card object-contain p-5 shadow-[0_28px_90px_rgba(34,211,238,.24)] sm:h-44 sm:w-44"
            />
          </div>
          <p className="mt-9 max-w-5xl text-5xl font-black uppercase leading-none tracking-[0.12em] text-primary-foreground drop-shadow-[0_14px_40px_rgba(0,0,0,.35)] sm:text-6xl lg:text-8xl">
            Supera tus limites
          </p>
          <p className="mt-6 max-w-2xl text-base font-semibold uppercase tracking-[0.28em] text-cyan-100/80 sm:text-lg">
            Entrena con energia, reserva con claridad
          </p>
          <Link
            to="/cliente/login"
            className="mt-12 inline-flex rounded-full bg-primary px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-primary-foreground shadow-[0_18px_48px_rgba(34,211,238,.22)] transition hover:-translate-y-1 hover:bg-card hover:text-foreground"
          >
            Ingresar Cliente
          </Link>
        </div>
      </section>

      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,.22),transparent_28%),radial-gradient(circle_at_78%_0%,rgba(37,99,235,.28),transparent_30%)]" />
        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div className="relative z-10">
            <span className="inline-flex rounded-full border border-cyan-200/30 bg-primary-foreground/8 px-5 py-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-100">
              Entrena diferente
            </span>
            <h1 className="mt-7 max-w-4xl font-display text-6xl font-black leading-[0.88] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              Cambia tu mente, transforma tu cuerpo
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-primary-foreground/72">
              Una experiencia de entrenamiento integral para moverte mejor, reservar tus clases y mantener el control de tu progreso desde una sola plataforma.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#programas"
                className="rounded-full bg-card px-7 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-foreground transition hover:bg-primary hover:text-primary-foreground"
              >
                Ver programas
              </a>
              <a
                href="#acceso"
                className="rounded-full border border-primary-foreground/25 px-7 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-primary-foreground transition hover:border-cyan-200 hover:text-cyan-100"
              >
                Acceder al sistema
              </a>
            </div>
          </div>

          <div className="relative z-10 rounded-[42px] border border-primary-foreground/10 bg-primary-foreground/8 p-4 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              <img src={trenSuperiorImage} alt="Entrenamiento de fuerza" className="h-72 w-full rounded-[32px] object-cover sm:h-[440px]" />
              <div className="grid gap-4">
                <img src={cardioImage} alt="Entrenamiento cardio" className="h-52 w-full rounded-[32px] object-cover" />
                <div className="rounded-[32px] bg-primary p-7 text-primary-foreground">
                  <p className="text-sm font-black uppercase tracking-[0.22em]">JMGym 360</p>
                  <p className="mt-5 text-4xl font-black leading-none">Reserva, entrena y evoluciona.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="sede"
        className="relative overflow-hidden bg-[#07111f] bg-cover bg-center px-5 py-20 text-primary-foreground lg:px-8"
        style={{ backgroundImage: `linear-gradient(110deg, rgba(7,17,31,.9), rgba(8,47,73,.58), rgba(7,17,31,.9)), url(${sedeBackgroundImage})` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(34,211,238,.24),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(37,99,235,.2),transparent_28%)]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-200">Nuestra sede</p>
            <h2 className="mt-4 max-w-xl text-5xl font-black tracking-[-0.05em] lg:text-6xl">Decide hoy, entrena esta semana</h2>
          </div>
          <article className="rounded-[36px] border border-primary-foreground/10 bg-primary p-8 text-primary-foreground shadow-[0_24px_90px_rgba(0,0,0,.32)] backdrop-blur lg:p-10">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="rounded-full bg-card px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-foreground">Sede principal</span>
                <h3 className="mt-6 text-4xl font-black">JMGym Callao</h3>
                <p className="mt-3 max-w-xl text-primary-foreground/70">{gymAddress}, Callao.</p>
                <p className="mt-4 max-w-2xl leading-7 text-primary-foreground/68">
                  Conoce los horarios, contacto y ubicacion exacta de nuestra sede principal.
                </p>
              </div>
              <Link to="/sede" className="rounded-full bg-card px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-foreground transition hover:bg-surface">
                Ver detalles
              </Link>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] bg-primary-foreground/8 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">Zona</p>
                <p className="mt-2 font-black">Callao, Callao</p>
              </div>
              <div className="rounded-[24px] bg-primary-foreground/8 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">Clases</p>
                <p className="mt-2 font-black">Presenciales</p>
              </div>
              <div className="rounded-[24px] bg-primary-foreground/8 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">Reservas</p>
                <p className="mt-2 font-black">Desde el sistema</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="programas" className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-200">Sistema JMGym 360</p>
              <h2 className="mt-4 max-w-3xl text-5xl font-black tracking-[-0.05em] lg:text-6xl">Programas para entrenar con direccion</h2>
            </div>
            <p className="max-w-md text-primary-foreground/64">Elige una experiencia segun tu energia, tus objetivos y el tipo de entrenamiento que quieres sostener.</p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {programs.map((program) => (
              <article key={program.title} className="group overflow-hidden rounded-[34px] border border-primary-foreground/10 bg-primary-foreground/8">
                <img src={program.image} alt={program.title} className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-7">
                  <h3 className="text-3xl font-black">{program.title}</h3>
                  <p className="mt-4 leading-7 text-primary-foreground/68">{program.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="servicios" className="bg-surface px-5 py-20 text-foreground lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-700">Nuestros servicios</p>
          <h2 className="mt-4 max-w-3xl text-5xl font-black tracking-[-0.05em] lg:text-6xl">Todo lo que necesitas para entrenar mejor</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <article key={service.title} className="rounded-[32px] bg-card p-8 shadow-[0_16px_50px_rgba(15,23,42,.08)]">
                <div className="mb-8 h-2 w-20 rounded-full bg-brand-600" />
                <h3 className="text-3xl font-black">{service.title}</h3>
                <p className="mt-4 leading-7 text-secondary">{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-200">Servicios complementarios</p>
            <h2 className="mt-4 text-5xl font-black tracking-[-0.05em] lg:text-6xl">La experiencia continua fuera de la sala</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {extraServices.map((service) => (
              <article key={service} className="rounded-[30px] border border-primary-foreground/10 bg-primary-foreground/8 p-7">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">JMGym plus</p>
                <h3 className="mt-4 text-2xl font-black">{service}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="acceso" className="bg-card px-5 py-20 text-foreground lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_.95fr] lg:items-center">
          <div className="rounded-[38px] bg-gradient-to-br from-[#0a4fb9] via-[#1364d2] to-[#2490e5] p-8 text-primary-foreground lg:p-10">
            <span className="inline-flex rounded-full bg-primary-foreground/12 px-4 py-2 text-xs font-black uppercase tracking-[0.22em]">Sistema de reservas</span>
            <h2 className="mt-6 max-w-[10ch] font-display text-5xl font-black leading-[0.9] md:text-6xl">Reserva tus clases</h2>
            <p className="mt-5 max-w-xl leading-7 text-primary-foreground/90">Consulta horarios, reserva espacios y administra tus actividades desde cualquier dispositivo.</p>
            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] bg-primary-foreground/12 p-5 backdrop-blur-sm">
                <p className="text-lg font-black">Reserva rapida</p>
                <p className="mt-2 text-sm text-primary-foreground/78">Encuentra clases en pocos pasos.</p>
              </div>
              <div className="rounded-[24px] bg-primary-foreground/12 p-5 backdrop-blur-sm">
                <p className="text-lg font-black">Experiencia comoda</p>
                <p className="mt-2 text-sm text-primary-foreground/78">Interfaz simple y facil de entender.</p>
              </div>
              <div className="rounded-[24px] bg-primary-foreground/12 p-5 backdrop-blur-sm">
                <p className="text-lg font-black">Multiplataforma</p>
                <p className="mt-2 text-sm text-primary-foreground/78">Usalo desde movil, tablet o escritorio.</p>
              </div>
            </div>
          </div>

          <aside className="rounded-[34px] bg-card p-8 shadow-[0_20px_60px_rgba(15,23,42,.12)] lg:p-10">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-brand-700">Comenzar</span>
            <h2 className="mt-4 text-5xl font-black tracking-[-0.04em] text-foreground">Selecciona tu acceso</h2>
            <p className="mt-4 text-lg text-secondary">Elige el perfil con el que deseas ingresar.</p>
            <div className="mt-8 grid gap-4">
              <Link to="/cliente/login" className="flex items-center justify-between rounded-[26px] bg-brand-700 px-8 py-6 text-primary-foreground transition hover:scale-[1.01]">
                <div>
                  <h3 className="text-2xl font-black">Cliente</h3>
                  <p className="text-primary-foreground/80">Reservar y gestionar clases</p>
                </div>
                <span className="text-3xl" aria-hidden="true">-&gt;</span>
              </Link>

              <Link to="/admin/login" className="flex items-center justify-between rounded-[26px] border-2 border-border bg-surface px-8 py-6 transition hover:bg-border-light">
                <div>
                  <h3 className="text-2xl font-black text-foreground">Administrador</h3>
                  <p className="text-muted">Gestion del sistema</p>
                </div>
                <span className="text-3xl" aria-hidden="true">-&gt;</span>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[42px] bg-primary p-8 text-primary-foreground lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em]">Empieza hoy</p>
              <h2 className="mt-4 max-w-3xl text-5xl font-black tracking-[-0.05em] lg:text-6xl">Tu proxima reserva esta a un click</h2>
            </div>
            <a href="#acceso" className="rounded-full bg-card px-8 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-foreground transition hover:bg-surface">
              Acceder al sistema
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

export default Landing;
