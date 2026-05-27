import StatsCard from '../../components/admin/StatsCard.jsx';

function Dashboard() {
  return <main className="grid gap-4 p-6 md:grid-cols-3"><StatsCard title="Clases" value="12" /><StatsCard title="Reservas" value="48" /><StatsCard title="Clientes" value="120" /></main>;
}

export default Dashboard;
