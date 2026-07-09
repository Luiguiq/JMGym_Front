import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Dumbbell,
  Calendar,
  Users,
  UserPlus,
  ShieldPlus,
  Bell,
  XCircle,
  LogOut,
  Tags,
  Settings,
  Smartphone,
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Panel principal',
      icon: LayoutDashboard,
      path: '/admin',
    },
    {
      id: 'clases',
      label: 'Clases',
      icon: Dumbbell,
      path: '/admin/clases',
    },
    {
      id: 'categorias',
      label: 'Categorías',
      icon: Tags,
      path: '/admin/categorias',
    },
    {
      id: 'reservas',
      label: 'Reservas',
      icon: Calendar,
      path: '/admin/reservas',
    },
    {
      id: 'cancelaciones',
      label: 'Anulaciones',
      icon: XCircle,
      path: '/admin/cancelaciones',
    },
    {
      id: 'pagos-yape',
      label: 'Pagos Yape',
      icon: Smartphone,
      path: '/admin/pagos-yape',
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: Users,
      path: '/admin/usuarios',
    },
    {
      id: 'instructores',
      label: 'Instructores',
      icon: UserPlus,
      path: '/admin/instructores',
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: Bell,
      path: '/admin/notificaciones',
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: Settings,
      path: '/admin/configuraciones',
    },
    {
      id: 'crear-admin',
      label: 'Crear administrador',
      icon: ShieldPlus,
      path: '/admin/crear-admin',
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) =>
    path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(path);

  return (
    <div className="h-full flex flex-col bg-card dark:bg-card">
      {/* Logo */}
      <div className="p-6 border-b border-border dark:border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">JM</span>
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-foreground dark:text-foreground">JM Gym</h1>
            <p className="text-xs text-secondary dark:text-muted">Panel administrativo</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto" aria-label="Navegacion principal admin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              aria-current={active ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                   ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground shadow-md'
                  : 'text-secondary hover:bg-border-light dark:text-secondary dark:hover:bg-surface'
              }`}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border space-y-3 dark:border-border">
        <div className="px-4 py-3 bg-surface rounded-xl dark:bg-surface">
          <p className="text-xs text-secondary dark:text-muted">Admin</p>
          <p className="font-medium text-foreground dark:text-foreground">{user?.name || 'Administrador'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors dark:text-red-300 dark:hover:bg-red-500/10"
          aria-label="Cerrar sesión"
        >
          <LogOut size={20} aria-hidden="true" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
