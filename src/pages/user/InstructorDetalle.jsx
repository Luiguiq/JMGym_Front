import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { instructorService } from '../../services/instructorService.js';
import { classService } from '../../services/classService.js';
import { getFriendlyErrorMessage } from '../../utils/userMessages.js';
import { resolveImageUrl } from '../../utils/imageUrl.js';
import cardioImage from '../../assets/images/cardio.jpg';
import trenSuperiorImage from '../../assets/images/trensuperior.jpg';
import zumbaImage from '../../assets/images/zumba.jpg';
import {
  ArrowLeft, Star, User, Dumbbell, Zap, Music,
  Clock, MapPin
} from 'lucide-react';

const genreIcons = {
  cardio: <Zap size={20} className="text-orange-500" />,
  baile: <Music size={20} className="text-purple-500" />,
  fuerza: <Dumbbell size={20} className="text-blue-500" />,
};

const genreColors = {
  cardio: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400' },
  baile: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
  fuerza: { bg: 'bg-primary/10', text: 'text-blue-700', dot: 'bg-blue-400' },
};

const SPECIALTY_COLORS = [
  { bg: 'bg-primary/10', text: 'text-blue-700', dot: 'bg-primary/100' },
  { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
  { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  { bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-500' },
];

const DEMO_REVIEWS = [
  { name: 'María G.', rating: 5, text: 'Excelente energía, sus clases son muy dinámicas.' },
  { name: 'Carlos R.', rating: 5, text: 'Motiva muchísimo a seguir entrenando.' },
  { name: 'Andrea L.', rating: 4, text: 'Muy profesional y paciente con principiantes.' },
];

const BACKEND_URL = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api').replace('/api', '');

function fotoUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}${path}`;
}

function isYouTubeUrl(url) {
  if (!url) return false;
  return /youtube\.com|youtu\.be/i.test(url);
}

function resolveVideoUrl(url) {
  if (!url) return '';
  if (/^(https?:|blob:|data:)/i.test(url)) return url;
  if (url.startsWith('/uploads/')) return `${BACKEND_URL}${url}`;
  return url;
}

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('youtube.com/embed/')) return trimmed;
  let videoId = '';
  const m = trimmed.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/);
  if (m) videoId = m[1];
  if (!videoId) { const s = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/); if (s) videoId = s[1]; }
  if (!videoId) { const sh = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/); if (sh) videoId = sh[1]; }
  if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
  return trimmed;
}

function getClassImage(className = '') {
  const n = className.toLowerCase().replace(/\s+/g, ' ').trim();
  const classImages = [
    { match: 'zumba', image: zumbaImage },
    { match: 'baile', image: zumbaImage },
    { match: 'dance', image: zumbaImage },
    { match: 'latino', image: zumbaImage },
    { match: 'ritmo', image: zumbaImage },
    { match: 'party', image: zumbaImage },
    { match: 'night', image: zumbaImage },
    { match: 'gold', image: zumbaImage },
    { match: 'tonificacion', image: zumbaImage },
    { match: 'cardio', image: cardioImage },
    { match: 'hiit', image: cardioImage },
    { match: 'core', image: cardioImage },
    { match: 'box', image: cardioImage },
    { match: 'metabolico', image: cardioImage },
    { match: 'resistencia', image: cardioImage },
    { match: 'quemagrasa', image: cardioImage },
    { match: 'power', image: cardioImage },
    { match: 'full body', image: cardioImage },
    { match: 'tren superior', image: trenSuperiorImage },
    { match: 'trensuperior', image: trenSuperiorImage },
    { match: 'tren', image: trenSuperiorImage },
    { match: 'fuerza', image: trenSuperiorImage },
    { match: 'funcional', image: trenSuperiorImage },
    { match: 'pesas', image: trenSuperiorImage },
    { match: 'express', image: trenSuperiorImage },
    { match: 'total', image: trenSuperiorImage },
  ];
  return classImages.find(({ match }) => n.includes(match))?.image;
}

function calcYears(dateStr) {
  if (!dateStr) return null;
  const start = new Date(dateStr);
  const now = new Date();
  const diff = now.getFullYear() - start.getFullYear();
  const m = now.getMonth() - start.getMonth();
  return m < 0 || (m === 0 && now.getDate() < start.getDate()) ? diff - 1 : diff;
}

function dominantIntensity(classes) {
  if (!classes.length) return null;
  const counts = {};
  classes.forEach((c) => { const k = c.level?.toLowerCase() || ''; if (k) counts[k] = (counts[k] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

const LEVEL_META = {
  'energia alta': { label: 'Alta', color: 'text-red-500', bg: 'bg-red-50' },
  alta: { label: 'Alta', color: 'text-red-500', bg: 'bg-red-50' },
  moderado: { label: 'Media', color: 'text-amber-500', bg: 'bg-amber-50' },
  media: { label: 'Media', color: 'text-amber-500', bg: 'bg-amber-50' },
  principiante: { label: 'Baja', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  baja: { label: 'Baja', color: 'text-emerald-500', bg: 'bg-emerald-50' },
};

function Stars({ count, size = 14 }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= count ? 'fill-amber-400 text-amber-400' : 'text-muted'} />
      ))}
    </span>
  );
}

function SkeletonHero() {
  return (
    <div className="h-[300px] w-full animate-pulse bg-border sm:h-[380px]" />
  );
}

function SkeletonBlock({ className = 'h-24' }) {
  return <div className={`animate-pulse rounded-2xl bg-border-light ${className}`} />;
}

export default function InstructorDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [instructor, setInstructor] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    Promise.all([
      instructorService.getById(id).catch(() => null),
      classService.getByInstructor(id).catch(() => []),
    ])
      .then(([inst, cls]) => { setInstructor(inst); setClasses(cls); })
      .catch((err) => setError(getFriendlyErrorMessage(err, 'No pudimos cargar el instructor. Intenta nuevamente.')))
      .finally(() => setLoading(false));
  }, [id]);

  const experienceYears = useMemo(() => {
    const y = calcYears(instructor?.fecha_registro);
    return y && y >= 1 ? y : 1;
  }, [instructor]);

  const intensity = useMemo(() => dominantIntensity(classes), [classes]);
  const intensityMeta = LEVEL_META[intensity] || { label: '—', color: 'text-muted-foreground', bg: 'bg-surface' };

  const specialties = useMemo(() => {
    if (!instructor?.especialidad) return [];
    return instructor.especialidad.split(',').map((s) => s.trim()).filter(Boolean);
  }, [instructor]);

  const formatClassDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-surface pb-24 lg:pb-12">
        <SkeletonHero />
        <section className="mx-auto max-w-lg px-5 -mt-8 relative z-10 space-y-4">
          <SkeletonBlock className="h-8 w-48" />
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-16" />
          <SkeletonBlock className="h-32" />
          <SkeletonBlock className="h-24" />
        </section>
      </main>
    );
  }

  if (error || !instructor) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface p-6">
        <div className="max-w-sm text-center">
          <User className="mx-auto h-10 w-10 text-muted" />
          <h2 className="mt-4 text-lg font-bold text-foreground">Instructor no encontrado</h2>
          <p className="mt-1 text-sm text-muted">{error || 'No encontramos este perfil.'}</p>
          <button onClick={() => navigate('/cliente/clases')} className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-blue-700">
            Ver clases
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface pb-24 lg:pb-12">
      {/* ─── Hero ─── */}
      <div className="relative h-[300px] w-full overflow-hidden sm:h-[380px] lg:h-[450px]">
        {instructor.video_presentacion && !videoError ? (
          isYouTubeUrl(instructor.video_presentacion) ? (
            <iframe
              src={getYouTubeEmbedUrl(instructor.video_presentacion)}
              title="Video de presentación"
              className="absolute inset-0 h-full w-full"
              allow="autoplay; encrypted-media"
              onError={() => setVideoError(true)}
            />
          ) : (
            <video
              src={resolveVideoUrl(instructor.video_presentacion)}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setVideoError(true)}
            />
          )
        ) : instructor.foto ? (
          <img
            src={fotoUrl(instructor.foto)}
            alt={instructor.nombre_completo}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500">
            <User size={80} className="text-primary-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/80 text-secondary shadow-sm backdrop-blur-md transition hover:bg-card"
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </motion.button>

        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-5">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
            <h1 className="text-3xl font-black text-primary-foreground drop-shadow-lg sm:text-4xl">
              {instructor.nombre_completo}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-amber-300">
                <Stars count={5} size={12} />
                5.0
              </span>
              <span className="text-[13px] text-primary-foreground/70">Instructor certificado</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <section className="relative -mt-6 rounded-t-3xl bg-surface px-5 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg space-y-6 lg:max-w-5xl">

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="grid grid-cols-3 gap-2"
          >
            {[
              { value: `${experienceYears} ${experienceYears === 1 ? 'año' : 'años'}`, label: 'Experiencia', color: 'text-blue-600' },
              { value: classes.length, label: 'Clases activas', color: 'text-emerald-600' },
              { value: intensityMeta.label, label: 'Intensidad', color: intensityMeta.color },
            ].map(({ value, label, color }) => (
              <div key={label} className="rounded-xl bg-card p-3 text-center shadow-sm">
                <p className={`text-lg font-black ${color}`}>{value}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
              </div>
            ))}
          </motion.div>

          {/* Specialty chips */}
          {specialties.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-wrap gap-2"
            >
              {specialties.map((s, i) => {
                const c = SPECIALTY_COLORS[i % SPECIALTY_COLORS.length];
                return (
                  <span key={s} className={`inline-flex items-center gap-1.5 rounded-full ${c.bg} px-3.5 py-1.5 text-[13px] font-semibold ${c.text}`}>
                    <span className={`inline-block h-2 w-2 rounded-full ${c.dot}`} />
                    {s}
                  </span>
                );
              })}
            </motion.div>
          )}

          {/* Bio */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <h2 className="mb-2 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">Sobre mí</h2>
            <div className="rounded-2xl bg-card p-4 shadow-sm">
              <p className="text-sm leading-relaxed text-secondary">
                {instructor.biografia || `${instructor.nombre_completo} es instructor${instructor.nombre_completo?.toLowerCase().endsWith('a') ? 'a' : ''} certificado${instructor.nombre_completo?.toLowerCase().endsWith('a') ? 'a' : ''} con más de ${experienceYears} año${experienceYears !== 1 ? 's' : ''} de experiencia en ${instructor.especialidad?.toLowerCase() || 'entrenamiento físico'}, comprometido${instructor.nombre_completo?.toLowerCase().endsWith('a') ? 'a' : ''} con ayudar a cada alumno a alcanzar sus metas.`}
              </p>
            </div>
          </motion.section>

          {/* Classes */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h2 className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">Próximas clases</h2>

            {classes.length > 0 ? (
              <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
                {classes.slice(0, 5).map((cls, i) => {
                  const gc = genreColors[cls.icon] || genreColors.fuerza;
                  const spotsLeft = cls.availableSpots ?? 0;
                  return (
                    <motion.button
                      key={cls.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                      whileHover={{ y: -2 }}
                      onClick={() => navigate(`/cliente/clases/${cls.id}`)}
                      className="w-full overflow-hidden rounded-2xl bg-card text-left shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden">
                          {resolveImageUrl(cls.imagen_clase) || getClassImage(cls.name) ? (
                            <img
                              src={resolveImageUrl(cls.imagen_clase) || getClassImage(cls.name)}
                              alt=""
                              className="h-full w-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                          ) : null}
                          <div className={`absolute inset-0 flex items-center justify-center ${gc.bg}`}
                            style={resolveImageUrl(cls.imagen_clase) || getClassImage(cls.name) ? { display: 'none' } : {}}>
                            {genreIcons[cls.icon] || <Dumbbell size={20} className="text-muted-foreground" />}
                          </div>
                        </div>
                        <div className="flex min-w-0 flex-1 items-center gap-3 p-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-foreground">{cls.name}</p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-muted">
                              <span className="inline-flex items-center gap-1">
                                <Clock size={12} /> {cls.time}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={12} /> Sala
                              </span>
                            </div>
                            <p className="mt-1 text-[12px] text-muted-foreground">{formatClassDate(cls.date)}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-black text-blue-600">S/ {Number(cls.price || 0).toFixed(2)}</p>
                            <span className={`mt-1 inline-block rounded-full px-2 py-[2px] text-[10px] font-bold ${
                              spotsLeft <= 5 ? 'bg-red-50 text-red-600' : spotsLeft <= 15 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {spotsLeft <= 5 ? 'Últimos' : spotsLeft <= 15 ? 'Pocos' : `${spotsLeft} cupos`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl bg-card p-8 text-center shadow-sm lg:col-span-2">
                <p className="font-bold text-muted">Sin clases programadas</p>
                <p className="mt-1 text-sm text-muted-foreground">Este instructor no tiene clases disponibles por ahora.</p>
              </div>
            )}
          </motion.section>

          {/* Reviews */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
          >
            <h2 className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-muted-foreground">Opiniones</h2>
            <div className="space-y-2">
              {DEMO_REVIEWS.map((review, i) => (
                <div key={i} className="rounded-2xl bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-border-light">
                        <User size={14} className="text-muted-foreground" />
                      </div>
                      <p className="text-sm font-bold text-secondary">{review.name}</p>
                    </div>
                    <Stars count={review.rating} size={12} />
                  </div>
                  <p className="mt-2 text-[13px] text-muted">{review.text}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="flex gap-3 pb-4"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-bold text-secondary transition hover:bg-surface"
            >
              ← Volver
            </button>
            <button
              onClick={() => navigate('/cliente/clases')}
              className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-blue-700"
            >
              Ver clases →
            </button>
          </motion.div>

        </div>
      </section>
    </main>
  );
}
