import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';
const UPLOAD_URL = API_BASE.replace('/api', '');

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
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState('');
  const [uploading, setUploading] = useState(false);

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
      if (initial.foto) {
        setFotoPreview(initial.foto.startsWith('http') ? initial.foto : `${UPLOAD_URL}${initial.foto}`);
      }
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const uploadFoto = async () => {
    if (!fotoFile) return form.foto;
    const formData = new FormData();
    formData.append('file', fotoFile);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Error al subir la imagen');
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const fotoUrl = await uploadFoto();
      onSave({ ...form, foto: fotoUrl });
    } catch (err) {
      onSave(form);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-card rounded-xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
          {initial ? 'Editar Instructor' : 'Nuevo Instructor'}
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
            <label className="block text-sm font-medium text-secondary mb-1">Especialidad</label>
            <input
              type="text"
              name="especialidad"
              value={form.especialidad}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Biografía</label>
            <textarea
              name="biografia"
              value={form.biografia}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Foto</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFotoChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-700 file:font-medium hover:file:bg-brand-100"
            />
            {fotoPreview && (
              <div className="mt-2">
                <img src={fotoPreview} alt="Vista previa" className="w-24 h-24 object-cover rounded-lg border" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Video Presentación (URL)</label>
            <input
              type="text"
              name="video_presentacion"
              value={form.video_presentacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          {initial && (
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
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
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-secondary bg-border-light rounded-lg hover:bg-border disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-brand-400 rounded-lg hover:bg-brand-500 disabled:opacity-50"
            >
              {uploading ? 'Subiendo imagen...' : initial ? 'Guardar Cambios' : 'Crear Instructor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
