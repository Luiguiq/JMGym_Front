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
    navigate('/');
  }

  return (
    <main className="min-h-screen bg-brand-50">
      <section className="relative min-h-screen bg-[linear-gradient(180deg,#fbfdff_0%,#edf8ff_100%)] pb-28 lg:grid lg:grid-cols-[minmax(360px,0.78fr)_minmax(500px,0.85fr)] lg:content-center lg:gap-x-24 lg:bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.95),transparent_28rem),linear-gradient(180deg,#f7fcff_0%,#e8f7ff_100%)] lg:px-[8vw] lg:py-12 lg:pb-28">
        <header className="mx-4 mt-4 rounded-[32px] bg-gradient-to-br from-[#004aab] via-[#0058c9] to-sky-500 px-5 py-6 text-center text-white shadow-xl sm:mx-5 sm:mt-5 sm:px-6 sm:py-8 md:mx-0">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-5xl backdrop-blur-sm border border-white/20 sm:h-28 sm:w-28 sm:text-6xl">
            👤
          </div>
          <h1 className="mt-4 text-2xl font-black sm:mt-5 sm:text-3xl">{user?.name ?? 'Usuario'}</h1>
          <p className="mt-1 text-sm text-sky-100 sm:mt-2">{user?.email ?? ''}</p>
        </header>

        <div className="px-4 pt-5 sm:px-5 md:px-0 md:pt-0">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl bg-white p-4 text-center shadow-[0_10px_25px_rgba(15,86,130,.08)] border border-sky-100 sm:p-5">
                <div className="text-2xl sm:text-3xl">{item.icon}</div>
                <p className="mt-2 text-2xl font-black text-[#004aab] sm:mt-3 sm:text-3xl">{item.value}</p>
                <p className="text-xs font-semibold text-slate-500 sm:text-sm">{item.label}</p>
              </div>
            ))}
          </div>
          <h2 className="mt-5 mb-2 text-sm uppercase tracking-wider font-bold text-slate-400 sm:mt-6 sm:mb-3">Mi cuenta</h2>
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)]">
            <ProfileOption icon="📝" label="Editar perfil" />
            <div className="h-px bg-slate-100" />
            <ProfileOption icon="💳" label="Historial de pagos" />
            <div className="h-px bg-slate-100" />
            <button className="w-full text-left" onClick={() => navigate('/cliente/notificaciones')}>
              <ProfileOption icon="🔔" label="Notificaciones" />
            </button>
          </div>

          <h2 className="mt-5 mb-2 text-sm uppercase tracking-wider font-bold text-slate-400 sm:mt-6 sm:mb-3">Preferencias</h2>
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)]">
            <ProfileOption icon="⚙️" label="Configuracion" />
            <div className="h-px bg-slate-100" />
            <ProfileOption icon="❓" label="Ayuda y soporte" />
          </div>

          <div className="mt-5">
            <button className="w-full text-left" onClick={handleLogout} type="button">
              <ProfileOption icon="↩️" label="Cerrar sesión" danger />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Perfil;
