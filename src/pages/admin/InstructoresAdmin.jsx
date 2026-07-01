import { useState, useEffect, useMemo } from 'react';
import { X, Search, AlertTriangle, User } from 'lucide-react';
import { instructorService } from '../../services/instructorService.js';
import InstructorForm from '../../components/admin/InstructorForm.jsx';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';
const UPLOAD_URL = API_BASE.replace('/api', '');

const FILTER_OPTIONS = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'ACTIVO', label: 'Activos' },
  { value: 'INACTIVO', label: 'Inactivos' },
];

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
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const [showForm, setShowForm] = useState(false);
  const [editInstructor, setEditInstructor] = useState(null);
  const [alert, setAlert] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

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

  const handleToggleStatus = async (id) => {
    try {
      await instructorService.toggleStatus(id);
      setAlert({ type: 'success', message: 'Estado del instructor actualizado' });
      loadInstructors();
    } catch {
      setAlert({ type: 'error', message: 'Error al cambiar estado' });
    }
    setConfirmId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este instructor permanentemente?')) return;
    try {
      await instructorService.delete(id);
      setAlert({ type: 'success', message: 'Instructor eliminado correctamente' });
      loadInstructors();
    } catch {
      setAlert({ type: 'error', message: 'Error al eliminar instructor' });
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Instructores</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{instructors.length} registrados</p>
        </div>
        <button
          onClick={() => { setEditInstructor(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[0_16px_36px_rgba(37,99,235,0.22)] transition hover:opacity-90 active:scale-[0.97]"
        >
          <span className="text-lg leading-none">+</span>
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`mb-4 flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold shadow-sm ${
          alert.type === 'error'
            ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30'
        }`}>
          <span>{alert.message}</span>
          <button onClick={() => setAlert(null)} className="opacity-60 hover:opacity-100 ml-3"><X size={18} /></button>
        </div>
      )}

      {/* Search + Filter */}
      <div className="mb-5 flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar instructor..."
            className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-[3px] focus:ring-primary/20"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
              activeFilter !== 'TODOS'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-secondary hover:border-border'
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
              <div className="absolute right-0 top-full mt-2 z-20 w-44 rounded-2xl border border-border-light bg-card py-2 shadow-xl">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setActiveFilter(opt.value); setFilterOpen(false); }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold transition ${
                      activeFilter === opt.value
                        ? 'text-primary bg-primary/10'
                        : 'text-secondary hover:bg-surface'
                    }`}
                  >
                    <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                      activeFilter === opt.value
                        ? 'border-primary bg-primary'
                        : 'border-border'
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

      {/* Confirm deactivate modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[28px] bg-card p-6 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl dark:bg-amber-500/10">
              <AlertTriangle size={28} className="text-amber-600" />
            </div>
            <h3 className="text-xl font-black text-foreground">Cambiar estado</h3>
            <p className="mt-2 text-sm text-muted">
              ¿Estás seguro de cambiar el estado de este instructor?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 rounded-2xl border border-border py-3 font-bold text-sm text-secondary transition hover:bg-surface"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleToggleStatus(confirmId)}
                className="flex-1 rounded-2xl bg-primary py-3 font-bold text-sm text-primary-foreground transition hover:opacity-90"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-3xl bg-card border border-border-light p-10 text-center shadow-sm">
          <div className="text-5xl mb-4">
            {search || activeFilter !== 'TODOS' ? <Search size={48} className="mx-auto text-muted-foreground" /> : <User size={48} className="mx-auto text-muted-foreground" />}
          </div>
          <h3 className="text-lg font-bold text-secondary">
            {search || activeFilter !== 'TODOS' ? 'Sin resultados' : 'No hay instructores'}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
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
              className="rounded-3xl bg-card border border-border-light p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="shrink-0">
                  {fotoUrl ? (
                    <img
                      src={fotoUrl}
                      alt={inst.nombre_completo}
                      className="h-16 w-16 rounded-full object-cover border-2 border-border-light sm:h-20 sm:w-20"
                    />
                  ) : (
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-400 text-primary-foreground font-black text-lg sm:text-xl border-2 border-border-light">
                      {getInitials(inst.nombre_completo)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-foreground truncate">
                      {inst.nombre_completo}
                    </h3>
                    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30'
                        : 'bg-border-light text-muted border border-border'
                    }`}>
                      {isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  {/* Especialidades */}
                  {especialidades.length > 0 && (
                    <p className="mt-1.5 text-sm text-muted font-medium truncate">
                      {especialidades.join(' • ')}
                    </p>
                  )}

                  {/* Clases count */}
                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
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
                    <p className="mt-1.5 text-xs text-muted-foreground">{inst.telefono}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2 border-t border-border-light pt-4">
                <button
                  onClick={() => { setEditInstructor(inst); setShowForm(true); }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-50 py-2.5 text-xs font-bold text-primary transition hover:bg-brand-100 active:scale-[0.97] dark:bg-primary/10 dark:text-blue-300 dark:hover:bg-primary/15"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                  Editar
                </button>

                <button
                  onClick={() => setAlert({ type: 'success', message: `Gestión de horarios de ${inst.nombre_completo} — próximamente` })}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-50 py-2.5 text-xs font-bold text-primary transition hover:bg-brand-100 active:scale-[0.97] dark:bg-primary/10 dark:text-blue-300 dark:hover:bg-primary/15"
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
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-100 active:scale-[0.97] dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
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
