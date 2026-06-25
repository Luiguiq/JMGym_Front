import { X } from 'lucide-react';
import Sidebar from './Sidebar';

const MobileMenu = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden dark:bg-slate-900 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal={isOpen}
        aria-label="Menú de navegación"
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">JM Gym</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors dark:hover:bg-slate-800"
            aria-label="Cerrar menú"
          >
            <X size={20} className="text-slate-600 dark:text-slate-300" aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          <Sidebar onClose={onClose} />
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
