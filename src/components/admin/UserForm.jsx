import { useState, useEffect } from 'react';

export default function UserForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    nombre_completo: '',
    dni: '',
    correo: '',
    telefono: '',
    password: '',
  });

  useEffect(() => {
    if (initial) {
      setForm({
        nombre_completo: initial.nombre_completo || '',
        dni: initial.dni || '',
        correo: initial.correo || '',
        telefono: initial.telefono || '',
        password: '',
      });
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (initial && !payload.password) {
      delete payload.password;
    }
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">
          {initial ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo *</label>
            <input
              type="text"
              name="nombre_completo"
              value={form.nombre_completo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">DNI *</label>
            <input
              type="text"
              name="dni"
              value={form.dni}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo *</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña {initial ? '(dejar vacío para mantener)' : '*'}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required={!initial}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-400 rounded-lg hover:bg-brand-500"
            >
              {initial ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
