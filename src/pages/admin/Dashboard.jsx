import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Dumbbell, TrendingUp, Plus } from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';
import Loader from '../../components/admin/Loader';
import { apiRequest } from '../../services/api';
import { reservationService } from '../../services/reservationService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalReservations: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentReservations, setRecentReservations] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [statsData, reservationsData] = await Promise.allSettled([
        apiRequest('/admin/stats'),
        reservationService.getAllReservations(),
      ]);

      if (statsData.status === 'fulfilled' && statsData.value) {
        setStats({
          totalClasses: statsData.value.totalClasses ?? statsData.value.total_clases ?? 0,
          totalReservations: statsData.value.totalReservations ?? statsData.value.total_reservas ?? 0,
          totalUsers: statsData.value.totalClients ?? statsData.value.total_usuarios ?? 0,
        });
      }

      if (reservationsData.status === 'fulfilled' && reservationsData.value) {
        setRecentReservations(reservationsData.value.slice(0, 5));
      }
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const dateFormatted = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" text="Cargando panel..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl dark:text-foreground">¡Bienvenido a JM Gym!</h1>
        <p className="text-secondary mt-1 text-sm sm:text-base dark:text-muted-foreground">
          {dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1)}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatsCard
          title="Total de Clases"
          value={stats.totalClasses}
          subtitle="Registradas"
          icon={Dumbbell}
          color="brand"
          onClick={() => navigate('/admin/clases')}
        />
        <StatsCard
          title="Reservas"
          value={stats.totalReservations}
          subtitle="En total"
          icon={Calendar}
          color="green"
          onClick={() => navigate('/admin/reservas')}
        />
        <StatsCard
          title="Usuarios"
          value={stats.totalUsers}
          subtitle="Clientes registrados"
          icon={Users}
          color="amber"
          onClick={() => navigate('/admin/usuarios')}
        />
        <StatsCard
          title="Reservas recientes"
          value={recentReservations.length}
          subtitle="Últimos registros"
          icon={TrendingUp}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <button
          onClick={() => navigate('/admin/clases/crear')}
          className="bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow text-left dark:from-primary/20 dark:to-card dark:border-primary/30"
        >
          <div className="flex items-start justify-between mb-2 gap-3">
            <div>
              <h3 className="font-bold text-foreground text-base sm:text-lg dark:text-foreground">Crear nueva clase</h3>
              <p className="text-xs sm:text-sm text-secondary dark:text-muted-foreground">Agrega una nueva clase al catálogo</p>
            </div>
            <Plus className="text-brand-600 flex-shrink-0 dark:text-blue-300" size={20} />
          </div>
        </button>

        <button
          onClick={() => navigate('/admin/reservas')}
          className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow text-left dark:from-green-500/15 dark:to-card dark:border-green-500/30"
        >
          <div className="flex items-start justify-between mb-2 gap-3">
            <div>
              <h3 className="font-bold text-foreground text-base sm:text-lg dark:text-foreground">Ver reservas</h3>
              <p className="text-xs sm:text-sm text-secondary dark:text-muted-foreground">Gestiona todas las reservas</p>
            </div>
            <Calendar className="text-green-600 flex-shrink-0 dark:text-green-300" size={20} />
          </div>
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-md dark:bg-card dark:border-border">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-foreground dark:text-foreground">Reservas recientes</h2>
          <button
            onClick={() => navigate('/admin/reservas')}
            className="text-brand-600 hover:text-brand-700 font-medium text-xs sm:text-sm whitespace-nowrap"
          >
            Ver todas →
          </button>
        </div>

        <div className="space-y-3">
          {recentReservations.length === 0 ? (
            <p className="text-muted text-center py-4 dark:text-muted-foreground">No hay reservas recientes</p>
          ) : (
            recentReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-surface rounded-xl hover:bg-border-light transition-colors dark:bg-surface/50 dark:hover:bg-border"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate dark:text-foreground">{reservation.userName}</p>
                  <p className="text-sm text-secondary truncate dark:text-muted-foreground">{reservation.className}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:text-right">
                  <p className="text-sm text-secondary whitespace-nowrap dark:text-muted-foreground">{reservation.date}</p>
                  <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    reservation.status === 'ACTIVA' || reservation.status === 'confirmada'
                      ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300'
                  }`}>
                    {reservation.status === 'ACTIVA' ? 'confirmada' : reservation.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
