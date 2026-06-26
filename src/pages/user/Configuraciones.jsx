import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Globe, Bell, BellRing, CalendarClock, TimerReset, Users, CheckCircle, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { userService } from '../../services/userService.js';
import TextSizeSetting from '../../components/common/TextSizeSetting.jsx';
import Field from '../../components/user/Field.jsx';

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
];

const NOTIF_OPTIONS = [
  { key: 'recordatorio', label: 'Recordatorio de clases', desc: 'Recibe un aviso antes de cada clase', icon: CalendarClock },
  { key: 'cambios_horario', label: 'Cambios de horario', desc: 'Notificar cuando una clase cambie de horario', icon: TimerReset },
  { key: 'nuevas_clases', label: 'Nuevas clases', desc: 'Entérate cuando agreguen nuevas clases', icon: Users },
];

function Configuraciones() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [language, setLanguage] = useState(() => localStorage.getItem('jmgym_lang') || 'es');
  const [notifPrefs, setNotifPrefs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jmgym_notif_prefs')) || {
        recordatorio: true,
        cambios_horario: true,
        nuevas_clases: false,
      };
    } catch {
      return { recordatorio: true, cambios_horario: true, nuevas_clases: false };
    }
  });

  function handleLanguageChange(e) {
    const val = e.target.value;
    setLanguage(val);
    localStorage.setItem('jmgym_lang', val);
    try {
      const el = document.querySelector('.goog-te-combo');
      if (el) {
        el.value = val;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } catch (e) {
      console.warn('GT error:', e);
    }
  }

  function toggleNotif(key) {
    setNotifPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('jmgym_notif_prefs', JSON.stringify(next));
      return next;
    });
  }

  function clearError(field) {
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setServerError('');
  }

  function validatePassword() {
    const errors = {};
    if (oldPassword || newPassword) {
      if (!oldPassword) errors.oldPassword = 'Ingresa tu contraseña actual';
      if (!newPassword) errors.newPassword = 'Ingresa una nueva contraseña';
      else if (newPassword.length < 6) errors.newPassword = 'Mínimo 6 caracteres';
    }
    return errors;
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setSuccess('');
    setServerError('');
    const errors = validatePassword();
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      await userService.updateMyProfile({
        old_password: oldPassword,
        password: newPassword,
      });
      setSuccess('Contraseña actualizada correctamente');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      const msg = err?.message || 'Error al cambiar la contraseña';
      if (msg.includes('contraseña actual no es correcta')) {
        setFieldErrors((prev) => ({ ...prev, oldPassword: msg }));
      } else {
        setServerError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-900">
      <section className="mx-auto max-w-2xl px-4 pt-8 sm:px-6 sm:pt-12">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="grid h-11 w-11 place-items-center rounded-xl bg-white text-slate-600 shadow-[0_4px_12px_rgba(33,45,58,0.08)] transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">Configuraciones</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Personaliza tu experiencia</p>
          </div>
        </div>

        {serverError && (
          <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            {serverError}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-600">
            {success}
          </div>
        )}

        <div className="mb-5 overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)] dark:bg-slate-800 dark:shadow-[0_14px_32px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-700">
            <Globe size={20} className="text-brand-600" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Idioma</h3>
          </div>
          <div className="px-5 py-4">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-5 overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)] dark:bg-slate-800 dark:shadow-[0_14px_32px_rgba(0,0,0,0.3)]">
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

        <TextSizeSetting />

        <div className="mb-5 overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)] dark:bg-slate-800 dark:shadow-[0_14px_32px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-700">
            <Bell size={20} className="text-brand-600" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Notificaciones</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {NOTIF_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isOn = notifPrefs[opt.key];
              return (
                <div key={opt.key} className="flex items-center gap-3 px-5 py-4">
                  <Icon size={20} className="text-slate-400 shrink-0 dark:text-slate-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{opt.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isOn}
                    onClick={() => toggleNotif(opt.key)}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${isOn ? 'bg-brand-600' : 'bg-slate-200'}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition ${isOn ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_32px_rgba(33,45,58,0.1)] dark:bg-slate-800 dark:shadow-[0_14px_32px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-700">
            <Lock size={20} className="text-brand-600" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Cambiar contraseña</h3>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 px-5 py-4">
            <Field label="Contraseña actual" icon={Lock} error={fieldErrors.oldPassword}>
              <input
                className="w-full bg-transparent outline-none"
                type="password"
                placeholder="Ingresa tu contraseña actual"
                value={oldPassword}
                onChange={(e) => { setOldPassword(e.target.value); clearError('oldPassword'); }}
              />
            </Field>
            <Field label="Nueva contraseña" icon={Lock} error={fieldErrors.newPassword}>
              <input
                className="w-full bg-transparent outline-none"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); clearError('newPassword'); }}
              />
            </Field>
            <button
              className="min-h-12 w-full rounded-2xl bg-brand-600 font-bold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Configuraciones;
