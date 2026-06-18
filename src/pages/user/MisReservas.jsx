import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, Search, ClipboardList, ScrollText } from 'lucide-react';
import { reservationService } from '../../services/reservationService.js';
import ReservationCard from '../../components/user/ReservationCard.jsx';

const STATUS_FILTERS = [
  { value: 'TODAS', label: 'Todas' },
  { value: 'CANCELADA', label: 'Canceladas' },
  { value: 'FINALIZADA', label: 'Finalizadas' },
  { value: 'COMPLETADA', label: 'Completadas' },
];

function groupByMonth(reservations) {
  const groups = {};
  for (const r of reservations) {
    const date = r.fecha_clase || r.fecha_reserva;
    if (!date) continue;
    const d = new Date(date + 'T00:00:00');
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

const MONTH_NAMES = {
  '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
  '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
  '09': 'Setiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre',
};

function formatMonthLabel(key) {
  const [year, month] = key.split('-');
  return `${MONTH_NAMES[month] || month} ${year}`;
}

function MisReservas() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('activas');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODAS');
  const [sortOrder, setSortOrder] = useState('newest');

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
    return reservations.filter((r) => r.estado_reserva === 'ACTIVA');
  }, [reservations]);

  const rawHistory = useMemo(() => {
    return reservations.filter(
      (r) =>
        r.estado_reserva === 'CANCELADA' ||
        r.estado_reserva === 'FINALIZADA' ||
        r.estado_reserva === 'COMPLETADA'
    );
  }, [reservations]);

  const historyReservations = useMemo(() => {
    let filtered = rawHistory;

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.className?.toLowerCase().includes(q) ||
          r.instructor_nombre?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'TODAS') {
      filtered = filtered.filter((r) => r.estado_reserva === statusFilter);
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = a.fecha_clase || a.fecha_reserva || '';
      const dateB = b.fecha_clase || b.fecha_reserva || '';
      if (sortOrder === 'newest') return dateB.localeCompare(dateA);
      return dateA.localeCompare(dateB);
    });

    return sorted;
  }, [rawHistory, search, statusFilter, sortOrder]);

  const historyGroups = useMemo(() => groupByMonth(historyReservations), [historyReservations]);

  const stats = useMemo(() => {
    const total = rawHistory.length;
    const completed = rawHistory.filter((r) => r.estado_reserva === 'FINALIZADA' || r.estado_reserva === 'COMPLETADA').length;
    const cancelled = rawHistory.filter((r) => r.estado_reserva === 'CANCELADA').length;
    const totalSpent = rawHistory
      .filter((r) => r.estado_pago === 'PAGADO')
      .reduce((sum, r) => sum + Number(r.monto || 0), 0);
    return { total, completed, cancelled, totalSpent };
  }, [rawHistory]);

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('TODAS');
    setSortOrder('newest');
  };

  const hasActiveFilters = search.trim() || statusFilter !== 'TODAS';

  return (
    <main className="min-h-screen bg-brand-50 px-5 py-6 pb-28 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl md:text-4xl">Mis reservas</h1>
      <p className="mt-1 text-sm text-slate-500 sm:text-base">Consulta y gestiona tus clases reservadas</p>

      {/* Tabs */}
      <div className="mt-6 inline-flex rounded-2xl bg-white p-1 shadow-sm border border-slate-100 overflow-x-auto" role="tablist" aria-label="Secciones de reservas">
        <button
          role="tab"
          id="tab-activas"
          aria-selected={activeTab === 'activas'}
          aria-controls="panel-activas"
          onClick={() => setActiveTab('activas')}
          className={`px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'activas'
              ? 'bg-[#004aab] text-white shadow-md'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calendar size={18} className="inline" aria-hidden="true" /> Activas ({activeReservations.length})
        </button>
        <button
          role="tab"
          id="tab-historial"
          aria-selected={activeTab === 'historial'}
          aria-controls="panel-historial"
          onClick={() => setActiveTab('historial')}
          className={`px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'historial'
              ? 'bg-[#004aab] text-white shadow-md'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock size={18} className="inline" aria-hidden="true" /> Historial ({rawHistory.length})
        </button>
      </div>

      {/* Stats - history */}
      {activeTab === 'historial' && rawHistory.length > 0 && (
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm" role="status">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total</p>
            <p className="text-xl font-black text-slate-800">{stats.total}</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm" role="status">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Asistidas</p>
            <p className="text-xl font-black text-emerald-600">{stats.completed}</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm" role="status">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Canceladas</p>
            <p className="text-xl font-black text-red-500">{stats.cancelled}</p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm" role="status">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Gastado</p>
            <p className="text-xl font-black text-[#004aab]">S/ {stats.totalSpent.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* History filters */}
      {activeTab === 'historial' && rawHistory.length > 0 && (
        <div className="mt-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                aria-label="Buscar reservas por clase o instructor"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por clase o instructor..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-[#004aab] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              aria-label="Filtrar por estado de reserva"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#004aab] focus:ring-2 focus:ring-blue-100"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>

            <select
              aria-label="Ordenar por fecha"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#004aab] focus:ring-2 focus:ring-blue-100"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguas</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-[#004aab] hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="mt-5 sm:mt-6">
        {loading ? (
          <p className="text-slate-400" role="status">Cargando reservas...</p>
        ) : error ? (
          <p className="text-red-500" role="alert">{error}</p>
        ) : activeTab === 'activas' ? (
          <div
            role="tabpanel"
            id="panel-activas"
            aria-labelledby="tab-activas"
            aria-live="polite"
          >
            {activeReservations.length === 0 ? (
              <div className="rounded-3xl bg-white border border-slate-100 p-10 text-center shadow-sm">
                <ClipboardList size={48} className="mx-auto mb-4 text-slate-300" aria-hidden="true" />
                <h3 className="text-lg font-bold text-slate-700">No tienes reservas activas</h3>
                <p className="mt-2 text-sm text-slate-400">Cuando reserves una clase aparecerá aquí.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {activeReservations.map((res) => (
                  <ReservationCard reservation={res} key={res.id} onRefresh={loadReservations} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div
            role="tabpanel"
            id="panel-historial"
            aria-labelledby="tab-historial"
            aria-live="polite"
          >
            {historyReservations.length === 0 ? (
              <div className="rounded-3xl bg-white border border-slate-100 p-10 text-center shadow-sm">
                <ScrollText size={48} className="mx-auto mb-4 text-slate-300" aria-hidden="true" />
                <h3 className="text-lg font-bold text-slate-700">
                  {hasActiveFilters ? 'Sin resultados' : 'No tienes historial de reservas'}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {hasActiveFilters
                    ? 'Intenta con otros términos de búsqueda.'
                    : 'Las reservas completadas o canceladas aparecerán aquí.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {historyGroups.map(([monthKey, group]) => (
                  <section key={monthKey} aria-label={`${formatMonthLabel(monthKey)} - ${group.length} reservas`}>
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3 px-1">
                      {formatMonthLabel(monthKey)} · {group.length} reserva{group.length !== 1 ? 's' : ''}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                      {group.map((res) => (
                        <ReservationCard reservation={res} key={res.id} onRefresh={loadReservations} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default MisReservas;