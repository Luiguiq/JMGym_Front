function ProfileOption({ icon, label, badge, danger = false, onClick }) {
  return (
    <button
      className={`flex min-h-14 w-full items-center gap-4 px-5 text-left font-extrabold transition hover:bg-surface ${danger ? 'justify-center rounded-2xl border-2 border-red-300 text-red-500 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10' : 'text-secondary'}`}
      type="button"
      onClick={onClick}
    >
      <span className="flex items-center justify-center" aria-hidden="true">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {badge ? <span className="grid h-6 min-w-6 place-items-center rounded-full bg-red-400 px-2 text-xs text-primary-foreground">{badge}</span> : null}
      {!danger ? <span className="text-xl font-normal text-muted-foreground" aria-hidden="true">›</span> : null}
    </button>
  );
}

export default ProfileOption;
