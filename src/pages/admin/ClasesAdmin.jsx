import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Plus, Search, Trash2, X } from 'lucide-react';
import ClassTable from '../../components/admin/ClassTable';
import ClassForm from '../../components/admin/ClassForm';
import Loader from '../../components/admin/Loader';
import { classService } from '../../services/classService';
import { reservationService } from '../../services/reservationService';
import { notificationService } from '../../services/notificationService';

const ClasesAdmin = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [showForm, setShowForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [usersModalClass, setUsersModalClass] = useState(null);
  const [classUsers, setClassUsers] = useState([]);
  const [loadingClassUsers, setLoadingClassUsers] = useState(false);
  const [classUsersError, setClassUsersError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showCancelClassModal, setShowCancelClassModal] = useState(false);
  const [cancelClassTarget, setCancelClassTarget] = useState(null);
  const [cancelingClass, setCancelingClass] = useState(false);
  const [cancelClassError, setCancelClassError] = useState('');
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
      const [classesData, reservationsData] = await Promise.all([
        classService.getAllForAdmin(),
        reservationService.getAllReservations(),
      ]);

      const enrolledByClass = reservationsData.reduce((acc, reservation) => {
        if (reservation.estado_reserva !== 'ACTIVA') return acc;

        acc[reservation.id_clase] = (acc[reservation.id_clase] || 0) + 1;
        return acc;
      }, {});

      setClasses(
        classesData.map((clase) => ({
          ...clase,
          enrolled: enrolledByClass[clase.id] || 0,
        }))
      );
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

  async function notifyUsersOnClassChange(classId, oldData, newData) {
    const cambios = [];
    if (oldData.instructor !== newData.instructor && newData.instructor) cambios.push('instructor');
    if (oldData.hora_inicio !== newData.hora_inicio && newData.hora_inicio) cambios.push('horario');
    if (oldData.fecha !== newData.fecha && newData.fecha) cambios.push('fecha');
    if (cambios.length === 0) return;

    try {
      const reservations = await reservationService.getAllReservations();
      const activeUsers = reservations
        .filter((r) => r.id_clase === classId && r.estado_reserva === 'ACTIVA' && r.id_usuario);

      if (activeUsers.length === 0) return;

      const cambiosStr = cambios.join(', ');
      for (const reservation of activeUsers) {
        await notificationService.sendNotification({
          titulo: `Cambio en tu clase "${oldData.name}"`,
          mensaje: `La clase ha cambiado su ${cambiosStr}. Revisa los nuevos detalles y confirma si deseas continuar con la reserva o cancelarla.`,
          tipo: 'CAMBIO_HORARIO',
          all_users: false,
          user_ids: [reservation.id_usuario],
          class_id: classId,
          requiere_respuesta: true,
        });
      }
    } catch (err) {
      console.error('Error enviando notificaciones de cambio:', err);
    }
  }

  const handleUpdateClass = async (formData) => {
    try {
      setLoading(true);
      await classService.updateClass(selectedClass.id, formData);
      await notifyUsersOnClassChange(selectedClass.id, selectedClass, formData);
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
    if (clase.enrolled > 0) {
      setCancelClassTarget(clase);
      setShowCancelClassModal(true);
      setCancelClassError('');
    } else {
      setDeleteTarget(clase);
      setDeleteError('');
    }
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

  const handleCancelClass = async () => {
    if (!cancelClassTarget) return;
    try {
      setCancelingClass(true);
      setCancelClassError('');
      await classService.updateClass(cancelClassTarget.id, { estado: 'CANCELADA' });
      await loadClasses();
      setShowCancelClassModal(false);
      setCancelClassTarget(null);
    } catch (error) {
      setCancelClassError(error.message || 'Error al cancelar la clase');
    } finally {
      setCancelingClass(false);
    }
  };

  const handleHardDeleteWithNotify = async () => {
    if (!cancelClassTarget) return;
    try {
      setDeleting(true);
      setDeleteError('');
      await classService.deleteClass(cancelClassTarget.id);
      await loadClasses();
      setShowCancelClassModal(false);
      setCancelClassTarget(null);
    } catch (error) {
      setDeleteError(error.message || 'Error al eliminar la clase');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClass = (clase) => {
    setSelectedClass(clase);
    setShowForm(true);
  };

  const handleViewClassUsers = async (clase) => {
    setUsersModalClass(clase);
    setClassUsers([]);
    setClassUsersError('');
    setLoadingClassUsers(true);

    try {
      const reservations = await reservationService.getAllReservations();
      const users = reservations
        .filter((reservation) => reservation.id_clase === clase.id && reservation.estado_reserva === 'ACTIVA')
        .map((reservation) => reservation.usuarioNombre || reservation.userName)
        .filter(Boolean);

      setClassUsers([...new Set(users)]);
    } catch (error) {
      setClassUsersError(error?.message || 'Error cargando usuarios de la clase');
    } finally {
      setLoadingClassUsers(false);
    }
  };

  const handleCloseUsersModal = () => {
    setUsersModalClass(null);
    setClassUsers([]);
    setClassUsersError('');
  };

  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Gestión de Clases</h1>
          <p className="text-secondary text-sm mt-1">Administra todas las clases disponibles</p>
        </div>
        <button
          onClick={() => {
            setSelectedClass(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-medium hover:shadow-lg transition-shadow w-full md:w-auto"
        >
          <Plus size={20} />
          Nueva Clase
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre o instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="todas">Todas las clases</option>
          <option value="activa">Activas</option>
          <option value="pausada">Pausadas</option>
          <option value="inactiva">Inactivas</option>
        </select>
      </div>

      <div className="bg-card rounded-2xl border border-border p-3 sm:p-6 shadow-md">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size="md" text="Cargando clases..." />
          </div>
        ) : (
          <ClassTable
            data={paginatedClasses}
            onEdit={handleEditClass}
            onViewUsers={handleViewClassUsers}
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

      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget && !deleting) setDeleteTarget(null); }}
        >
          <div
            className="bg-card rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <div className="border-b border-border px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
                  <AlertTriangle size={20} className="text-red-600 dark:text-red-300" />
                </div>
                <div>
                  <h2 id="delete-modal-title" className="text-lg font-bold text-foreground">Eliminar clase</h2>
                  <p className="text-sm text-muted mt-1">{deleteTarget.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="text-muted-foreground hover:text-secondary transition-colors"
                aria-label="Cerrar"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm text-secondary">
                ¿Estás seguro de eliminar esta clase? Esta acción no se puede deshacer.
              </p>

              {deleteError && (
                <div className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 dark:bg-red-500/10 dark:text-red-300" role="alert">
                  {deleteError}
                </div>
              )}

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold text-secondary transition hover:bg-surface disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelClassModal && cancelClassTarget && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget && !cancelingClass && !deleting) { setShowCancelClassModal(false); setCancelClassTarget(null); } }}
        >
          <div
            className="bg-card rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
          >
            <div className="border-b border-border px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/10">
                  <AlertTriangle size={20} className="text-amber-600 dark:text-amber-300" />
                </div>
                <div>
                  <h2 id="cancel-modal-title" className="text-lg font-bold text-foreground">{cancelClassTarget.name}</h2>
                  <p className="text-sm text-muted mt-1">{cancelClassTarget.enrolled} alumno(s) inscritos</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowCancelClassModal(false); setCancelClassTarget(null); }}
                disabled={cancelingClass || deleting}
                className="text-muted-foreground hover:text-secondary transition-colors"
                aria-label="Cerrar"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-secondary">
                Esta clase tiene alumnos inscritos. Elige qué acción realizar:
              </p>

              {cancelClassError && (
                <div className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 dark:bg-red-500/10 dark:text-red-300" role="alert">
                  {cancelClassError}
                </div>
              )}

              <button
                type="button"
                onClick={handleCancelClass}
                disabled={cancelingClass || deleting}
                className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-primary-foreground transition hover:bg-amber-600 disabled:opacity-50 text-left px-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <p className="font-bold">Cancelar clase</p>
                    <p className="text-xs text-primary-foreground/80">Los alumnos recibirán una notificación y podrán solicitar reembolso</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleHardDeleteWithNotify}
                disabled={cancelingClass || deleting}
                className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-primary-foreground transition hover:bg-red-700 disabled:opacity-50 text-left px-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20">
                    <Trash2 size={18} />
                  </div>
                  <div>
                    <p className="font-bold">Eliminar clase</p>
                    <p className="text-xs text-primary-foreground/80">Se notificará a los alumnos que pueden solicitar reembolso</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { setShowCancelClassModal(false); setCancelClassTarget(null); }}
                disabled={cancelingClass || deleting}
                className="w-full rounded-xl border border-border py-3 text-sm font-bold text-secondary transition hover:bg-surface disabled:opacity-50"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {usersModalClass && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseUsersModal(); }}
        >
          <div
            className="bg-card rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="users-modal-title"
          >
            <div className="border-b border-border px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="users-modal-title" className="text-lg font-bold text-foreground">Usuarios de la clase</h2>
                <p className="text-sm text-muted mt-1">{usersModalClass.name}</p>
              </div>
              <button
                type="button"
                onClick={handleCloseUsersModal}
                className="text-muted-foreground hover:text-secondary transition-colors"
                aria-label="Cerrar usuarios de la clase"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="p-5">
              {loadingClassUsers ? (
                <div className="flex justify-center py-8">
                  <Loader size="sm" text="Cargando usuarios..." />
                </div>
              ) : classUsersError ? (
                <p className="text-sm text-red-600" role="alert">{classUsersError}</p>
              ) : classUsers.length > 0 ? (
                <ul className="divide-y divide-border-light rounded-xl border border-border-light overflow-hidden">
                  {classUsers.map((userName) => (
                    <li key={userName} className="px-4 py-3 text-sm font-medium text-foreground">
                      {userName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-secondary">No hay usuarios registrados para esta clase.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClasesAdmin;
