function ReservationCard({ reservation }) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-soft">
      <h3 className="font-bold text-slate-800">{reservation?.className ?? 'Reserva'}</h3>
      <p className="text-sm text-slate-500">{reservation?.date ?? 'Fecha pendiente'}</p>
    </article>
  );
}

export default ReservationCard;
