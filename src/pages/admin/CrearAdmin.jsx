import { useState } from 'react';
import { adminService } from '../../services/adminService.js';

export default function CrearAdmin() {
  const [form, setForm] = useState({ nombre: '', correo_institucional: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const result = await adminService.create(form);
      setAlert({ type: 'success', message: `Administrador "${result.nombre}" creado correctamente` });
      setForm({ nombre: '', correo_institucional: '', password: '' });
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error al crear administrador' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl mb-6">Crear Administrador</h1>

      {alert && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${alert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {alert.message}
          <button className="float-right" onClick={() => setAlert(null)}>×</button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Institucional *</label>
            <input
              type="email"
              name="correo_institucional"
              value={form.correo_institucional}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña *</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-brand-400 rounded-lg hover:bg-brand-500 disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Administrador'}
          </button>
        </form>
      </div>
    </div>
  );
}
