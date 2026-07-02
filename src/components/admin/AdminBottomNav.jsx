import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Calendar, Users } from 'lucide-react';

const items = [
  { icon: LayoutDashboard, label: 'Inicio', to: '/admin' },
  { icon: Dumbbell, label: 'Clases', to: '/admin/clases' },
  { icon: Calendar, label: 'Reservas', to: '/admin/reservas' },
  { icon: Users, label: 'Usuarios', to: '/admin/usuarios' },
];

function AdminBottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 grid grid-cols-4 bg-card border-t border-border px-2 pt-2 pb-3 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] z-40 lg:hidden"
      aria-label="Navegacion admin"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-xs transition-colors ${
                isActive ? 'text-brand-600 font-extrabold' : 'text-muted-foreground font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`grid place-items-center w-9 h-9 rounded-xl transition-colors ${
                    isActive ? 'bg-brand-50 dark:bg-primary/10' : 'bg-transparent'
                  }`}
                >
                  <Icon size={20} />
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default AdminBottomNav;
