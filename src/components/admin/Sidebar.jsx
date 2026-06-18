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
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
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
      label: 'Cancelaciones',
      icon: XCircle,
      path: '/admin/cancelaciones',
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
      id: 'crear-admin',
      label: 'Crear Admin',
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
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <span className="text-white font-bold text-lg">JM</span>
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-slate-900">JM Gym</h1>
            <p className="text-xs text-slate-600">Admin Panel</p>
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
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-200 space-y-3">
        <div className="px-4 py-3 bg-slate-50 rounded-xl">
          <p className="text-xs text-slate-600">Admin</p>
          <p className="font-medium text-slate-900">{user?.name || 'Administrador'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
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
