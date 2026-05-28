function ReservationTable({ reservations = [], loading = false }) {
  if (loading) return <div className="rounded-2xl bg-white p-5 shadow-soft"><p className="text-slate-400">Cargando...</p></div>;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
      <table className="w-full text-left">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="px-5 py-4 text-sm font-extrabold text-slate-500">Cliente</th>
            <th className="px-5 py-4 text-sm font-extrabold text-slate-500">Clase</th>
            <th className="px-5 py-4 text-sm font-extrabold text-slate-500">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr><td className="px-5 py-8 text-center text-slate-400" colSpan={3}>No hay reservas</td></tr>
          ) : (
            reservations.map((r) => (
              <tr className="border-b last:border-none" key={r.id}>
                <td className="px-5 py-4 font-bold text-slate-800">{r.clientName ?? r.user?.name ?? '-'}</td>
                <td className="px-5 py-4 text-slate-500">{r.className ?? r.class?.name ?? '-'}</td>
                <td className="px-5 py-4 text-slate-500">{r.date ? new Date(r.date).toLocaleDateString() : '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationTable;
