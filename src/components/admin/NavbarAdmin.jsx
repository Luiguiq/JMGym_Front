import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Search, LogOut } from 'lucide-react';
import { useState } from 'react';

const NavbarAdmin = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8 border-b border-transparent dark:border-border">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-border-light rounded-lg transition-colors dark:hover:bg-card"
          aria-label="Abrir menú de navegación"
        >
          <Menu size={20} className="text-secondary dark:text-secondary" aria-hidden="true" />
        </button>

        <div className="hidden md:flex items-center gap-2 bg-border-light rounded-lg px-4 py-2 flex-1 max-w-xs ring-1 ring-transparent dark:bg-card dark:ring-border">
          <Search size={18} className="text-muted-foreground dark:text-muted" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar..."
            aria-label="Buscar en el panel de administración"
            className="bg-transparent border-none outline-none text-sm w-full text-secondary placeholder:text-muted-foreground dark:text-foreground dark:placeholder:text-muted"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-2 hover:bg-border-light rounded-lg transition-colors dark:hover:bg-card"
            aria-label="Menú de usuario"
            aria-expanded={showDropdown}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <p className="text-sm font-medium text-foreground dark:text-foreground">{user?.name || 'Admin'}</p>
              <p className="text-xs text-muted dark:text-muted">Administrador</p>
            </div>
          </button>

          {showDropdown && (
            <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 sm:static sm:absolute sm:left-auto sm:right-0 sm:top-full sm:translate-y-0 sm:mt-2 bg-card rounded-lg shadow-lg border border-border min-w-44 sm:min-w-48 z-50 dark:bg-card dark:border-border">
              <div className="p-4 border-b border-border dark:border-border">
                <p className="font-medium text-foreground dark:text-foreground">{user?.name}</p>
                <p className="text-sm text-secondary dark:text-muted">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors dark:text-red-300 dark:hover:bg-red-500/10"
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
