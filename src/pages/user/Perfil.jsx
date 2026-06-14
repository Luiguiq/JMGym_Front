import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit3, CreditCard, Bell, LogOut, Calendar, Trophy, XCircle, DollarSign, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { userService } from '../../services/userService.js';
import { reservationService } from '../../services/reservationService.js';
import ProfileOption from '../../components/user/ProfileOption.jsx';

function Perfil() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.getMyProfile(),
      reservationService.getMyReservations(),
    ])
      .then(([profileData, reservationsData]) => {
        setProfile(profileData);
        setReservations(reservationsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = reservations.length;
    const completed = reservations.filter(
      (r) => r.estado_reserva === 'FINALIZADA' || r.estado_reserva === 'COMPLETADA'
    ).length;
    const cancelled = reservations.filter((r) => r.estado_reserva === 'CANCELADA').length;
    const totalSpent = reservations
      .filter((r) => r.estado_pago === 'PAGADO')
      .reduce((sum, r) => sum + Number(r.monto || 0), 0);
    return { total, completed, cancelled, totalSpent };
  }, [reservations]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-50">
        <p className="text-slate-400">Cargando perfil...</p>
      </main>
    );
  }

  const displayName = profile?.nombre_completo ?? authUser?.name ?? 'Usuario';
  const displayEmail = profile?.correo ?? authUser?.email ?? '';
  const displayDni = profile?.dni ?? authUser?.dni ?? '';
  const displayPhone = profile?.telefono ?? '';
  const displayEstado = profile?.estado ?? '';
  const displayFechaRegistro = profile?.fecha_registro ?? '';
  const displayFoto = profile?.foto_perfil ?? authUser?.foto_perfil ?? '';

  return (
    <main className="min-h-screen bg-brand-50">
      <section className="relative min-h-screen bg-[linear-gradient(180deg,#fbfdff_0%,#edf8ff_100%)] pb-28 lg:grid lg:grid-cols-[minmax(360px,0.78fr)_minmax(500px,0.85fr)] lg:content-center lg:gap-x-24 lg:bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.95),transparent_28rem),linear-gradient(180deg,#f7fcff_0%,#e8f7ff_100%)] lg:px-[8vw] lg:py-12 lg:pb-28">
        <header className="mx-4 mt-4 rounded-[32px] bg-gradient-to-br from-[#004aab] via-[#0058c9] to-sky-500 px-5 py-6 text-center text-white shadow-xl sm:mx-5 sm:mt-5 sm:px-6 sm:py-8 md:mx-0">
          <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/20 backdrop-blur-sm border border-white/20 sm:h-28 sm:w-28">
            {displayFoto ? (
              <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://127.0.0.1:8000'}${displayFoto}`} alt="Foto de perfil" className="h-full w-full object-cover" />
            ) : (
              <User size={48} className="text-white" />
            )}
          </div>
          <h1 className="mt-4 text-2xl font-black sm:mt-5 sm:text-3xl">{displayName}</h1>
          <p className="mt-1 text-sm text-sky-100 sm:mt-2">{displayEmail}</p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-left text-sm text-white/85">
            {displayDni && (
              <div className="rounded-2xl bg-white/10 px-4 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">DNI</p>
                <p className="font-semibold">{displayDni}</p>
              </div>
            )}
            {displayPhone && (
              <div className="rounded-2xl bg-white/10 px-4 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Teléfono</p>
                <p className="font-semibold">{displayPhone}</p>
              </div>
            )}
            {displayEstado && (
              <div className="rounded-2xl bg-white/10 px-4 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Estado</p>
                <p className="font-semibold">{displayEstado}</p>
              </div>
            )}
            {displayFechaRegistro && (
              <div className="rounded-2xl bg-white/10 px-4 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Miembro desde</p>
                <p className="font-semibold">
                  {new Date(displayFechaRegistro).toLocaleDateString('es-PE', { year: 'numeric', month: 'short' })}
                </p>
              </div>
            )}
          </div>
        </header>

        <div className="px-4 pt-5 sm:px-5 md:px-0 md:pt-0">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-3xl bg-white p-4 text-center shadow-[0_10px_25px_rgba(15,86,130,.08)] border border-sky-100 sm:p-5">
              <Calendar size={32} className="mx-auto text-[#004aab]" />
              <p className="mt-2 text-2xl font-black text-[#004aab] sm:mt-3 sm:text-3xl">{stats.total}</p>
              <p className="text-xs font-semibold text-slate-500 sm:text-sm">Reservas</p>
            </div>
            <div className="rounded-3xl bg-white p-4 text-center shadow-[0_10px_25px_rgba(15,86,130,.08)] border border-sky-100 sm:p-5">
              <Trophy size={32} className="mx-auto text-emerald-500" />
              <p className="mt-2 text-2xl font-black text-emerald-600 sm:mt-3 sm:text-3xl">{stats.completed}</p>
              <p className="text-xs font-semibold text-slate-500 sm:text-sm">Completadas</p>
            </div>
            <div className="rounded-3xl bg-white p-4 text-center shadow-[0_10px_25px_rgba(15,86,130,.08)] border border-sky-100 sm:p-5">
              <XCircle size={32} className="mx-auto text-red-400" />
              <p className="mt-2 text-2xl font-black text-red-500 sm:mt-3 sm:text-3xl">{stats.cancelled}</p>
              <p className="text-xs font-semibold text-slate-500 sm:text-sm">Canceladas</p>
            </div>
            <div className="rounded-3xl bg-white p-4 text-center shadow-[0_10px_25px_rgba(15,86,130,.08)] border border-sky-100 sm:p-5">
              <DollarSign size={32} className="mx-auto text-[#004aab]" />
              <p className="mt-2 text-2xl font-black text-[#004aab] sm:mt-3 sm:text-3xl">S/ {stats.totalSpent.toFixed(2)}</p>
              <p className="text-xs font-semibold text-slate-500 sm:text-sm">Gastado</p>
            </div>
          </div>

          <h2 className="mt-5 mb-2 text-sm uppercase tracking-wider font-bold text-slate-400 sm:mt-6 sm:mb-3">Mi cuenta</h2>
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)]">
            <ProfileOption icon={<Edit3 size={22} />} label="Editar perfil" onClick={() => navigate('/cliente/perfil/editar')} />
            <div className="h-px bg-slate-100" />
            <ProfileOption icon={<CreditCard size={22} />} label="Historial de pagos" onClick={() => navigate('/cliente/pagos')} />
            <div className="h-px bg-slate-100" />
            <ProfileOption icon={<Bell size={22} />} label="Notificaciones" onClick={() => navigate('/cliente/notificaciones')} />
          </div>

          <h2 className="mt-5 mb-2 text-sm uppercase tracking-wider font-bold text-slate-400 sm:mt-6 sm:mb-3">Configuración</h2>
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)]">
            <ProfileOption icon={<Settings size={22} />} label="Configuraciones" onClick={() => navigate('/cliente/configuraciones')} />
          </div>

          <h2 className="mt-5 mb-2 text-sm uppercase tracking-wider font-bold text-slate-400 sm:mt-6 sm:mb-3">Soporte</h2>
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)]">
            <ProfileOption icon={<HelpCircle size={22} />} label="Ayuda y soporte" onClick={() => navigate('/cliente/ayuda')} />
          </div>

          <div className="mt-5">
            <ProfileOption icon={<LogOut size={22} />} label="Cerrar sesión" danger onClick={handleLogout} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Perfil;
