import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Search, LogOut } from 'lucide-react';
import { useState } from 'react';

const NavbarAdmin = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8">
      {/* Left - Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={20} className="text-slate-600" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-2 flex-1 max-w-xs">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent border-none outline-none text-sm w-full text-slate-600"
          />
        </div>
      </div>

      {/* Right - Notifications & User */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <p className="text-sm font-medium text-slate-900">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500">Administrador</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 min-w-48 z-50">
              <div className="p-4 border-b border-slate-200">
                <p className="font-medium text-slate-900">{user?.name}</p>
                <p className="text-sm text-slate-600">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarAdmin;
