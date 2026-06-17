import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Plus, Search, Trash2, X } from 'lucide-react';
import ClassTable from '../../components/admin/ClassTable';
import ClassForm from '../../components/admin/ClassForm';
import Loader from '../../components/admin/Loader';
import { classService } from '../../services/classService';

const ClasesAdmin = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [showForm, setShowForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [searchTerm, statusFilter, classes]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const data = await classService.getAllForAdmin();
      setClasses(data);
    } catch (error) {
      console.error('Error cargando clases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterClasses = () => {
    let filtered = classes;

    if (searchTerm) {
      filtered = filtered.filter(
        (clase) =>
          clase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          clase.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'todas') {
      filtered = filtered.filter((clase) => clase.status === statusFilter);
    }

    setFilteredClasses(filtered);
    setCurrentPage(1);
  };

  const handleCreateClass = async (formData) => {
    try {
      setLoading(true);
      await classService.createClass(formData);
      await loadClasses();
      setShowForm(false);
    } catch (error) {
      console.error('Error creando clase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClass = async (formData) => {
    try {
      setLoading(true);
      await classService.updateClass(selectedClass.id, formData);
      await loadClasses();
      setSelectedClass(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error actualizando clase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = (clase) => {
    setDeleteTarget(clase);
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setDeleteError('');
      await classService.deleteClass(deleteTarget.id);
      await loadClasses();
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error eliminando clase:', error);
      setDeleteError(error.message || 'No se pudo eliminar la clase');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClass = (clase) => {
    setSelectedClass(clase);
    setShowForm(true);
  };

  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Gestión de Clases</h1>
          <p className="text-slate-600 text-sm mt-1">Administra todas las clases disponibles</p>
        </div>
        <button
          onClick={() => {
            setSelectedClass(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-medium hover:shadow-lg transition-shadow w-full md:w-auto"
        >
          <Plus size={20} />
          Nueva Clase
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="todas">Todas las clases</option>
          <option value="activa">Activas</option>
          <option value="pausada">Pausadas</option>
          <option value="inactiva">Inactivas</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-6 shadow-md">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size="md" text="Cargando clases..." />
          </div>
        ) : (
          <ClassTable
            data={paginatedClasses}
            onEdit={handleEditClass}
            onDelete={(id) => handleDeleteClass(classes.find((clase) => clase.id === id))}
            pagination={{
              page: currentPage,
              total: filteredClasses.length,
              pageSize,
            }}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {showForm && (
        <ClassForm
          initialData={selectedClass}
          onSubmit={selectedClass ? handleUpdateClass : handleCreateClass}
          onClose={() => {
            setShowForm(false);
            setSelectedClass(null);
          }}
          loading={loading}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-red-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Eliminar clase</h2>
                  <p className="text-sm text-slate-500">Esta accion no se puede deshacer.</p>
                </div>
              </div>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Vas a eliminar:</p>
              <p className="mt-1 font-bold text-slate-900">{deleteTarget.name}</p>
              <p className="text-sm text-slate-500">{deleteTarget.instructor} - {deleteTarget.schedule}</p>
            </div>

            {deleteError && (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 disabled:opacity-60"
              >
                <Trash2 size={18} />
                {deleting ? 'Eliminando...' : 'Si, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClasesAdmin;
