import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CreditCard, ChevronRight, Dumbbell, X } from 'lucide-react';
import { reservationService } from '../../services/reservationService.js';
import cardioImage from '../../assets/images/cardio.jpg';
import trenSuperiorImage from '../../assets/images/trensuperior.jpg';
import zumbaImage from '../../assets/images/zumba.jpg';

const classImages = [
  { match: 'zumba', image: zumbaImage },
  { match: 'cardio', image: cardioImage },
  { match: 'tren superior', image: trenSuperiorImage },
  { match: 'trensuperior', image: trenSuperiorImage },
];

function getClassImage(className = '') {
  const n = className.toLowerCase().replace(/\s+/g, ' ').trim();
  return classImages.find(({ match }) => n.includes(match))?.image;
}

function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const opts = { weekday: 'long', day: 'numeric', month: 'long' };
  return d.toLocaleDateString('es-PE', opts);
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl bg-card p-5 shadow-sm">
      <div className="flex gap-4">
        <div className="h-20 w-20 shrink-0 rounded-2xl bg-border" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-5 w-2/3 rounded bg-border" />
          <div className="h-3 w-1/2 rounded bg-border-light" />
          <div className="h-3 w-1/3 rounded bg-border-light" />
          <div className="h-6 w-1/4 rounded bg-border" />
        </div>
      </div>
    </div>
  );
}

