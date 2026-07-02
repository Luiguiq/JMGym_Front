import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, ChevronLeft, Calendar, Flame, Music, Dumbbell, Zap, Clock } from 'lucide-react';
import ClassCard from '../../components/user/ClassCard.jsx';
import { classService } from '../../services/classService.js';

const mesNombres = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
const diasCorto = ['Do','Lu','Ma','Mi','Ju','Vi','Sa'];

function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const catChips = [
  { val: 'todos', label: 'Todas', icon: Flame },
  { val: 'cardio', label: 'Cardio', icon: Zap },
  { val: 'baile', label: 'Baile', icon: Music },
  { val: 'fuerza', label: 'Fuerza', icon: Dumbbell },
];

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-border" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-border" />
          <div className="h-3 w-1/3 rounded bg-border-light" />
        </div>
        <div className="h-8 w-16 rounded-lg bg-border" />
      </div>
    </div>
  );
}

function FilterDrawer({ open, onClose, filters, setFilters, onClear }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[60] flex flex-col rounded-t-3xl bg-card shadow-xl"
            style={{ maxHeight: '85vh' }}
          >
            <div className="shrink-0 px-6 pt-6">
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border-light" />
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Filtros</h3>
                <button onClick={onClose} className="rounded-full bg-border-light p-2 text-muted transition hover:bg-border">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-6 pb-4 space-y-5 flex-1">
              <div>
                <p className="mb-2 text-[13px] font-bold text-secondary">Categoría</p>
                <div className="flex flex-wrap gap-2">
                  {catChips.map(({ val, label, icon: Icon }) => (
                    <button
                      key={val}
                      onClick={() => setFilters((p) => ({ ...p, cat: val }))}
                      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                        filters.cat === val
                          ? 'bg-blue-600 text-primary-foreground shadow-md'
                          : 'bg-border-light text-secondary hover:bg-border'
                      }`}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[13px] font-bold text-secondary">Fecha</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: '', label: 'Todas' },
                    { val: 'hoy', label: 'Hoy' },
                    { val: 'manana', label: 'Mañana' },
                    { val: 'semana', label: 'Esta semana' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      onClick={() => setFilters((p) => ({ ...p, time: val }))}
                      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                        filters.time === val
                          ? 'bg-blue-600 text-primary-foreground shadow-md'
                          : 'bg-border-light text-secondary hover:bg-border'
                      }`}
                    >
                      <Calendar size={15} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[13px] font-bold text-secondary">Hora</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: '', label: 'Cualquiera' },
                    { val: '6-12', label: 'Manana 6-12' },
                    { val: '12-18', label: 'Tarde 12-18' },
                    { val: '18-24', label: 'Noche 18-24' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      onClick={() => setFilters((p) => ({ ...p, hour: p.hour === val ? '' : val }))}
                      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                        filters.hour === val
                          ? 'bg-blue-600 text-primary-foreground shadow-md'
                          : 'bg-border-light text-secondary hover:bg-border'
                      }`}
                    >
                      <Clock size={15} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-border-light px-6 py-4">
              <div className="flex gap-3">
                <button
                  onClick={onClear}
                  className="flex-1 rounded-xl border border-border py-3 text-sm font-bold text-secondary transition hover:bg-surface"
                >
                  Limpiar
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-primary-foreground transition hover:bg-blue-700"
                >
                  Ver resultados
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ListaClases() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ cat: 'todos', time: '', hour: '' });

  useEffect(() => {
    classService
      .getAllClasses()
      .then(setClasses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const todayStr = useMemo(() => toDateStr(new Date()), []);

  const visibleClasses = useMemo(() => {
    let filtered = classes;

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) => c.name.toLowerCase().includes(q) || (c.trainer && c.trainer.toLowerCase().includes(q))
      );
    }

    if (filters.time === 'hoy') {
      filtered = filtered.filter((c) => c.date === todayStr);
    } else if (filters.time === 'manana') {
      const tomorrow = toDateStr(new Date(Date.now() + 86400000));
      filtered = filtered.filter((c) => c.date === tomorrow);
    }

    if (filters.cat !== 'todos') {
      filtered = filtered.filter((c) => {
        const name = (c.name || '').toLowerCase();
        if (filters.cat === 'cardio') return name.includes('cardio');
        if (filters.cat === 'baile') return c.id_genero === 2 || name.includes('zumba') || name.includes('baile');
        if (filters.cat === 'fuerza') return c.id_genero === 3 || name.includes('tren') || name.includes('fuerza');
        return true;
      });
    }

    if (filters.hour) {
      filtered = filtered.filter((c) => {
        if (!c.time) return false;
        const hour = parseInt(c.time.split(':')[0], 10);
        const [minH, maxH] = filters.hour.split('-').map(Number);
        return hour >= minH && hour < maxH;
      });
    }

    return filtered;
  }, [classes, search, filters]);

  const hasActiveFilters = search || filters.cat !== 'todos' || filters.time !== '' || filters.hour !== '';

  function clearFilters() {
    setSearch('');
    setFilters({ cat: 'todos', time: '', hour: '' });
  }

  return (
    <main className="min-h-screen bg-surface pb-28">
      <section className="mx-auto max-w-lg px-5 py-5 sm:px-6 sm:py-6">

        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-secondary shadow-sm transition hover:bg-border-light"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Clases</h1>
            <p className="text-[13px] text-muted">Encuentra tu próxima clase</p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar clase o instructor..."
            className="w-full rounded-2xl border-0 bg-card py-3.5 pl-11 pr-10 text-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] outline-none transition focus:shadow-[0_4px_16px_rgba(59,130,246,0.15)] focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="mb-2 flex items-center gap-2">
          {catChips.slice(0, 3).map(({ val, label, icon: Icon }) => (
            <button
              key={val}
              onClick={() => setFilters((p) => ({ ...p, cat: val }))}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition ${
                filters.cat === val
                  ? 'bg-blue-600 text-primary-foreground shadow-sm'
                  : 'bg-card text-muted shadow-sm hover:bg-border-light'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(true)}
            className={`ml-auto flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition ${
              hasActiveFilters && filters.cat === 'todos'
                ? 'bg-blue-600 text-primary-foreground shadow-sm'
                : 'bg-card text-muted shadow-sm hover:bg-border-light'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filtros
            {(filters.time || filters.hour) && (
              <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-primary-foreground">
                {(filters.time ? 1 : 0) + (filters.hour ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        <div className="mb-1 mt-4 flex items-center justify-between border-t border-border pt-3">
          <p className="text-[13px] text-muted">
            {loading ? (
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                Cargando...
              </span>
            ) : error ? (
              <span className="flex items-center gap-1.5 text-red-500">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                {error}
              </span>
            ) : (
              <span className="font-medium">{visibleClasses.length} clase{visibleClasses.length !== 1 ? 's' : ''} disponible{visibleClasses.length !== 1 ? 's' : ''}</span>
            )}
          </p>
          {hasActiveFilters && !loading && !error && (
            <button onClick={clearFilters} className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 transition">
              Limpiar
            </button>
          )}
        </div>

        <div className="mt-3 space-y-3">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 py-10 text-center dark:border-red-500/30 dark:bg-red-500/10">
              <p className="text-sm font-bold text-red-600 dark:text-red-300">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-primary-foreground transition hover:bg-red-700">
                Reintentar
              </button>
            </div>
          ) : visibleClasses.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg font-bold text-muted">Sin resultados</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasActiveFilters ? 'No hay clases con los filtros seleccionados' : 'No hay clases disponibles'}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-4 rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-primary-foreground transition hover:bg-blue-700">
                  Mostrar todas
                </button>
              )}
            </div>
          ) : (
            visibleClasses.map((classItem, i) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <ClassCard classItem={classItem} />
              </motion.div>
            ))
          )}
        </div>
      </section>

      <FilterDrawer
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        onClear={clearFilters}
      />
    </main>
  );
}

export default ListaClases;
