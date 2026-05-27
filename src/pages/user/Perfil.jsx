import { Link } from 'react-router-dom';
import BottomNav from '../../components/user/BottomNav.jsx';
import ProfileOption from '../../components/user/ProfileOption.jsx';

const profileData = {
  name: 'Maria Garcia Lopez',
  email: 'maria@correo.com',
  stats: [
    { label: 'Clases', value: '12' },
    { label: 'Este mes', value: '3' },
    { label: 'Ahorrado', value: 'S/ 75' },
  ],
  notifications: 3,
};

function Perfil() {
  return (
    <main className="min-h-screen bg-brand-50">
      <section className="relative min-h-screen bg-[linear-gradient(180deg,#fbfdff_0%,#edf8ff_100%)] pb-28 md:grid md:grid-cols-[minmax(360px,0.78fr)_minmax(500px,0.85fr)] md:content-center md:gap-x-24 md:bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.95),transparent_28rem),linear-gradient(180deg,#f7fcff_0%,#e8f7ff_100%)] md:px-[8vw] md:py-12 md:pb-28">
        <header className="bg-gradient-to-br from-brand-500 via-brand-600 to-sky-400 px-6 pb-8 pt-9 text-center text-white shadow-soft md:min-h-[560px] md:rounded-[38px] md:px-12 md:py-14">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-slate-950 text-6xl shadow-xl md:h-36 md:w-36 md:text-8xl" aria-hidden="true">
            👤
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight md:text-6xl">{profileData.name}</h1>
          <p className="mt-2 text-white/85 md:text-xl">{profileData.email}</p>

          <div className="mx-auto mt-5 grid max-w-md grid-cols-3 divide-x divide-white/25 md:mt-10 md:max-w-xl">
            {profileData.stats.map((stat) => (
              <div className="px-3" key={stat.label}>
                <strong className="block text-2xl md:text-4xl">{stat.value}</strong>
                <span className="mt-1 block text-xs text-white/80 md:text-base">{stat.label}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="px-5 pt-6 md:px-0 md:pt-0">
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)]">
            <ProfileOption icon="👤" label="Editar perfil" />
            <div className="h-px bg-slate-100" />
            <ProfileOption icon="📜" label="Historial de pagos" />
            <div className="h-px bg-slate-100" />
            <ProfileOption icon="🔔" label="Notificaciones" badge={profileData.notifications} />
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)]">
            <ProfileOption icon="⚙️" label="Configuracion" />
            <div className="h-px bg-slate-100" />
            <ProfileOption icon="❓" label="Ayuda y soporte" />
          </div>

          <div className="mt-5">
            <Link to="/cliente/login">
              <ProfileOption icon="🚪" label="Cerrar sesion" danger />
            </Link>
          </div>
        </div>

        <BottomNav />
      </section>
    </main>
  );
}

export default Perfil;
