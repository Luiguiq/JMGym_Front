import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowLeft, MapPin, Info } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [correo, setCorreo] = useState('admin@jmgym.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin({ correo_institucional: correo, password });
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setCorreo('admin@jmgym.com');
    setPassword('admin123');
    setError('');
    setLoading(true);

    try {
      await adminLogin({ correo_institucional: correo, password });
      window.location.href = '/admin';
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
      <button
        onClick={() => navigate('/')}
        className="fixed left-4 top-4 z-10 flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary bg-primary-foreground/80 backdrop-blur-sm rounded-xl shadow-sm hover:bg-card transition-colors md:left-6 md:top-6"
        aria-label="Volver al inicio"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">Volver</span>
      </button>

      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-3xl">JM</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">JM Gym</h1>
            <p className="text-secondary">Panel de Administración</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Correo Institucional
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="admin@jmgym.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 mt-6"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full mt-3 bg-border-light text-secondary py-3 rounded-xl font-semibold hover:bg-border transition-colors disabled:opacity-50"
          >
            Acceso Demo (Rápido)
          </button>

          <div className="mt-6 p-4 bg-surface rounded-xl border border-border">
            <p className="text-xs text-secondary font-semibold mb-2"><MapPin size={14} className="inline" /> Credenciales Demo:</p>
            <p className="text-xs text-secondary">
              <strong>Email:</strong> admin@jmgym.com
            </p>
            <p className="text-xs text-secondary">
              <strong>Password:</strong> admin123
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-6 text-center">
          <p className="text-sm text-secondary">
            <Info size={16} className="inline" /> <strong>Frontend conectado</strong> - Datos desde la API
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
