function Field({ label, icon: Icon, children, error, className = '' }) {
  return (
    <label className={`grid gap-2 font-semibold text-secondary dark:text-foreground ${className}`}>
      {label}
      <div className={`flex min-h-14 items-center gap-3 rounded-2xl border-2 bg-card px-4 shadow-[0_10px_24px_rgba(9,105,163,0.06)] sm:min-h-16 transition dark:bg-surface dark:shadow-[0_10px_24px_rgba(0,0,0,0.2)] ${
        error ? 'border-red-300 dark:border-red-500' : 'border-brand-100 dark:border-border'
      }`}>
        <span aria-hidden="true" className={`${error ? 'text-red-400' : 'text-muted dark:text-muted-foreground'}`}><Icon size={20} /></span>
        {children}
      </div>
      {error && (
        <p className="text-xs font-semibold text-red-500">{error}</p>
      )}
    </label>
  );
}

export default Field;
