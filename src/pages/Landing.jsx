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
    <main className="min-h-dvh overflow-y-auto overflow-x-hidden bg-[#eaf3fb]">

      <section className="mx-auto flex min-h-dvh max-w-7xl flex-col px-4 py-3 sm:px-5 sm:py-4 lg:px-10">

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
                    mt-4
                    max-w-[10ch]
                    font-display
                    text-4xl
                    font-black
                    leading-[0.9]
                    sm:text-5xl
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
                  gap-2
                  pt-6
                  sm:grid-cols-3
                  sm:gap-3
                "
              >
                {features.map((item) => (
                  <article
                    key={item.title}
                    className="
                      rounded-[24px]
                      bg-white/10
                      p-4
                      backdrop-blur-sm
                      sm:p-5
                    "
                  >
                    <div
                      className="
                        mb-2
                        grid
                        h-10
                        w-10
                        place-items-center
                        rounded-2xl
                        bg-white/10
                        text-lg
                        sm:h-12
                        sm:w-12
                        sm:text-xl
                      "
                    >
                      {item.icon}
                    </div>

                    <h3
                      className="
                        text-base
                        font-extrabold
                        sm:text-lg
                      "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-white/80
                        sm:mt-2
                        sm:text-sm
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
                  mt-3
                  text-3xl
                  font-black
                  text-slate-900
                  sm:text-5xl
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

              <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4">

                <Link
                  to="/cliente/login"
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-[26px]
                    bg-brand-700
                    px-5
                    py-4
                    text-white
                    transition
                    hover:scale-[1.01]
                    sm:px-8
                    sm:py-6
                  "
                >
                  <div>
                    <h3 className="text-xl font-black sm:text-2xl">
                      👤 Cliente
                    </h3>

                    <p className="text-sm text-white/80 sm:text-base">
                      Reservar y gestionar clases
                    </p>
                  </div>

                  <span className="text-2xl sm:text-3xl">
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
                    px-5
                    py-4
                    transition
                    hover:bg-slate-100
                    sm:px-8
                    sm:py-6
                  "
                >
                  <div>

                    <h3
                      className="
                        text-xl
                        font-black
                        text-slate-900
                        sm:text-2xl
                      "
                    >
                      🛠 Administrador
                    </h3>

                    <p className="text-sm text-slate-500 sm:text-base">
                      Gestión del sistema
                    </p>

                  </div>

                  <span className="text-2xl sm:text-3xl">
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