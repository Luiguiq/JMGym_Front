import { useEffect, useMemo, useState } from 'react';
import { reservationService } from '../../services/reservationService.js';
import ReservationCard from '../../components/user/ReservationCard.jsx';

function MisReservas() {
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

  const activeReservations = useMemo(() => {
    return reservations.filter(
      (r) =>
        r.estado_reserva === 'ACTIVA'
    );
  }, [reservations]);

  const historyReservations = useMemo(() => {
    return reservations.filter(
      (r) =>
        r.estado_reserva === 'CANCELADA' ||
        r.estado_reserva === 'FINALIZADA' ||
        r.estado_reserva === 'COMPLETADA'
    );
  }, [reservations]);

  const visibleReservations =
    activeTab === 'activas'
      ? activeReservations
      : historyReservations;

  return (
    <main className="min-h-screen bg-brand-50 px-5 py-6 pb-32 sm:px-6 sm:py-8 md:pb-28">
      <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl md:text-4xl">Mis reservas</h1>
      <p className="mt-1 text-sm text-slate-500 sm:text-base">Consulta y gestiona tus clases reservadas</p>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setActiveTab('activas')}
          className={`px-5 py-2 rounded-xl font-bold transition ${
            activeTab === 'activas'
              ? 'bg-brand-600 text-white'
              : 'bg-white text-slate-600'
          }`}
        >
          Activas ({activeReservations.length})
        </button>

        <button
          onClick={() => setActiveTab('historial')}
          className={`px-5 py-2 rounded-xl font-bold transition ${
            activeTab === 'historial'
              ? 'bg-brand-600 text-white'
              : 'bg-white text-slate-600'
          }`}
        >
          Historial ({historyReservations.length})
        </button>
      </div>

      <div className="mt-5 sm:mt-6 grid gap-4">
        {loading ? (
          <p className="text-slate-400">
            Cargando reservas...
          </p>
        ) : error ? (
          <p className="text-red-500">
            {error}
          </p>
        ) : visibleReservations.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center">
            <p className="text-slate-400">
              {activeTab === 'activas'
                ? 'No tienes reservas activas'
                : 'No tienes historial de reservas'}
            </p>
          </div>
        ) : (
          visibleReservations.map((res) => (
            <ReservationCard
              reservation={res}
              key={res.id}
              onRefresh={loadReservations}
            />
          ))
        )}
      </div>
    </main>
  );
}

export default MisReservas;