function ReservationCard({ reservation, onRefresh }) {
  const navigate = useNavigate();
  const [showCancel, setShowCancel] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const image = getClassImage(reservation.className || reservation.nombre_clase || '');
  const daysUntil = getDaysUntil(reservation.fecha_clase);
  const isActive = reservation.estado_reserva === 'ACTIVA';
  const isPaid = reservation.estado_pago === 'PAGADO' || reservation.estado_pago === 'CONFIRMADO';
  const isPending = reservation.estado_pago === 'PENDIENTE';

  async function handleCancel() {
    setCanceling(true);
    try {
      await reservationService.cancelReservation(reservation.id);
      onRefresh?.();
    } catch (e) {
      console.error(e);
    } finally {
      setCanceling(false);
      setShowCancel(false);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-3xl bg-card shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
    >
      <div className="flex gap-4 p-4 sm:p-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-24">
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-primary-foreground">
              <Dumbbell size={28} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-foreground">{reservation.className || reservation.nombre_clase || 'Clase'}</h3>
              {isActive ? (
                <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[12px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Activa
                </span>
              ) : (
                <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-border-light px-2.5 py-0.5 text-[12px] font-semibold text-muted">
                  {reservation.estado_reserva === 'FINALIZADA' || reservation.estado_reserva === 'COMPLETADA' ? 'Finalizada' : 'Cancelada'}
                </span>
              )}
            </div>
            <p className="shrink-0 text-xl font-black text-blue-600">
              S/ {Number(reservation.monto || 0).toFixed(2)}
            </p>
          </div>

          <div className="mt-2 space-y-1 text-[13px] text-muted">
            <p className="flex items-center gap-1.5">
              <Calendar size={14} className="shrink-0 text-muted-foreground" />
              {formatDate(reservation.fecha_clase)}
            </p>
            <p className="flex items-center gap-1.5">
              <Clock size={14} className="shrink-0 text-muted-foreground" />
              {reservation.hora_inicio?.slice(0, 5) || reservation.hora_clase?.slice(0, 5)} &middot; {reservation.codigo_espacio || reservation.espacio_codigo || 'Sala'}
            </p>
            {isPending && (
              <p className="flex items-center gap-1.5 text-amber-600">
                <CreditCard size={14} className="shrink-0" />
                Pago pendiente
              </p>
            )}
            {isActive && daysUntil !== null && (
              <p className="flex items-center gap-1.5 font-semibold text-blue-600">
                {daysUntil === 0 ? 'Hoy' : daysUntil === 1 ? 'Mañana' : `Empieza en ${daysUntil} días`}
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => navigate(`/cliente/reservas/${reservation.id}`)}
              className="flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-bold text-primary-foreground transition hover:bg-blue-700"
            >
              Ver detalle
              <ChevronRight size={14} />
            </button>
            {isActive && (
              <button
                onClick={() => setShowCancel(true)}
                className="rounded-xl border border-border px-4 py-2 text-[12px] font-bold text-muted transition hover:bg-surface"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCancel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setShowCancel(false)}
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-6 top-1/2 z-50 -translate-y-1/2 rounded-3xl bg-card p-6 shadow-xl"
            >
              <button onClick={() => setShowCancel(false)} className="absolute right-4 top-4 text-muted-foreground">
                <X size={20} />
              </button>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
                <Dumbbell size={22} className="text-red-500" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">Cancelar reserva</h3>
              <p className="mt-1 text-sm text-muted">¿Estás seguro de cancelar esta reserva?</p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setShowCancel(false)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold text-secondary transition hover:bg-surface"
                >
                  Volver
                </button>
                <button
                  onClick={handleCancel}
                  disabled={canceling}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-red-700 disabled:opacity-50"
                >
                  {canceling ? 'Cancelando...' : 'Sí, cancelar'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EmptyState({ onViewClasses }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 py-16 text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-border-light">
        <Calendar size={36} className="text-muted" />
      </div>
      <div>
        <p className="text-lg font-bold text-secondary">No tienes reservas activas</p>
        <p className="mt-1 text-sm text-muted-foreground">Reserva una clase para comenzar</p>
      </div>
      <button
        onClick={onViewClasses}
        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-blue-700"
      >
        Ver clases
      </button>
    </motion.div>
  );
}

function MisReservas() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('activas');

  const loadReservations = () => {
    setLoading(true);
    reservationService
      .getMyReservations()
      .then(setReservations)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const activeReservations = useMemo(
    () => reservations.filter((r) => r.estado_reserva === 'ACTIVA'),
    [reservations]
  );

  const rawHistory = useMemo(
    () => reservations.filter((r) => ['CANCELADA', 'FINALIZADA', 'COMPLETADA'].includes(r.estado_reserva)),
    [reservations]
  );

  const stats = useMemo(() => {
    const total = rawHistory.length;
    const completed = rawHistory.filter((r) => r.estado_reserva === 'FINALIZADA' || r.estado_reserva === 'COMPLETADA').length;
    const cancelled = rawHistory.filter((r) => r.estado_reserva === 'CANCELADA').length;
    const totalSpent = rawHistory
      .filter((r) => r.estado_pago === 'PAGADO' || r.estado_pago === 'CONFIRMADO')
      .reduce((sum, r) => sum + Number(r.monto || 0), 0);
    return { total, completed, cancelled, totalSpent };
  }, [rawHistory]);

  return (
    <main className="min-h-screen bg-surface pb-28">
      <section className="mx-auto max-w-lg px-5 py-5 sm:px-6 sm:py-6">

        <div className="mb-5">
          <h1 className="text-xl font-bold text-foreground">Mis reservas</h1>
          <p className="text-[13px] text-muted">
            {activeTab === 'activas'
              ? `${activeReservations.length} reserva${activeReservations.length !== 1 ? 's' : ''} activa${activeReservations.length !== 1 ? 's' : ''}`
              : `${rawHistory.length} reserva${rawHistory.length !== 1 ? 's' : ''} en historial`}
          </p>
        </div>

        <div className="mb-5 inline-flex rounded-2xl bg-card p-1 shadow-sm">
          {[
            { key: 'activas', label: 'Activas', count: activeReservations.length },
            { key: 'historial', label: 'Historial', count: rawHistory.length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`rounded-xl px-5 py-2.5 text-[13px] font-bold transition-all ${
                activeTab === key
                  ? 'bg-blue-600 text-primary-foreground shadow-sm'
                  : 'text-muted hover:text-secondary'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {activeTab === 'historial' && rawHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 grid grid-cols-4 gap-2"
          >
            {[
              { label: 'Total', value: stats.total, color: 'text-foreground' },
              { label: 'Asistidas', value: stats.completed, color: 'text-emerald-600' },
              { label: 'Canceladas', value: stats.cancelled, color: 'text-red-500' },
              { label: 'Gastado', value: `S/${stats.totalSpent.toFixed(0)}`, color: 'text-blue-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-2xl bg-card p-3 text-center shadow-sm">
                <p className={`text-lg font-black ${color}`}>{value}</p>
                <p className="text-[10px] font-semibold text-muted-foreground">{label}</p>
              </div>
            ))}
          </motion.div>
        )}

        <div className="space-y-3">
          {loading ? (
            <>
              <SkeletonCard />
              {activeTab === 'historial' && <SkeletonCard />}
            </>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-4 text-center text-sm font-medium text-red-600 dark:bg-red-500/10 dark:text-red-300">{error}</div>
          ) : activeTab === 'activas' ? (
            activeReservations.length === 0 ? (
              <EmptyState onViewClasses={() => navigate('/cliente/clases')} />
            ) : (
              <AnimatePresence>
                {activeReservations.map((res) => (
                  <ReservationCard key={res.id} reservation={res} onRefresh={loadReservations} />
                ))}
              </AnimatePresence>
            )
          ) : (
            rawHistory.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <p className="text-lg font-bold text-muted">Sin historial</p>
                <p className="text-sm text-muted-foreground">Las reservas finalizadas o canceladas aparecerán aquí.</p>
              </div>
            ) : (
              <AnimatePresence>
                {rawHistory.map((res) => (
                  <ReservationCard key={res.id} reservation={res} onRefresh={loadReservations} />
                ))}
              </AnimatePresence>
            )
          )}
        </div>
      </section>
    </main>
  );
}

export default MisReservas;
