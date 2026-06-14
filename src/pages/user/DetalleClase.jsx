import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { classService } from '../../services/classService.js';
import { instructorService } from '../../services/instructorService.js';
import { reservationService } from '../../services/reservationService.js';
import cardioImage from '../../assets/images/cardio.jpg';
import trenSuperiorImage from '../../assets/images/trensuperior.jpg';
import zumbaImage from '../../assets/images/zumba.jpg';
import PageLoader from '../../components/common/PageLoader.jsx';
import { AlertTriangle, Search, Flame, Music, Heart, Zap, Dumbbell, TrendingUp, Calendar, Clock, Timer, User } from 'lucide-react';

const genreIcons = {
  cardio: <Zap className="h-16 w-16 text-white/80" />,
  baile: <Music className="h-16 w-16 text-white/80" />,
  fuerza: <Dumbbell className="h-16 w-16 text-white/80" />,
};

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';
const BACKEND_URL = API_BASE.replace('/api', '');

const classImages = [
  { match: 'zumba', image: zumbaImage },
  { match: 'cardio', image: cardioImage },
  { match: 'tren superior', image: trenSuperiorImage },
  { match: 'trensuperior', image: trenSuperiorImage },
];

function getClassImage(className = '') {
  const normalizedName = className.toLowerCase().replace(/\s+/g, ' ').trim();
  return classImages.find(({ match }) => normalizedName.includes(match))?.image;
}

