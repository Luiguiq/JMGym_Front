import { NavLink } from 'react-router-dom';
import { Home, Calendar, ClipboardList, User } from 'lucide-react';

const items = [
  { to: '/cliente/home', label: 'Inicio', icon: Home },
  { to: '/cliente/clases', label: 'Clases', icon: Calendar },
  { to: '/cliente/reservas', label: 'Reservas', icon: ClipboardList },
  { to: '/cliente/perfil', label: 'Perfil', icon: User },
];

function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] sm:pb-[max(env(safe-area-inset-bottom),1rem)]"
      aria-label="Navegacion cliente"
    >
      <div className="mx-auto flex max-w-[480px] items-center justify-around rounded-[28px] bg-card/90 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              [
                'flex flex-col items-center gap-0.5 rounded-2xl px-4 py-2 text-[10px] font-semibold transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-blue-600'
                  : 'text-muted-foreground hover:text-secondary',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
