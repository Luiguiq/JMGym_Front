import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ProfileOption from '../../components/user/ProfileOption.jsx';

function Perfil() {
  const { user, logout } = useAuth();

  const stats = [
    {
      label: 'Reservas',
      value: user?.totalReservas ?? 12,
      icon: '📅',
    },
    {
      label: 'Completadas',
      value: user?.clasesCompletadas ?? 8,
      icon: '🏆',
    },
  ];

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/cliente/login');
  }

  return (
    <main className="min-h-screen bg-brand-50">
      <section className="relative min-h-screen bg-[linear-gradient(180deg,#fbfdff_0%,#edf8ff_100%)] pb-28 md:grid md:grid-cols-[minmax(360px,0.78fr)_minmax(500px,0.85fr)] md:content-center md:gap-x-24 md:bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.95),transparent_28rem),linear-gradient(180deg,#f7fcff_0%,#e8f7ff_100%)] md:px-[8vw] md:py-12 md:pb-28">
        <header
          className="
            mx-5
            mt-5
            rounded-[32px]
            bg-gradient-to-br
            from-[#004aab]
            via-[#0058c9]
            to-sky-500
            px-6
            py-8
            text-center
            text-white
            shadow-xl
            md:mx-0
          "
        >

          <div
            className="
              mx-auto
              flex
              h-28
              w-28
              items-center
              justify-center
              rounded-full
              bg-white/20
              text-6xl
              backdrop-blur-sm
              border
              border-white/20
            "
          >
            👤
          </div>

          <h1
            className="
              mt-5
              text-3xl
              font-black
            "
          >
            {user?.name ?? 'Usuario'}
          </h1>

          <p
            className="
              mt-2
              text-sky-100
            "
          >
            {user?.email ?? ''}
          </p>

        </header>

        <div className="px-5 pt-6 md:px-0 md:pt-0">
          <div
            className="
              mx-5
              mt-5
              grid
              grid-cols-2
              gap-4
              md:mx-0
            "
          >
            {stats.map((item) => (
              <div
                key={item.label}
                className="
                  rounded-3xl
                  bg-white
                  p-5
                  text-center
                  shadow-[0_10px_25px_rgba(15,86,130,.08)]
                  border
                  border-sky-100
                "
              >
                <div className="text-3xl">
                  {item.icon}
                </div>

                <p
                  className="
                    mt-3
                    text-3xl
                    font-black
                    text-[#004aab]
                  "
                >
                  {item.value}
                </p>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-slate-500
                  "
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <h2
            className="
              mx-5
              mt-6
              mb-3
              text-sm
              uppercase
              tracking-wider
              font-bold
              text-slate-400
              md:mx-0
            "
          >
            Mi cuenta
          </h2>
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)]">
            <ProfileOption
              icon="📝"
              label="Editar perfil"
            />
            <div className="h-px bg-slate-100" />
            <ProfileOption
              icon="💳"
              label="Historial de pagos"
            />
            <div className="h-px bg-slate-100" />
            <ProfileOption
              icon="🔔"
              label="Notificaciones"
              badge={0}
            />
          </div>

          <h2
            className="
              mx-5
              mt-6
              mb-3
              text-sm
              uppercase
              tracking-wider
              font-bold
              text-slate-400
              md:mx-0
            "
          >
            Preferencias
          </h2>

          <div className="mt-4 overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)]">
            <ProfileOption icon="⚙️" label="Configuracion" />
            <div className="h-px bg-slate-100" />
            <ProfileOption icon="❓" label="Ayuda y soporte" />
          </div>

          <div className="mt-5">
            <button className="w-full text-left" onClick={handleLogout} type="button">
              <ProfileOption
                icon="↩️"
                label="Cerrar sesión"
                danger
              />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Perfil;
