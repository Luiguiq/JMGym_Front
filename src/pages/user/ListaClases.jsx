import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ClassCard from '../../components/user/ClassCard.jsx';
import { classService } from '../../services/classService.js';

const mesNombres = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const diasCorto = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];

function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function CalendarOverlay({ mode, selectedDates, onSelect, onClose }) {
  const [viewDate, setViewDate] = useState(new Date());
  const initial = Array.isArray(selectedDates) ? [...selectedDates] : (selectedDates ? [selectedDates] : []);
  const [localSelected, setLocalSelected] = useState(initial);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = toDateStr(new Date());

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function prevMonth() { setViewDate(new Date(year, month - 1, 1)); }
  function nextMonth() { setViewDate(new Date(year, month + 1, 1)); }

  function handleDayClick(day) {
    if (!day) return;
    const dateStr = toDateStr(new Date(year, month, day));
    setLocalSelected((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
  }

  function handleAccept() {
    if (mode === 'custom') {
      onSelect(localSelected.length > 0 ? localSelected[localSelected.length - 1] : '');
    } else {
      localSelected.forEach((d) => onSelect(d));
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-slate-100 transition">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <h3 className="font-extrabold text-slate-800 text-base">
            {mesNombres[month]} {year}
          </h3>
          <button onClick={nextMonth} className="p-1 rounded-full hover:bg-slate-100 transition">
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>

        <div className="px-5 pb-2 grid grid-cols-7 gap-0.5">
          {diasCorto.map((d) => (
            <div key={d} className="text-center text-[11px] font-bold text-slate-400 py-1">{d}</div>
          ))}
        </div>

        <div className="px-5 pb-5 grid grid-cols-7 gap-0.5">
          {cells.map((day, i) => {
            if (!day) return <div key={`e${i}`} />;
            const dateStr = toDateStr(new Date(year, month, day));
            const isToday = dateStr === today;
            const isSelected = localSelected.includes(dateStr);
            const isPast = dateStr < today;
            return (
              <button
                key={dateStr}
                onClick={() => !isPast && handleDayClick(day)}
                disabled={isPast}
                className={`relative flex items-center justify-center rounded-xl py-2.5 text-sm font-bold transition ${
                  isSelected
                    ? 'bg-[#004aab] text-white shadow-md'
                    : isToday
                      ? 'bg-brand-100 text-[#004aab]'
                      : isPast
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="border-t border-slate-100 px-5 py-3 flex justify-between items-center">
          <p className="text-xs text-slate-500">
            {localSelected.length > 0
              ? `${localSelected.length} día(s) seleccionado(s)`
              : 'Selecciona uno o más días'}
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="text-xs font-bold text-slate-600 bg-slate-100 rounded-full px-4 py-1.5 hover:bg-slate-200 transition">
              Cerrar
            </button>
            <button onClick={handleAccept} className="text-xs font-bold text-white bg-[#004aab] rounded-full px-5 py-1.5 hover:opacity-90 transition">
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const catOptions = [
  { val: 'todos', label: 'Todas' },
  { val: 'cardio', label: 'Cardio' },
  { val: 'baile',  label: 'Baile' },
  { val: 'fuerza', label: 'Fuerza' },
];

const hourOptions = [
  { val: '',      label: 'Cualquier hora' },
  { val: '6-12',  label: 'Mañana (6-12)' },
  { val: '12-18', label: 'Tarde (12-18)' },
  { val: '18-24', label: 'Noche (18-24)' },
];

function ListaClases() {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [catFilter, setCatFilter] = useState('todos');
  const [hourFilter, setHourFilter] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(null);

  useEffect(() => {
    classService
      .getAllClasses()
      .then(setClasses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const todayStr = useMemo(() => toDateStr(new Date()), []);

  function getFilteredClasses() {
    let filtered = classes;

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.trainer && c.trainer.toLowerCase().includes(q))
      );
    }

    if (timeFilter === 'hoy') {
      filtered = filtered.filter((c) => c.date === todayStr);
    } else if (timeFilter === 'manana') {
      const tomorrow = toDateStr(new Date(Date.now() + 86400000));
      filtered = filtered.filter((c) => c.date === tomorrow);
    } else if (timeFilter === 'semana' || timeFilter === 'custom') {
      if (timeFilter === 'semana' && selectedDates.length > 0) {
        filtered = filtered.filter((c) => selectedDates.includes(c.date));
      } else if (timeFilter === 'semana') {
        const dates = [];
        const d = new Date();
        const day = d.getDay();
        const mon = new Date(d);
        mon.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
        for (let i = 0; i < 7; i++) {
          const dd = new Date(mon);
          dd.setDate(mon.getDate() + i);
          dates.push(toDateStr(dd));
        }
        filtered = filtered.filter((c) => dates.includes(c.date));
      } else if (timeFilter === 'custom' && customDate) {
        filtered = filtered.filter((c) => c.date === customDate);
      } else if (timeFilter === 'custom' && selectedDates.length > 0) {
        filtered = filtered.filter((c) => selectedDates.includes(c.date));
      }
    }

    if (catFilter !== 'todos') {
      filtered = filtered.filter((c) => {
        const name = (c.name || '').toLowerCase();
        if (catFilter === 'cardio') return name.includes('cardio');
        if (catFilter === 'baile') return c.id_genero === 1 || name.includes('zumba') || name.includes('baile');
        if (catFilter === 'fuerza') return c.id_genero === 3 || name.includes('tren') || name.includes('fuerza');
        return true;
      });
    }

    if (hourFilter) {
      filtered = filtered.filter((c) => {
        if (!c.time) return false;
        const hour = parseInt(c.time.split(':')[0], 10);
        const [minH, maxH] = hourFilter.split('-').map(Number);
        return hour >= minH && hour < maxH;
      });
    }

    return filtered;
  }

  const visibleClasses = useMemo(
    getFilteredClasses,
    [classes, search, timeFilter, selectedDates, catFilter, hourFilter, customDate, todayStr]
  );

  const hasActiveFilters = search || timeFilter !== '' || selectedDates.length > 0 || catFilter !== 'todos' || hourFilter;

  function clearFilters() {
    setSearch('');
    setTimeFilter('');
    setSelectedDates([]);
    setCatFilter('todos');
    setHourFilter('');
    setCustomDate('');
    searchRef.current?.focus();
  }

  function handleCalendarSelect(dateStr) {
    if (showCalendar === 'semana') {
      setSelectedDates((prev) =>
        prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
      );
    } else {
      setCustomDate(dateStr);
    }
  }

  const activeCount = visibleClasses.length;
  const totalCount = classes.length;

  const timeLabel = timeFilter === '' ? '📅 Todas'
    : timeFilter === 'hoy' ? '📅 Hoy'
    : timeFilter === 'manana' ? '📅 Mañana'
    : timeFilter === 'semana'
      ? (selectedDates.length > 0 ? `📅 ${selectedDates.length} día(s)` : '📅 Esta semana')
    : customDate
      ? (() => {
          const d = new Date(customDate + 'T00:00:00');
          const diff = Math.round((d - new Date()) / 86400000);
          return diff === 0 ? '📅 Hoy' : diff === 1 ? '📅 Mañana' : `📅 ${d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}`;
        })()
    : '📅 Elegir fecha';

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fcff_0%,#edf8ff_100%)] px-5 py-6 pb-28 sm:px-6 sm:py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <section className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl">Clases disponibles</h1>
        <p className="mt-1 text-sm text-slate-500">Encuentra tu próxima clase y reserva tu lugar</p>

        {/* Search */}
        <div className="mt-5 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar clase o instructor..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm outline-none transition focus:border-[#004aab] focus:ring-2 focus:ring-blue-100"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Time filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => { setTimeFilter(''); setSelectedDates([]); setCustomDate(''); }}
            className={`rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
              timeFilter === ''
                ? 'bg-[#004aab] text-white shadow-md'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            📅 Todas
          </button>
          <button
            onClick={() => { setTimeFilter('hoy'); setSelectedDates([]); setCustomDate(''); }}
            className={`rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
              timeFilter === 'hoy'
                ? 'bg-[#004aab] text-white shadow-md'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            📅 Hoy
          </button>
          <button
            onClick={() => { setTimeFilter('manana'); setSelectedDates([]); setCustomDate(''); }}
            className={`rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
              timeFilter === 'manana'
                ? 'bg-[#004aab] text-white shadow-md'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            📅 Mañana
          </button>
          <button
            onClick={() => { setTimeFilter('semana'); setShowCalendar('semana'); }}
            className={`rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
              timeFilter === 'semana'
                ? 'bg-[#004aab] text-white shadow-md'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            📅 {timeFilter === 'semana' && selectedDates.length > 0 ? `${selectedDates.length} día(s)` : 'Esta semana'}
          </button>
          <button
            onClick={() => { setTimeFilter('custom'); setShowCalendar('custom'); }}
            className={`rounded-full px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
              timeFilter === 'custom'
                ? 'bg-[#004aab] text-white shadow-md'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            📅 {customDate || 'Elegir fecha'}
          </button>
        </div>

        {/* Category + Hour */}
        <div className="mt-3 flex flex-wrap gap-2">
          {catOptions.map((opt) => (
            <button
              key={opt.val}
              onClick={() => setCatFilter(opt.val)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                catFilter === opt.val
                  ? 'bg-[#004aab] text-white shadow-md'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <span className="hidden sm:block w-px bg-slate-200 self-stretch mx-1" />
          {hourOptions.map((opt) => (
            <button
              key={opt.val}
              onClick={() => setHourFilter(opt.val === hourFilter ? '' : opt.val)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                hourFilter === opt.val
                  ? 'bg-[#004aab] text-white shadow-md'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3">
          <p className="text-xs text-slate-500">
            {loading ? (
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                Cargando clases...
              </span>
            ) : error ? (
              <span className="flex items-center gap-1.5 text-red-500">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                {error}
              </span>
            ) : (
              <span>{activeCount} de {totalCount} clase{totalCount !== 1 ? 's' : ''}</span>
            )}
          </p>
          {hasActiveFilters && !loading && !error && (
            <button onClick={clearFilters} className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition">
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Results */}
        <div className="mt-4 grid gap-4">
          {loading ? (
            <p className="py-10 text-center text-sm text-slate-400">Cargando clases...</p>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 py-10 text-center">
              <p className="text-sm font-bold text-red-600">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 transition">
                Reintentar
              </button>
            </div>
          ) : visibleClasses.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg font-bold text-slate-500">Sin resultados</p>
              <p className="mt-1 text-sm text-slate-400">
                {hasActiveFilters ? 'No hay clases con los filtros seleccionados' : 'No hay clases disponibles'}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-4 rounded-full bg-[#004aab] px-5 py-2 text-xs font-bold text-white hover:opacity-90 transition">
                  Mostrar todas
                </button>
              )}
            </div>
          ) : (
            visibleClasses.map((classItem) => (
              <ClassCard classItem={classItem} key={classItem.id} />
            ))
          )}
        </div>
      </section>

      {/* Calendar Overlay */}
      {showCalendar && (
        <CalendarOverlay
          mode={showCalendar}
          selectedDates={showCalendar === 'semana' ? selectedDates : customDate}
          onSelect={handleCalendarSelect}
          onClose={() => {
            if (showCalendar === 'custom' && !customDate) setTimeFilter('');
            setShowCalendar(null);
          }}
        />
      )}
    </main>
  );
}

export default ListaClases;
