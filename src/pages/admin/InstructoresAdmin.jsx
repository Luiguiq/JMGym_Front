import { useState, useEffect, useMemo } from 'react';
import { X, Search, AlertTriangle, User, Trash2 } from 'lucide-react';
import { instructorService } from '../../services/instructorService.js';
import InstructorForm from '../../components/admin/InstructorForm.jsx';
import { useToast } from '../../components/common/Toast.jsx';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';
const UPLOAD_URL = API_BASE.replace('/api', '');

const FILTER_OPTIONS = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'ACTIVO', label: 'Activos' },
  { value: 'INACTIVO', label: 'Inactivos' },
];

const DAYS = [
  { value: 'LUNES', label: 'Lunes' },
  { value: 'MARTES', label: 'Martes' },
  { value: 'MIERCOLES', label: 'Miércoles' },
  { value: 'JUEVES', label: 'Jueves' },
  { value: 'VIERNES', label: 'Viernes' },
  { value: 'SABADO', label: 'Sábado' },
  { value: 'DOMINGO', label: 'Domingo' },
];

const EMPTY_SCHEDULE = {
  dia: 'LUNES',
  hora_inicio: '08:00',
  hora_fin: '09:00',
};

function formatTime(value) {
  return value?.slice(0, 5) || '';
}

function getDayLabel(value) {
  return DAYS.find((day) => day.value === value)?.label || value;
}

