import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserRound, Pencil, Bell, Shield, LogOut, CreditCard,
  Calendar, Trophy, XCircle, DollarSign, Dumbbell, ChevronRight,
  HelpCircle, ArrowRight, Camera, Sparkles, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { userService } from '../../services/userService.js';
import { reservationService } from '../../services/reservationService.js';
import ProfileOption from '../../components/user/ProfileOption.jsx';

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];

function SkeletonLine({ className = '' }) {
  return <div className={`animate-pulse rounded bg-border ${className}`} />;
}

function Perfil() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.getMyProfile().catch(() => null),
      reservationService.getMyReservations().catch(() => []),
    ])
      .then(([p, r]) => {
        setProfile(p);
        setReservations(r);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayName = profile?.nombre_completo ?? authUser?.name ?? 'Usuario';
  const displayEmail = profile?.correo ?? authUser?.email ?? '';
  const displayFoto = profile?.foto_perfil ?? authUser?.foto_perfil ?? '';
  const fechaRegistro = profile?.fecha_registro ?? '';
  const membresia = profile?.membresia ?? 'Premium';
  const estado = profile?.estado ?? 'activo';

  const monthJoined = fechaRegistro
    ? new Date(fechaRegistro).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })
    : '';

  const stats = useMemo(() => {
    const total = reservations.length;
    const completed = reservations.filter(
      (r) => r.estado_reserva === 'FINALIZADA' || r.estado_reserva === 'COMPLETADA'
    ).length;
    const cancelled = reservations.filter((r) => r.estado_reserva === 'CANCELADA').length;
    const totalSpent = reservations
      .filter((r) => r.estado_pago === 'PAGADO' || r.estado_pago === 'CONFIRMADO')
      .reduce((sum, r) => sum + Number(r.monto || 0), 0);
    return { total, completed, cancelled, totalSpent };
  }, [reservations]);

  const nextClass = useMemo(() => {
    const now = new Date();
    const upcoming = reservations
      .filter((r) => r.estado_reserva === 'ACTIVA')
      .sort((a, b) => {
        const da = a.fecha_clase || '';
        const db = b.fecha_clase || '';
        return da.localeCompare(db) || (a.hora_inicio || '').localeCompare(b.hora_inicio || '');
      })
      .find((r) => {
        const d = new Date(r.fecha_clase + 'T00:00:00');
        return d >= now || r.fecha_clase === now.toISOString().slice(0, 10);
      });
    return upcoming || null;
  }, [reservations]);

  const monthlyClasses = useMemo(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return reservations.filter((r) => {
      const d = new Date(r.fecha_clase + 'T00:00:00');
      return d.getMonth() + 1 === month && d.getFullYear() === year &&
        (r.estado_reserva === 'FINALIZADA' || r.estado_reserva === 'COMPLETADA');
    }).length;
  }, [reservations]);

  const formatClassDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Mañana';
    if (diff < 7) return `En ${diff} días`;
    return d.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-surface pb-28">
        <section className="mx-auto max-w-lg px-5 py-6 space-y-6">
          <div className="rounded-[28px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-6 text-center shadow-md">
            <SkeletonLine className="mx-auto h-20 w-20 rounded-full" />
            <SkeletonLine className="mx-auto mt-3 h-5 w-32" />
            <SkeletonLine className="mx-auto mt-1 h-3 w-24" />
            <SkeletonLine className="mx-auto mt-2 h-3 w-36" />
          </div>
          <SkeletonLine className="h-24 w-full rounded-2xl" />
          <SkeletonLine className="h-20 w-full rounded-2xl" />
          <SkeletonLine className="h-12 w-full rounded-2xl" />
          <SkeletonLine className="h-12 w-full rounded-2xl" />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface pb-28">
      <section className="mx-auto max-w-lg px-5 py-6">

        {/* ─── Header compacto ─── */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-5 shadow-md"
        >
          <div className="absolute right-0 top-0 h-40 w-40 translate-x-8 -translate-y-8 rounded-full bg-white/5 blur-2xl" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-[3px] border-white/70 bg-white/20 shadow-lg backdrop-blur-sm sm:h-18 sm:w-18">
                {displayFoto ? (
                  <img
                    src={`${(import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api').replace('/api', '')}${displayFoto}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={30} className="text-white" />
                )}
              </div>
              <button
                onClick={() => navigate('/cliente/perfil/editar')}
                className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-sm"
                aria-label="Cambiar foto"
              >
                <Camera size={10} />
              </button>
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-white">{displayName}</h1>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-[2px] text-[11px] font-semibold text-white backdrop-blur-sm">
                  <Sparkles size={11} />
                  {membresia}
                </span>
                {estado === 'activo' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/30 px-2 py-[2px] text-[11px] font-medium text-emerald-100">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    Activo
                  </span>
                )}
              </div>
              <p className="mt-1 text-[12px] text-blue-100">
                Miembro desde {monthJoined || '—'}
              </p>
            </div>
          </div>
        </motion.header>

        {/* ─── Estadísticas ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mt-6"
        >
          <p className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">Actividad</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Reservas', value: stats.total, color: 'text-blue-600', icon: Calendar, bg: 'bg-blue-50' },
              { label: 'Completadas', value: stats.completed, color: 'text-emerald-600', icon: Trophy, bg: 'bg-emerald-50' },
              { label: 'Canceladas', value: stats.cancelled, color: 'text-red-500', icon: XCircle, bg: 'bg-red-50' },
              { label: 'Gastado', value: `S/${stats.totalSpent.toFixed(0)}`, color: 'text-amber-600', icon: DollarSign, bg: 'bg-amber-50' },
            ].map(({ label, value, color, icon: Icon, bg }) => (
              <div key={label} className="relative overflow-hidden rounded-2xl bg-card p-4 shadow-sm">
                <Icon size={48} className="absolute -bottom-2 -right-2 text-muted/20" />
                <p className={`text-2xl font-black ${color}`}>{value}</p>
                <p className="mt-0.5 text-[12px] font-semibold text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── Progreso mensual ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="mt-6"
        >
          <p className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">Progreso mensual</p>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-bold text-secondary">Clases asistidas este mes</p>
                <p className="text-[12px] text-muted-foreground">{MONTHS[new Date().getMonth()]} {new Date().getFullYear()}</p>
              </div>
              <p className="text-2xl font-black text-blue-600">{monthlyClasses}</p>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border-light">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((monthlyClasses / 12) * 100, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {monthlyClasses >= 12 ? 'Meta alcanzada 🎉' : `${12 - monthlyClasses} clases restantes para tu meta`}
            </p>
          </div>
        </motion.div>

        {/* ─── Próxima clase ─── */}
        {nextClass && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="mt-6"
          >
            <p className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">Próxima clase</p>
            <button
              onClick={() => navigate(`/cliente/reservas/${nextClass.id}`)}
              className="group w-full rounded-2xl bg-card p-4 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-sm">
                  <Dumbbell size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground">{nextClass.className || 'Clase'}</p>
                  <p className="text-[13px] text-muted">
                    {formatClassDate(nextClass.fecha_clase)} &middot; {nextClass.hora_inicio?.slice(0, 5)}
                  </p>
                </div>
                <ChevronRight size={18} className="shrink-0 text-muted transition group-hover:translate-x-0.5" />
              </div>
            </button>
          </motion.div>
        )}

        {/* ─── Acciones rápidas ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="mt-6"
        >
          <p className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">Acceso rápido</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Reservar clase', icon: Calendar, to: '/cliente/clases', color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Ver reservas', icon: Dumbbell, to: '/cliente/reservas', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Mi historial', icon: Trophy, to: '/cliente/reservas?tab=historial', color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Código QR', icon: CreditCard, to: '/cliente/qr', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map(({ label, icon: Icon, to, color, bg }) => (
              <button
                key={label}
                onClick={() => navigate(to)}
                className={`flex items-center gap-3 rounded-2xl ${bg} p-4 text-left shadow-sm transition hover:shadow-md`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-sm`}>
                  <Icon size={20} className={color} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-foreground">{label}</p>
                  <ArrowRight size={12} className="mt-0.5 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ─── Mi cuenta ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="mt-6"
        >
          <p className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">Mi cuenta</p>
          <div className="space-y-2">
            {[
              { icon: <Pencil size={20} />, label: 'Editar perfil', to: '/cliente/perfil/editar' },
              { icon: <CreditCard size={20} />, label: 'Historial de pagos', to: '/cliente/pagos' },
              { icon: <Bell size={20} />, label: 'Notificaciones', to: '/cliente/notificaciones' },
              { icon: <Settings size={20} />, label: 'Configuraciones', to: '/cliente/configuraciones' },
              { icon: <Shield size={20} />, label: 'Seguridad', to: '/cliente/seguridad' },
              { icon: <HelpCircle size={20} />, label: 'Ayuda y soporte', to: '/cliente/ayuda' },
            ].map(({ icon, label, to }) => (
              <div key={label} className="overflow-hidden rounded-2xl bg-card shadow-sm">
                <ProfileOption icon={icon} label={label} onClick={() => navigate(to)} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── Cerrar sesión ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.35 }}
          className="mt-6"
        >
          <ProfileOption icon={<LogOut size={20} />} label="Cerrar sesión" danger onClick={handleLogout} />
        </motion.div>

      </section>
    </main>
  );
}

export default Perfil;