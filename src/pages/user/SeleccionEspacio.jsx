import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
                console.error("Error al cargar la información:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleSeatClick = (seat) => {
        if (seat.estado === 'DISPONIBLE') {

            navigator.vibrate?.(50);

            setSelectedSeat(
                selectedSeat?.id_espacio === seat.id_espacio
                    ? null
                    : seat
            );
        }
    };

    const handleContinue = () => {
        if (selectedSeat) {
            navigate(`/cliente/pago/${id}`, { state: { seatId: selectedSeat.id_espacio, seatCode: selectedSeat.codigo_espacio } });
        }
    };

    const getSeatStyles = (seat) => {
        if (selectedSeat?.id_espacio === seat.id_espacio) {
            return `bg-[#004aab] text-white font-black border-2 border-white ring-4 ring-sky-200 shadow-xl shadow-sky-300/40 scale-110 animate-pulse`;
        }

        switch (seat.estado) {
            case 'DISPONIBLE':
                return 'bg-sky-50 text-sky-600 font-medium hover:bg-sky-100 hover:scale-105 cursor-pointer border-2 border-transparent';
            case 'EN_ESPERA':
            case 'RESERVADO':
                return 'bg-orange-50 text-orange-500 font-bold border-2 border-orange-300 cursor-not-allowed opacity-80';
            case 'OCUPADO':
                return 'bg-green-50 text-green-600 font-bold border-2 border-green-300 cursor-not-allowed opacity-80';
            default:
                return 'bg-gray-100 cursor-not-allowed opacity-50';
        }
    };

    if (loading) {
        return (
            <PageLoader
            text="Cargando información..."
            />
        );
        }

    if (!classInfo) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500 text-center px-4">Error: No se pudo cargar la información de la clase o sus asientos.</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24 lg:pb-8 lg:pt-8">
            {/* Contenedor Principal (Diseño a 2 columnas en PC) */}
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:px-6">

                {/* ========================================================= */}
                {/* COLUMNA IZQUIERDA: INFORMACIÓN Y GRID DE ASIENTOS         */}
                {/* ========================================================= */}
                <div className="flex-1 bg-white lg:rounded-3xl shadow-sm relative pb-32 lg:pb-12">

                    <header className="px-6 pt-10 lg:pt-8 pb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-800 font-semibold mb-2 hover:text-sky-700 transition-colors"
                        >
                            <span className="text-xl">←</span>
                            <h1 className="text-2xl font-serif font-bold text-slate-800">
                                Selecciona tu espacio
                            </h1>
                        </button>
                        <p className="text-slate-500 text-sm pl-7">
                            {classInfo.name} · {classInfo.time} · Prof. {classInfo.trainer}
                        </p>
                    </header>

                    <div className="px-6 md:px-10 mb-6 flex flex-wrap justify-between gap-3 text-xs md:text-sm text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded bg-sky-50 border border-sky-100"></div> Libre
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-2 border-orange-300 bg-orange-50"></div> En espera
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-2 border-green-300 bg-green-50"></div> Ocupado
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded bg-sky-600"></div> Seleccionado
                        </div>
                    </div>

                    <div className="px-4 md:px-10">
                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 max-w-2xl mx-auto">
                            <div className="mb-6 rounded-xl bg-gradient-to-r from-[#004aab] to-sky-500 py-3 text-center text-white shadow-md
                                "
                            >
                                <p className="text-xs uppercase tracking-widest opacity-80">
                                    Instructor
                                </p>

                                <p className="font-black text-lg">
                                    Frente del salón
                                </p>
                                </div>

                            <div className={`grid gap-2 sm:gap-3 md:gap-4 ${
                                seats.length >= 40 ? 'grid-cols-5 sm:grid-cols-8' :
                                    seats.length >= 30 ? 'grid-cols-5 sm:grid-cols-6' :
                                        'grid-cols-5'
                            }`}>
                                {seats.map((seat) => (
                                    <button
                                        key={seat.id_espacio}
                                        onClick={() => handleSeatClick(seat)}
                                        disabled={seat.estado !== 'DISPONIBLE'}
                                        className={`
                                        w-full aspect-square rounded-lg flex items-center justify-center text-[10px] sm:text-xs md:text-sm transition-all duration-200
                                        ${getSeatStyles(seat)}
                                        `}
                                    >
                                        {seat.codigo_espacio}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* COLUMNA DERECHA: PANEL DE RESUMEN Y BOTÓN DE CONTINUAR    */}
                {/* ========================================================= */}
                {/* En móvil: fixed al fondo. En PC: Sticky lateral de 350px */}
                <div className="fixed bottom-0 left-0 w-full z-20 pointer-events-none lg:pointer-events-auto lg:static lg:w-[350px] lg:shrink-0">
                    <div className="w-full pointer-events-auto bg-white px-6 pb-8 pt-4 lg:p-6 border-t lg:border border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] lg:shadow-sm lg:rounded-3xl lg:sticky lg:top-8">

                        <h3 className="hidden lg:block text-lg font-extrabold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                            Resumen de reserva
                        </h3>

                        <div>

                            <div className="mb-4 rounded-2xl bg-slate-50 p-4">
                            <p className="font-black text-slate-800">
                                {classInfo.name}
                            </p>

                            <p className="text-sm text-slate-500">
                                {classInfo.time} · Prof. {classInfo.trainer}
                            </p>
                            </div>

                            {/* Espacio */}
                            <div className="mb-6">
                                <p className="text-xs uppercase font-bold text-slate-400">
                                    Espacio
                                </p>

                                <p className="text-2xl font-black text-[#004aab]">
                                    {selectedSeat?.codigo_espacio || '--'}
                                </p>

                                <p className="text-xs text-slate-500">
                                    {selectedSeat
                                        ? 'Espacio seleccionado'
                                        : 'Aún no seleccionado'}
                                </p>
                            </div>

                            {/* Total */}
                            <div className="
                                rounded-2xl
                                bg-slate-50
                                p-4
                                border
                                border-slate-100
                                mb-6
                            ">
                                <p className="text-xs uppercase font-bold text-slate-400">
                                    Total a pagar
                                </p>

                                <p className="text-3xl font-black text-slate-900">
                                    S/ {Number(classInfo.price || 0).toFixed(2)}
                                </p>
                            </div>

                            {/* Botón */}
                            <button
                                onClick={handleContinue}
                                disabled={!selectedSeat}
                                className="
                                    w-full
                                    bg-gradient-to-r
                                    from-sky-500
                                    to-brand-600
                                    text-white
                                    font-bold
                                    md:text-lg
                                    py-4
                                    rounded-2xl
                                    shadow-lg
                                    shadow-sky-200
                                    transition-all
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >
                                {selectedSeat
                                    ? 'Continuar al pago →'
                                    : 'Selecciona un espacio'}
                            </button>

                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}

export default SeleccionEspacio;
