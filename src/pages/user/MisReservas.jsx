import { useEffect, useState } from 'react';
import { reservationService } from '../../services/reservationService.js';
import ReservationCard from '../../components/user/ReservationCard.jsx';
import BottomNav from '../../components/user/BottomNav.jsx';

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
    <main className="min-h-screen bg-brand-50 px-6 py-8 pb-28">
      <h1 className="text-3xl font-extrabold text-slate-800">Mis reservas</h1>

      <div className="mt-6 grid gap-4">
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

      <BottomNav />
    </main>
  );
}

export default MisReservas;
