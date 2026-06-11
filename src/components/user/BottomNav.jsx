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
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 lg:px-8"
      aria-label="Navegacion cliente"
    >
      <div className="mx-auto grid max-w-[520px] grid-cols-4 gap-2 rounded-[28px] border border-white/80 bg-white/95 p-2 shadow-[0_-14px_34px_rgba(15,23,42,.08)] backdrop-blur">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              [
                'flex flex-col items-center justify-center gap-1 rounded-[22px] px-3 py-3 text-[11px] font-semibold transition',
                isActive
                  ? 'bg-[#004aab] text-white shadow-[0_10px_20px_rgba(0,74,171,.18)]'
                  : 'text-slate-500 hover:bg-slate-50',
              ].join(' ')
            }
          >
            <Icon size={18} strokeWidth={2.2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;