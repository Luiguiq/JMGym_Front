import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Smartphone, CheckCircle, XCircle, Clock,
  DollarSign, TrendingUp, AlertCircle,
} from 'lucide-react';
import { paymentService } from '../../services/paymentService.js';
import Loader from '../../components/admin/Loader.jsx';

const PAGE_SIZE = 8;

const statusConfig = {
  APROBADO: {
    label: 'Aprobado',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-700 dark:text-emerald-300',
    icon: CheckCircle,
  },
  RECHAZADO: {
    label: 'Rechazado',
    bg: 'bg-red-50 dark:bg-red-500/10',
    text: 'text-red-700 dark:text-red-300',
    icon: XCircle,
  },
  PENDIENTE: {
    label: 'Pendiente',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-300',
    icon: Clock,
  },
};

function PagosYapeAdmin() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('todos');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadPagos();
  }, []);

  const loadPagos = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getAllYapePayments();
      setPagos(data);
    } catch (error) {
      console.error('Error cargando pagos Yape:', error);
    } finally {
      setLoading(false);
    }
  };

  const aprobados = pagos.filter((p) => p.estado === 'APROBADO');
  const rechazados = pagos.filter((p) => p.estado === 'RECHAZADO');
  const pendientes = pagos.filter((p) => p.estado === 'PENDIENTE');

  const filtered =
    filterTab === 'aprobados'
      ? aprobados
      : filterTab === 'rechazados'
        ? rechazados
        : filterTab === 'pendientes'
          ? pendientes
          : pagos;

  const searched = search
    ? filtered.filter(
        (p) =>
          p.usuarioNombre?.toLowerCase().includes(search.toLowerCase()) ||
          p.usuarioCorreo?.toLowerCase().includes(search.toLowerCase()) ||
          p.celular?.includes(search),
      )
    : filtered;

  const totalMonto = aprobados.reduce((sum, p) => sum + Number(p.monto || 0), 0);
  const totalPages = Math.max(1, Math.ceil(searched.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = searched.slice(start, end);

  useEffect(() => { setPage(1); }, [filterTab, search]);

  const stats = [
    {
      label: 'Total pagos',
      value: pagos.length,
      color: 'text-foreground',
      icon: Smartphone,
    },
    {
      label: 'Aprobados',
      value: aprobados.length,
      color: 'text-emerald-600 dark:text-emerald-400',
      icon: CheckCircle,
    },
    {
      label: 'Rechazados',
      value: rechazados.length,
      color: 'text-red-600 dark:text-red-400',
      icon: XCircle,
    },
    {
      label: 'Monto total',
      value: `S/ ${totalMonto.toFixed(2)}`,
      color: 'text-blue-600 dark:text-blue-400',
      icon: DollarSign,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-0">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-3xl">Pagos Yape</h1>
        <p className="mt-1 text-xs text-muted sm:text-sm">
          Historial de pagos realizados con Yape
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border-light bg-card p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className={`text-2xl font-black sm:text-3xl ${s.color}`}>{s.value}</p>
                <Icon size={20} className="text-muted-foreground" />
              </div>
              <p className="mt-1 text-xs font-semibold text-muted">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Buscar por nombre, correo o celular..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      {/* Filter tabs */}
      <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-2 sm:min-w-0">
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'aprobados', label: 'Aprobados' },
            { key: 'pendientes', label: 'Pendientes' },
            { key: 'rechazados', label: 'Rechazados' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setFilterTab(t.key); setPage(1); }}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition ${
                filterTab === t.key
                  ? 'bg-brand-600 text-primary-foreground shadow-md'
                  : 'border border-border bg-card text-secondary hover:bg-surface'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader size="md" text="Cargando pagos Yape..." />
        </div>
      ) : pageItems.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Smartphone size={48} className="text-muted-foreground" />
          <p className="text-lg font-bold text-muted">
            {search ? 'Sin resultados' : 'No hay pagos con Yape aún'}
          </p>
          <p className="text-xs text-muted-foreground">
            {search ? 'Intenta con otros términos de búsqueda' : 'Los pagos aparecerán aquí cuando los usuarios usen Yape'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {pageItems.map((pago) => {
            const cfg = statusConfig[pago.estado] || statusConfig.PENDIENTE;
            const StatusIcon = cfg.icon;
            return (
              <motion.div
                key={pago.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border-light bg-card p-4 shadow-sm transition hover:shadow-md sm:p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar / icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/10">
                    <Smartphone size={22} className="text-purple-600 dark:text-purple-300" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-foreground">
                        {pago.usuarioNombre || 'Usuario'}
                      </p>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${cfg.bg} ${cfg.text}`}>
                        <StatusIcon size={12} />
                        {cfg.label}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                      <span>{pago.usuarioCorreo}</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-300">
                        📱 {pago.celular}
                      </span>
                      <span className="font-black text-foreground">
                        S/ {Number(pago.monto || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                      <span>
                        Creado:{' '}
                        {pago.fechaCreacion
                          ? new Date(pago.fechaCreacion).toLocaleDateString('es-PE', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </span>
                      {pago.fechaConfirmacion && (
                        <span>
                          Confirmado:{' '}
                          {new Date(pago.fechaConfirmacion).toLocaleDateString('es-PE', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold text-secondary transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="px-3 text-sm font-semibold text-muted">
            {safePage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-bold text-secondary transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default PagosYapeAdmin;
