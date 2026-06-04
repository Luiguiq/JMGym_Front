import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { classService } from '../../services/classService.js';

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
            setSelectedSeat(selectedSeat?.id_espacio === seat.id_espacio ? null : seat);
        }
    };

    const handleContinue = () => {
        if (selectedSeat) {
            navigate(`/cliente/pago/${id}`, { state: { seatId: selectedSeat.id_espacio, seatCode: selectedSeat.codigo_espacio } });
        }
    };

    const getSeatStyles = (seat) => {
        if (selectedSeat?.id_espacio === seat.id_espacio) {
            return 'bg-sky-600 text-white shadow-md shadow-sky-200 font-bold border-2 border-sky-600 transform scale-105';
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
            <main className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            </main>
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
                            <h1 className="text-2xl font-serif font-bold text-slate-800">Selecciona tu espacio</h1>
                        </button>
                        <p className="text-slate-500 text-sm pl-7">
                            {classInfo.name} · {classInfo.time} · Prof. {classInfo.trainer}
                        </p>
                    </header>

                    <div className="px-6 md:px-10 mb-6">
                        <div className="bg-sky-50/80 rounded-2xl flex items-center justify-between p-4 md:p-6 border border-sky-100">
                            <div className="text-center flex-1 border-r border-sky-100">
                                <p className="text-[10px] md:text-xs font-bold text-sky-700 uppercase tracking-wider">Clase</p>
                                <p className="font-bold text-slate-800 line-clamp-1 px-1">{classInfo.name}</p>
                            </div>
                            <div className="text-center flex-1 border-r border-sky-100">
                                <p className="text-[10px] md:text-xs font-bold text-sky-700 uppercase tracking-wider">Hora</p>
                                <p className="font-bold text-slate-800">{classInfo.time}</p>
                            </div>
                            <div className="text-center flex-1">
                                <p className="text-[10px] md:text-xs font-bold text-sky-700 uppercase tracking-wider">Cupos</p>
                                <p className="font-bold text-slate-800">{classInfo.availableSpots} libres</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 md:px-10 mb-6 flex flex-wrap justify-between gap-3 text-xs md:text-sm text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded bg-sky-50 border border-sky-100"></div> Disponible
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-2 border-orange-300 bg-orange-50"></div> En espera
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-2 border-green-300 bg-green-50"></div> Pagado
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded bg-sky-600"></div> Seleccionado
                        </div>
                    </div>

                    <div className="px-4 md:px-10">
                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 max-w-2xl mx-auto">
                            <div className="flex justify-center items-center gap-2 mb-6 md:mb-8">
                                <span className="text-sm md:text-base">🏋️‍♀️</span>
                                <p className="text-xs md:text-sm font-bold text-sky-700 tracking-widest uppercase">Frente al instructor</p>
                                <span className="text-sm md:text-base">🏋️‍♀️</span>
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

                        {selectedSeat ? (
                            <div className="animate-fade-in-up">
                                <div className="bg-sky-50/80 rounded-2xl p-4 flex justify-between items-center mb-6 border border-sky-100">
                                    <div>
                                        <p className="text-[10px] md:text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">Espacio Seleccionado</p>
                                        <p className="text-2xl md:text-3xl font-bold text-sky-900">{selectedSeat.codigo_espacio}</p>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-md md:rounded-xl flex items-center justify-center shadow-sm">
                                        <span className="text-white text-lg md:text-xl font-bold">✓</span>
                                    </div>
                                </div>

                                <div className="hidden lg:flex justify-between items-center mb-6 text-sm">
                                    <span className="text-slate-500 font-medium">Total a pagar:</span>
                                    <span className="text-xl font-bold text-slate-800">S/ {classInfo.price || "0.00"}</span>
                                </div>

                                <button
                                    onClick={handleContinue}
                                    className="w-full bg-gradient-to-r from-sky-500 to-brand-600 text-white font-bold md:text-lg py-4 rounded-2xl shadow-lg shadow-sky-200 transform hover:scale-[1.02] transition-all"
                                >
                                    Continuar al pago →
                                </button>
                            </div>
                        ) : (
                            <div className="w-full bg-sky-50 text-sky-700 font-bold text-xs md:text-sm py-4 rounded-2xl text-center uppercase tracking-wide border border-sky-100">
                                Seleccione un espacio
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </main>
    );
}

export default SeleccionEspacio;
