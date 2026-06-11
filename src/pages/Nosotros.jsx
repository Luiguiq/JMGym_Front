import { Link } from 'react-router-dom';
import PublicFooter from '../components/common/PublicFooter.jsx';
import PublicHeader from '../components/common/PublicHeader.jsx';
import heroBackgroundImage from '../assets/images/jmworkoutparatras.jpg';
import trenSuperiorImage from '../assets/images/trensuperior.jpg';
import zumbaImage from '../assets/images/zumba.jpg';

const pillars = [
  {
    title: 'Movimiento',
    text: 'Entrenar no es solo completar una clase: es construir energia, tecnica y constancia en cada visita.',
  },
  {
    title: 'Comunidad',
    text: 'Creamos un espacio donde cada persona se sienta acompanada, motivada y lista para avanzar a su ritmo.',
  },
  {
    title: 'Progreso',
    text: 'Unimos clases presenciales y reservas digitales para que organizar tu rutina sea simple y sostenible.',
  },
];

function Nosotros() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <PublicHeader subtitle="Sobre nosotros" />

      <div className="animate-page-enter">
        <section
          className="relative overflow-hidden bg-[#07111f] bg-cover bg-center px-5 py-24 text-white lg:px-8 lg:py-32"
          style={{ backgroundImage: `linear-gradient(110deg, rgba(7,17,31,.92), rgba(8,47,73,.68), rgba(7,17,31,.9)), url(${heroBackgroundImage})` }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(34,211,238,.24),transparent_32%)]" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <span className="inline-flex rounded-full border border-cyan-200/30 bg-white/8 px-5 py-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-100">
              Conoce JMGym
            </span>
            <h1 className="mt-7 max-w-4xl font-display text-6xl font-black leading-[0.9] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              Donde cada reserva empieza una mejor version
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/76">
              Somos un gimnasio pensado para entrenar con claridad: clases presenciales, una experiencia digital simple y un ambiente que te empuja a superar tus propios limites.
            </p>
          </div>
        </section>

        <section className="px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-700">Sobre nosotros</p>
              <h2 className="mt-4 max-w-2xl text-5xl font-black tracking-[-0.05em] lg:text-6xl">
                Entrenar mejor tambien debe sentirse mas simple
              </h2>
            </div>

            <div className="rounded-[38px] bg-white p-8 shadow-[0_24px_70px_rgba(7,17,31,.08)] lg:p-10">
              <p className="text-lg leading-8 text-slate-700">
                JMGym nace para acercar el entrenamiento a las personas de una forma practica, motivadora y ordenada. Combinamos espacios funcionales, clases con energia y una plataforma que facilita tus reservas para que puedas enfocarte en lo importante: moverte, mejorar y volver manana.
              </p>
              <p className="mt-6 text-lg leading-8 text-slate-700">
                Creemos que la constancia se construye cuando el gimnasio se siente cercano, cuando reservar es sencillo y cuando cada clase te deja con ganas de dar el siguiente paso.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#07111f] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
            <article className="rounded-[38px] border border-white/10 bg-white/8 p-8 backdrop-blur lg:p-10">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-200">Mision</p>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] lg:text-5xl">Impulsar habitos que se sostienen</h2>
              <p className="mt-6 text-lg leading-8 text-white/70">
                Acompanar a cada persona a construir una rutina saludable mediante entrenamientos accesibles, espacios funcionales y una plataforma que haga mas facil organizar cada clase.
              </p>
            </article>

            <article className="rounded-[38px] bg-cyan-300 p-8 text-slate-950 lg:p-10">
              <p className="text-sm font-black uppercase tracking-[0.24em]">Vision</p>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] lg:text-5xl">Ser una experiencia fitness cercana y digital</h2>
              <p className="mt-6 text-lg leading-8 text-slate-800">
                Convertirnos en un referente de entrenamiento presencial y reservas digitales, donde cada usuario encuentre motivacion, comunidad y herramientas para superar sus limites.
              </p>
            </article>
          </div>
        </section>

        <section className="px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-700">Nuestra forma de entrenar</p>
                <h2 className="mt-4 max-w-3xl text-5xl font-black tracking-[-0.05em] lg:text-6xl">Tres ideas que nos mueven</h2>
              </div>
              <p className="max-w-md leading-7 text-slate-600">
                No buscamos que entrenes perfecto. Buscamos que empieces, regreses y notes que estas avanzando.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {pillars.map((pillar) => (
                <article key={pillar.title} className="rounded-[34px] bg-white p-8 shadow-[0_18px_55px_rgba(7,17,31,.08)]">
                  <div className="mb-8 h-2 w-20 rounded-full bg-cyan-400" />
                  <h3 className="text-3xl font-black">{pillar.title}</h3>
                  <p className="mt-4 leading-7 text-slate-600">{pillar.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[42px] bg-[#07111f] text-white shadow-[0_28px_80px_rgba(7,17,31,.2)] lg:grid-cols-[.95fr_1.05fr]">
            <div className="p-8 lg:p-12">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-200">Supera tus limites</p>
              <h2 className="mt-5 max-w-2xl text-5xl font-black tracking-[-0.05em] lg:text-6xl">Tu proxima clase puede ser el inicio</h2>
              <p className="mt-6 max-w-xl leading-8 text-white/70">
                Conoce nuestra sede o entra al sistema para reservar tu proximo entrenamiento.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/cliente/login" className="rounded-full bg-cyan-300 px-7 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-white">
                  Ingresar cliente
                </Link>
                <Link to="/sede" className="rounded-full border border-white/20 px-7 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-white transition hover:border-cyan-200 hover:text-cyan-100">
                  Ver sede
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 lg:p-5">
              <img src={trenSuperiorImage} alt="Entrenamiento de fuerza" className="h-full min-h-72 rounded-[30px] object-cover" />
              <img src={zumbaImage} alt="Clase grupal en JMGym" className="h-full min-h-72 rounded-[30px] object-cover" />
            </div>
          </div>
        </section>
      </div>

      <PublicFooter />
    </main>
  );
}

export default Nosotros;
