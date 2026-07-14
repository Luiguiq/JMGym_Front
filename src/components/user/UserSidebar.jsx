import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Calendar,
  ClipboardList,
  User,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';

const menuItems = [
  { id: 'home', label: 'Inicio', icon: Home, path: '/cliente/home' },
  { id: 'clases', label: 'Clases', icon: Calendar, path: '/cliente/clases' },
  { id: 'reservas', label: 'Reservas', icon: ClipboardList, path: '/cliente/reservas' },
  { id: 'perfil', label: 'Perfil', icon: User, path: '/cliente/perfil' },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell, path: '/cliente/notificaciones' },
  { id: 'configuraciones', label: 'Configuración', icon: Settings, path: '/cliente/configuraciones', hideOnDesktop: true },
  { id: 'ayuda', label: 'Ayuda / Soporte', icon: HelpCircle, path: '/cliente/ayuda' },
];

const UserSidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="flex h-full flex-col bg-card dark:bg-card">
      <div className="bg-gradient-to-r from-blue-600 to-sky-600 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/30 shadow-sm">
            <img src={logoJmGym} alt="Logo JMGym" className="h-full w-full object-contain" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-white">JM Gym</h1>
            <p className="text-xs text-blue-100">Panel de cliente</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4" aria-label="Navegacion principal cliente">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              aria-current={active ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-primary-foreground shadow-md'
                  : 'text-secondary hover:bg-blue-50 dark:text-secondary dark:hover:bg-blue-950/20'
              } ${item.hideOnDesktop ? 'lg:hidden' : ''}`}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-border space-y-3 border-t p-4">
        <div className="rounded-xl bg-blue-50/50 px-4 py-3 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/20">
          <p className="text-xs text-blue-600 dark:text-blue-400">Cliente</p>
          <p className="font-medium text-foreground dark:text-foreground">
            {user?.name || 'Cliente'}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 transition-colors hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
          aria-label="Cerrar sesión"
        >
          <LogOut size={20} aria-hidden="true" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
