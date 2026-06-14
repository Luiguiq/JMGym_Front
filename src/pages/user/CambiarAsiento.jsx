import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, CheckCircle } from 'lucide-react';
import { classService } from '../../services/classService.js';
import { reservationService } from '../../services/reservationService.js';
import PageLoader from '../../components/common/PageLoader.jsx';

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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await reservationService.getMyReservationDetail(id);
        setReservation(res);
        const dataClase = await classService.getClassById(res.id_clase);
        setClassInfo(dataClase);
        const dataEspacios = await classService.getClassSeats(res.id_clase);
        const sorted = dataEspacios.sort((a, b) =>
          a.codigo_espacio.localeCompare(b.codigo_espacio)
        );
        setSeats(sorted);
      } catch (err) {
        setError(err?.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const currentSeatCode = seats.find(
    (s) => s.id_espacio === reservation?.id_espacio
  )?.codigo_espacio;

  const handleSeatClick = (seat) => {
    if (seat.estado !== 'DISPONIBLE') return;
    if (seat.id_espacio === reservation?.id_espacio) return;
    navigator.vibrate?.(50);
    setSelectedSeat(
      selectedSeat?.id_espacio === seat.id_espacio ? null : seat
    );
  };

  const handleChange = async () => {
    if (!selectedSeat) return;
    setSaving(true);
    setError('');
    try {
      await reservationService.changeSeat(id, selectedSeat.id_espacio);
      setSuccess(true);
      setTimeout(() => navigate(`/cliente/reservas/${id}`), 1500);
    } catch (err) {
      setError(err?.message || 'Error al cambiar el asiento');
    } finally {
      setSaving(false);
    }
  };

  const getSeatStyles = (seat) => {
    const isCurrent = seat.id_espacio === reservation?.id_espacio;
    if (isCurrent) {
      return 'bg-emerald-500 text-white font-black ring-2 ring-emerald-300 shadow-lg';
    }
    if (selectedSeat?.id_espacio === seat.id_espacio) {
      return 'bg-[#004aab] text-white font-black ring-2 ring-sky-300 shadow-lg scale-110 z-10';
    }
    switch (seat.estado) {
      case 'DISPONIBLE':
        return 'bg-white text-sky-700 font-semibold border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50 active:scale-95 cursor-pointer';
      case 'EN_ESPERA':
      case 'RESERVADO':
        return 'bg-amber-50 text-amber-600 font-bold border-2 border-amber-200 cursor-not-allowed opacity-70';
      case 'OCUPADO':
        return 'bg-emerald-50 text-emerald-600 font-bold border-2 border-emerald-200 cursor-not-allowed opacity-70';
      default:
        return 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50';
    }
  };

  if (loading) return <PageLoader text="Cargando información..." />;

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Asiento cambiado</h3>
          <p className="text-sm text-slate-500">Tu nuevo asiento se ha asignado correctamente.</p>
        </div>
      </main>
    );
  }

  if (error && !classInfo) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <p className="text-red-500 font-bold">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-0 lg:flex-row lg:gap-6 lg:px-6 lg:pt-6">
        <div className="relative flex-1 bg-white lg:rounded-3xl lg:pb-12 lg:shadow-sm">
          <header className="px-4 pb-2 pt-5 sm:px-6 lg:px-8 lg:pt-6">
            <button
              onClick={() => navigate(-1)}
              className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-sky-700"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
              <span>Volver</span>
            </button>
            <h1 className="text-xl font-black text-slate-800 sm:text-2xl">
              Cambiar asiento
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {classInfo?.name} &middot; {classInfo?.time} &middot;{' '}
              {classInfo?.trainer}
            </p>
            {currentSeatCode && (
              <p className="mt-1 text-xs font-semibold text-emerald-600">
                Asiento actual: {currentSeatCode}
              </p>
            )}
          </header>

          {error && (
            <div className="mx-4 mb-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-bold text-red-600 sm:mx-6 lg:mx-8">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3 px-4 py-3 text-[11px] font-semibold text-slate-500 sm:px-6 lg:px-8">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded bg-emerald-500" />{' '}
              Tu asiento
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded border-2 border-sky-200 bg-white" />{' '}
              Libre
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded border-2 border-amber-200 bg-amber-50" />{' '}
              Reservado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded border-2 border-emerald-200 bg-emerald-50" />{' '}
              Ocupado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded bg-[#004aab]" />{' '}
              Seleccionado
            </span>
          </div>

          <div className="px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg rounded-2xl border border-slate-100 bg-slate-50/50 p-4 shadow-sm sm:p-6">
              <div className="mb-4 rounded-lg bg-gradient-to-r from-[#004aab] to-sky-500 py-2 text-center text-white shadow-sm">
                <p className="text-[10px] uppercase tracking-widest opacity-80">Instructor</p>
                <p className="text-sm font-black">Frente del salón</p>
              </div>

              <div className={`grid gap-1.5 sm:gap-2 ${
                seats.length >= 40
                  ? 'grid-cols-5 sm:grid-cols-8'
                  : seats.length >= 30
                    ? 'grid-cols-5 sm:grid-cols-6'
                    : 'grid-cols-5'
              }`}>
                {seats.map((seat) => {
                  const isCurrent = seat.id_espacio === reservation?.id_espacio;
                  return (
                    <button
                      key={seat.id_espacio}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.estado !== 'DISPONIBLE' || isCurrent}
                      className={`relative flex aspect-square items-center justify-center rounded-lg text-[10px] font-bold transition-all duration-150 sm:text-xs ${getSeatStyles(seat)}`}
                    >
                      {selectedSeat?.id_espacio === seat.id_espacio ? (
                        <Check size={14} strokeWidth={3} absoluteStrokeWidth />
                      ) : (
                        seat.codigo_espacio
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-[340px] lg:shrink-0">
          <div className="mx-4 mb-4 rounded-2xl border border-slate-100 bg-white px-4 pb-4 pt-4 shadow-sm lg:mx-0 lg:rounded-3xl lg:border lg:pb-5 lg:shadow-sm lg:sticky lg:top-8">
            <div className="mb-3 rounded-xl bg-slate-50 p-3 sm:p-4">
              <p className="font-black text-slate-800">{classInfo?.name}</p>
              <p className="text-xs text-slate-500">
                {classInfo?.time} &middot; {classInfo?.trainer}
              </p>
            </div>

            <div className="mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Asiento actual
                </span>
                <span className="text-sm font-black text-emerald-600">
                  {currentSeatCode || '---'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Nuevo asiento
                </span>
                <span className="text-xl font-black text-[#004aab]">
                  {selectedSeat?.codigo_espacio || '---'}
                </span>
              </div>
            </div>

            <button
              onClick={handleChange}
              disabled={!selectedSeat || saving}
              className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-[#004aab] py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-200/50 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {saving ? 'Cambiando...' : selectedSeat ? 'Confirmar cambio' : 'Selecciona un asiento'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CambiarAsiento;
