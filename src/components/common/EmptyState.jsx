import { Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function EmptyState({ icon: Icon = Inbox, title = 'Sin datos', description = '', actionLabel, actionTo }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <Icon size={32} className="text-slate-400" />
      </div>
      <p className="text-lg font-bold text-slate-600">{title}</p>
      {description && <p className="max-w-xs text-sm text-slate-400">{description}</p>}
      {actionLabel && actionTo && (
        <button
          onClick={() => navigate(actionTo)}
          className="mt-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
