import { Link } from 'react-router-dom';
import logoJmGym from '../assets/logos/logo-jmgym.jpeg';

const features = [
  {
    icon: '⚡',
    title: 'Reserva rápida',
    text: 'Encuentra clases en pocos pasos.',
  },
  {
    icon: '🧘',
    title: 'Experiencia cómoda',
    text: 'Interfaz simple y fácil de entender.',
  },
  {
    icon: '📱',
    title: 'Multiplataforma',
    text: 'Úsalo desde móvil, tablet o escritorio.',
  },
];

function Landing() {
  return (
    <main className="h-screen overflow-hidden bg-[#eaf3fb]">

      <section className="mx-auto flex h-full max-w-7xl flex-col px-5 py-4 lg:px-10">

        {/* HEADER */}
        <header
          className="
            flex
            items-center
            gap-4
            rounded-[28px]
            bg-white
            px-5
            py-3
            shadow-[0_10px_30px_rgba(15,23,42,.06)]
          "
        >
          <img
            src={logoJmGym}
            alt="Logo JMGym"
            className="
              h-14
              w-14
              rounded-2xl
              object-contain
            "
          />

          <div>
            <h1 className="text-3xl font-black text-slate-900">
              JMGym
            </h1>

            <p className="text-sm text-slate-500">
              Reserva clases fácilmente
            </p>
          </div>
        </header>

        {/* HERO */}
        <div
          className="
            mt-4
            grid
            flex-1
            gap-6
            overflow-hidden
            lg:grid-cols-[1.05fr_.95fr]
          "
        >

          {/* IZQUIERDA */}
          <section
            className="
              rounded-[34px]
              bg-gradient-to-br
              from-[#0a4fb9]
              via-[#1364d2]
              to-[#2490e5]
              p-8
              text-white
              lg:p-10
            "
          >

            <div className="flex h-full flex-col">

              <div>
                <span
                  className="
                    inline-flex
                    rounded-full
                    bg-white/10
                    px-4
                    py-2
                    text-xs
                    font-black
                    tracking-[0.22em]
                  "
                >
                  SISTEMA DE RESERVAS
                </span>

                <h2
                  className="
                    mt-6
                    max-w-[10ch]
                    font-display
                    text-5xl
                    font-black
                    leading-[0.9]
                    md:text-6xl
                  "
                >
                  Reserva tus clases
                </h2>

                <p
                  className="
                    mt-5
                    max-w-xl
                    text-base
                    leading-relaxed
                    text-white/92
                  "
                >
                  Consulta horarios, reserva espacios y administra
                  tus actividades desde cualquier dispositivo.
                </p>
              </div>

              {/* BENEFICIOS */}
              <div
                className="
                  mt-auto
                  grid
                  gap-3
                  pt-8
                  sm:grid-cols-3
                "
              >
                {features.map((item) => (
                  <article
                    key={item.title}
                    className="
                      rounded-[24px]
                      bg-white/10
                      p-5
                      backdrop-blur-sm
                    "
                  >
                    <div
                      className="
                        mb-3
                        grid
                        h-12
                        w-12
                        place-items-center
                        rounded-2xl
                        bg-white/10
                        text-xl
                      "
                    >
                      {item.icon}
                    </div>

                    <h3
                      className="
                        text-lg
                        font-extrabold
                      "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                        mt-2
                        text-sm
                        text-white/80
                      "
                    >
                      {item.text}
                    </p>

                  </article>
                ))}
              </div>

            </div>

          </section>

          {/* DERECHA */}
          <aside
            className="
              flex
              items-center
            "
          >

            <div
              className="
                w-full
                rounded-[34px]
                bg-white
                p-8
                shadow-[0_20px_60px_rgba(15,23,42,.08)]
                lg:p-10
              "
            >

              <span
                className="
                  text-xs
                  font-black
                  tracking-[0.24em]
                  text-brand-700
                "
              >
                COMENZAR
              </span>

              <h2
                className="
                  mt-4
                  text-5xl
                  font-black
                  text-slate-900
                "
              >
                Selecciona tu acceso
              </h2>

              <p
                className="
                  mt-4
                  text-lg
                  text-slate-600
                "
              >
                Elige el perfil con el que deseas ingresar.
              </p>

              <div className="mt-8 grid gap-4">

                <Link
                  to="/cliente/login"
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-[26px]
                    bg-brand-700
                    px-8
                    py-6
                    text-white
                    transition
                    hover:scale-[1.01]
                  "
                >
                  <div>
                    <h3 className="text-2xl font-black">
                      👤 Cliente
                    </h3>

                    <p className="text-white/80">
                      Reservar y gestionar clases
                    </p>
                  </div>

                  <span className="text-3xl">
                    →
                  </span>
                </Link>

                <Link
                  to="/admin/login"
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-[26px]
                    border-2
                    border-slate-200
                    bg-slate-50
                    px-8
                    py-6
                    transition
                    hover:bg-slate-100
                  "
                >
                  <div>

                    <h3
                      className="
                        text-2xl
                        font-black
                        text-slate-900
                      "
                    >
                      🛠 Administrador
                    </h3>

                    <p className="text-slate-500">
                      Gestión del sistema
                    </p>

                  </div>

                  <span className="text-3xl">
                    →
                  </span>

                </Link>

              </div>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}

export default Landing;