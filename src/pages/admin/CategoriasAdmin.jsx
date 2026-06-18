import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { genreService } from '../../services/genreService.js';
import Loader from '../../components/admin/Loader.jsx';

function CategoriasAdmin() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editGenre, setEditGenre] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const nameRef = useRef(null);

  const loadGenres = async () => {
    try {
      const data = await genreService.getAll();
      setGenres(data);
    } catch {
      setAlert({ type: 'error', message: 'Error al cargar categorías' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGenres(); }, []);

  useEffect(() => {
    if (showForm && nameRef.current) {
      nameRef.current.focus();
    }
  }, [showForm]);

  const filtered = genres.filter((g) =>
    g.nombre_genero.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditGenre(null);
    setShowForm(true);
  };

  const handleOpenEdit = (genre) => {
    setEditGenre(genre);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const nombre_genero = form.nombre_genero.value.trim();
    const descripcion = form.descripcion.value.trim();
    const estado = editGenre ? form.estado.value : 'ACTIVO';

    if (!nombre_genero) {
      setAlert({ type: 'error', message: 'El nombre de la categoría es obligatorio' });
      return;
    }

    setSaving(true);
    try {
      if (editGenre) {
        await genreService.update(editGenre.id_genero, { nombre_genero, descripcion, estado });
        setAlert({ type: 'success', message: 'Categoría actualizada correctamente' });
      } else {
        await genreService.create({ nombre_genero, descripcion });
        setAlert({ type: 'success', message: 'Categoría creada correctamente' });
      }
      setShowForm(false);
      setEditGenre(null);
      loadGenres();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error al guardar la categoría' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await genreService.delete(deleteTarget.id_genero);
      setAlert({ type: 'success', message: 'Categoría eliminada correctamente' });
      setDeleteTarget(null);
      loadGenres();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Error al eliminar la categoría' });
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6" role="region" aria-label="Gestión de categorías">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Gestión de Categorías</h1>
          <p className="text-slate-600 text-sm mt-1">Administra los géneros y tipos de clases</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-medium hover:shadow-lg transition-shadow w-full sm:w-auto"
        >
          <Plus size={20} aria-hidden="true" />
          Nueva Categoría
        </button>
      </div>

      {alert && (
        <div
          role="alert"
          className={`flex items-center justify-between gap-3 p-4 rounded-xl text-sm font-medium ${
            alert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          <span>{alert.message}</span>
          <button onClick={() => setAlert(null)} className="text-current opacity-60 hover:opacity-100 flex-shrink-0" aria-label="Cerrar mensaje">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
        <input
          type="text"
          aria-label="Buscar categorías por nombre"
          placeholder="Buscar categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size="md" text="Cargando categorías..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertTriangle size={48} className="text-slate-300" aria-hidden="true" />
            <p className="text-lg font-bold text-slate-500">
              {search ? 'Sin resultados' : 'No hay categorías registradas'}
            </p>
            <p className="text-sm text-slate-400">
              {search ? 'Intenta con otro término de búsqueda' : 'Crea una nueva categoría para empezar'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th scope="col" className="text-left px-6 py-3 font-semibold text-slate-900">Nombre</th>
                  <th scope="col" className="text-left px-6 py-3 font-semibold text-slate-900 hidden sm:table-cell">Descripción</th>
                  <th scope="col" className="text-center px-6 py-3 font-semibold text-slate-900">Estado</th>
                  <th scope="col" className="text-center px-6 py-3 font-semibold text-slate-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((g) => (
                  <tr key={g.id_genero} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{g.nombre_genero}</td>
                    <td className="px-6 py-4 text-slate-600 hidden sm:table-cell">{g.descripcion || '—'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        g.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {g.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(g)}
                          className="p-2 hover:bg-brand-50 text-brand-600 rounded-lg transition-colors"
                          aria-label={`Editar categoría ${g.nombre_genero}`}
                        >
                          <Edit2 size={16} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(g)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          aria-label={`Eliminar categoría ${g.nombre_genero}`}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowForm(false); setEditGenre(null); } }}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="categoria-form-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 id="categoria-form-title" className="text-lg font-bold text-slate-900">
                {editGenre ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <button
                onClick={() => { setShowForm(false); setEditGenre(null); }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Cerrar formulario"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label htmlFor="categoria-nombre" className="block text-sm font-semibold text-slate-900 mb-2">
                  Nombre <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  ref={nameRef}
                  id="categoria-nombre"
                  type="text"
                  name="nombre_genero"
                  defaultValue={editGenre?.nombre_genero || ''}
                  required
                  aria-required="true"
                  placeholder="ej: Yoga, Pilates, CrossFit"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label htmlFor="categoria-descripcion" className="block text-sm font-semibold text-slate-900 mb-2">
                  Descripción <span className="text-slate-400 text-xs font-normal">(opcional)</span>
                </label>
                <textarea
                  id="categoria-descripcion"
                  name="descripcion"
                  rows={3}
                  defaultValue={editGenre?.descripcion || ''}
                  placeholder="Describe brevemente esta categoría..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              {editGenre && (
                <div>
                  <label htmlFor="categoria-estado" className="block text-sm font-semibold text-slate-900 mb-2">Estado</label>
                  <select
                    id="categoria-estado"
                    name="estado"
                    defaultValue={editGenre.estado || 'ACTIVO'}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditGenre(null); }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : editGenre ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}
        >
          <div
            className="w-full max-w-sm rounded-[28px] bg-white shadow-2xl"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-categoria-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100 shadow-inner">
                <AlertTriangle className="w-7 h-7 text-red-500" aria-hidden="true" />
              </div>
              <h2 id="delete-categoria-title" className="text-xl font-black text-slate-900">Eliminar categoría</h2>
              <p className="mt-2 text-sm text-slate-500">
                ¿Estás seguro de eliminar <strong>{deleteTarget.nombre_genero}</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border-2 border-slate-100 py-3 font-bold text-slate-600 text-sm hover:bg-slate-50 transition-colors disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3 font-bold text-white text-sm hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-60 shadow-lg shadow-red-200"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriasAdmin;
