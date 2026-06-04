import { useState, useEffect } from 'react';
import { instructorService } from '../../services/instructorService.js';
import InstructorForm from '../../components/admin/InstructorForm.jsx';

export default function InstructoresAdmin() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editInstructor, setEditInstructor] = useState(null);
  const [alert, setAlert] = useState(null);

  const loadInstructors = async () => {
    try {
      const data = await instructorService.getAll();
      setInstructors(data);
    } catch {
      setAlert({ type: 'error', message: 'Error al cargar instructores' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInstructors(); }, []);

  const handleSave = async (formData) => {
    try {
      if (editInstructor) {
        await instructorService.update(editInstructor.id_instructor, formData);
        setAlert({ type: 'success', message: 'Instructor actualizado correctamente' });
      } else {
        await instructorService.create(formData);
        setAlert({ type: 'success', message: 'Instructor creado correctamente' });
      }
      setShowForm(false);
      setEditInstructor(null);
      loadInstructors();
    } catch (err) {
      setShowForm(false);
      setEditInstructor(null);
      setAlert({ type: 'error', message: err.message || 'Error al guardar instructor' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este instructor?')) return;
    try {
      await instructorService.delete(id);
      setAlert({ type: 'success', message: 'Instructor eliminado correctamente' });
      loadInstructors();
    } catch {
      setAlert({ type: 'error', message: 'Error al eliminar instructor' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Instructores</h1>
        <button
          onClick={() => { setEditInstructor(null); setShowForm(true); }}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-400 rounded-lg hover:bg-brand-500 w-full sm:w-auto"
        >
          + Nuevo Instructor
        </button>
      </div>

      {alert && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${alert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {alert.message}
          <button className="float-right" onClick={() => setAlert(null)}>×</button>
        </div>
      )}

      {showForm && (
        <InstructorForm
          initial={editInstructor}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditInstructor(null); }}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">Teléfono</th>
                <th className="text-left px-4 py-3">Especialidad</th>
                <th className="text-center px-4 py-3">Estado</th>
                <th className="text-center px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {instructors.map((inst) => (
                <tr key={inst.id_instructor} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{inst.nombre_completo}</td>
                  <td className="px-4 py-3 text-slate-600">{inst.telefono || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{inst.especialidad || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${inst.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {inst.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => { setEditInstructor(inst); setShowForm(true); }}
                      className="text-brand-500 hover:text-brand-600 font-medium mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(inst.id_instructor)}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {instructors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No hay instructores registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
