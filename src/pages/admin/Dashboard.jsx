import { useEffect, useState } from 'react';
import StatsCard from '../../components/admin/StatsCard.jsx';
import { apiRequest } from '../../services/api.js';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/admin/stats')
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="p-6"><p className="text-slate-500">Cargando...</p></main>;

  return (
    <main className="grid gap-4 p-6 md:grid-cols-3">
      {stats ? (
        <>
          <StatsCard title="Clases" value={String(stats.totalClasses ?? 0)} />
          <StatsCard title="Reservas" value={String(stats.totalReservations ?? 0)} />
          <StatsCard title="Clientes" value={String(stats.totalClients ?? 0)} />
        </>
      ) : (
        <>
          <StatsCard title="Clases" value="0" />
          <StatsCard title="Reservas" value="0" />
          <StatsCard title="Clientes" value="0" />
        </>
      )}
    </main>
  );
}

export default Dashboard;
