import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer } from 'vaul';
import {
  ArrowLeft, Check, Clock, Dumbbell, Lock, MapPin, User, XCircle, ChevronRight
} from 'lucide-react';
import { classService } from '../../services/classService.js';
import { fidelizacionService } from '../../services/fidelizacionService.js';

const SEAT_STATUS = {
  DISPONIBLE: { label: 'Disponible', ring: 'ring-border-light', bg: 'bg-card', text: 'text-secondary', dot: 'bg-card ring-2 ring-border-light' },
  EN_ESPERA: { label: 'Reservado', ring: 'ring-amber-200', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-50 ring-2 ring-amber-200' },
  RESERVADO: { label: 'Reservado', ring: 'ring-amber-200', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-50 ring-2 ring-amber-200' },
  OCUPADO: { label: 'Ocupado', ring: 'ring-red-200', bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-50 ring-2 ring-red-200' },
};

const LEGEND_ITEMS = [
  { label: 'Disponible', dot: 'bg-card ring-2 ring-border' },
  { label: 'Reservado', dot: 'bg-amber-50 ring-2 ring-amber-300' },
  { label: 'Ocupado', dot: 'bg-red-50 ring-2 ring-red-300' },
  { label: 'Seleccionado', dot: 'bg-blue-600 ring-2 ring-blue-400' },
];

function SeleccionEspacio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  const [seats, setSeats] = useState([]);
  const [fidelizacion, setFidelizacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [dataClase, dataEspacios, fid] = await Promise.all([
          classService.getClassById(id),
          classService.getClassSeats(id),
          fidelizacionService.getMiFidelizacion().catch(() => null),
        ]);
        setClassInfo(dataClase);
        setFidelizacion(fid);
        setSeats((dataEspacios || []).sort((a, b) => a.codigo_espacio.localeCompare(b.codigo_espacio)));
      } catch (error) {
        console.error('Error al cargar:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSeatClick = (seat) => {
    if (seat.estado !== 'DISPONIBLE') return;
    navigator.vibrate?.(10);
    const newSeat = selectedSeat?.id_espacio === seat.id_espacio ? null : seat;
    setSelectedSeat(newSeat);
    if (newSeat) setDrawerOpen(true);
  };

  const handleContinue = () => {
    if (selectedSeat) {
      navigate(`/cliente/pago/${id}`, {
        state: { seatId: selectedSeat.id_espacio, seatCode: selectedSeat.codigo_espacio },
      });
    }
  };

  const isSelected = (seat) => selectedSeat?.id_espacio === seat.id_espacio;

  const cols = seats.length >= 40 ? 'grid-cols-6 sm:grid-cols-8' : seats.length >= 30 ? 'grid-cols-5 sm:grid-cols-6' : 'grid-cols-5';

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Cargando espacios...</p>
        </div>
      </main>
    );
  }

  if (!classInfo) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface p-6">
        <p className="text-center text-muted">No se pudo cargar la información de la clase.</p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-surface pb-36 max-md:landscape:pb-8">
      <div className="mx-auto max-w-lg px-4 pt-5 sm:px-5 max-md:landscape:pt-3">

        {/* Back + title */}
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
          <button
            onClick={() => navigate(-1)}
            className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-secondary"
          >
            <ArrowLeft size={16} /> Volver
          </button>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-black text-foreground"
        >
          Selecciona tu espacio
        </motion.h1>
        <p className="mt-2 rounded-2xl border border-border-light bg-card px-4 py-3 text-sm text-secondary">
          Toca un espacio disponible para seleccionarlo. Después podrás revisar el detalle antes de continuar al pago.
        </p>

        {/* Class info mini card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-3 flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-primary-foreground shadow-sm">
            <Dumbbell size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{classInfo.name}</p>
            <div className="flex flex-wrap items-center gap-x-3 text-[12px] text-muted">
              <span className="inline-flex items-center gap-1"><Clock size={12} /> {classInfo.time}</span>
              <span className="inline-flex items-center gap-1"><User size={12} /> {classInfo.trainer}</span>
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-4 flex flex-wrap gap-4 text-[12px] font-medium text-muted"
        >
          {LEGEND_ITEMS.map(({ label, dot }) => (
            <span key={label} className="inline-flex items-center gap-1.5">
              <span className={`inline-block h-3 w-3 rounded-sm ${dot}`} />
              {label}
            </span>
          ))}
        </motion.div>

        {/* Seat grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4 rounded-2xl border border-border-light bg-card p-4 shadow-sm"
        >
          {/* Front indicator */}
          <div className="mb-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-center shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary-foreground/70">Instructor</p>
            <p className="text-xs font-black text-primary-foreground">Frente del salón</p>
          </div>

          <div className={`grid ${cols} gap-1.5 sm:gap-2`}>
            {seats.map((seat) => {
              const status = SEAT_STATUS[seat.estado] || SEAT_STATUS.DISPONIBLE;
              const selected = isSelected(seat);
              const label = selected ? 'seleccionado' : status.label.toLowerCase();
              const Icon = selected
                ? Check
                : seat.estado === 'RESERVADO' || seat.estado === 'EN_ESPERA'
                  ? Lock
                  : seat.estado === 'OCUPADO'
                    ? XCircle
                    : null;
              return (
                <motion.button
                  key={seat.id_espacio}
                  layout
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.estado !== 'DISPONIBLE'}
                  aria-label={`Espacio ${seat.codigo_espacio}, ${label}`}
                  whileTap={seat.estado === 'DISPONIBLE' ? { scale: 0.88 } : {}}
                  whileHover={seat.estado === 'DISPONIBLE' && !selected ? { scale: 1.06 } : {}}
                  animate={selected ? { scale: [1, 1.12, 1], transition: { duration: 0.25 } } : {}}
                  className={`relative flex aspect-square items-center justify-center rounded-lg text-[10px] font-bold transition-colors sm:text-xs ${
                    selected
                      ? 'z-10 bg-blue-600 text-primary-foreground shadow-md ring-2 ring-blue-300'
                      : `${status.bg} ${status.ring} ring-1 ${status.text} ${seat.estado === 'DISPONIBLE' ? 'cursor-pointer hover:ring-blue-400' : 'cursor-not-allowed opacity-60'}`
                  }`}
                >
                  {Icon ? (
                    <span className="inline-flex items-center gap-0.5">
                      <Icon size={13} strokeWidth={3} />
                      <span>{selected ? seat.codigo_espacio : ''}</span>
                    </span>
                  ) : seat.codigo_espacio}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Close drawer spacer when something's selected */}
        {selectedSeat && <div className="h-4" />}
      </div>

      {/* ─── Vaul Drawer ─── */}
      <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl bg-card shadow-xl outline-none max-h-[82dvh] overflow-y-auto">
            <div className="px-5 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-3 sm:px-6">
              <Drawer.Handle className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border-light" />

              <AnimatePresence mode="wait">
                {selectedSeat && (
                  <motion.div
                    key={selectedSeat.id_espacio}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Selected seat badge */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-primary-foreground shadow-md">
                        <MapPin size={22} />
                      </div>
                      <div>
                        <p className="text-lg font-black text-foreground">{selectedSeat.codigo_espacio}</p>
                        <p className="text-[13px] text-muted">Has seleccionado el espacio {selectedSeat.codigo_espacio}.</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      {fidelizacion?.descuento_porcentaje > 0 && (
                        <div className="mb-3 rounded-xl bg-green-50 px-3 py-2 text-[12px] font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-300">
                          Descuento de {fidelizacion?.nivel || ''} ({fidelizacion?.descuento_porcentaje}%) aplicado
                        </div>
                      )}
                    <div className="flex items-center justify-between border-t border-border-light pt-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total</p>
                        <div className="flex items-baseline gap-1.5">
                          <p className="text-2xl font-black text-blue-600">S/ {(fidelizacion?.descuento_porcentaje > 0
                            ? Math.round(Number(classInfo.price || 0) * (100 - fidelizacion.descuento_porcentaje)) / 100
                            : Number(classInfo.price || 0)
                          ).toFixed(2)}</p>
                          {fidelizacion?.descuento_porcentaje > 0 && (
                            <p className="text-sm font-semibold text-muted-foreground line-through">S/ {Number(classInfo.price || 0).toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={handleContinue}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-blue-700 active:scale-[0.97]"
                      >
                        Confirmar reserva <ChevronRight size={16} />
                      </button>
                    </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </main>
  );
}

export default SeleccionEspacio;
