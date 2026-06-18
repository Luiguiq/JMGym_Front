import { useState, useEffect } from 'react';
import { User, Calendar, Clock, Search, XCircle, CreditCard, Dumbbell, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { reservationService } from '../../services/reservationService.js';
import Loader from '../../components/admin/Loader.jsx';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';
const BACKEND_URL = API_BASE.replace('/api', '');
const PAGE_SIZE = 5;

function ReservasAdmin() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('todas');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelMotivo, setCancelMotivo] = useState('CLASE_CANCELADA');
  const [cancelDetalle, setCancelDetalle] = useState('');
  const [payTarget, setPayTarget] = useState(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const [refundTarget, setRefundTarget] = useState(null);
  const [approvingRefund, setApprovingRefund] = useState(false);
  const [refundError, setRefundError] = useState('');

  const adminMotivos = [
    { value: 'CLASE_CANCELADA', label: 'Clase cancelada' },
    { value: 'CAMBIO_HORARIO', label: 'Cambio de horario' },
    { value: 'CAMBIO_INSTRUCTOR', label: 'Cambio de instructor' },
    { value: 'VENCIMIENTO_PAGO', label: 'Vencimiento de pago' },
    { value: 'OTRO', label: 'Otro motivo' },
  ];

  useEffect(() => {
    loadReservations();
  }, []);

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

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCanceling(true);
    setCancelError('');
    try {
      await reservationService.deleteReservation(cancelTarget.id, cancelMotivo, cancelDetalle || null);
      setReservations((prev) => prev.filter((r) => r.id !== cancelTarget.id));
      setCancelTarget(null);
    } catch (error) {
      setCancelError(error?.message || 'No se pudo cancelar la reserva. Intenta nuevamente.');
    } finally {
      setCanceling(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!payTarget) return;
    setPaying(true);
    setPayError('');
    try {
      const updatedReservation = await reservationService.markAsPaid(payTarget.id);
      setReservations((prev) =>
        prev.map((r) => (r.id === updatedReservation.id ? updatedReservation : r))
      );
      setPayTarget(null);
    } catch (error) {
      setPayError(error?.message || 'No se pudo marcar la reserva como pagada. Intenta nuevamente.');
    } finally {
      setPaying(false);
    }
  };

  const handleApproveRefund = async () => {
  if (!refundTarget) return;

  setApprovingRefund(true);
  setRefundError('');

  try {

    const updatedReservation =
      await reservationService.approveRefund(
        refundTarget.id
      );

    setReservations((prev) =>
      prev.map((r) =>
        r.id === updatedReservation.id
          ? updatedReservation
          : r
      )
    );

    setRefundTarget(null);

  } catch (error) {

    setRefundError(
      error?.message ||
      'No se pudo aprobar el reembolso.'
    );

  } finally {

    setApprovingRefund(false);

  }
};

  const pagadas = reservations.filter(
    (r) => r.estado_pago === 'PAGADO' && r.estado_reserva === 'ACTIVA'
  );
  const pendientes = reservations.filter(
    (r) => r.estado_pago === 'PENDIENTE' && r.estado_reserva === 'ACTIVA'
  );
  const reembolsos = reservations.filter(
    (r) =>
      r.estado_pago === 'REEMBOLSO_PENDIENTE'
  );
  console.log(
    'REEMBOLSOS',
    reembolsos
  );

  const filtered =
    filterTab === 'pagadas'
      ? pagadas
      : filterTab === 'pendientes'
        ? pendientes
        : filterTab === 'reembolsos'
          ? reembolsos
          : reservations.filter(
              (r) => r.estado_reserva === 'ACTIVA'
            );

  const searched = search
    ? filtered.filter(
        (r) =>
          r.userName?.toLowerCase().includes(search.toLowerCase()) ||
          r.className?.toLowerCase().includes(search.toLowerCase()) ||
          r.codigo_reserva?.toLowerCase().includes(search.toLowerCase())
      )
    : filtered;

  const totalPages = Math.max(1, Math.ceil(searched.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = searched.slice(start, end);

  useEffect(() => { setPage(1); }, [filterTab, search]);

  function renderCard(r) {
    const isPending =
      r.estado_pago === 'PENDIENTE';

    const isRefundPending =
      r.estado_pago === 'REEMBOLSO_PENDIENTE';

    const fotoUrl = r.userPhoto
      ? `${BACKEND_URL}${r.userPhoto}`
      : null;

    return (
      <div
        key={r.id}
        className="rounded-2xl bg-white p-4 shadow-[0_4px_16px_rgba(33,45,58,0.06)] border border-slate-100 transition hover:shadow-[0_8px_24px_rgba(33,45,58,0.1)] sm:p-5"
      >
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-sky-100">
            {fotoUrl ? (
              <img src={fotoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User size={20} className="text-sky-500" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-900 truncate">{r.userName || 'Usuario'}</p>
            <p className="mt-0.5 text-xs text-slate-400">#{r.codigo_reserva}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
              isRefundPending
                ? 'bg-amber-100 text-amber-700'
                : isPending
                ? 'bg-orange-50 text-orange-700'
                : r.estado_pago === 'REEMBOLSADO'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {isRefundPending
              ? 'Reembolso pendiente'
              : r.estado_pago === 'REEMBOLSADO'
              ? 'Reembolsado'
              : isPending
              ? 'Pendiente'
              : 'Pagado'}
          </span>
        </div>

        <div className="mt-3 rounded-xl bg-slate-50 p-3">
          <p className="font-black text-slate-900">{r.className}</p>
          {r.instructor_nombre && (
            <p className="mt-0.5 text-xs text-slate-500">
              <Dumbbell size={12} className="inline -mt-0.5 mr-0.5" />
              {r.instructor_nombre}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              {r.fecha_clase
                ? new Date(r.fecha_clase + 'T00:00:00').toLocaleDateString('es-PE', {
                    day: 'numeric',
                    month: 'short',
                  })
                : '-'}
            </span>
            {r.hora_inicio && (
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {r.hora_inicio.slice(0, 5)}
              </span>
            )}
            {r.codigo_espacio && (
              <span className="font-semibold text-purple-600">{r.codigo_espacio}</span>
            )}
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
          <span>
            <CreditCard size={12} className="inline -mt-0.5 mr-0.5" />
            S/ {Number(r.monto || 0).toFixed(2)}
          </span>
          {r.fecha_reserva && (
            <span>
              Reservado{' '}
              {new Date(r.fecha_reserva).toLocaleDateString('es-PE', {
                day: 'numeric',
                month: 'short',
              })}
            </span>
          )}
        </div>

        {isPending && (
          <div className="mt-3 space-y-2">
            <button
              onClick={() => { setPayTarget(r); setPayError(''); }}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 active:scale-[0.98]"
            >
              <CheckCircle size={16} />
              Colocar como pagado
            </button>
            <button
              onClick={() => { setCancelTarget(r); setCancelError(''); setCancelMotivo('CLASE_CANCELADA'); setCancelDetalle(''); }}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 active:scale-[0.98]"
            >
              <XCircle size={16} />
              Cancelar reserva
            </button>
          </div>
        )}
        {isRefundPending && (
          <div className="mt-3">

            <button
              onClick={() => {
                setRefundTarget(r);
                setRefundError('');
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
            >
              <CheckCircle size={16} />
              Aprobar reembolso
            </button>

          </div>
        )}
      </div>
    );

    console.log(
      'CARD',
      r.codigo_reserva,
      r.estado_pago
    );
  }

  const stats = [
    {
      label: 'Total activas',
      value: reservations.filter((r) => r.estado_reserva === 'ACTIVA').length,
      color: 'text-slate-900',
    },
    {
      label: 'Pagadas',
      value: pagadas.length,
      color: 'text-emerald-600',
    },
    {
      label: 'Pendientes',
      value: pendientes.length,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-3xl">Reservas activas</h1>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">Gestiona todas las reservas de los clientes</p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por cliente, clase o código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="-mx-4 px-4 overflow-x-auto pb-1 sm:mx-0 sm:px-0">
        <div className="flex gap-2 min-w-max sm:min-w-0">
          {[
            { key: 'todas', label: 'Todas' },
            { key: 'pagadas', label: 'Pagadas' },
            { key: 'pendientes', label: 'Pendientes' },
            { key: 'reembolsos', label: 'Reembolsos' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setFilterTab(t.key);
                setPage(1);
              }}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition ${
                filterTab === t.key
                  ? t.key === 'reembolsos'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.label}
              {t.key === 'reembolsos' && reembolsos.length > 0 && (
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {reembolsos.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-slate-100 p-4 text-center shadow-sm">
            <p className={`text-2xl font-black sm:text-3xl ${s.color}`}>{s.value}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader size="md" text="Cargando reservas..." />
        </div>
      ) : pageItems.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Calendar size={48} className="text-slate-300" />
          <p className="text-lg font-bold text-slate-500">
            {search ? 'Sin resultados' : 'No hay reservas activas'}
          </p>
          <p className="text-sm text-slate-400">
            {search
              ? 'Intenta con otro término de búsqueda'
              : 'Las reservas aparecerán aquí cuando los clientes reserven clases'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pageItems.some((r) => r.estado_pago === 'PAGADO') && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Pagadas
              </h3>
              <div className="space-y-3">
                {pageItems
                  .filter((r) => r.estado_pago === 'PAGADO')
                  .map(renderCard)}
              </div>
            </section>
          )}

          {pageItems.some((r) => r.estado_pago === 'PENDIENTE') && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-orange-600">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Pendientes
              </h3>
              <div className="space-y-3">
                {pageItems
                  .filter((r) => r.estado_pago === 'PENDIENTE')
                  .map(renderCard)}
              </div>
            </section>
          )}

          {pageItems.some(
            (r) => r.estado_pago === 'REEMBOLSO_PENDIENTE'
          ) && (
            <section>

              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-600">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Solicitudes de reembolso
              </h3>

              <div className="space-y-3">
                {pageItems
                  .filter(
                    (r) =>
                      r.estado_pago ===
                      'REEMBOLSO_PENDIENTE'
                  )
                  .map(renderCard)}
              </div>

            </section>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
                Anterior
              </button>
              <span className="text-sm font-semibold text-slate-500">
                {safePage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}
      {payTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6"
          onClick={(e) => { if (e.target === e.currentTarget) setPayTarget(null); }}
        >
          <div
            className="w-full sm:max-w-sm rounded-[28px] bg-white shadow-2xl animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-5 sm:p-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-inner">
                  <CheckCircle className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900">Colocar como pagado</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  ¿Confirmas cambiar esta reserva de pendiente a pagado?
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:p-4">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 shrink-0">Cliente</span>
                    <span className="font-bold text-slate-900 text-right truncate max-w-[180px]">{payTarget.userName}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 shrink-0">Clase</span>
                    <span className="font-bold text-slate-900 text-right truncate max-w-[180px]">{payTarget.className}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 shrink-0">Código</span>
                    <span className="font-mono font-semibold text-slate-700 text-right">#{payTarget.codigo_reserva}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 shrink-0">Monto</span>
                    <span className="font-bold text-slate-900 text-right">S/ {Number(payTarget.monto || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {payError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                  {payError}
                </div>
              )}

              <div className="mt-4 flex gap-2 sm:gap-3">
                <button
                  onClick={() => { setPayTarget(null); setPayError(''); }}
                  disabled={paying}
                  className="flex-1 rounded-xl sm:rounded-2xl border-2 border-slate-100 py-3 sm:py-3.5 font-bold text-slate-600 text-xs sm:text-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-200 active:scale-[0.98] disabled:opacity-60"
                >
                  Volver
                </button>
                <button
                  onClick={handleMarkAsPaid}
                  disabled={paying}
                  className="flex-1 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 sm:py-3.5 font-bold text-white text-xs sm:text-sm transition-all duration-200 hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] shadow-lg shadow-emerald-200 disabled:opacity-60"
                >
                  {paying ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Guardando...
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Sí, pagado
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {refundTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-3xl bg-white p-6">

            <h3 className="text-xl font-black">
              Aprobar reembolso
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              ¿Deseas aprobar el reembolso de la reserva
              <strong>
                {' '}
                #{refundTarget.codigo_reserva}
              </strong>
              ?
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">

              <p>
                Cliente:
                <strong>
                  {' '}
                  {refundTarget.userName}
                </strong>
              </p>

              <p>
                Clase:
                <strong>
                  {' '}
                  {refundTarget.className}
                </strong>
              </p>

              <p>
                Monto:
                <strong>
                  {' '}
                  S/ {Number(refundTarget.monto).toFixed(2)}
                </strong>
              </p>

            </div>

            {refundError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {refundError}
              </div>
            )}

            <div className="mt-5 flex gap-3">

              <button
                onClick={() => setRefundTarget(null)}
                disabled={approvingRefund}
                className="flex-1 rounded-xl border border-slate-200 py-3 font-bold"
              >
                Cancelar
              </button>

              <button
                onClick={handleApproveRefund}
                disabled={approvingRefund}
                className="flex-1 rounded-xl bg-emerald-600 py-3 font-bold text-white"
              >
                {approvingRefund
                  ? 'Procesando...'
                  : 'Aprobar'}
              </button>

            </div>

          </div>

        </div>
      )}

      {cancelTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6"
          onClick={(e) => { if (e.target === e.currentTarget) setCancelTarget(null); }}
        >
          <div
            className="w-full sm:max-w-md rounded-[28px] bg-white shadow-2xl flex flex-col max-h-[90vh] animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto px-4 sm:px-6 py-4 sm:p-6">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100 shadow-inner">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900">Cancelar reserva</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Estás a punto de cancelar la reserva de{' '}
                  <span className="font-bold text-slate-700">{cancelTarget.userName}</span>.
                  Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="mt-4 sm:mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:p-4">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 shrink-0">Clase</span>
                    <span className="font-bold text-slate-900 text-right truncate max-w-[180px]">{cancelTarget.className}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 shrink-0">Código</span>
                    <span className="font-mono font-semibold text-slate-700 text-right">#{cancelTarget.codigo_reserva}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 shrink-0">Fecha</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {cancelTarget.fecha_clase
                        ? new Date(cancelTarget.fecha_clase + 'T00:00:00').toLocaleDateString('es-PE', {
                            day: 'numeric',
                            month: 'long',
                          })
                        : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 shrink-0">Espacio</span>
                    <span className="font-bold text-purple-600 text-right">{cancelTarget.codigo_espacio}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 shrink-0">Monto</span>
                    <span className="font-bold text-slate-900 text-right">S/ {Number(cancelTarget.monto || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-2 sm:mb-2.5">Motivo de cancelación</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {adminMotivos.map((m) => (
                    <label
                      key={m.value}
                      className={`flex items-center gap-2 sm:gap-2.5 rounded-xl border-2 px-3 py-2 sm:px-3.5 sm:py-3 cursor-pointer transition-all duration-200 ${
                        cancelMotivo === m.value
                          ? 'border-[#004aab] bg-blue-50/70 shadow-sm'
                          : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200 ${
                        cancelMotivo === m.value
                          ? 'border-[#004aab]'
                          : 'border-slate-300'
                      }`}>
                        {cancelMotivo === m.value && (
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#004aab]" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="adminMotivo"
                        value={m.value}
                        checked={cancelMotivo === m.value}
                        onChange={(e) => setCancelMotivo(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-xs sm:text-sm font-medium text-slate-700 leading-tight">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {cancelMotivo === 'OTRO' && (
                <div className="mt-2 sm:mt-3 animate-[fadeIn_0.2s_ease-out]">
                  <textarea
                    value={cancelDetalle}
                    onChange={(e) => setCancelDetalle(e.target.value)}
                    placeholder="Describe el motivo (opcional)..."
                    className="w-full rounded-xl border-2 border-slate-100 bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition-all duration-200 focus:border-[#004aab] focus:ring-2 focus:ring-blue-100 resize-none"
                    rows={2}
                  />
                </div>
              )}

              {cancelError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                  {cancelError}
                </div>
              )}

              <div className="mt-4 sm:mt-5 flex gap-2 sm:gap-3">
                <button
                  onClick={() => { setCancelTarget(null); setCancelError(''); }}
                  disabled={canceling}
                  className="flex-1 rounded-xl sm:rounded-2xl border-2 border-slate-100 py-3 sm:py-3.5 font-bold text-slate-600 text-xs sm:text-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-200 active:scale-[0.98] disabled:opacity-60"
                >
                  Volver
                </button>
                <button
                  onClick={handleCancel}
                  disabled={canceling}
                  className="flex-1 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-500 to-red-600 py-3 sm:py-3.5 font-bold text-white text-xs sm:text-sm transition-all duration-200 hover:from-red-600 hover:to-red-700 active:scale-[0.98] shadow-lg shadow-red-200 disabled:opacity-60"
                >
                  {canceling ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Cancelando...
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Sí, cancelar
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservasAdmin;
