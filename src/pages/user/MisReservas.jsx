import { useEffect, useState } from 'react';
import { reservationService } from '../../services/reservationService.js';
import ReservationCard from '../../components/user/ReservationCard.jsx';

function MisReservas() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    reservationService
      .getMyReservations()
      .then(setReservations)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-brand-50 px-5 py-6 pb-32 sm:px-6 sm:py-8 md:pb-28">
      <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl md:text-4xl">Mis reservas</h1>
      <p className="mt-1 text-sm text-slate-500 sm:text-base">Consulta y gestiona tus clases reservadas</p>

      <div className="mt-5 sm:mt-6 grid gap-4">
        {loading ? (
          <p className="text-slate-400">Cargando reservas...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : reservations.length === 0 ? (
          <p className="text-slate-400">No tienes reservas activas</p>
        ) : (
          reservations.map((res) => <ReservationCard reservation={res} key={res.id} />)
        )}
      </div>
    </main>
  );
}

export default MisReservas;
