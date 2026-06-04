import { useState, useEffect } from 'react';

export default function InstructorForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    nombre_completo: '',
    telefono: '',
    especialidad: '',
    biografia: '',
    foto: '',
    video_presentacion: '',
    estado: 'ACTIVO',
  });

  useEffect(() => {
    if (initial) {
      setForm({
        nombre_completo: initial.nombre_completo || '',
        telefono: initial.telefono || '',
        especialidad: initial.especialidad || '',
        biografia: initial.biografia || '',
        foto: initial.foto || '',
        video_presentacion: initial.video_presentacion || '',
        estado: initial.estado || 'ACTIVO',
      });
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">
          {initial ? 'Editar Instructor' : 'Nuevo Instructor'}
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Especialidad</label>
            <input
              type="text"
              name="especialidad"
              value={form.especialidad}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Biografía</label>
            <textarea
              name="biografia"
              value={form.biografia}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Foto (URL)</label>
            <input
              type="text"
              name="foto"
              value={form.foto}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Video Presentación (URL)</label>
            <input
              type="text"
              name="video_presentacion"
              value={form.video_presentacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          {initial && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </div>
          )}
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
              {initial ? 'Guardar Cambios' : 'Crear Instructor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
