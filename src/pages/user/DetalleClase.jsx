import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { classService } from '../../services/classService.js';
import { reservationService } from '../../services/reservationService.js';

function DetalleClase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [classItem, setClassItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reserving, setReserving] = useState(false);
  const [reserved, setReserved] = useState(false);

  useEffect(() => {
    classService
        .getClassById(id)
        .then((data) => {
          setClassItem(data);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
  }, [id]);

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

  // Lógica visual para renderizar los círculos de intensidad
  const renderIntensityDots = (level) => {
    let activeDots = 2; // Por defecto MEDIA (Moderado)
    if (level === 'Energia alta' || level === 'ALTA') activeDots = 3;
    if (level === 'Principiante' || level === 'BAJA') activeDots = 1;

    return (
        <div className="flex items-center gap-1.5 mt-1">
          {[1, 2, 3].map((dot) => (
              <div
                  key={dot}
                  className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                      dot <= activeDots ? 'bg-orange-500' : 'bg-slate-200'
                  }`}
              />
          ))}
          <span className="text-xs font-bold text-slate-500 ml-1.5 uppercase tracking-wide">
          {classItem.level}
        </span>
        </div>
    );
  };

  return (
      <main className="min-h-screen bg-gradient-to-b from-brand-50 to-brand-100 pb-24">
        {/* Encabezado Superior de Navegación */}
        <div className="max-w-3xl mx-auto px-6 pt-6">
          <button
              className="flex items-center gap-2 font-extrabold text-brand-600 hover:text-brand-700 transition group py-2"
              onClick={() => navigate(-1)}
              type="button"
          >
            <span className="text-xl transform group-hover:-translate-x-1 transition-transform">←</span>
            Volver
          </button>
        </div>

        <section className="max-w-3xl mx-auto px-6 mt-4">
          {/* Tarjeta de Información Principal */}
          <article className="overflow-hidden rounded-3xl bg-white shadow-soft border border-brand-100 p-6 md:p-8 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
              <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 font-extrabold text-xs rounded-full uppercase tracking-wider mb-2">
                Clase Programada
              </span>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                  {classItem.name}
                </h1>
              </div>
              <span className="text-4xl md:text-5xl bg-slate-50 p-3 rounded-2xl" aria-hidden="true">
              {classItem.icon || '💪'}
            </span>
            </div>

            {/* Bloque de Horarios y Aforos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">

              {/* Fecha */}
              <div className="flex items-center gap-3">
                <span className="text-xl bg-slate-50 p-2 rounded-xl" aria-hidden="true">📅</span>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Fecha</p>
                  <p className="text-sm font-extrabold text-slate-700">
                    {classItem.date
                        ? new Date(classItem.date + 'T00:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
                        : 'Próximamente'}
                  </p>
                </div>
              </div>

              {/* Horario */}
              <div className="flex items-center gap-3">
                <span className="text-xl bg-slate-50 p-2 rounded-xl" aria-hidden="true">⏰</span>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Horario</p>
                  <p className="text-sm font-extrabold text-slate-700">{classItem.time || '00:00'}</p>
                </div>
              </div>

              {/* Duración */}
              <div className="flex items-center gap-3">
                <span className="text-xl bg-slate-50 p-2 rounded-xl" aria-hidden="true">⏱️</span>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Duración</p>
                  <p className="text-sm font-extrabold text-slate-700">{classItem.duration || '0 min'}</p>
                </div>
              </div>

              {/* Aforo */}
              <div className="flex items-center gap-3">
                <span className="text-xl bg-slate-50 p-2 rounded-xl" aria-hidden="true">👥</span>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Aforo</p>
                  <p className="text-sm font-extrabold text-slate-700">
                    {classItem.reserved}/{classItem.capacity} cupos
                  </p>
                </div>
              </div>

            </div>

            {/* Intensidad y Precio */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Intensidad</p>
                {renderIntensityDots(classItem.level)}
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase">Precio de Inscripción</p>
                <p className="text-xl font-extrabold text-brand-600">
                  S/ {classItem.price ? Number(classItem.price).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </article>

          {/* Sección: Sobre la clase */}
          <section className="bg-white rounded-3xl shadow-soft border border-brand-100 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 mb-3">
              <span className="text-brand-500" aria-hidden="true">✨</span> Sobre la clase
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {classItem.description || 'No hay una descripción detallada disponible para esta clase en este momento.'}
            </p>
          </section>

          {/* Sección: Reglas de vestimenta */}
          <section className="bg-white rounded-3xl shadow-soft border border-brand-100 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 mb-3">
              <span className="text-orange-500" aria-hidden="true">👟</span> Reglas de vestimenta
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {classItem.clothingRules ||
                  classItem.reglas_vestimenta ||
                  'Uso obligatorio de indumentaria deportiva completa, zapatillas limpias de salón y toalla personal para el entrenamiento.'}
            </p>
          </section>

          {/* Sección: Instructora / Profesor */}
          <section className="bg-white rounded-3xl shadow-soft border border-brand-100 p-6 md:p-8 mb-8">
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 mb-4">
              <span className="text-brand-500" aria-hidden="true">👑</span> Instructora a cargo
            </h2>
            <div className="flex items-center gap-4 bg-gradient-to-r from-brand-50 to-transparent p-4 rounded-2xl">
              <div className="w-14 h-14 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                {classItem.trainer ? classItem.trainer.charAt(0) : '👩‍🏫'}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base md:text-lg">
                  Prof. {classItem.trainer}
                </h3>
                <p className="text-xs font-bold text-brand-600 bg-white px-2.5 py-0.5 rounded-full inline-block mt-1 border border-brand-100">
                  Staff Certificado JMGym
                </p>
              </div>
            </div>
          </section>

          {/* Indicador Dinámico de Disponibilidad */}
          <div className="mb-4 text-center">
            <p className={`text-sm font-extrabold ${classItem.availableSpots > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {classItem.availableSpots > 0
                  ? `🔥 ¡Aprovecha! Quedan solo ${classItem.availableSpots} cupos disponibles para esta sesión`
                  : '❌ Lo sentimos, esta clase ya completó su aforo total'}
            </p>
          </div>

          {/* Botón de Acción / Confirmación */}
          {reserved ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-4 font-bold text-emerald-700 text-center shadow-soft flex items-center justify-center gap-2">
                <span>✅</span> ¡Clase agendada exitosamente! Puedes verla desde tu panel de reservas.
              </div>
          ) : (
              <button
                  className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 font-extrabold text-white shadow-soft transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg active:translate-y-[0px] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none md:min-h-16 md:text-lg"
                  onClick={handleReserve}
                  disabled={reserving || classItem.availableSpots === 0}
                  type="button"
              >
                {reserving ? (
                    <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando tu reserva...
              </span>
                ) : classItem.availableSpots === 0 ? (
                    'Sin cupos disponibles'
                ) : (
                    'Reservar mi clase'
                )}
              </button>
          )}
        </section>
      </main>
  );
}

export default DetalleClase;