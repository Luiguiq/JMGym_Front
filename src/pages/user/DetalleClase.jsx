import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { classService } from '../../services/classService.js';
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
  const normalizedName = className.toLowerCase().replace(/\s+/g, ' ').trim();
  return classImages.find(({ match }) => normalizedName.includes(match))?.image;
}

function DetalleClase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [classItem, setClassItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasActiveReservation, setHasActiveReservation] = useState(false);
  const [checkingReservation, setCheckingReservation] = useState(false);

  useEffect(() => {
    classService
        .getClassById(id)
        .then((data) => {
          setClassItem(data);
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
              (r) => Number(r.id_clase) === Number(id) && r.status === 'ACTIVA'
          );
          setHasActiveReservation(active);
        })
        .catch(() => {})
        .finally(() => setCheckingReservation(false));
  }, [isAuthenticated, id]);

  function handleReserve() {
    // Si no ha iniciado sesión, lo mandamos al login
    if (!isAuthenticated) {
      navigate('/cliente/login');
      return;
    }

    // Si ya inició sesión, lo mandamos a tu nueva pantalla de asientos
    navigate(`/cliente/seleccion-espacio/${id}`);
  }

  if (loading) {
    return (
        <main className="min-h-screen bg-brand-50 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Cargando detalles de la clase...</p>
          </div>
        </main>
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
            <span className="text-4xl" aria-hidden="true">🔍</span>
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
    let activeDots = 2; // Por defecto MEDIA (Moderado)
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

  const classImage = getClassImage(classItem.name);
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
            <header className="relative min-h-[310px] overflow-hidden bg-sky-500 p-5 text-white md:min-h-full md:p-8">
              {classImage ? (
                  <img
                      src={classImage}
                      alt={`Persona realizando ${classItem.name}`}
                      className="absolute inset-0 h-full w-full object-cover"
                  />
              ) : (
                  <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-sky-400 to-brand-600 text-8xl" aria-hidden="true">
                    {classItem.icon || '💪'}
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

              <div className="relative z-10 mt-28 md:mt-44">
                <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-sky-700 shadow-sm">
                  Intensidad
                </span>
                <h1 className="mt-4 font-display text-4xl font-bold leading-tight drop-shadow md:text-5xl">
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

            <div className="relative bg-white p-5 md:p-8">
              <div className="-mt-5 grid grid-cols-3 gap-2 rounded-3xl bg-white/95 p-3 text-center text-xs font-extrabold text-slate-500 shadow-[0_10px_28px_rgba(15,86,130,0.12)] ring-1 ring-sky-50 md:mt-0 md:text-sm">
                <div>
                  <span className="block text-sky-500">Duración</span>
                  {classItem.duration || '0 min'}
                </div>
                <div>
                  <span className="block text-sky-500">Cupos</span>
                  {classItem.reserved}/{classItem.capacity}
                </div>
                <div>
                  <span className="block text-sky-500">Fecha</span>
                  {formattedDate}
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
                <p className="mt-2 text-sm leading-relaxed text-slate-500 md:text-base">
                  {classItem.description || 'Entrenamiento dinámico diseñado para mejorar tu resistencia, coordinación y energía con una rutina guiada por el instructor.'}
                </p>
              </section>

              <section className="mt-6">
                <h2 className="text-lg font-extrabold text-slate-800">Regla de vestimenta ⚠️</h2>
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
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-sky-500 text-3xl text-white shadow-lg shadow-sky-100" aria-hidden="true">
                    👩‍🏫
                  </div>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-slate-800">Prof. {classItem.trainer}</h3>
                    <p className="mt-1 text-xs font-bold text-sky-600 md:text-sm">Staff certificado JMGym</p>
                    <p className="mt-1 text-xs text-slate-400">Ver perfil del instructor →</p>
                  </div>
                </button>
              </section>

              {hasActiveReservation ? (
                  <p className="mt-6 text-center text-sm font-extrabold text-amber-600 bg-amber-50 rounded-2xl p-4 ring-1 ring-amber-200">
                    Ya tienes una reserva activa para esta clase. No puedes reservar dos veces la misma sesión.
                  </p>
              ) : (
                  <p className={`mt-6 text-center text-sm font-extrabold ${classItem.availableSpots > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {classItem.availableSpots > 0
                        ? `Quedan ${classItem.availableSpots} espacios disponibles para esta sesión`
                        : 'Lo sentimos, esta clase ya completó su aforo total'}
                  </p>
              )}

              <div className="sticky bottom-4 mt-5">
                <button
                    className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-brand-600 font-extrabold text-white shadow-[0_14px_28px_rgba(14,165,233,0.28)] transition hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 md:min-h-16 md:text-lg"
                    onClick={handleReserve}
                    disabled={classItem.availableSpots === 0 || hasActiveReservation || checkingReservation}
                    type="button"
                >
                  {checkingReservation
                      ? 'Verificando...'
                      : hasActiveReservation
                          ? 'Ya reservado'
                          : classItem.availableSpots === 0
                              ? 'Sin cupos disponibles'
                      : 'Seleccionar espacio →'}
                </button>
              </div>
            </div>
          </article>
        </section>
      </main>
  );
}

export default DetalleClase;
