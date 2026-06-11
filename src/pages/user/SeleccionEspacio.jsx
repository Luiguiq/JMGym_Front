import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { classService } from '../../services/classService.js';
import PageLoader from '../../components/common/PageLoader.jsx';

function SeleccionEspacio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dataClase = await classService.getClassById(id);
        setClassInfo(dataClase);
        const dataEspacios = await classService.getClassSeats(id);
        const sortedSeats = dataEspacios.sort((a, b) =>
          a.codigo_espacio.localeCompare(b.codigo_espacio)
        );
        setSeats(sortedSeats);
      } catch (error) {
        console.error('Error al cargar la información:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSeatClick = (seat) => {
    if (seat.estado !== 'DISPONIBLE') return;
    navigator.vibrate?.(50);
    setSelectedSeat(
      selectedSeat?.id_espacio === seat.id_espacio ? null : seat
    );
  };

  const handleContinue = () => {
    if (selectedSeat) {
      navigate(`/cliente/pago/${id}`, {
        state: {
          seatId: selectedSeat.id_espacio,
          seatCode: selectedSeat.codigo_espacio,
        },
      });
    }
  };

  const getSeatStyles = (seat) => {
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

  if (!classInfo) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="px-4 text-center text-slate-500">
          Error: No se pudo cargar la información de la clase.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-0 lg:flex-row lg:gap-6 lg:px-6 lg:pt-6">
        {/* COLUMNA IZQUIERDA: MAPA DE ASIENTOS */}
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
              Selecciona tu espacio
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {classInfo.name} &middot; {classInfo.time} &middot;{' '}
              {classInfo.trainer}
            </p>
          </header>

          {/* Leyenda */}
          <div className="flex flex-wrap gap-3 px-4 py-3 text-[11px] font-semibold text-slate-500 sm:px-6 lg:px-8">
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

          {/* Grid de asientos */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg rounded-2xl border border-slate-100 bg-slate-50/50 p-4 shadow-sm sm:p-6">
              <div className="mb-4 rounded-lg bg-gradient-to-r from-[#004aab] to-sky-500 py-2 text-center text-white shadow-sm">
                <p className="text-[10px] uppercase tracking-widest opacity-80">
                  Instructor
                </p>
                <p className="text-sm font-black">Frente del sal&oacute;n</p>
              </div>

              <div
                className={`grid gap-1.5 sm:gap-2 ${
                  seats.length >= 40
                    ? 'grid-cols-5 sm:grid-cols-8'
                    : seats.length >= 30
                      ? 'grid-cols-5 sm:grid-cols-6'
                      : 'grid-cols-5'
                }`}
              >
                {seats.map((seat) => (
                  <button
                    key={seat.id_espacio}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.estado !== 'DISPONIBLE'}
                    className={`relative flex aspect-square items-center justify-center rounded-lg text-[10px] font-bold transition-all duration-150 sm:text-xs ${getSeatStyles(seat)}`}
                  >
                    {selectedSeat?.id_espacio === seat.id_espacio ? (
                      <Check size={14} strokeWidth={3} absoluteStrokeWidth />
                    ) : (
                      seat.codigo_espacio
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESUMEN + BOTÓN */}
        <div className="lg:w-[340px] lg:shrink-0">
          <div className="mx-4 mb-4 rounded-2xl border border-slate-100 bg-white px-4 pb-4 pt-4 shadow-sm lg:mx-0 lg:rounded-3xl lg:border lg:pb-5 lg:shadow-sm lg:sticky lg:top-8">
            <div className="mb-3 rounded-xl bg-slate-50 p-3 sm:p-4">
              <p className="font-black text-slate-800">{classInfo.name}</p>
              <p className="text-xs text-slate-500">
                {classInfo.time} &middot; {classInfo.trainer}
              </p>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Espacio
                </p>
                <p className="text-xl font-black text-[#004aab]">
                  {selectedSeat?.codigo_espacio || '---'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Total
                </p>
                <p className="text-xl font-black text-slate-900">
                  S/ {Number(classInfo.price || 0).toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedSeat}
              className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-[#004aab] py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-200/50 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {selectedSeat
                ? 'Continuar al pago'
                : 'Selecciona un espacio'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SeleccionEspacio;
