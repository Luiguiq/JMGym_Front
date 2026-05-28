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
      .then(setClassItem)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleReserve() {
    if (!isAuthenticated) {
      navigate('/cliente/login');
      return;
    }
    setReserving(true);
    setError('');
    try {
      await reservationService.createReservation(id);
      setReserved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setReserving(false);
    }
  }

  if (loading) return <main className="min-h-screen bg-brand-50 p-8"><p className="text-slate-500">Cargando...</p></main>;
  if (error) return <main className="min-h-screen bg-brand-50 p-8"><p className="text-red-500">{error}</p></main>;
  if (!classItem) return <main className="min-h-screen bg-brand-50 p-8"><p className="text-slate-500">Clase no encontrada</p></main>;

  return (
    <main className="min-h-screen bg-brand-50 p-8">
      <section className="mx-auto max-w-2xl">
        <button className="mb-6 font-extrabold text-brand-600" onClick={() => navigate(-1)} type="button">← Volver</button>
        <h1 className="text-4xl font-extrabold text-slate-800">{classItem.name}</h1>
        <p className="mt-2 text-lg text-slate-500">👩‍🏫 Prof. {classItem.trainer}</p>
        <p className="mt-1 text-lg text-slate-500">⏰ {classItem.time} · ⏱️ {classItem.duration}</p>
        <p className="mt-1 text-lg text-slate-500">🔥 {classItem.level} · 👥 {classItem.reserved}/{classItem.capacity}</p>
        <p className={`mt-1 text-lg ${classItem.availableSpots > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {classItem.availableSpots > 0 ? `${classItem.availableSpots} cupos disponibles` : 'Sin cupos'}
        </p>

        {reserved ? (
          <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 font-bold text-emerald-700">¡Reservada exitosamente!</p>
        ) : (
          <button
            className="mt-6 min-h-14 w-full rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 font-extrabold text-white shadow-soft disabled:opacity-60 md:min-h-16"
            onClick={handleReserve}
            disabled={reserving || classItem.availableSpots === 0}
            type="button"
          >
            {reserving ? 'Reservando...' : classItem.availableSpots === 0 ? 'Sin cupos' : 'Reservar clase'}
          </button>
        )}
      </section>
    </main>
  );
}

export default DetalleClase;
