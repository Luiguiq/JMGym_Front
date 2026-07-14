import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle, Clock, XCircle, RotateCcw, Search } from 'lucide-react';
import { paymentService } from '../../services/paymentService.js';

const ESTADO_STYLES = {
  CONFIRMADO: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', icon: CheckCircle, label: 'Confirmado' },
  PENDIENTE: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-300', icon: Clock, label: 'Pendiente' },
  RECHAZADO: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-700 dark:text-red-300', icon: XCircle, label: 'Rechazado' },
  REEMBOLSADO: { bg: 'bg-primary/10', text: 'text-blue-700 dark:text-blue-300', icon: RotateCcw, label: 'Reembolsado' },
};

const METODO_ICONS = {
  YAPE: CreditCard,
  EFECTIVO: CreditCard,
};

const MONTH_NAMES = {
  '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
  '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
  '09': 'Setiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} de ${MONTH_NAMES[String(d.getMonth() + 1).padStart(2, '0')] || ''} del ${d.getFullYear()}`;
}

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getDate()} de ${MONTH_NAMES[String(d.getMonth() + 1).padStart(2, '0')]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function Pagos() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    paymentService
      .getMyPayments()
      .then(setPayments)
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.nombreClase.toLowerCase().includes(q) ||
      p.codigoReserva.toLowerCase().includes(q) ||
      p.metodoPago.toLowerCase().includes(q) ||
      p.estado.toLowerCase().includes(q)
    );
  });

  const totalGastado = payments
    .filter((p) => p.estado === 'CONFIRMADO')
    .reduce((sum, p) => sum + p.monto, 0);

  return (
    <main className="min-h-screen bg-surface pb-32 lg:pb-16">
      <section className="mx-auto max-w-2xl px-4 pt-8 sm:px-6 sm:pt-12 lg:max-w-4xl lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Volver a la pantalla anterior"
            className="grid h-11 w-11 place-items-center rounded-xl bg-card text-secondary shadow-[0_4px_12px_rgba(33,45,58,0.08)] transition hover:bg-border-light"
          >
            <ArrowLeft size={22} aria-hidden="true" />
          </button>
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Historial de pagos</h2>
            <p className="mt-1 text-secondary">Todos tus pagos realizados</p>
          </div>
        </div>

        <div className="relative mb-5">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-foreground placeholder:text-muted"
            type="text"
            aria-label="Buscar pagos por clase, código, método o estado"
            placeholder="Buscar por clase, código, método..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {totalGastado > 0 && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-4 text-primary-foreground shadow-lg">
            <CreditCard size={24} />
            <div>
              <p className="text-sm font-semibold opacity-80">Total consumido</p>
              <p className="text-2xl font-black">S/ {totalGastado.toFixed(2)}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3" role="status" aria-label="Cargando pagos">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-border-light" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <CreditCard size={48} className="text-muted" aria-hidden="true" />
            <p className="text-lg font-bold text-secondary">
              {search ? 'Sin resultados' : 'Aún no tienes pagos'}
            </p>
            <p className="text-sm text-muted">
              {search ? 'Intenta con otro término de búsqueda' : 'Tus pagos aparecerán aquí cuando reserves una clase'}
            </p>
          </div>
        ) : (
          <div className="space-y-3" aria-live="polite">
            {filtered.map((p) => {
              const estadoStyle = ESTADO_STYLES[p.estado] || ESTADO_STYLES.PENDIENTE;
              const MetodoIcon = METODO_ICONS[p.metodoPago] || CreditCard;
              const EstadoIcon = estadoStyle.icon;
              return (
                <div
                  key={p.id}
                  className="rounded-2xl bg-card p-4 shadow-[0_4px_16px_rgba(33,45,58,0.06)] transition hover:shadow-[0_8px_24px_rgba(33,45,58,0.1)] sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-bold text-foreground">{p.nombreClase || 'Clase'}</p>
                      <p className="mt-0.5 text-xs text-secondary">Código de reserva #{p.codigoReserva}</p>
                      {p.fechaClase && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
                          <Clock size={14} className="text-muted" />
                          {formatDate(p.fechaClase)}
                          {p.horaInicio && ` · ${p.horaInicio.slice(0, 5)}`}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-foreground">S/ {p.monto.toFixed(2)}</p>
                      <span
                        className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${estadoStyle.bg} ${estadoStyle.text}`}
                        aria-label={`Estado del pago: ${estadoStyle.label}`}
                      >
                        <EstadoIcon size={12} aria-hidden="true" />
                        Pago {estadoStyle.label.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border-light pt-3 text-xs text-secondary">
                    <span className="flex items-center gap-1">
                      <MetodoIcon size={14} aria-hidden="true" />
                      Método: {p.metodoPago}
                    </span>
                    {p.fechaPago && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} aria-hidden="true" />
                        Pagado {formatDateTime(p.fechaPago)}
                      </span>
                    )}
                    {p.codigoOperacion && (
                      <span className="text-secondary">Operación {p.codigoOperacion}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Pagos;
