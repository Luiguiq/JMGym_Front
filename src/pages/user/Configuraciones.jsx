import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Globe, Bell, CalendarClock, TimerReset, Users, Sun, Moon, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAccessibility } from '../../context/AccessibilityContext.jsx';
import { userService } from '../../services/userService.js';
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
      return JSON.parse(localStorage.getItem('jmgym_notif_prefs')) || { recordatorio: true, cambios_horario: true, nuevas_clases: false };
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
      if (el) { el.value = val; el.dispatchEvent(new Event('change', { bubbles: true })); }
    } catch (e) { console.warn('GT error:', e); }
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
      await userService.updateMyProfile({ old_password: oldPassword, password: newPassword });
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
    <main className="min-h-screen bg-surface pb-28">
      <div className="mx-auto max-w-lg px-4 pt-5 sm:px-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="mb-5 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-secondary shadow-sm transition hover:bg-surface"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Configuraciones</h1>
            <p className="text-[13px] text-muted">Personaliza tu experiencia</p>
          </div>
        </motion.div>

        {/* Messages */}
        {serverError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-500/10 dark:text-red-300">
            {serverError}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
            <Check size={16} /> {success}
          </motion.div>
        )}

        {/* Idioma */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card shadow-sm"
        >
          <div className="flex items-center gap-3 border-b border-border-light px-4 py-3.5">
            <Globe size={18} className="text-muted" />
            <h3 className="text-sm font-bold text-foreground">Idioma</h3>
          </div>
          <div className="px-4 py-3">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-secondary outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-primary/20"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Apariencia */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-3 rounded-2xl bg-card shadow-sm"
        >
          <div className="flex items-center gap-3 border-b border-border-light px-4 py-3.5">
            {theme === 'dark' ? <Moon size={18} className="text-muted" /> : <Sun size={18} className="text-muted" />}
            <h3 className="text-sm font-bold text-foreground">Apariencia</h3>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-bold text-foreground">Modo oscuro</p>
              <p className="text-xs text-muted">Cambia entre tema claro y oscuro</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              onClick={toggleTheme}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-border'}`}
            >
              <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-card shadow transition ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </motion.div>

        {/* Tamaño de texto */}
        <TextSizeCard />

        {/* Notificaciones */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-3 rounded-2xl bg-card shadow-sm"
        >
          <div className="flex items-center gap-3 border-b border-border-light px-4 py-3.5">
            <Bell size={18} className="text-muted" />
            <h3 className="text-sm font-bold text-foreground">Notificaciones</h3>
          </div>
          <div className="divide-y divide-border-light">
            {NOTIF_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isOn = notifPrefs[opt.key];
              return (
                <div key={opt.key} className="flex items-center gap-3 px-4 py-3">
                  <Icon size={18} className="shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted">{opt.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isOn}
                    onClick={() => toggleNotif(opt.key)}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${isOn ? 'bg-blue-600' : 'bg-border'}`}
                  >
                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-card shadow transition ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Cambiar contraseña */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 rounded-2xl bg-card shadow-sm"
        >
          <div className="flex items-center gap-3 border-b border-border-light px-4 py-3.5">
            <Lock size={18} className="text-muted" />
            <h3 className="text-sm font-bold text-foreground">Cambiar contraseña</h3>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-3 px-4 py-3">
            <Field label="Contraseña actual" icon={Lock} error={fieldErrors.oldPassword}>
              <input
                className="w-full bg-transparent text-sm outline-none"
                type="password"
                placeholder="Ingresa tu contraseña actual"
                value={oldPassword}
                onChange={(e) => { setOldPassword(e.target.value); clearError('oldPassword'); }}
              />
            </Field>
            <Field label="Nueva contraseña" icon={Lock} error={fieldErrors.newPassword}>
              <input
                className="w-full bg-transparent text-sm outline-none"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); clearError('newPassword'); }}
              />
            </Field>
            <button
              className="min-h-12 w-full rounded-xl bg-blue-600 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </motion.div>

      </div>
    </main>
  );
}

function TextSizeCard() {
  const { textSizeLevel, cycleTextSizeLevel, maxTextSizeLevel } = useAccessibility();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mt-3 rounded-2xl bg-card shadow-sm"
    >
      <div className="flex items-center gap-3 border-b border-border-light px-4 py-3.5">
        <span className="flex h-[18px] w-[18px] items-center justify-center text-xs font-black text-muted">Tt</span>
        <h3 className="text-sm font-bold text-foreground">Tamaño de texto</h3>
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">Nivel {textSizeLevel}</p>
          <p className="text-xs text-muted">Aumenta el tamaño de los textos</p>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: maxTextSizeLevel }, (_, i) => (
              <span key={i} className={`h-1.5 w-8 rounded-full ${i < textSizeLevel ? 'bg-primary/100' : 'bg-border'}`} />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={cycleTextSizeLevel}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-black text-blue-600 transition hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-primary/15"
          aria-label={`Nivel ${textSizeLevel} de ${maxTextSizeLevel}`}
        >
          Tt
        </button>
      </div>
    </motion.div>
  );
}

export default Configuraciones;
