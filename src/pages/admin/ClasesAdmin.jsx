import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
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

  const handleDeleteClass = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta clase?')) {
      try {
        await classService.deleteClass(id);
        await loadClasses();
      } catch (error) {
        console.error('Error eliminando clase:', error);
      }
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
            onDelete={handleDeleteClass}
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
    </div>
  );
};

export default ClasesAdmin;
