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
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Usuarios</h1>
        <button
          onClick={() => { setEditUser(null); setShowForm(true); }}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-400 rounded-lg hover:bg-brand-500 w-full sm:w-auto"
        >
          + Nuevo Usuario
        </button>
      </div>

      {alert && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${alert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {alert.message}
          <button className="float-right" onClick={() => setAlert(null)}>×</button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 truncate">
                Historial de {showHistory.nombre_completo}
              </h2>
              <button onClick={() => setShowHistory(null)} className="text-slate-400 hover:text-slate-600 text-xl flex-shrink-0">×</button>
            </div>
            {history.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Sin reservas registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[480px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
                      <th className="text-left px-3 py-2">#</th>
                      <th className="text-left px-3 py-2">Fecha Reserva</th>
                      <th className="text-left px-3 py-2">Fecha Clase</th>
                      <th className="text-center px-3 py-2">Estado</th>
                      <th className="text-right px-3 py-2">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((r) => (
                      <tr key={r.id_reserva} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-slate-600">{r.id_reserva}</td>
                        <td className="px-3 py-2 text-slate-600">{formatDateTime(r.fecha_reserva)}</td>
                        <td className="px-3 py-2">{r.fecha_clase ? formatDate(r.fecha_clase) : '—'}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${r.estado_reserva === 'CONFIRMADA' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {r.estado_reserva}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right text-slate-600">S/ {r.monto?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre, correo o DNI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="todos">Todos</option>
            <option value="activos">Activos</option>
            <option value="bloqueados">Bloqueados</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">DNI</th>
                <th className="text-left px-4 py-3">Correo</th>
                <th className="text-left px-4 py-3">Teléfono</th>
                <th className="text-center px-4 py-3">Estado</th>
                <th className="text-center px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id_usuario} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{u.nombre_completo}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{u.dni}</td>
                  <td className="px-4 py-3 text-slate-600">{u.correo}</td>
                  <td className="px-4 py-3 text-slate-600">{u.telefono || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${u.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => { setEditUser(u); setShowForm(true); }}
                      className="text-brand-500 hover:text-brand-600 font-medium mr-2 sm:mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleBlock(u.id_usuario)}
                      className={`font-medium mr-2 sm:mr-3 ${u.estado === 'ACTIVO' ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}`}
                    >
                      {u.estado === 'ACTIVO' ? 'Bloquear' : 'Desbloquear'}
                    </button>
                    <button
                      onClick={() => handleShowHistory(u)}
                      className="text-slate-500 hover:text-slate-700 font-medium"
                    >
                      Historial
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
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
