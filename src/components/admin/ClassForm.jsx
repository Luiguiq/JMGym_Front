import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ClassForm({ initialData = null, onSubmit }) {
  const navigate = useNavigate();
  const isEditing = Boolean(initialData);
  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    trainer: initialData?.trainer ?? '',
    time: initialData?.time ?? '',
    duration: initialData?.duration ?? '',
    level: initialData?.level ?? '',
    capacity: initialData?.capacity ?? '',
    description: initialData?.description ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit({ ...form, capacity: Number(form.capacity) });
      navigate('/admin/clases');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
      <h2 className="mb-6 text-2xl font-extrabold text-slate-800">{isEditing ? 'Editar clase' : 'Crear clase'}</h2>

      {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</div>}

      <div className="grid gap-4">
        <label className="grid gap-1 text-sm font-bold text-slate-500">
          Nombre
          <input className="min-h-12 rounded-xl border-2 border-brand-100 px-4 outline-none" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label className="grid gap-1 text-sm font-bold text-slate-500">
          Entrenador
          <input className="min-h-12 rounded-xl border-2 border-brand-100 px-4 outline-none" name="trainer" value={form.trainer} onChange={handleChange} required />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1 text-sm font-bold text-slate-500">
            Horario
            <input className="min-h-12 rounded-xl border-2 border-brand-100 px-4 outline-none" name="time" value={form.time} onChange={handleChange} placeholder="6:00 PM" required />
          </label>
          <label className="grid gap-1 text-sm font-bold text-slate-500">
            Duracion
            <input className="min-h-12 rounded-xl border-2 border-brand-100 px-4 outline-none" name="duration" value={form.duration} onChange={handleChange} placeholder="60 min" required />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1 text-sm font-bold text-slate-500">
            Nivel
            <input className="min-h-12 rounded-xl border-2 border-brand-100 px-4 outline-none" name="level" value={form.level} onChange={handleChange} placeholder="Moderado" required />
          </label>
          <label className="grid gap-1 text-sm font-bold text-slate-500">
            Capacidad
            <input className="min-h-12 rounded-xl border-2 border-brand-100 px-4 outline-none" name="capacity" type="number" value={form.capacity} onChange={handleChange} required />
          </label>
        </div>
        <label className="grid gap-1 text-sm font-bold text-slate-500">
          Descripcion
          <textarea className="min-h-20 rounded-xl border-2 border-brand-100 px-4 py-3 outline-none" name="description" value={form.description} onChange={handleChange} />
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="flex-1 min-h-12 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 font-extrabold text-white disabled:opacity-60" type="submit" disabled={loading}>
          {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear clase'}
        </button>
        <button className="min-h-12 rounded-xl border-2 border-slate-200 px-6 font-bold text-slate-500" type="button" onClick={() => navigate('/admin/clases')}>Cancelar</button>
      </div>
    </form>
  );
}

export default ClassForm;
