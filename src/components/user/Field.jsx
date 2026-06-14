function Field({ label, icon: Icon, children, error, className = '' }) {
  return (
    <label className={`grid gap-2 font-semibold text-slate-700 ${className}`}>
      {label}
      <div className={`flex min-h-14 items-center gap-3 rounded-2xl border-2 bg-white px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)] sm:min-h-16 transition ${
        error ? 'border-red-300' : 'border-brand-100'
      }`}>
        <span aria-hidden="true" className={error ? 'text-red-400' : ''}><Icon size={20} /></span>
        {children}
      </div>
      {error && (
        <p className="text-xs font-semibold text-red-500">{error}</p>
      )}
    </label>
  );
}

export default Field;