function getAvailabilityInfo(spots) {

  if (spots <= 0) {
    return {
      label: 'Clase completa',
      color: 'text-red-600',
      bg: 'bg-red-50',
      iconColor: 'bg-red-500'
    };
  }

  if (spots <= 5) {
    return {
      label: 'Últimos espacios',
      color: 'text-red-600',
      bg: 'bg-red-50',
      iconColor: 'bg-red-500'
    };
  }

  if (spots <= 15) {
    return {
      label: 'Pocos espacios',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      iconColor: 'bg-yellow-400'
    };
  }

  return {
    label: 'Muchos espacios disponibles',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    iconColor: 'bg-emerald-500'
  };
}

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
            instructorService.getById(data.trainerId)
              .then(setInstructorData)
              .catch(() => {});
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setCheckingReservation(true);
    reservationService.getMyReservations()
      .then((reservations) => {

        const active = reservations.some(
          (r) =>
            Number(r.id_clase) === Number(id) &&
            r.status === 'ACTIVA'
        );

        setHasActiveReservation(active);

        const conflict = reservations.some((r) => {

          const activeStatuses = [
            'ACTIVA',
            'PENDIENTE',
            'CONFIRMADA'
          ];

          return (
            activeStatuses.includes(r.status) &&
            r.fecha_clase === classItem?.date &&
            Number(r.id_clase) !== Number(id)
          );
        });

        setHasDateConflict(conflict);
      })
        .catch(() => {})
        .finally(() => setCheckingReservation(false));
  }, [isAuthenticated, id, classItem]);

  function handleReserve() {
    if (!isAuthenticated) {
      navigate('/cliente/login');
      return;
    }

    navigate(`/cliente/seleccion-espacio/${id}`);
  }

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
            <AlertTriangle className="mx-auto h-10 w-10 text-red-400" aria-hidden="true" />
            <h2 className="text-xl font-bold text-slate-800 mt-3">Hubo un error</h2>
            <p className="text-red-500 mt-2 text-sm">{error}</p>
            <button
                onClick={() => navigate(-1)}
                className="mt-5 px-6 py-2.5 bg-brand-600 text-white font-bold rounded-2xl shadow-soft text-sm transition hover:bg-brand-700"
            >
              Volver atrás
            </button>
          </div>
        </main>
    );
  }

  if (!classItem) {
    return (
        <main className="min-h-screen bg-brand-50 p-8 flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-soft max-w-md w-full text-center">
            <Search className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
            <h2 className="text-xl font-bold text-slate-800 mt-3">Clase no encontrada</h2>
            <p className="text-slate-500 mt-2 text-sm">El horario o la clase especificada no existe actualmente.</p>
            <button
                onClick={() => navigate('/cliente/clases')}
                className="mt-5 px-6 py-2.5 bg-brand-600 text-white font-bold rounded-2xl shadow-soft text-sm"
            >
              Ver catálogo de clases
            </button>
          </div>
        </main>
    );
  }

  const renderIntensityDots = (level) => {
    let activeDots = 2;
    if (level === 'Energia alta' || level === 'ALTA') activeDots = 3;
    if (level === 'Principiante' || level === 'BAJA') activeDots = 1;

    return (
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((dot) => (
              <div
                  key={dot}
                  className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                      dot <= activeDots ? 'bg-sky-500' : 'bg-slate-200'
                  }`}
              />
          ))}
        </div>
    );
  };

  const ICON_MAP = { Flame, Music, Heart, Zap, Dumbbell, TrendingUp };

  const classImage = classItem.imagen_clase || getClassImage(classItem.name);
  const benefitsMap = {
    zumba: [
      { icon: 'Flame', text: 'Quema calorías' },
      { icon: 'Music', text: 'Mejora coordinación' },
      { icon: 'Heart', text: 'Mejora resistencia cardiovascular' },
    ],

    cardiofit: [
      { icon: 'Heart', text: 'Aumenta resistencia' },
      { icon: 'Flame', text: 'Alto gasto calórico' },
      { icon: 'Zap', text: 'Mejora capacidad aeróbica' },
    ],

    cardio: [
      { icon: 'Heart', text: 'Aumenta resistencia' },
      { icon: 'Flame', text: 'Alto gasto calórico' },
      { icon: 'Zap', text: 'Mejora capacidad aeróbica' },
    ],

    'tren superior': [
      { icon: 'Dumbbell', text: 'Incrementa fuerza muscular' },
      { icon: 'Dumbbell', text: 'Mejora estabilidad' },
      { icon: 'TrendingUp', text: 'Favorece hipertrofia' },
    ],
  };

  const normalizedName = classItem.name
    ?.toLowerCase()
    .trim();

  const benefits =
    benefitsMap[normalizedName] || [
      { icon: 'Dumbbell', text: 'Mejora condición física' },
      { icon: 'Flame', text: 'Incrementa actividad física' },
      { icon: 'Zap', text: 'Favorece el bienestar general' },
    ];
  const availabilityInfo = getAvailabilityInfo(
    classItem.availableSpots
  );
  const formattedDate = classItem.date
      ? new Date(classItem.date + 'T00:00:00').toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: 'short' })
      : 'Próximamente';
  const clothingRules = classItem.clothingRules
      ? classItem.clothingRules.split(/[\n;]/).map((rule) => rule.trim()).filter(Boolean)
      : ['Ropa deportiva cómoda', 'Toalla personal', 'Llegar 10 minutos antes de la clase'];

  return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#f7fcff_0%,#edf8ff_100%)] pb-28 text-slate-700">
        <section className="mx-auto max-w-5xl px-4 py-5 md:px-8 md:py-8">
          <article className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_48px_rgba(15,86,130,0.13)] ring-1 ring-sky-100 md:grid md:grid-cols-[0.95fr_1.05fr]">
            <header className="relative min-h-[300px] overflow-hidden bg-sky-500 p-5 text-white sm:min-h-[420px] md:min-h-[520px] md:p-10">
              {classImage ? (
                  <img
                      src={classImage}
                      alt={`Persona realizando ${classItem.name}`}
                      className="absolute inset-0 h-full w-full object-cover"
                  />
              ) : (
                  <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-sky-400 to-brand-600 text-8xl" aria-hidden="true">
                    {genreIcons[classItem.icon] || <Dumbbell className="h-16 w-16 text-white/80" />}
                  </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-sky-950/75 via-sky-800/35 to-sky-400/15" aria-hidden="true" />

              <button
                  className="relative z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-xl font-black text-sky-900 shadow-lg transition hover:bg-white"
                  onClick={() => navigate(-1)}
                  type="button"
                  aria-label="Volver"
              >
                ←
              </button>

              <div className="relative z-10 mt-28 sm:mt-44 md:mt-64">
                <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-sky-700 shadow-sm">
                  Intensidad
                </span>
                <h1 className="mt-4 font-display text-5xl font-black leading-tight drop-shadow md:text-6xl">
                  {classItem.name}
                </h1>
                <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold text-white/95 md:text-base">
                  <span>Hoy, {classItem.time || '00:00'}</span>
                  <span>•</span>
                  <span>{classItem.duration || '0 min'}</span>
                  <span>•</span>
                  <span>S/ {classItem.price ? Number(classItem.price).toFixed(2) : '0.00'}</span>
                </p>
              </div>
            </header>

          <div className="relative bg-white p-4 md:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 rounded-[28px] bg-white p-3 sm:p-4 shadow-[0_8px_24px_rgba(0,0,0,.06)]">
                <div className="text-center">
                  <p className="text-xs text-slate-400">Fecha</p>
                  <p className="font-bold text-slate-800">
                    <Calendar className="inline-block h-4 w-4 mr-1 -mt-0.5" /> {formattedDate}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Hora</p>
                  <p className="font-bold text-slate-800">
                    <Clock className="inline-block h-4 w-4 mr-1 -mt-0.5" /> {classItem.time}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Duración</p>
                  <p className="font-bold text-slate-800">
                    <Timer className="inline-block h-4 w-4 mr-1 -mt-0.5" /> {classItem.duration}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Precio</p>
                  <p className="font-black text-[#004aab]">
                    S/ {Number(classItem.price || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <section className="mt-5 rounded-3xl bg-sky-50/80 p-5 shadow-sm ring-1 ring-sky-100">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-700">Intensidad</h2>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-sky-700 ring-1 ring-sky-100">
                    {classItem.level}
                  </span>
                </div>
                <div className="mt-3">{renderIntensityDots(classItem.level)}</div>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Moderada, ideal para principiantes y usuarios que quieren mantenerse activos.
                </p>
              </section>

            <section className="mt-6">
              <h2 className="text-lg font-extrabold text-slate-800">Sobre la clase</h2>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                  {benefits.map((benefit, i) => {
                    const IconComponent = ICON_MAP[benefit.icon];
                    return (
                      <div
                        key={i}
                        className="rounded-2xl bg-sky-50 p-4"
                      >
                        <p className="font-bold text-sky-700">
                          {IconComponent && <IconComponent className="inline-block h-5 w-5 mr-1.5 -mt-0.5" />}
                          {benefit.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 md:text-base">
                  {classItem.description || 'Entrenamiento dinámico diseñado para mejorar tu resistencia, coordinación y energía con una rutina guiada por el instructor.'}
                </p>
              </section>

              <section className="mt-6">
                <h2 className="text-lg font-extrabold text-slate-800">Regla de vestimenta <AlertTriangle className="inline-block h-5 w-5 text-amber-500 -mt-0.5" /></h2>
                <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-500 md:text-base">
                  {clothingRules.map((rule) => (
                      <li key={rule}>• {rule}</li>
                  ))}
                </ul>
              </section>

              <section className="mt-6">
                <h2 className="text-lg font-extrabold text-slate-800">Instructor</h2>
                <button
                  onClick={() => navigate(`/cliente/instructores/${classItem.trainerId}`)}
                  className="mt-3 w-full flex items-center gap-4 rounded-3xl bg-gradient-to-r from-sky-50 to-white p-4 ring-1 ring-sky-100 text-left transition hover:bg-sky-100 hover:shadow-md"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-3xl shadow-xl">
                    {instructorData?.foto ? (
                      <img
                        src={instructorData.foto.startsWith('http') ? instructorData.foto : `${BACKEND_URL}${instructorData.foto}`}
                        alt={classItem.trainer}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#004aab] to-sky-500 text-4xl text-white">
                        {classItem.trainer?.charAt(0) || <User className="h-8 w-8" />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-slate-800">Prof. {classItem.trainer}</h3>
                    <p className="mt-1 text-sm font-bold text-sky-600">Staff certificado JMGym</p>
                    <p className="mt-1 text-xs text-slate-400">Ver perfil del instructor →</p>
                  </div>
                </button>
              </section>

              <section className={`mt-6 rounded-3xl p-5 ${availabilityInfo.bg}`}>
                <h3 className={`font-extrabold text-lg ${availabilityInfo.color} flex items-center gap-2`}>
                  <span className={`inline-block w-3 h-3 rounded-full ${availabilityInfo.iconColor}`} />
                  {availabilityInfo.label}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Actualmente quedan {classItem.availableSpots} espacios disponibles para esta sesión.
                </p>
              </section>
              
              <div className="mt-6 space-y-3">
                {hasActiveReservation && (
                  <div className="rounded-3xl bg-amber-50 p-4 ring-1 ring-amber-200">
                    <h3 className="font-extrabold text-amber-700 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      Ya reservaste esta clase
                    </h3>

                    <p className="mt-1 text-sm text-amber-700">
                      No puedes reservar dos veces la misma sesión.
                    </p>
                  </div>
                )}
                {hasDateConflict && (
                  <div className="rounded-3xl bg-amber-50 p-4 ring-1 ring-amber-200">
                    <h3 className="font-extrabold text-amber-700 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      Conflicto de fecha
                    </h3>

                    <p className="mt-1 text-sm text-amber-700">
                      Ya tienes otra reserva activa programada para ese día.
                    </p>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 mt-5 pb-2 sm:bottom-4 sm:pb-0">
                <button
                    className={`
                      min-h-14 w-full rounded-2xl font-extrabold text-white
                      transition md:min-h-16 md:text-lg
                      ${
                        hasActiveReservation ||
                        hasDateConflict ||
                        classItem.availableSpots === 0
                          ? 'bg-slate-300 cursor-not-allowed'
                          : 'bg-gradient-to-r from-sky-500 to-brand-600 shadow-[0_14px_28px_rgba(14,165,233,0.28)] hover:scale-[1.01] active:scale-[0.99]'
                      }
                    `}
                    onClick={handleReserve}
                    disabled={
                      classItem.availableSpots === 0 ||
                      hasActiveReservation ||
                      hasDateConflict ||
                      checkingReservation
                    }
                    type="button"
                >
                  {checkingReservation
                    ? 'Verificando disponibilidad...'
                    : hasActiveReservation
                        ? 'Clase ya reservada'
                        : hasDateConflict
                            ? 'Conflicto de horario'
                            : classItem.availableSpots === 0
                                ? 'Clase completa'
                                : 'Continuar con la reserva →'}
                </button>
              </div>
            </div>
          </article>
        </section>
      </main>
  );
}

export default DetalleClase;