function ScheduleModal({ instructor, onClose }) {
  const toast = useToast();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_SCHEDULE);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await instructorService.getSchedules(instructor.id_instructor);
      setSchedules(data ?? []);
    } catch (err) {
      toast.error(err?.message || 'Error al cargar horarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSchedules(); }, [instructor.id_instructor]);

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_SCHEDULE);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.hora_inicio >= form.hora_fin) {
      toast.error('La hora de inicio debe ser menor que la hora fin');
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await instructorService.updateSchedule(editingId, form);
        toast.success('Horario actualizado correctamente');
      } else {
        await instructorService.createSchedule(instructor.id_instructor, form);
        toast.success('Horario agregado correctamente');
      }
      resetForm();
      await loadSchedules();
    } catch (err) {
      toast.error(err?.message || 'Error al guardar horario');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule.id_horario);
    setForm({
      dia: schedule.dia,
      hora_inicio: formatTime(schedule.hora_inicio),
      hora_fin: formatTime(schedule.hora_fin),
    });
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm('¿Eliminar este horario?')) return;
    try {
      await instructorService.deleteSchedule(scheduleId);
      toast.success('Horario eliminado correctamente');
      if (editingId === scheduleId) resetForm();
      await loadSchedules();
    } catch (err) {
      toast.error(err?.message || 'Error al eliminar horario');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">Horario del instructor</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">{instructor.nombre_completo}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar horarios"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-88px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="grid gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-[1.2fr_1fr_1fr_auto]">
            <label className="text-xs font-black uppercase tracking-wide text-slate-500">
              Día
              <select
                value={form.dia}
                onChange={(event) => setForm((current) => ({ ...current, dia: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-[#004aab] focus:ring-2 focus:ring-blue-100"
              >
                {DAYS.map((day) => <option key={day.value} value={day.value}>{day.label}</option>)}
              </select>
            </label>
            <label className="text-xs font-black uppercase tracking-wide text-slate-500">
              Hora inicio
              <input
                type="time"
                value={form.hora_inicio}
                onChange={(event) => setForm((current) => ({ ...current, hora_inicio: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-[#004aab] focus:ring-2 focus:ring-blue-100"
                required
              />
            </label>
            <label className="text-xs font-black uppercase tracking-wide text-slate-500">
              Hora fin
              <input
                type="time"
                value={form.hora_fin}
                onChange={(event) => setForm((current) => ({ ...current, hora_fin: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-[#004aab] focus:ring-2 focus:ring-blue-100"
                required
              />
            </label>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#004aab] px-4 py-2.5 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Agregar'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="mt-5 overflow-x-auto rounded-3xl border border-slate-100">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Día</th>
                  <th className="px-4 py-3">Hora inicio</th>
                  <th className="px-4 py-3">Hora fin</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr><td colSpan="4" className="px-4 py-8 text-center font-bold text-slate-400">Cargando horarios...</td></tr>
                ) : schedules.length === 0 ? (
                  <tr><td colSpan="4" className="px-4 py-8 text-center font-bold text-slate-400">Este instructor no tiene horarios registrados.</td></tr>
                ) : schedules.map((schedule) => (
                  <tr key={schedule.id_horario}>
                    <td className="px-4 py-3 font-bold text-slate-800">{getDayLabel(schedule.dia)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatTime(schedule.hora_inicio)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatTime(schedule.hora_fin)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(schedule)}
                          className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-[#004aab] transition hover:bg-blue-100"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(schedule.id_horario)}
                          className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
                          aria-label="Eliminar horario"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function parseEspecialidades(raw) {
  if (!raw) return [];
  return raw
    .split(/[,;•·]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function InstructoresAdmin() {
  const toast = useToast();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const [showForm, setShowForm] = useState(false);
  const [editInstructor, setEditInstructor] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [scheduleInstructor, setScheduleInstructor] = useState(null);

  const loadInstructors = async () => {
    try {
      const data = await instructorService.getAll();
      setInstructors(data);
    } catch (err) {
      toast.error(err?.message || 'Error al cargar instructores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInstructors(); }, []);

  const filtered = useMemo(() => {
    let list = instructors;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.nombre_completo?.toLowerCase().includes(q) ||
          i.especialidad?.toLowerCase().includes(q)
      );
    }
    if (activeFilter !== 'TODOS') {
      list = list.filter((i) => i.estado === activeFilter);
    }
    return list;
  }, [instructors, search, activeFilter]);

  const handleSave = async (formData) => {
    try {
      if (editInstructor) {
        await instructorService.update(editInstructor.id_instructor, formData);
        toast.success('Instructor actualizado correctamente');
      } else {
        await instructorService.create(formData);
        toast.success('Instructor creado correctamente');
      }
      setShowForm(false);
      setEditInstructor(null);
      loadInstructors();
    } catch (err) {
      setShowForm(false);
      setEditInstructor(null);
      toast.error(err.message || 'Error al guardar instructor');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await instructorService.toggleStatus(id);
      toast.success('Estado del instructor actualizado');
      loadInstructors();
    } catch (err) {
      toast.error(err?.message || 'Error al cambiar estado');
    }
    setConfirmId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este instructor permanentemente?')) return;
    try {
      await instructorService.delete(id);
      toast.success('Instructor eliminado correctamente');
      loadInstructors();
    } catch (err) {
      toast.error(err?.message || 'Error al eliminar instructor');
    }
  };

  const getFotoUrl = (inst) => {
    if (!inst.foto) return null;
    return inst.foto.startsWith('http') ? inst.foto : `${UPLOAD_URL}${inst.foto}`;
  };

  const getClaseCount = (inst) => inst.cantidad_clases ?? inst.numero_clases ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004aab]" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Instructores</h1>
          <p className="text-sm text-slate-400 mt-0.5">{instructors.length} registrados</p>
        </div>
        <button
          onClick={() => { setEditInstructor(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-2xl bg-[#004aab] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:opacity-90 active:scale-[0.97]"
        >
          <span className="text-lg leading-none">+</span>
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      </div>

      {/* Search + Filter */}
      <div className="mb-5 flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar instructor..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#004aab] focus:ring-[3px] focus:ring-blue-100"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
              activeFilter !== 'TODOS'
                ? 'border-[#004aab] bg-blue-50 text-[#004aab]'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="20" y2="12" />
              <line x1="12" y1="18" x2="20" y2="18" />
            </svg>
          </button>

          {filterOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-20 w-44 rounded-2xl border border-slate-100 bg-white py-2 shadow-xl">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setActiveFilter(opt.value); setFilterOpen(false); }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold transition ${
                      activeFilter === opt.value
                        ? 'text-[#004aab] bg-blue-50'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                      activeFilter === opt.value
                        ? 'border-[#004aab] bg-[#004aab]'
                        : 'border-slate-300'
                    }`}>
                      {activeFilter === opt.value && (
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="white">
                          <path d="M4 8.5L2 6.5L1 7.5L4 10.5L10 3.5L9 2.5Z" />
                        </svg>
                      )}
                    </span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <InstructorForm
          initial={editInstructor}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditInstructor(null); }}
        />
      )}

      {scheduleInstructor && (
        <ScheduleModal
          instructor={scheduleInstructor}
          onClose={() => setScheduleInstructor(null)}
        />
      )}

      {/* Confirm deactivate modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">
              <AlertTriangle size={28} className="text-amber-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Cambiar estado</h3>
            <p className="mt-2 text-sm text-slate-500">
              ¿Estás seguro de cambiar el estado de este instructor?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 rounded-2xl border border-slate-200 py-3 font-bold text-sm text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleToggleStatus(confirmId)}
                className="flex-1 rounded-2xl bg-[#004aab] py-3 font-bold text-sm text-white transition hover:opacity-90"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-3xl bg-white border border-slate-100 p-10 text-center shadow-sm">
          <div className="text-5xl mb-4">
            {search || activeFilter !== 'TODOS' ? <Search size={48} className="mx-auto text-slate-300" /> : <User size={48} className="mx-auto text-slate-300" />}
          </div>
          <h3 className="text-lg font-bold text-slate-700">
            {search || activeFilter !== 'TODOS' ? 'Sin resultados' : 'No hay instructores'}
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            {search || activeFilter !== 'TODOS'
              ? 'Prueba con otros términos o filtros.'
              : 'Agrega el primer instructor para empezar.'}
          </p>
        </div>
      )}

      {/* Instructor cards */}
      <div className="space-y-4">
        {filtered.map((inst) => {
          const fotoUrl = getFotoUrl(inst);
          const especialidades = parseEspecialidades(inst.especialidad);
          const claseCount = getClaseCount(inst);
          const isActive = inst.estado === 'ACTIVO';

          return (
            <div
              key={inst.id_instructor}
              className="rounded-3xl bg-white border border-slate-100 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="shrink-0">
                  {fotoUrl ? (
                    <img
                      src={fotoUrl}
                      alt={inst.nombre_completo}
                      className="h-16 w-16 rounded-full object-cover border-2 border-slate-100 sm:h-20 sm:w-20"
                    />
                  ) : (
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#004aab] to-blue-400 text-white font-black text-lg sm:text-xl border-2 border-slate-100">
                      {getInitials(inst.nombre_completo)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-800 truncate">
                      {inst.nombre_completo}
                    </h3>
                    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  {/* Especialidades */}
                  {especialidades.length > 0 && (
                    <p className="mt-1.5 text-sm text-slate-500 font-medium truncate">
                      {especialidades.join(' • ')}
                    </p>
                  )}

                  {/* Clases count */}
                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#004aab]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {claseCount} clase{claseCount !== 1 ? 's' : ''}
                  </div>

                  {/* Phone */}
                  {inst.telefono && (
                    <p className="mt-1.5 text-xs text-slate-400">{inst.telefono}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                <button
                  onClick={() => { setEditInstructor(inst); setShowForm(true); }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-50 py-2.5 text-xs font-bold text-[#004aab] transition hover:bg-brand-100 active:scale-[0.97]"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                  Editar
                </button>

                <button
                  onClick={() => setScheduleInstructor(inst)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-50 py-2.5 text-xs font-bold text-[#004aab] transition hover:bg-brand-100 active:scale-[0.97]"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Horario
                </button>

                <button
                  onClick={() => setConfirmId(inst.id_instructor)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-100 active:scale-[0.97]"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  {isActive ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
