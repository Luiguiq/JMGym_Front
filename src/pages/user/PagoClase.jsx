import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { classService } from '../../services/classService.js';
import { reservationService } from '../../services/reservationService.js';
import yapeLogo from '../../assets/images/yapelogo.png';

function PagoClase() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Rescatamos el asiento seleccionado en la pantalla anterior
    const seatCode = location.state?.seatCode || 'Pendiente';
    const seatId = location.state?.seatId;

    const [classInfo, setClassInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [method, setMethod] = useState('YAPE'); // Controla si elige Yape o Efectivo
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Seguridad: Si entran a esta URL sin elegir asiento, los regresamos
        if (!seatId) {
            navigate(`/cliente/clases/${id}`);
            return;
        }

        classService.getClassById(id)
            .then(setClassInfo)
            .catch((err) => setError('Error al cargar la clase: ' + err.message))
            .finally(() => setLoading(false));
    }, [id, seatId, navigate]);

    const handleConfirm = async () => {
        setProcessing(true);
        setError('');
        try {
            // Ejecutamos la petición a tu API de FastAPI para crear la reserva en la BD
            await reservationService.createReservation(id);

            // Si todo sale bien, lo mandamos a su panel de Mis Reservas
            navigate('/cliente/reservas', { replace: true });
        } catch (err) {
            setError(err.message || 'Error al procesar la reserva');
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[linear-gradient(180deg,#f7fcff_0%,#edf8ff_100%)] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            </main>
        );
    }

    if (!classInfo) return null;

    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,#f7fcff_0%,#edf8ff_100%)] font-sans pb-8 flex justify-center">
            <div className="w-full max-w-md bg-transparent min-h-screen relative flex flex-col">

                {/* Encabezado */}
                <header className="px-6 pt-10 pb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-3 text-slate-800 font-semibold transition hover:text-sky-700"
                    >
                        <span className="text-xl">←</span>
                        <h1 className="text-2xl font-serif font-bold text-slate-800">Método de pago</h1>
                    </button>
                </header>

                <div className="px-6 flex-1">
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 font-bold text-sm rounded-xl">{error}</div>}

                    {/* Tarjeta Blanca: Resumen de Reserva */}
                    <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(15,86,130,0.08)] mb-8 border border-sky-100">
                        <h2 className="text-[11px] font-extrabold text-sky-700 uppercase tracking-widest mb-5">
                            Resumen de reserva
                        </h2>

                        <div className="grid gap-4 text-sm">
                            <div className="flex justify-between border-b border-sky-50 pb-4">
                                <span className="text-slate-500">Clase</span>
                                <span className="font-extrabold text-slate-800">{classInfo.name}</span>
                            </div>
                            <div className="flex justify-between border-b border-sky-50 pb-4">
                                <span className="text-slate-500">Horario</span>
                                <span className="font-extrabold text-slate-800">Hoy · {classInfo.time}</span>
                            </div>
                            <div className="flex justify-between border-b border-sky-50 pb-4">
                                <span className="text-slate-500">Espacio</span>
                                <span className="font-extrabold text-slate-800">{seatCode}</span>
                            </div>
                            <div className="flex justify-between border-b border-sky-50 pb-4">
                                <span className="text-slate-500">Instructor</span>
                                <span className="font-extrabold text-slate-800">{classInfo.trainer}</span>
                            </div>
                            <div className="flex justify-between pt-2 items-center">
                                <span className="font-extrabold text-slate-800 text-base">Total</span>
                                <span className="font-extrabold text-sky-700 text-xl">
                  S/ {classInfo.price ? Number(classInfo.price).toFixed(2) : '0.00'}
                </span>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-[11px] font-extrabold text-sky-700 uppercase tracking-widest mb-4">
                        Elige tu método
                    </h2>

                    <div className="grid gap-4 mb-8">
                        {/* Opción Yape */}
                        <button
                            onClick={() => setMethod('YAPE')}
                            className={`flex items-center p-4 rounded-[20px] border-2 transition-all text-left ${
                                method === 'YAPE'
                                    ? 'border-sky-500 bg-sky-50/70 shadow-[0_8px_24px_rgba(14,165,233,0.12)]'
                                    : 'border-white bg-white shadow-[0_4px_20px_rgba(15,86,130,0.05)]'
                            }`}
                        >
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 shrink-0 shadow-sm ring-1 ring-sky-100 overflow-hidden">
                                <img src={yapeLogo} alt="Yape" className="h-9 w-9 object-contain" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-extrabold text-slate-800 text-base">Yape</h3>
                                <p className="text-xs text-slate-500 font-medium">Pago rápido con tu celular</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                method === 'YAPE' ? 'border-sky-600 bg-sky-600' : 'border-slate-200 bg-slate-50'
                            }`}>
                                {method === 'YAPE' && <span className="text-white text-xs">✓</span>}
                            </div>
                        </button>

                        {/* Opción Efectivo */}
                        <button
                            onClick={() => setMethod('EFECTIVO')}
                            className={`flex items-center p-4 rounded-[20px] border-2 transition-all text-left ${
                                method === 'EFECTIVO'
                                    ? 'border-sky-500 bg-sky-50/70 shadow-[0_8px_24px_rgba(14,165,233,0.12)]'
                                    : 'border-white bg-white shadow-[0_4px_20px_rgba(15,86,130,0.05)]'
                            }`}
                        >
                            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-xl mr-4 shrink-0 ring-1 ring-sky-100">
                                💵
                            </div>
                            <div className="flex-1">
                                <h3 className="font-extrabold text-slate-800 text-base">Efectivo</h3>
                                <p className="text-xs text-slate-500 font-medium">Paga en recepción</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                method === 'EFECTIVO' ? 'border-sky-600 bg-sky-600' : 'border-slate-200 bg-slate-50'
                            }`}>
                                {method === 'EFECTIVO' && <span className="text-white text-xs">✓</span>}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer Area */}
                <div className="px-6 pb-8">
                    <div className="bg-sky-50/80 border border-sky-100 rounded-[20px] p-4 flex gap-4 mb-6 items-center">
                        <div className="text-2xl bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                            {method === 'YAPE' ? '📱' : '🏢'}
                        </div>
                        <div>
                            <h4 className="font-bold text-sky-900 text-sm">
                                {method === 'YAPE' ? 'Paga con Yape' : 'Pago presencial'}
                            </h4>
                            <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
                                {method === 'YAPE'
                                    ? 'Abre tu app Yape y escanea el código QR en recepción'
                                    : 'Acércate a la recepción del gimnasio 15 min antes de tu clase.'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-sky-500 to-brand-600 text-white font-bold text-lg py-4 rounded-[20px] shadow-lg shadow-sky-200/60 transform hover:scale-[1.02] transition-all disabled:opacity-70 disabled:transform-none"
                    >
                        {processing ? 'Procesando reserva...' : 'Confirmar reserva y pagar →'}
                    </button>
                </div>

            </div>
        </main>
    );
}

export default PagoClase;
