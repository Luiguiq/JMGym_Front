import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import { classService } from '../../services/classService.js';
import { instructorService } from '../../services/instructorService.js';
import { getFriendlyErrorMessage } from '../../utils/userMessages.js';
import { reservationService } from '../../services/reservationService.js';
import cardioImage from '../../assets/images/cardio.jpg';
import trenSuperiorImage from '../../assets/images/trensuperior.jpg';
import zumbaImage from '../../assets/images/zumba.jpg';
import {
  ArrowLeft, Heart, Flame, Zap, Dumbbell, TrendingUp,
  Music, AlertTriangle, User, ChevronRight, Sparkles,
  Calendar, Clock, Timer, Users
} from 'lucide-react';

const BACKEND_URL = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api').replace('/api', '');

const classImages = [
  { match: 'zumba', image: zumbaImage },
  { match: 'cardio', image: cardioImage },
  { match: 'tren superior', image: trenSuperiorImage },
  { match: 'trensuperior', image: trenSuperiorImage },
];

function getClassImage(className = '') {
  return classImages.find(({ match }) => className.toLowerCase().includes(match))?.image;
}

function getAvailabilityInfo(spots) {
  if (spots <= 0) return { label: 'Clase completa', color: 'text-red-600', dot: 'bg-red-500' };
  if (spots <= 5) return { label: 'Últimos espacios', color: 'text-red-600', dot: 'bg-red-500' };
  if (spots <= 15) return { label: 'Pocos espacios', color: 'text-amber-600', dot: 'bg-amber-400' };
  return { label: `${spots} cupos disponibles`, color: 'text-emerald-600', dot: 'bg-emerald-500' };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' });
}

const BENEFITS_MAP = {
  zumba: [
    { icon: 'Flame', text: 'Quema calorías' },
    { icon: 'Music', text: 'Mejora coordinación' },
    { icon: 'Heart', text: 'Resistencia cardiovascular' },
  ],
  cardiofit: [
    { icon: 'Heart', text: 'Aumenta resistencia' },
    { icon: 'Flame', text: 'Alto gasto calórico' },
    { icon: 'Zap', text: 'Capacidad aeróbica' },
  ],
  cardio: [
    { icon: 'Heart', text: 'Aumenta resistencia' },
    { icon: 'Flame', text: 'Alto gasto calórico' },
    { icon: 'Zap', text: 'Capacidad aeróbica' },
  ],
  'tren superior': [
    { icon: 'Dumbbell', text: 'Incrementa fuerza' },
    { icon: 'Dumbbell', text: 'Mejora estabilidad' },
    { icon: 'TrendingUp', text: 'Favorece hipertrofia' },
  ],
};

const ICON_MAP = { Flame, Music, Heart, Zap, Dumbbell, TrendingUp };

