import { useState } from 'react';
import { Trash2, Edit2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const ClassTable = ({ 
  data = [], 
  loading = false, 
  onEdit, 
  onViewUsers,
  onDelete,
  pagination = { page: 1, total: 0, pageSize: 10 },
  onPageChange 
}) => {
  const formatClassDay = (date) => {
    if (!date) return '-';

    const parsedDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) return '-';

    return new Intl.DateTimeFormat('es-PE', { weekday: 'long' }).format(parsedDate);
  };

  const formatClassDate = (date) => {
    if (!date) return '-';

    const parsedDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) return '-';

    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(parsedDate);
  };

  const statusColors = {
    activa: 'bg-green-100 text-green-800',
    inactiva: 'bg-slate-100 text-slate-800',
    pausada: 'bg-amber-100 text-amber-800',
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No hay clases registradas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Nombre</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Instructor</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Horario</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Día</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Fecha</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Cupo</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Estado</th>
              <th className="text-center px-6 py-3 font-semibold text-slate-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((clase) => (
              <tr key={clase.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{clase.name}</td>
                <td className="px-6 py-4 text-slate-600">{clase.instructor}</td>
                <td className="px-6 py-4 text-slate-600">{clase.schedule}</td>
                <td className="px-6 py-4 text-slate-600 capitalize">{formatClassDay(clase.fecha)}</td>
                <td className="px-6 py-4 text-slate-600">{formatClassDate(clase.fecha)}</td>
                <td className="px-6 py-4">
                  <span className="text-slate-900">{clase.enrolled}</span>
                  <span className="text-slate-600">/{clase.capacity}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[clase.status] || statusColors.activa}`}>
                    {clase.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewUsers?.(clase)}
                      className="p-2 hover:bg-sky-50 text-sky-600 rounded-lg transition-colors"
                      aria-label={`Ver usuarios de ${clase.name}`}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit?.(clase)}
                      className="p-2 hover:bg-brand-50 text-brand-600 rounded-lg transition-colors"
                      aria-label={`Editar ${clase.name}`}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete?.(clase.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      aria-label={`Eliminar ${clase.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((clase) => (
          <div
            key={clase.id}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{clase.name}</h3>
                <p className="text-sm text-slate-600">{clase.instructor}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[clase.status] || statusColors.activa}`}>
                {clase.status}
              </span>
            </div>

            <div className="space-y-2 mb-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Horario:</span>
                <span className="text-slate-900 font-medium">{clase.schedule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Día:</span>
                <span className="text-slate-900 font-medium capitalize">{formatClassDay(clase.fecha)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Fecha:</span>
                <span className="text-slate-900 font-medium">{formatClassDate(clase.fecha)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Cupo:</span>
                <span className="text-slate-900 font-medium">
                  {clase.enrolled}/{clase.capacity}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onViewUsers?.(clase)}
                className="flex-1 p-2 bg-sky-50 text-sky-600 rounded-lg font-medium text-sm hover:bg-sky-100 transition-colors"
                aria-label={`Ver usuarios de ${clase.name}`}
              >
                <Eye size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => onEdit?.(clase)}
                className="flex-1 p-2 bg-brand-50 text-brand-600 rounded-lg font-medium text-sm hover:bg-brand-100 transition-colors"
                aria-label={`Editar ${clase.name}`}
              >
                <Edit2 size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => onDelete?.(clase.id)}
                className="flex-1 p-2 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors"
                aria-label={`Eliminar ${clase.name}`}
              >
                <Trash2 size={16} className="mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.pageSize && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Página {pagination.page} de {Math.ceil(pagination.total / pagination.pageSize)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} className="text-slate-600" />
            </button>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassTable;
