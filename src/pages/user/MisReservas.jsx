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
    <main className="min-h-screen bg-brand-50 px-5 py-6 pb-28 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl md:text-4xl">Mis reservas</h1>
      <p className="mt-1 text-sm text-slate-500 sm:text-base">Consulta y gestiona tus clases reservadas</p>

      <div className="mt-6 inline-flex rounded-2xl bg-white p-1 shadow-sm border border-slate-100 overflow-x-auto">
        <button
          onClick={() => setActiveTab('activas')}
          className={`
              px-5
              py-3
              rounded-xl
              text-sm
              font-bold
              transition-all
              ${
                  activeTab === 'activas'
                      ? 'bg-[#004aab] text-white shadow-md'
                      : 'text-slate-500'
              }
          `}
        >
            📅 Activas ({activeReservations.length})
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          className={`
              px-5
              py-3
              rounded-xl
              text-sm
              font-bold
              transition-all
              ${
                  activeTab === 'historial'
                      ? 'bg-[#004aab] text-white shadow-md'
                      : 'text-slate-500'
              }
          `}
        >
            🕘 Historial ({historyReservations.length})
        </button>
      </div>

      <div className="mt-5 sm:mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {loading ? (
          <p className="text-slate-400">
            Cargando reservas...
          </p>
        ) : error ? (
          <p className="text-red-500">
            {error}
          </p>
        ) : visibleReservations.length === 0 ? (

          <div
            className="
              rounded-3xl
              bg-white
              border
              border-slate-100
              p-10
              text-center
              shadow-sm
            "
          >

            <div className="text-5xl mb-4">
              {activeTab === 'activas'
                ? '📋'
                : '📜'}
            </div>

            <h3 className="
              text-lg
              font-bold
              text-slate-700
            ">
              {activeTab === 'activas'
                ? 'No tienes reservas activas'
                : 'No tienes historial de reservas'}
            </h3>

            <p className="
              mt-2
              text-sm
              text-slate-400
            ">
              {activeTab === 'activas'
                ? 'Cuando reserves una clase aparecerá aquí.'
                : 'Las reservas completadas o canceladas aparecerán aquí.'}
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
