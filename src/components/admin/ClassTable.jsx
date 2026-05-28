function ClassTable({ classes = [], loading = false }) {
  if (loading) return <div className="rounded-2xl bg-white p-5 shadow-soft"><p className="text-slate-400">Cargando...</p></div>;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
      <table className="w-full text-left">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="px-5 py-4 text-sm font-extrabold text-slate-500">Nombre</th>
            <th className="px-5 py-4 text-sm font-extrabold text-slate-500">Entrenador</th>
            <th className="px-5 py-4 text-sm font-extrabold text-slate-500">Horario</th>
            <th className="px-5 py-4 text-sm font-extrabold text-slate-500">Cupos</th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr><td className="px-5 py-8 text-center text-slate-400" colSpan={4}>No hay clases registradas</td></tr>
          ) : (
            classes.map((c) => (
              <tr className="border-b last:border-none" key={c.id}>
                <td className="px-5 py-4 font-bold text-slate-800">{c.name}</td>
                <td className="px-5 py-4 text-slate-500">{c.trainer}</td>
                <td className="px-5 py-4 text-slate-500">{c.time}</td>
                <td className="px-5 py-4 text-slate-500">{c.availableSpots}/{c.capacity}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ClassTable;
