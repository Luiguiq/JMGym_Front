import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ReservationTable from '../../components/admin/ReservationTable';
import Loader from '../../components/admin/Loader';
import { reservationService } from '../../services/reservationService';

const ReservasAdmin = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [paymentFilter, setPaymentFilter] = useState('todos');

  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [searchTerm, statusFilter, paymentFilter, reservations]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getAllReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error cargando reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.className.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'todas') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (paymentFilter !== 'todos') {
      filtered = filtered.filter((r) => r.paymentStatus === paymentFilter);
    }

    setFilteredReservations(filtered);
  };

  const handleDeleteReservation = async (id) => {
    if (window.confirm('¿Está seguro de que desea cancelar esta reserva?')) {
      try {
        await reservationService.deleteReservation(id);
        setReservations(reservations.filter((r) => r.id !== id));
      } catch (error) {
        console.error('Error cancelando reserva:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Gestión de Reservas</h1>
        <p className="text-slate-600 text-sm mt-1">Visualiza y administra todas las reservas de clases</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por usuario o clase..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="todas">Todos los estados</option>
          <option value="confirmada">Confirmada</option>
          <option value="pendiente">Pendiente</option>
          <option value="cancelada">Cancelada</option>
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="todos">Todos los pagos</option>
          <option value="pagado">Pagado</option>
          <option value="pendiente">Pendiente</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-6 shadow-md">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size="md" text="Cargando reservas..." />
          </div>
        ) : (
          <ReservationTable
            data={filteredReservations}
            onDelete={handleDeleteReservation}
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-slate-600 text-sm mb-1">Confirmadas</p>
          <p className="text-3xl font-bold text-green-600">
            {reservations.filter((r) => r.status === 'confirmada').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-slate-600 text-sm mb-1">Pendientes</p>
          <p className="text-3xl font-bold text-amber-600">
            {reservations.filter((r) => r.status === 'pendiente').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-slate-600 text-sm mb-1">Canceladas</p>
          <p className="text-3xl font-bold text-red-600">
            {reservations.filter((r) => r.status === 'cancelada').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReservasAdmin;
