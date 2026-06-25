import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

function ConfiguracionesAdmin() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="animate-page-enter">
      <h2 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Configuraciones</h2>
      <p className="mb-6 text-slate-500 dark:text-slate-400">Personaliza la apariencia del sistema</p>

      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)] dark:bg-slate-800 dark:shadow-[0_14px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          {theme === 'dark' ? <Moon size={20} className="text-brand-600" /> : <Sun size={20} className="text-brand-600" />}
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Apariencia</h3>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Modo oscuro</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Cambia entre tema claro y oscuro</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={theme === 'dark'}
            onClick={toggleTheme}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${theme === 'dark' ? 'bg-brand-600' : 'bg-slate-200'}`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracionesAdmin;
