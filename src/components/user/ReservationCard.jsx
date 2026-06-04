function ReservationCard({ reservation }) {
    // Leemos el nombre anidado que ahora manda FastAPI
    const nombreClase = reservation?.clase?.nombre_clase || `Reserva #${reservation?.codigo_reserva || ''}`;

    // Formateamos la fecha (ej. "viernes, 5 de junio")
    const fecha = reservation?.fecha_clase
        ? new Date(reservation.fecha_clase + 'T00:00:00').toLocaleDateString('es-PE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        })
        : 'Fecha pendiente';

    return (
        <article className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex justify-between items-center">
            <div>
                <h3 className="font-extrabold text-slate-800 text-lg capitalize">{nombreClase}</h3>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                    <span aria-hidden="true">📅</span> {fecha}
                </p>
            </div>
            <div className="text-right">
         <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold px-3 py-1.5 rounded-xl text-xs uppercase tracking-wider shadow-sm">
           {reservation?.estado_reserva || 'ACTIVA'}
         </span>
            </div>
        </article>
    );
}

export default ReservationCard;
