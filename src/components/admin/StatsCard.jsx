function StatsCard({ title = 'Indicador', value = '0' }) {
  return <article className="rounded-2xl bg-white p-5 shadow-soft"><p className="text-slate-500">{title}</p><strong className="text-3xl text-slate-900">{value}</strong></article>;
}

export default StatsCard;
