import { useState, useEffect } from 'react';
import { userService } from '../../services/userService.js';
import UserForm from '../../components/admin/UserForm.jsx';

export default function UsuariosAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showHistory, setShowHistory] = useState(null);
  const [history, setHistory] = useState([]);
  const [alert, setAlert] = useState(null);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch {
      setAlert({ type: 'error', message: 'Error al cargar usuarios' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = users.filter((u) => {
    const term = search.toLowerCase();
    const matchesSearch = u.nombre_completo.toLowerCase().includes(term) || u.correo.toLowerCase().includes(term) || u.dni.includes(term);
    const matchesFilter = filter === 'todos' || (filter === 'activos' && u.estado === 'ACTIVO') || (filter === 'bloqueados' && u.estado === 'BLOQUEADO');
    return matchesSearch && matchesFilter;
  });

  const handleSave = async (formData) => {
    try {
      if (editUser) {
        await userService.update(editUser.id_usuario, formData);
        setAlert({ type: 'success', message: 'Usuario actualizado correctamente' });
      } else {
        await userService.registerByAdmin(formData);
        setAlert({ type: 'success', message: 'Usuario creado correctamente' });
      }
      setShowForm(false);
      setEditUser(null);
      loadUsers();
    } catch (err) {
      setShowForm(false);
      setEditUser(null);
      setAlert({ type: 'error', message: err.message || 'Error al guardar usuario' });
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      await userService.toggleBlock(id);
      setAlert({ type: 'success', message: 'Estado de usuario actualizado' });
      loadUsers();
    } catch {
      setAlert({ type: 'error', message: 'Error al cambiar estado' });
    }
  };

  const handleShowHistory = async (user) => {
    try {
      const data = await userService.getReservations(user.id_usuario);
      setHistory(data);
      setShowHistory(user);
    } catch {
      setAlert({ type: 'error', message: 'Error al cargar historial' });
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-ES') : '—';
  const formatDateTime = (d) => d ? new Date(d).toLocaleString('es-ES') : '—';

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
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Usuarios</h1>
        <button
          onClick={() => { setEditUser(null); setShowForm(true); }}
          className="px-4 py-2 text-sm font-medium text-primary-foreground bg-brand-400 rounded-lg hover:bg-brand-500 w-full sm:w-auto"
        >
          + Nuevo Usuario
        </button>
      </div>

      {alert && (
        <div role="alert" className={`mb-4 p-3 rounded-lg text-sm font-medium flex items-center justify-between ${alert.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300'}`}>
          <span>{alert.message}</span>
          <button className="text-current opacity-60 hover:opacity-100 flex-shrink-0 ml-3" onClick={() => setAlert(null)} aria-label="Cerrar mensaje">×</button>
        </div>
      )}

      {showForm && (
        <UserForm
          initial={editUser}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditUser(null); }}
        />
      )}

      {showHistory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowHistory(null); }}
        >
          <div
            className="w-full max-w-2xl bg-card rounded-xl shadow-xl p-4 sm:p-6 max-h-[80vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-modal-title"
          >
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 id="history-modal-title" className="text-base sm:text-lg font-bold text-foreground truncate">
                Historial de {showHistory.nombre_completo}
              </h2>
              <button onClick={() => setShowHistory(null)} className="text-muted-foreground hover:text-secondary text-xl flex-shrink-0 p-1" aria-label="Cerrar historial">×</button>
            </div>
            {history.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Sin reservas registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[480px]">
                  <thead>
                    <tr className="bg-surface text-secondary uppercase text-xs tracking-wider">
                      <th scope="col" className="text-left px-3 py-2">#</th>
                      <th scope="col" className="text-left px-3 py-2">Fecha Reserva</th>
                      <th scope="col" className="text-left px-3 py-2">Fecha Clase</th>
                      <th scope="col" className="text-center px-3 py-2">Estado</th>
                      <th scope="col" className="text-right px-3 py-2">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {history.map((r) => (
                      <tr key={r.id_reserva} className="hover:bg-surface">
                        <td className="px-3 py-2 text-secondary">{r.id_reserva}</td>
                        <td className="px-3 py-2 text-secondary">{formatDateTime(r.fecha_reserva)}</td>
                        <td className="px-3 py-2">{r.fecha_clase ? formatDate(r.fecha_clase) : '—'}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${r.estado_reserva === 'CONFIRMADA' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'}`}>
                            {r.estado_reserva}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right text-secondary">S/ {r.monto?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-border-light flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            aria-label="Buscar usuarios por nombre, correo o DNI"
            placeholder="Buscar por nombre, correo o DNI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 border border-border bg-card text-foreground placeholder:text-muted-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <select
            aria-label="Filtrar por estado de usuario"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="todos">Todos</option>
            <option value="activos">Activos</option>
            <option value="bloqueados">Bloqueados</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-surface text-secondary uppercase text-xs tracking-wider">
                <th scope="col" className="text-left px-4 py-3">Nombre</th>
                <th scope="col" className="text-left px-4 py-3">DNI</th>
                <th scope="col" className="text-left px-4 py-3">Correo</th>
                <th scope="col" className="text-left px-4 py-3">Teléfono</th>
                <th scope="col" className="text-center px-4 py-3">Estado</th>
                <th scope="col" className="text-center px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filtered.map((u) => (
                <tr key={u.id_usuario} className="hover:bg-surface">
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{u.nombre_completo}</td>
                  <td className="px-4 py-3 text-secondary whitespace-nowrap">{u.dni}</td>
                  <td className="px-4 py-3 text-secondary">{u.correo}</td>
                  <td className="px-4 py-3 text-secondary">{u.telefono || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${u.estado === 'ACTIVO' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300'}`}>
                      {u.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => { setEditUser(u); setShowForm(true); }}
                      className="text-brand-500 hover:text-brand-600 font-medium mr-2 sm:mr-3"
                      aria-label={`Editar usuario ${u.nombre_completo}`}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleBlock(u.id_usuario)}
                      className={`font-medium mr-2 sm:mr-3 ${u.estado === 'ACTIVO' ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}`}
                      aria-label={u.estado === 'ACTIVO' ? `Bloquear usuario ${u.nombre_completo}` : `Desbloquear usuario ${u.nombre_completo}`}
                    >
                      {u.estado === 'ACTIVO' ? 'Bloquear' : 'Desbloquear'}
                    </button>
                    <button
                      onClick={() => handleShowHistory(u)}
                      className="text-muted hover:text-secondary font-medium"
                      aria-label={`Ver historial de ${u.nombre_completo}`}
                    >
                      Historial
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron usuarios
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
