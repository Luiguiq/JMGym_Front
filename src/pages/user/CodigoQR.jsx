import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Dumbbell,
  MapPin,
  RefreshCw,
  ShieldCheck,
  User,
} from 'lucide-react';
import PageLoader from '../../components/common/PageLoader.jsx';
import { reservationService } from '../../services/reservationService.js';

const ELIGIBLE_RESERVATION_STATUSES = new Set(['ACTIVA']);
const ELIGIBLE_PAYMENT_STATUSES = new Set(['PAGADO', 'PENDIENTE']);

function getQrValue(reservation) {
  return reservation?.qr_checkin || reservation?.qr_url || null;
}

function isQrEligible(reservation) {
  return (
    ELIGIBLE_RESERVATION_STATUSES.has(reservation?.estado_reserva) &&
    ELIGIBLE_PAYMENT_STATUSES.has(reservation?.estado_pago) &&
    Boolean(getQrValue(reservation))
  );
}

function getClassDateTime(reservation) {
  const date = reservation?.fecha_clase || '';
  const time = reservation?.hora_inicio || '00:00';
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  const value = new Date(`${date}T${normalizedTime}`);
  return Number.isNaN(value.getTime()) ? new Date(8640000000000000) : value;
}

function formatDate(dateStr) {
  if (!dateStr) return 'Fecha por confirmar';
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(timeStr) {
  return timeStr ? timeStr.slice(0, 5) : 'Hora por confirmar';
}

function ReservationOption({ reservation, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-primary/40 ${
        selected
          ? 'border-primary bg-primary/10 shadow-sm'
          : 'border-border-light bg-card hover:border-primary/40 hover:bg-surface'
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          selected ? 'bg-primary text-primary-foreground' : 'bg-surface text-brand-600'
        }`}>
          <Dumbbell className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-black text-foreground">
            {reservation.className || 'Clase'}
          </span>
          <span className="mt-1 block text-sm text-secondary">
            {formatDate(reservation.fecha_clase)} · {formatTime(reservation.hora_inicio)}
          </span>
          <span className="mt-2 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            {reservation.estado_reserva}
          </span>
        </span>
      </div>
    </button>
  );
}

function CodigoQR() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReservations = () => {
    setLoading(true);
    setError('');
    reservationService
      .getMyReservations()
      .then((items) => {
        setReservations(items);
      })
      .catch((err) => setError(err?.message || 'No pudimos cargar tu código QR.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const eligibleReservations = useMemo(
    () =>
      reservations
        .filter(isQrEligible)
        .sort((a, b) => getClassDateTime(a) - getClassDateTime(b)),
    [reservations]
  );

  useEffect(() => {
    if (eligibleReservations.length === 0) {
      setSelectedId(null);
      return;
    }

    if (!eligibleReservations.some((reservation) => reservation.id === selectedId)) {
      setSelectedId(eligibleReservations[0].id);
    }
  }, [eligibleReservations, selectedId]);

  const selectedReservation =
    eligibleReservations.find((reservation) => reservation.id === selectedId) ||
    eligibleReservations[0] ||
    null;
  const qrValue = getQrValue(selectedReservation);

  if (loading) {
    return <PageLoader text="Cargando código QR..." />;
  }

  if (error) {
    return (
      <main className="min-h-dvh bg-surface px-5 py-6 pb-36">
        <section className="mx-auto max-w-lg rounded-3xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/30 dark:bg-red-500/10">
          <AlertTriangle className="mx-auto h-10 w-10 text-red-500 dark:text-red-300" aria-hidden="true" />
          <h1 className="mt-3 text-xl font-black text-red-700 dark:text-red-200">
            No pudimos cargar tu código QR.
          </h1>
          <p className="mt-2 text-sm text-red-600 dark:text-red-300">
            Intenta nuevamente en unos segundos.
          </p>
          <button
            type="button"
            onClick={loadReservations}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Reintentar
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-surface px-5 py-6 pb-36 lg:pb-12">
      <section className="mx-auto max-w-lg lg:max-w-4xl">
        <header className="rounded-[28px] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-6 text-primary-foreground shadow-md">
          <p className="text-xs font-bold uppercase tracking-[3px] text-primary-foreground/75">
            Asistencia
          </p>
          <h1 className="mt-2 text-3xl font-black">Código QR de asistencia</h1>
          <p className="mt-2 text-sm leading-relaxed text-blue-50">
            Presenta el código correspondiente a tu clase para registrar tu asistencia.
          </p>
        </header>

        {eligibleReservations.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-border bg-card p-6 text-center shadow-sm">
            <CreditCard className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
            <h2 className="mt-3 text-xl font-black text-foreground">
              No tienes códigos QR disponibles
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-secondary">
              Los códigos QR aparecerán aquí cuando tengas una reserva activa y habilitada para asistencia.
            </p>
            <button
              type="button"
              onClick={() => navigate('/cliente/clases')}
              className="mt-5 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-brand-700"
            >
              Ver clases disponibles
            </button>
          </div>
        ) : (
          <>
            {eligibleReservations.length > 1 && (
              <div className="mt-6">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground">
                  Selecciona una reserva
                </h2>
                <div className="mt-3 space-y-3">
                  {eligibleReservations.map((reservation) => (
                    <ReservationOption
                      key={reservation.id}
                      reservation={reservation}
                      selected={reservation.id === selectedReservation?.id}
                      onSelect={() => setSelectedId(reservation.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedReservation && (
              <article className="mt-6 overflow-hidden rounded-[28px] border border-border-light bg-card shadow-sm lg:flex lg:flex-row-reverse">
                <div className="p-5 text-center lg:flex lg:w-80 lg:flex-col lg:items-center lg:justify-center lg:border-l lg:border-border-light lg:p-8">
                  <div className="mx-auto w-full max-w-[280px] rounded-3xl bg-white p-5 shadow-sm">
                    <QRCode
                      value={qrValue}
                      size={240}
                      className="h-auto w-full"
                      fgColor="#111827"
                      bgColor="#ffffff"
                      aria-label={`Código QR de la reserva ${selectedReservation.codigo_reserva}`}
                    />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-foreground">
                    Reserva #{selectedReservation.codigo_reserva}
                  </p>
                  <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-left dark:border-blue-500/30 dark:bg-blue-500/10">
                    <p className="flex items-start gap-2 text-sm leading-relaxed text-blue-800 dark:text-blue-200">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>
                        Presenta este código al personal autorizado antes de ingresar a la clase.
                        El código identifica únicamente esta reserva. No lo compartas con otras personas.
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex-1 border-b border-border-light bg-surface p-5 lg:border-b-0 lg:border-r lg:border-border-light">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-brand-600">
                      <CheckCircle className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xl font-black text-foreground">
                        {selectedReservation.className || 'Clase'}
                      </h2>
                      {selectedReservation.instructor_nombre && (
                        <p className="mt-1 text-sm text-secondary">
                          Prof. {selectedReservation.instructor_nombre}
                        </p>
                      )}
                    </div>
                  </div>
                  <dl className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-2xl bg-card p-3">
                      <dt className="flex items-center gap-2 text-xs font-bold uppercase text-muted">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        Fecha
                      </dt>
                      <dd className="mt-1 font-bold text-foreground">
                        {formatDate(selectedReservation.fecha_clase)}
                      </dd>
                    </div>
                    <div className="rounded-2xl bg-card p-3">
                      <dt className="flex items-center gap-2 text-xs font-bold uppercase text-muted">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        Hora
                      </dt>
                      <dd className="mt-1 font-bold text-foreground">
                        {formatTime(selectedReservation.hora_inicio)}
                      </dd>
                    </div>
                    <div className="rounded-2xl bg-card p-3">
                      <dt className="flex items-center gap-2 text-xs font-bold uppercase text-muted">
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        Espacio
                      </dt>
                      <dd className="mt-1 font-bold text-brand-600">
                        {selectedReservation.codigo_espacio || 'Por confirmar'}
                      </dd>
                    </div>
                    <div className="rounded-2xl bg-card p-3">
                      <dt className="flex items-center gap-2 text-xs font-bold uppercase text-muted">
                        <User className="h-4 w-4" aria-hidden="true" />
                        Estado
                      </dt>
                      <dd className="mt-1 font-bold text-foreground">
                        {selectedReservation.estado_reserva} · {selectedReservation.estado_pago}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default CodigoQR;
