import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { classService } from '../../services/classService.js';
import { reservationService } from '../../services/reservationService.js';
import yapeLogo from '../../assets/images/yapelogo.png';
import PageLoader from '../../components/common/PageLoader.jsx';

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
    const [showConfirm, setShowConfirm] = useState(false);
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
            await reservationService.createReservation({
                classId: Number(id),
                seatId: Number(seatId),
                paymentMethod: method,
            });

            // Si todo sale bien, lo mandamos a su panel de Mis Reservas
            navigate('/cliente/reservas', { replace: true });
        } catch (err) {
            const message = err?.message || '';

            if (
                message.includes(
                'Ya tienes una reserva activa para esa fecha'
                )
            ) {
                setError(
                'Ya tienes una clase reservada para esa fecha. Si deseas reservar esta clase, primero cancela la reserva anterior.'
                );
                return;
            }

            setError(message);
        }
    };

    if (loading) {
        return (
            <PageLoader
            text="Cargando información..."
            />
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
                    <div
                        className="
                            bg-white
                            rounded-[28px]
                            p-6
                            shadow-[0_8px_30px_rgba(15,86,130,0.08)]
                            mb-8
                            border
                            border-sky-100
                        "
                    >

                        <p className="
                            text-[11px]
                            font-extrabold
                            uppercase
                            tracking-widest
                            text-sky-600
                        ">
                            Reserva
                        </p>

                        <h2 className="
                            mt-2
                            text-3xl
                            font-black
                            text-slate-900
                        ">
                            {classInfo.name}
                        </h2>

                        <p className="
                            mt-1
                            text-sm
                            text-slate-500
                        ">
                            Prof. {classInfo.trainer}
                        </p>

                        <div className="
                            mt-6
                            grid
                            grid-cols-2
                            gap-3
                        ">
                            <div className="
                                rounded-2xl
                                bg-sky-50
                                p-4
                                border
                                border-sky-100
                            ">
                                <p className="
                                    text-[11px]
                                    uppercase
                                    font-bold
                                    text-sky-700
                                ">
                                    Horario
                                </p>

                                <p className="
                                    mt-1
                                    text-lg
                                    font-black
                                    text-slate-800
                                ">
                                    {classInfo.time}
                                </p>
                            </div>

                            <div className="
                                rounded-2xl
                                bg-sky-50
                                p-4
                                border
                                border-sky-100
                            ">
                                <p className="
                                    text-[11px]
                                    uppercase
                                    font-bold
                                    text-sky-700
                                ">
                                    Espacio
                                </p>

                                <p className="
                                    mt-1
                                    text-lg
                                    font-black
                                    text-[#004aab]
                                ">
                                    {seatCode}
                                </p>
                            </div>
                        </div>

                        <div className="
                            mt-5
                            rounded-2xl
                            bg-gradient-to-r
                            from-sky-50
                            to-white
                            p-5
                            border
                            border-sky-100
                        ">
                            <p className="
                                text-xs
                                uppercase
                                font-bold
                                tracking-wider
                                text-slate-500
                            ">
                                Total a pagar
                            </p>

                            <p className="
                                mt-2
                                text-4xl
                                font-black
                                text-[#004aab]
                            ">
                                S/ {Number(classInfo.price || 0).toFixed(2)}
                            </p>

                            <p className="
                                mt-1
                                text-xs
                                text-slate-400
                            ">
                                Incluye impuestos y registro de reserva.
                            </p>
                        </div>

                    </div>

                    <h2 className="text-[11px] font-extrabold text-sky-700 uppercase tracking-widest mb-4">
                        Elige tu método
                    </h2>

                    <div className="grid gap-4 mb-8">
                        {/* Opción Yape */}
                        <div
                            onClick={() => setMethod('YAPE')}
                            className={`
                                cursor-pointer
                                rounded-[20px]
                                border-2
                                p-4
                                transition-all
                                ${
                                    method === 'YAPE'
                                        ? 'border-sky-500 bg-sky-50/70 shadow-[0_8px_24px_rgba(14,165,233,0.12)]'
                                        : 'border-white bg-white shadow-[0_4px_20px_rgba(15,86,130,0.05)]'
                                }
                            `}
                        >
                            <div className="flex items-center">
                                <div className="
                                    w-12
                                    h-12
                                    bg-white
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-center
                                    mr-4
                                    shrink-0
                                    shadow-sm
                                    ring-1
                                    ring-sky-100
                                    overflow-hidden
                                ">
                                    <img
                                        src={yapeLogo}
                                        alt="Yape"
                                        className="h-9 w-9 object-contain"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-extrabold text-slate-800 text-base">
                                        Yape
                                    </h3>

                                    <p className="text-xs text-slate-500 font-medium">
                                        Pago rápido con tu celular
                                    </p>
                                </div>

                                <div
                                    className={`
                                        w-6
                                        h-6
                                        rounded-full
                                        border-2
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                        ${
                                            method === 'YAPE'
                                                ? 'border-sky-600 bg-sky-600'
                                                : 'border-slate-200 bg-slate-50'
                                        }
                                    `}
                                >
                                    {method === 'YAPE' && (
                                        <span className="text-white text-xs">
                                            ✓
                                        </span>
                                    )}
                                </div>
                            </div>

                            {method === 'YAPE' && (
                                <div className="
                                    mt-4
                                    rounded-xl
                                    bg-white
                                    p-3
                                    border
                                    border-sky-100
                                ">
                                    <p className="text-xs font-semibold text-sky-800">
                                        ✓ Escanea el código QR disponible en recepción para completar tu pago.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Opción Efectivo */}
                        <div
                            onClick={() => setMethod('EFECTIVO')}
                            className={`
                                cursor-pointer
                                rounded-[20px]
                                border-2
                                p-4
                                transition-all
                                ${
                                    method === 'EFECTIVO'
                                        ? 'border-sky-500 bg-sky-50/70 shadow-[0_8px_24px_rgba(14,165,233,0.12)]'
                                        : 'border-white bg-white shadow-[0_4px_20px_rgba(15,86,130,0.05)]'
                                }
                            `}
                        >
                            <div className="flex items-center">
                                <div className="
                                    w-12
                                    h-12
                                    bg-sky-50
                                    rounded-xl
                                    flex
                                    items-center
                                    justify-center
                                    text-xl
                                    mr-4
                                    shrink-0
                                    ring-1
                                    ring-sky-100
                                ">
                                    💵
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-extrabold text-slate-800 text-base">
                                        Efectivo
                                    </h3>

                                    <p className="text-xs text-slate-500 font-medium">
                                        Pago en recepción
                                    </p>
                                </div>

                                <div
                                    className={`
                                        w-6
                                        h-6
                                        rounded-full
                                        border-2
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                        ${
                                            method === 'EFECTIVO'
                                                ? 'border-sky-600 bg-sky-600'
                                                : 'border-slate-200 bg-slate-50'
                                        }
                                    `}
                                >
                                    {method === 'EFECTIVO' && (
                                        <span className="text-white text-xs">
                                            ✓
                                        </span>
                                    )}
                                </div>
                            </div>

                            {method === 'EFECTIVO' && (
                                <div className="
                                    mt-4
                                    rounded-xl
                                    bg-white
                                    p-3
                                    border
                                    border-sky-100
                                ">
                                    <p className="text-xs font-semibold text-sky-800">
                                        ✓ Acércate a recepción 15 minutos antes del inicio de tu clase para realizar el pago.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Area */}
                <div className="px-6 pb-8">
                    {error && (
                    <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-800">
                        {error}
                    </div>
                    )}
                    <button
                        disabled={processing}
                        onClick={() => setShowConfirm(true)}
                        className="
                            w-full
                            rounded-2xl
                            bg-gradient-to-r
                            from-sky-500
                            to-[#004aab]
                            py-4
                            text-white
                            shadow-lg
                            shadow-sky-200
                            transition-all
                            hover:scale-[1.01]
                            active:scale-[0.99]
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-lg font-black">
                                {processing
                                    ? 'Procesando reserva...'
                                    : `Reservar por S/ ${Number(classInfo.price || 0).toFixed(2)}`}
                            </span>

                            {!processing && (
                                <span className="text-xs text-white/80 font-medium">
                                    Espacio {seatCode} • {method === 'YAPE' ? 'Yape' : 'Efectivo'}
                                </span>
                            )}
                        </div>
                    </button>
                </div>

            </div>
            {showConfirm && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/50
                        backdrop-blur-sm
                        p-6
                    "
                >
                    <div
                        className="
                            w-full
                            max-w-md
                            rounded-[28px]
                            bg-white
                            p-6
                            shadow-2xl
                        "
                    >
                        {/* Título */}
                        <div className="text-center">
                            <div
                                className="
                                    mx-auto
                                    mb-4
                                    flex
                                    h-16
                                    w-16
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-sky-100
                                    text-3xl
                                "
                            >
                                📝
                            </div>

                            <h3 className="text-2xl font-black text-slate-900">
                                Confirmar reserva
                            </h3>

                            <p className="mt-2 text-xs text-slate-400">
                                Al confirmar, tu espacio quedará reservado para esta clase.
                            </p>
                        </div>

                        {/* Resumen */}
                        <div
                            className="
                                mt-6
                                rounded-2xl
                                border
                                border-sky-100
                                bg-slate-50
                                p-5
                            "
                        >
                            <div className="space-y-3">

                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Clase
                                    </span>

                                    <span className="font-bold text-slate-800">
                                        {classInfo.name}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Instructor
                                    </span>

                                    <span className="font-bold text-slate-800">
                                        {classInfo.trainer}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Espacio
                                    </span>

                                    <span className="font-black text-[#004aab]">
                                        {seatCode}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Método
                                    </span>

                                    <span className="font-bold text-slate-800">
                                        {method === 'YAPE'
                                            ? 'Yape'
                                            : 'Efectivo'}
                                    </span>
                                </div>

                            </div>

                            <div
                                className="
                                    mt-4
                                    border-t
                                    border-dashed
                                    pt-4
                                    text-center
                                "
                            >
                                <p className="text-xs uppercase font-bold text-slate-500">
                                    Total a pagar
                                </p>

                                <p
                                    className="
                                        mt-2
                                        text-4xl
                                        font-black
                                        text-[#004aab]
                                    "
                                >
                                    S/ {Number(classInfo.price || 0).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Mensaje de confianza */}
                        <div
                            className="
                                mt-4
                                rounded-2xl
                                border
                                border-emerald-200
                                bg-emerald-50
                                p-4
                            "
                        >
                            <p className="font-bold text-emerald-700">
                                ✓ Reserva segura
                            </p>

                            <p className="mt-1 text-xs text-emerald-600">
                                Tu espacio quedará registrado inmediatamente al confirmar.
                            </p>
                        </div>

                        {/* Botones */}
                        <div className="mt-6 flex gap-3">

                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={processing}
                                className="
                                    flex-1
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    py-3
                                    font-bold
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
                                "
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleConfirm}
                                disabled={processing}
                                className="
                                    flex-1
                                    rounded-2xl
                                    bg-[#004aab]
                                    py-3
                                    font-bold
                                    text-white
                                    transition
                                    hover:opacity-90
                                    disabled:opacity-50
                                "
                            >
                                {processing
                                    ? 'Procesando...'
                                    : `Confirmar S/ ${Number(classInfo.price || 0).toFixed(2)}`}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default PagoClase;