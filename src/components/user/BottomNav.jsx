import { NavLink } from 'react-router-dom';

const items = [
  { icon: '🏠', label: 'Inicio', to: '/cliente/home' },
  { icon: '🎭', label: 'Clases', to: '/cliente/clases' },
  { icon: '📋', label: 'Reservas', to: '/cliente/reservas' },
  { icon: '👤', label: 'Perfil', to: '/cliente/perfil' },
];

function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 grid grid-cols-4 gap-1 rounded-t-[30px] bg-white/95 px-5 py-4 shadow-[0_-16px_34px_rgba(33,45,58,0.12)] md:left-1/2 md:right-auto md:w-[min(720px,calc(100%-64px))] md:-translate-x-1/2" aria-label="Navegacion cliente">
      {items.map((item) => (
        <NavLink className={({ isActive }) => `grid justify-items-center gap-1 text-xs ${isActive ? 'font-extrabold text-brand-600' : 'text-slate-400'}`} to={item.to} key={item.label}>
          <span className="text-xl" aria-hidden="true">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