function DetalleClase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [classItem, setClassItem] = useState(null);
  const [instructorData, setInstructorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasActiveReservation, setHasActiveReservation] = useState(false);
  const [hasDateConflict, setHasDateConflict] = useState(false);
  const [checkingReservation, setCheckingReservation] = useState(false);

  useEffect(() => {
    classService
      .getClassById(id)
      .then((data) => {
        setClassItem(data);
        if (data.trainerId) {
          instructorService.getById(data.trainerId).then(setInstructorData).catch(() => {});
        }
      })
      .catch((err) => setError(getFriendlyErrorMessage(err, 'No pudimos cargar el detalle de la clase. Intenta nuevamente.')))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !classItem) return;
    setCheckingReservation(true);
    reservationService
      .getMyReservations()
      .then((reservations) => {
        setHasActiveReservation(reservations.some((r) => Number(r.id_clase) === Number(id) && r.status === 'ACTIVA'));
        setHasDateConflict(
          reservations.some(
            (r) =>
              ['ACTIVA', 'PENDIENTE', 'CONFIRMADA'].includes(r.status) &&
              r.fecha_clase === classItem.date &&
              Number(r.id_clase) !== Number(id)
          )
        );
      })
      .catch(() => {})
      .finally(() => setCheckingReservation(false));
  }, [isAuthenticated, id, classItem]);

  function handleReserve() {
    if (!isAuthenticated) { navigate('/cliente/login'); return; }
    navigate(`/cliente/seleccion-espacio/${id}`);
  }

  const classImage = classItem?.imagen_clase || getClassImage(classItem?.name || '');

  const normalizedName = classItem?.name?.toLowerCase().trim() || '';
  const benefits = BENEFITS_MAP[normalizedName] || [
    { icon: 'Dumbbell', text: 'Mejora condición física' },
    { icon: 'Flame', text: 'Incrementa actividad física' },
    { icon: 'Zap', text: 'Bienestar general' },
  ];

  const availabilityInfo = getAvailabilityInfo(classItem?.availableSpots ?? 0);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isPastClass = classItem?.date < todayStr;

  const spots = classItem?.availableSpots ?? 0;
  const isDisabled = spots === 0 || hasActiveReservation || hasDateConflict || checkingReservation || isPastClass;

  const clothingRules = classItem?.clothingRules
    ? classItem.clothingRules.split(/[\n;]/).map((r) => r.trim()).filter(Boolean)
    : ['Ropa deportiva cómoda', 'Toalla personal', 'Llegar 10 minutos antes'];

  const intensityDots = useMemo(() => {
    const level = classItem?.level || '';
    const count = level.includes('ALTA') || level.includes('Energia alta') ? 3 : level.includes('BAJA') || level.includes('Principiante') ? 1 : 2;
    return Array.from({ length: 3 }, (_, i) => i < count);
  }, [classItem?.level]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-card">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-muted-foreground">Cargando clase...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-card p-6">
        <div className="max-w-sm text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-red-400" />
          <h2 className="mt-4 text-lg font-bold text-foreground">No pudimos cargar la clase</h2>
          <p className="mt-1 text-sm text-muted">{error}</p>
          <button onClick={() => navigate(-1)} className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-blue-700">
            Volver
          </button>
        </div>
      </main>
    );
  }

  if (!classItem) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-card p-6">
        <div className="max-w-sm text-center">
          <h2 className="text-lg font-bold text-foreground">Clase no encontrada</h2>
          <p className="mt-1 text-sm text-muted">Esta clase no existe o fue eliminada.</p>
          <button onClick={() => navigate('/cliente/clases')} className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-blue-700">
            Ver catálogo
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-card">
      {/* ─── Hero image edge-to-edge ─── */}
      <div className="relative h-[280px] w-full overflow-hidden sm:h-[360px]">
        {classImage ? (
          <img src={classImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-400">
            <Dumbbell size={64} className="text-primary-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/80 text-secondary shadow-sm backdrop-blur-md transition hover:bg-card"
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </motion.button>
      </div>

      {/* ─── Content ─── */}
      <div className="relative -mt-6 rounded-t-3xl bg-card px-5 pt-6 pb-32 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Title + Intensity */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-sans text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              {classItem.name}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-border-light px-3 py-1 text-[12px] font-semibold text-secondary">
              {intensityDots.map((active, i) => (
                <span key={i} className={`inline-block h-2.5 w-2.5 rounded-full ${active ? 'bg-orange-400' : 'bg-border'}`} />
              ))}
              {classItem.level || 'Moderada'}
            </span>
          </div>

          {/* Info line */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-muted">
            <span className="inline-flex items-center gap-1">
              <Calendar size={14} className="text-muted-foreground" /> {formatDate(classItem.date)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={14} className="text-muted-foreground" /> {classItem.time || '00:00'}
            </span>
            <span className="inline-flex items-center gap-1">
              <Timer size={14} className="text-muted-foreground" /> {classItem.duration || '—'}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={14} className="text-muted-foreground" /> {spots} cupo{spots !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Price */}
          <p className="mt-3 text-2xl font-black text-blue-600">
            S/ {Number(classItem.price || 0).toFixed(2)}
          </p>

          <hr className="my-5 border-border-light" />

          {/* Benefits chips */}
          <section>
            <h2 className="mb-2 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">Beneficios</h2>
            <div className="flex flex-wrap gap-2">
              {benefits.map((b, i) => {
                const Icon = ICON_MAP[b.icon];
                return (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3.5 py-1.5 text-[13px] font-semibold text-sky-700">
                    {Icon && <Icon size={14} />}
                    {b.text}
                  </span>
                );
              })}
            </div>
          </section>

          {/* Description */}
          {classItem.description && (
            <section className="mt-5">
              <h2 className="mb-1 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">Detalles</h2>
              <p className="text-sm leading-relaxed text-secondary">
                {classItem.description}
              </p>
            </section>
          )}

          {/* Rules */}
          <section className="mt-5">
            <h2 className="mb-2 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">Reglas</h2>
            <div className="flex flex-wrap gap-2">
              {clothingRules.map((rule) => (
                <span key={rule} className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1.5 text-[13px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  <AlertTriangle size={14} />
                  {rule}
                </span>
              ))}
            </div>
          </section>

          {/* Instructor */}
          <section className="mt-5">
            <h2 className="mb-2 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">Instructor</h2>
            <button
              onClick={() => navigate(`/cliente/instructores/${classItem.trainerId}`)}
              className="flex w-full items-center gap-4 rounded-2xl border border-border-light bg-card p-4 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-primary-foreground shadow-sm">
                {instructorData?.foto ? (
                  <img
                    src={instructorData.foto.startsWith('http') ? instructorData.foto : `${BACKEND_URL}${instructorData.foto}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={22} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground">Prof. {classItem.trainer}</p>
                <p className="flex items-center gap-1 text-[13px] text-muted">
                  <Sparkles size={13} className="text-amber-400" />
                  Staff certificado
                </p>
              </div>
              <ChevronRight size={18} className="shrink-0 text-muted" />
            </button>
          </section>

          {/* Warnings */}
          {hasActiveReservation && (
            <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              Ya reservaste esta clase
            </div>
          )}
          {hasDateConflict && (
            <div className="mt-3 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              Ya tienes otra reserva activa ese día
            </div>
          )}

        </motion.div>
      </div>

      {/* ─── Fixed bottom bar ─── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-light bg-card/95 px-5 pb-6 pt-3 shadow-lg backdrop-blur-md sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Precio</p>
            <p className="text-xl font-black text-blue-600">S/ {Number(classItem.price || 0).toFixed(2)}</p>
          </div>
          <motion.button
            whileTap={isDisabled ? {} : { scale: 0.97 }}
            onClick={handleReserve}
            disabled={isDisabled}
            className={`min-h-[48px] rounded-xl px-8 text-sm font-bold shadow-sm transition ${
              isDisabled
                ? 'cursor-not-allowed bg-border text-muted-foreground'
                : 'bg-blue-600 text-primary-foreground shadow-[0_16px_36px_rgba(37,99,235,0.22)] hover:bg-blue-700'
            }`}
          >
            {isPastClass
              ? 'Clase finalizada'
              : checkingReservation
                ? 'Verificando...'
                : hasActiveReservation
                  ? 'Ya reservada'
                  : hasDateConflict
                    ? 'Conflicto de horario'
                    : spots === 0
                      ? 'Clase completa'
                      : 'Reservar ahora'}
          </motion.button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          {spots > 0 ? (
            <>
              <span className={`inline-block h-2 w-2 rounded-full ${availabilityInfo.dot}`} />
              <span className={`text-[12px] font-medium ${availabilityInfo.color}`}>{availabilityInfo.label}</span>
            </>
          ) : (
            <span className="text-[12px] font-medium text-red-500">No hay espacios disponibles</span>
          )}
        </div>
      </div>
    </main>
  );
}

export default DetalleClase;
