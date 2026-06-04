import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ProfileOption from '../../components/user/ProfileOption.jsx';

function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/cliente/login');
  }

  return (
    <main className="min-h-screen bg-brand-50">
      <section className="relative min-h-screen bg-[linear-gradient(180deg,#fbfdff_0%,#edf8ff_100%)] pb-28 md:grid md:grid-cols-[minmax(360px,0.78fr)_minmax(500px,0.85fr)] md:content-center md:gap-x-24 md:bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.95),transparent_28rem),linear-gradient(180deg,#f7fcff_0%,#e8f7ff_100%)] md:px-[8vw] md:py-12 md:pb-28">
        <header className="bg-gradient-to-br from-brand-500 via-brand-600 to-sky-400 px-6 pb-8 pt-9 text-center text-white shadow-soft md:min-h-[560px] md:rounded-[38px] md:px-12 md:py-14">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-slate-950 text-6xl shadow-xl md:h-36 md:w-36 md:text-8xl" aria-hidden="true">
            👤
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight md:text-6xl">{user?.name ?? 'Usuaria'}</h1>
          <p className="mt-2 text-white/85 md:text-xl">{user?.email ?? ''}</p>
        </header>

        <div className="px-5 pt-6 md:px-0 md:pt-0">
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)]">
            <ProfileOption icon="👤" label="Editar perfil" />
            <div className="h-px bg-slate-100" />
            <ProfileOption icon="📜" label="Historial de pagos" />
            <div className="h-px bg-slate-100" />
            <ProfileOption icon="🔔" label="Notificaciones" badge={0} />
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)]">
            <ProfileOption icon="⚙️" label="Configuracion" />
            <div className="h-px bg-slate-100" />
            <ProfileOption icon="❓" label="Ayuda y soporte" />
          </div>

          <div className="mt-5">
            <button className="w-full text-left" onClick={handleLogout} type="button">
              <ProfileOption icon="🚪" label="Cerrar sesion" danger />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Perfil;
