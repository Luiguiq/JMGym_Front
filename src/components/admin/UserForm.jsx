import { useState, useEffect } from 'react';
import { DNI_ERROR_MESSAGE, isValidDni, sanitizeDni } from '../../utils/dni.js';

export default function UserForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    nombre_completo: '',
    dni: '',
    correo: '',
    telefono: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

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
    setForm((prev) => ({ ...prev, [name]: name === 'dni' ? sanitizeDni(value) : value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidDni(form.dni)) {
      setErrors((prev) => ({ ...prev, dni: DNI_ERROR_MESSAGE }));
      return;
    }
    const payload = { ...form };
    if (initial && !payload.password) {
      delete payload.password;
    }
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-card rounded-xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
          {initial ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Nombre Completo *</label>
            <input
              type="text"
              name="nombre_completo"
              value={form.nombre_completo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">DNI *</label>
            <input
              type="text"
              name="dni"
              value={form.dni}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]{8}"
              maxLength={8}
              aria-invalid={!!errors.dni}
              aria-describedby={errors.dni ? 'admin-user-dni-error' : undefined}
              required
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400 ${errors.dni ? 'border-red-500' : 'border-border'}`}
            />
            {errors.dni && <p id="admin-user-dni-error" className="mt-1 text-xs font-semibold text-red-500" role="alert">{errors.dni}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Correo *</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Contraseña {initial ? '(dejar vacío para mantener)' : '*'}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required={!initial}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-secondary bg-border-light rounded-lg hover:bg-border"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-brand-400 rounded-lg hover:bg-brand-500"
            >
              {initial ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
