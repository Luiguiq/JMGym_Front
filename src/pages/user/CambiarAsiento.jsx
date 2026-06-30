import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer } from 'vaul';
import {
  ArrowLeft, Check, CheckCircle, Dumbbell, MapPin,
  Clock, User, ArrowRight, ChevronRight
} from 'lucide-react';
import { classService } from '../../services/classService.js';
import { reservationService } from '../../services/reservationService.js';

const LEGEND_ITEMS = [
  { label: 'Tu asiento', dot: 'bg-emerald-500 ring-2 ring-emerald-300' },
  { label: 'Libre', dot: 'bg-card ring-2 ring-border' },
  { label: 'Reservado', dot: 'bg-amber-50 ring-2 ring-amber-300' },
  { label: 'Ocupado', dot: 'bg-emerald-50 ring-2 ring-emerald-300' },
  { label: 'Seleccionado', dot: 'bg-blue-600 ring-2 ring-blue-400' },
];

function CambiarAsiento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [reservation, setReservation] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await reservationService.getMyReservationDetail(id);
        setReservation(res);
        const dataClase = await classService.getClassById(res.id_clase);
        setClassInfo(dataClase);
        const dataEspacios = await classService.getClassSeats(res.id_clase);
        setSeats((dataEspacios || []).sort((a, b) => a.codigo_espacio.localeCompare(b.codigo_espacio)));
      } catch (err) {
        setError(err?.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const currentSeatCode = seats.find((s) => s.id_espacio === reservation?.id_espacio)?.codigo_espacio;

  const handleSeatClick = (seat) => {
    if (seat.estado !== 'DISPONIBLE') return;
    if (seat.id_espacio === reservation?.id_espacio) return;
    navigator.vibrate?.(10);
    const newSeat = selectedSeat?.id_espacio === seat.id_espacio ? null : seat;
    setSelectedSeat(newSeat);
    if (newSeat) setDrawerOpen(true);
  };

  const handleChange = async () => {
    if (!selectedSeat) return;
    setSaving(true);
    setError('');
    try {
      await reservationService.changeSeat(id, selectedSeat.id_espacio);
      setSuccess(true);
      setTimeout(() => navigate(`/cliente/reservas/${id}`), 1800);
    } catch (err) {
      setError(err?.message || 'Error al cambiar el asiento');
      setDrawerOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const isCurrent = (seat) => seat.id_espacio === reservation?.id_espacio;
  const isSelected = (seat) => selectedSeat?.id_espacio === seat.id_espacio;

  const cols = seats.length >= 40 ? 'grid-cols-6 sm:grid-cols-8' : seats.length >= 30 ? 'grid-cols-5 sm:grid-cols-6' : 'grid-cols-5';

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Cargando asientos...</p>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface p-6">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-foreground">Asiento cambiado</h2>
          <p className="text-sm text-muted">Tu nuevo asiento se ha asignado correctamente.</p>
        </motion.div>
      </main>
    );
  }

  if (error && !classInfo) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface p-6">
        <p className="font-bold text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface pb-32">
      <div className="mx-auto max-w-lg px-4 pt-5 sm:px-5">

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
          Cambiar asiento
        </motion.h1>

        {/* Class info mini card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-3 flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-sm">
            <Dumbbell size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{classInfo?.name}</p>
            <div className="flex flex-wrap items-center gap-x-3 text-[12px] text-muted">
              <span className="inline-flex items-center gap-1"><Clock size={12} /> {classInfo?.time}</span>
              <span className="inline-flex items-center gap-1"><User size={12} /> {classInfo?.trainer}</span>
            </div>
          </div>
          {currentSeatCode && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
              <Check size={12} /> {currentSeatCode}
            </span>
          )}
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

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
          <div className="mb-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-center shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/70">Instructor</p>
            <p className="text-xs font-black text-white">Frente del salón</p>
          </div>

          <div className={`grid ${cols} gap-1.5 sm:gap-2`}>
            {seats.map((seat) => {
              const current = isCurrent(seat);
              const selected = isSelected(seat);

              let bg, ring, text, cursor, disabled;
              if (current) {
                bg = 'bg-emerald-500'; ring = 'ring-2 ring-emerald-300'; text = 'text-white';
                cursor = 'cursor-default'; disabled = true;
              } else if (seat.estado === 'DISPONIBLE') {
                bg = 'bg-card'; ring = 'ring-1 ring-border-light'; text = 'text-secondary';
                cursor = 'cursor-pointer hover:ring-blue-400'; disabled = false;
              } else if (seat.estado === 'EN_ESPERA' || seat.estado === 'RESERVADO') {
                bg = 'bg-amber-50'; ring = 'ring-1 ring-amber-200'; text = 'text-amber-600';
                cursor = 'cursor-not-allowed'; disabled = true;
              } else {
                bg = 'bg-emerald-50'; ring = 'ring-1 ring-emerald-200'; text = 'text-emerald-600';
                cursor = 'cursor-not-allowed'; disabled = true;
              }

              if (selected) {
                bg = 'bg-blue-600'; ring = 'ring-2 ring-blue-300'; text = 'text-white';
              }

              return (
                <motion.button
                  key={seat.id_espacio}
                  layout
                  onClick={() => handleSeatClick(seat)}
                  disabled={disabled}
                  whileTap={!disabled ? { scale: 0.88 } : {}}
                  whileHover={!disabled && !selected ? { scale: 1.06 } : {}}
                  animate={selected ? { scale: [1, 1.12, 1], transition: { duration: 0.25 } } : {}}
                  className={`relative flex aspect-square items-center justify-center rounded-lg text-[10px] font-bold transition-colors sm:text-xs ${bg} ${ring} ${text} ${cursor} ${disabled && !current ? 'opacity-60' : ''}`}
                >
                  {selected ? <Check size={14} strokeWidth={3} /> : current ? <Check size={14} strokeWidth={3} /> : seat.codigo_espacio}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {selectedSeat && <div className="h-4" />}
      </div>

      {/* ─── Vaul Drawer ─── */}
      <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl bg-card shadow-xl outline-none">
            <div className="px-5 pb-6 pt-3 sm:px-6">
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
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                        <MapPin size={22} />
                      </div>
                      <div>
                        <p className="text-lg font-black text-foreground">Asiento {selectedSeat.codigo_espacio}</p>
                        <p className="text-[13px] text-muted">Excelente ubicación — frente al instructor</p>
                      </div>
                    </div>

                    {/* Current → New indicator */}
                    {currentSeatCode && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-[13px] font-medium text-secondary">
                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-700">{currentSeatCode}</span>
                        <ArrowRight size={14} className="text-muted-foreground" />
                        <span className="rounded-md bg-blue-100 px-2 py-0.5 text-blue-700">{selectedSeat.codigo_espacio}</span>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-border-light pt-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sin costo adicional</p>
                        <p className="text-sm text-muted">El cambio es gratuito</p>
                      </div>
                      <button
                        onClick={handleChange}
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.97] disabled:opacity-50"
                      >
                        {saving ? 'Cambiando...' : 'Confirmar cambio'} <ChevronRight size={16} />
                      </button>
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

export default CambiarAsiento;