import { X } from 'lucide-react';
import logoJmGym from '../../assets/logos/logo-jmgym.jpeg';
import UserSidebar from './UserSidebar';

const UserMobileMenu = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transition-transform duration-300 ease-in-out lg:hidden dark:bg-card ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal={isOpen}
        aria-label="Menú de navegación"
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <img src={logoJmGym} alt="Logo JMGym" className="h-8 w-8 rounded-lg object-contain" />
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-border-light dark:hover:bg-surface"
            aria-label="Cerrar menú"
          >
            <X size={20} className="text-secondary dark:text-secondary" aria-hidden="true" />
          </button>
        </div>
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <UserSidebar onClose={onClose} />
        </div>
      </div>
    </>
  );
};

export default UserMobileMenu;
