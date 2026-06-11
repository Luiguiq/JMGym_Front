import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instructorService } from '../../services/instructorService.js';
import { classService } from '../../services/classService.js';
import PageLoader from '../../components/common/PageLoader.jsx';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';
const BACKEND_URL = API_BASE.replace('/api', '');

function fotoUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}${path}`;
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
  classes.forEach((c) => {
    const key = c.level?.toLowerCase() || '';
    if (key) counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

const LEVEL_LABELS = {
  'energia alta': { label: 'Alta', color: 'text-red-500', bg: 'bg-red-50' },
  alta: { label: 'Alta', color: 'text-red-500', bg: 'bg-red-50' },
  moderado: { label: 'Media', color: 'text-amber-500', bg: 'bg-amber-50' },
  media: { label: 'Media', color: 'text-amber-500', bg: 'bg-amber-50' },
  principiante: { label: 'Baja', color: 'text-green-500', bg: 'bg-green-50' },
  baja: { label: 'Baja', color: 'text-green-500', bg: 'bg-green-50' },
};

export default function InstructorDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      instructorService.getById(id),
      classService.getByInstructor(id),
    ])
      .then(([instData, classData]) => {
        setInstructor(instData);
        setClasses(classData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const experienceYears = useMemo(() => {
    const y = calcYears(instructor?.fecha_registro);
    if (!y || y < 1) return 1;
    return y;
  }, [instructor]);
  const intensity = useMemo(() => dominantIntensity(classes), [classes]);
  const intensityMeta = LEVEL_LABELS[intensity] || { label: '—', color: 'text-slate-400', bg: 'bg-slate-50' };

  const specialties = useMemo(() => {
    if (!instructor?.especialidad) return [];
    return instructor.especialidad.split(',').map((s) => s.trim()).filter(Boolean);
  }, [instructor]);

  if (loading) {
    return (
      <PageLoader
        text="Cargando información..."
      />
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-brand-50 p-8 flex items-center justify-center">
        <div className="bg-white p-6 rounded-3xl shadow-soft max-w-md w-full text-center border border-red-100">
          <span className="text-4xl" aria-hidden="true">⚠️</span>
          <h2 className="text-xl font-bold text-slate-800 mt-3">Hubo un error</h2>
          <p className="text-red-500 mt-2 text-sm">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-5 px-6 py-2.5 bg-brand-600 text-white font-bold rounded-2xl text-sm"
          >
            Volver atrás
          </button>
        </div>
      </main>
    );
  }

  if (!instructor) {
    return (
      <main className="min-h-screen bg-brand-50 p-8 flex items-center justify-center">
        <div className="bg-white p-6 rounded-3xl shadow-soft max-w-md w-full text-center">
          <span className="text-4xl" aria-hidden="true">🔍</span>
          <h2 className="text-xl font-bold text-slate-800 mt-3">Instructor no encontrado</h2>
          <button
            onClick={() => navigate('/cliente/clases')}
            className="mt-5 px-6 py-2.5 bg-brand-600 text-white font-bold rounded-2xl text-sm"
          >
            Ver clases
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fcff_0%,#edf8ff_100%)] pb-28 text-slate-700">
      <section className="mx-auto max-w-lg">
        {/* Hero header */}
        <div className="relative h-[33vh] min-h-[260px] overflow-hidden bg-sky-900">
          {instructor.video_presentacion ? (
            <iframe
              src={instructor.video_presentacion.includes('youtube') || instructor.video_presentacion.includes('youtu.be')
                ? instructor.video_presentacion + (instructor.video_presentacion.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&loop=1&playlist=' + instructor.video_presentacion.split('/').pop()?.split('?')[0]
                : instructor.video_presentacion
              }
              title="Video de presentación"
              className="absolute inset-0 h-full w-full pointer-events-none"
              style={{ filter: 'brightness(0.6)' }}
              allow="autoplay; encrypted-media"
            />
          ) : instructor.foto ? (
            <img
              src={fotoUrl(instructor.foto) || '/public/default-instructor.jpg'}
              alt={instructor.nombre_completo}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#004aab] to-sky-500">
              <div className="text-center text-white">

                <div className="
                  mx-auto
                  h-28
                  w-28
                  rounded-full
                  bg-white/20
                  flex
                  items-center
                  justify-center
                  text-5xl
                  font-black
                  backdrop-blur-sm
                  border
                  border-white/20
                ">
                  {instructor.nombre_completo?.charAt(0)}
                </div>

                <p className="mt-4 text-xl font-bold">
                  {instructor.nombre_completo}
                </p>

                <p className="mt-1 text-sm text-sky-100">
                  Instructor JMGym
                </p>

              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-sky-800/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />

          <button
            onClick={() => navigate(-1)}
            className="absolute top-5 left-5 z-20 flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Volver
          </button>

          <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-5">
            <h1 className="text-4xl font-black text-white drop-shadow-xl md:text-5xl">
              {instructor.nombre_completo}
            </h1>
            {instructor.especialidad && (
              <p className="mt-2 text-lg font-bold text-sky-100">
                {instructor.especialidad}
              </p>
            )}
          </div>
        </div>

        <div className="px-4 -mt-5 relative z-20 space-y-5">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4">
            {/* Experiencia */}
            <div className="
              rounded-3xl
              bg-white
              p-4
              text-center
              shadow-[0_4px_16px_rgba(15,86,130,0.08)]
              ring-1
              ring-sky-100
              transition-all
              duration-300
              hover:-translate-y-1
            ">
              <p className="text-[#004aab] font-black text-2xl">
                {experienceYears} {experienceYears === 1 ? 'año' : 'años'}
              </p>

              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Experiencia
              </p>
            </div>
            {/* Clases */}
            <div className="
              rounded-3xl
              bg-white
              p-4
              text-center
              shadow-[0_4px_16px_rgba(15,86,130,0.08)]
              ring-1
              ring-sky-100
              transition-all
              duration-300
              hover:-translate-y-1
            ">
              <p className="text-[#004aab] font-black text-2xl">
                {classes.length}
              </p>

              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Clases activas
              </p>
            </div>
            {/* Intensidad */}
            <div className="
              rounded-3xl
              bg-white
              p-4
              text-center
              shadow-[0_4px_16px_rgba(15,86,130,0.08)]
              ring-1
              ring-sky-100
              transition-all
              duration-300
              hover:-translate-y-1
            ">
              <p className={`text-2xl font-black ${intensityMeta.color}`}>
                {intensityMeta.label}
              </p>

              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Intensidad
              </p>
            </div>
          </div>

          {/* Specialty chips */}
          {specialties.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Bio */}
          <section className="rounded-3xl bg-white p-5 shadow-[0_4px_16px_rgba(15,86,130,0.08)] ring-1 ring-sky-100">
            <section className="rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(15,86,130,0.08)] ring-1 ring-sky-100">
              <h2 className="text-base font-extrabold text-slate-800">
                Conoce a tu instructor
                <p className="text-xs text-slate-400 mt-1">
                  Profesional certificado del equipo JMGym
                </p>
              </h2>
              
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {instructor.biografia
                  ? instructor.biografia
                  : `${instructor.nombre_completo} forma parte del equipo profesional de JMGym. Especialista en ${instructor.especialidad?.toLowerCase()}, acompaña a los alumnos en el desarrollo de sus objetivos físicos mediante entrenamientos seguros, dinámicos y adaptados a diferentes niveles de experiencia.`
                }
              </p>
            </section>
          </section>

          {/* Próximas clases */}
          <section>
            <h2 className="text-base font-extrabold text-slate-800 mb-3">Próximas clases</h2>

            {classes.length > 0 ? (
              <div className="space-y-3">
                {classes.slice(0,3).map((cls) => {
                  const classDate = cls.date
                    ? new Date(cls.date + 'T00:00:00').toLocaleDateString('es-PE', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'short',
                      })
                    : '';
                  return (
                    <button
                      key={cls.id}
                      onClick={() => navigate(`/cliente/clases/${cls.id}`)}
                      className="w-full flex items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-sky-100 transition hover:bg-sky-50"
                    >
                      {cls.imagen_clase ? (
                        <img
                          src={fotoUrl(cls.imagen_clase)}
                          alt={cls.name}
                          className="h-14 w-14 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl"
                          style={{ backgroundColor: cls.color === 'orange' ? '#FFF7ED' : '#EFF6FF' }}
                        >
                          {cls.icon || '💪'}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 truncate">{cls.name}</p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {classDate} · {cls.time} · {cls.duration}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-[#004aab]">
                          S/ {Number(cls.price || 0).toFixed(2)}
                        </p>
                        <p className="text-sm font-bold text-sky-600">
                          {cls.availableSpots} cupos
                          <span
                            className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              cls.availableSpots <= 5
                                ? 'bg-red-50 text-red-600'
                                : cls.availableSpots <= 15
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-emerald-50 text-emerald-600'
                            }`}
                          >
                            {cls.availableSpots <= 5
                              ? 'Últimos'
                              : cls.availableSpots <= 15
                              ? 'Pocos'
                              : 'Disponible'}
                          </span>
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-8 text-center shadow-[0_4px_16px_rgba(15,86,130,0.08)] ring-1 ring-sky-100">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-50">
                  <span className="text-3xl">📋</span>
                </div>
                <h3 className="text-base font-bold text-slate-700">Sin clases programadas</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Este instructor no tiene clases disponibles por el momento.
                </p>
                <button
                  onClick={() => navigate('/cliente/clases')}
                  className="mt-4 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
                >
                  Explorar clases
                </button>
              </div>
            )}
          </section>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              py-4
              font-bold
              text-slate-700
              transition
              hover:bg-slate-50
            "
          >
            ← Volver
          </button>

          <button
            onClick={() => navigate('/cliente/clases')}
            className="
              rounded-2xl
              bg-[#004aab]
              py-4
              font-bold
              text-white
              transition
              hover:opacity-90
            "
          >
            Ver clases
          </button>
        </div>
      </section>
    </main>
  );
}
