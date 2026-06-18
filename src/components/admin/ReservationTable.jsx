import { Trash2, Edit2, CheckCircle, XCircle, Clock, AlertTriangle, Check } from 'lucide-react';

const ReservationTable = ({ 
  data = [], 
  loading = false, 
  onEdit, 
  onDelete,
  onStatusChange 
}) => {
  const statusColors = {
    ACTIVA: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    CANCELADA: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
    FINALIZADA: { bg: 'bg-slate-100', text: 'text-slate-800', icon: Clock },
  };

  const paymentStatusColors = {
    PAGADO: 'bg-green-100 text-green-800 border-green-200',
    PENDIENTE: 'bg-amber-100 text-amber-800 border-amber-200',
    VENCIDO: 'bg-red-100 text-red-800 border-red-200',
    REEMBOLSADO: 'bg-blue-100 text-blue-800 border-blue-200',
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
        <p className="text-slate-600">No hay reservas registradas</p>
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
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Usuario</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Clase</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Fecha</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">
                Validación
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Estado</th>
              <th className="text-left px-6 py-3 font-semibold text-slate-900">Pago</th>
              <th className="text-center px-6 py-3 font-semibold text-slate-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((reservation) => {
              const statusConfig = statusColors[reservation.status] || statusColors.ACTIVA;
              const StatusIcon = statusConfig.icon;

              return (
                <tr key={reservation.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{reservation.userName}</td>
                  <td className="px-6 py-4 text-slate-600">{reservation.className}</td>
                  <td className="px-6 py-4 text-slate-600">{reservation.date}</td>
                  <td className="px-6 py-4">
                    {reservation.validationConflict ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                        <AlertTriangle size={14} className="inline" /> Conflicto
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        <Check size={14} className="inline" /> Válida
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold w-fit ${statusConfig.bg} ${statusConfig.text}`}>
                      <StatusIcon size={14} />
                      {reservation.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${paymentStatusColors[reservation.paymentStatus] || paymentStatusColors.PENDIENTE}`}>
                      Pago {reservation.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit?.(reservation)}
                        aria-label={`Editar reserva de ${reservation.userName}`}
                        className="p-2 hover:bg-brand-50 text-brand-600 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(reservation.id)}
                        aria-label={`Eliminar reserva de ${reservation.userName}`}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((reservation) => {
          const statusConfig = statusColors[reservation.status] || statusColors.ACTIVA;
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={reservation.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{reservation.userName}</h3>
                  <p className="text-sm text-slate-600">{reservation.className}</p>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                  <StatusIcon size={12} />
                  {reservation.status}
                </div>
              </div>

              <div className="space-y-2 mb-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Fecha:</span>
                  <span className="text-slate-900 font-medium">{reservation.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pago:</span>
                  <span className={`rounded-full border px-2 py-0.5 font-medium ${paymentStatusColors[reservation.paymentStatus] || paymentStatusColors.PENDIENTE}`}>
                    Pago {reservation.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit?.(reservation)}
                  aria-label={`Editar reserva de ${reservation.userName}`}
                  className="flex-1 p-2 bg-brand-50 text-brand-600 rounded-lg font-medium text-sm hover:bg-brand-100 transition-colors"
                >
                  <Edit2 size={16} className="mx-auto" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(reservation.id)}
                  aria-label={`Eliminar reserva de ${reservation.userName}`}
                  className="flex-1 p-2 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} className="mx-auto" aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReservationTable;
