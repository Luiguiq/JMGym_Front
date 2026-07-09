import { useState, useEffect } from 'react';
import { Search, XCircle, User, Calendar, Clock, FileText, Filter } from 'lucide-react';
import { cancelacionService } from '../../services/cancelacionService.js';
import Loader from '../../components/admin/Loader.jsx';

const MOTIVOS_LABEL = {
  CAMBIO_HORARIO: 'Cambio de horario',
  SALUD: 'Problemas de salud',
  ECONOMICO: 'Motivo económico',
  CAMBIO_SECTOR: 'Cambio de sector',
  CLASE_CANCELADA: 'Clase anulada',
  VENCIMIENTO_PAGO: 'Vencimiento de pago',
  OTRO: 'Otro motivo',
};

const CANCELADO_POR_LABEL = {
  USUARIO: 'Usuario',
  ADMIN: 'Admin',
  SISTEMA: 'Sistema',
};

function CancelacionesAdmin() {
  const [cancelaciones, setCancelaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMotivo, setFilterMotivo] = useState('todos');

  useEffect(() => {
    loadCancelaciones();
  }, []);

  const loadCancelaciones = async () => {
    try {
      setLoading(true);
      const data = await cancelacionService.getAll();
      setCancelaciones(data);
    } catch (error) {
      console.error('Error cargando anulaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = cancelaciones.filter((c) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (
        !c.nombreUsuario?.toLowerCase().includes(q) &&
        !c.nombreClase?.toLowerCase().includes(q) &&
        !c.codigoReserva?.toLowerCase().includes(q)
      ) return false;
    }
    if (filterMotivo !== 'todos' && c.motivo !== filterMotivo) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Gestión de Anulaciones</h1>
        <p className="text-secondary text-sm mt-1">Visualiza todas las anulaciones de reservas</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            aria-label="Buscar anulaciones por usuario, clase o código"
            placeholder="Buscar por usuario, clase o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border bg-card text-foreground placeholder:text-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="relative">
          <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <select
            aria-label="Filtrar por motivo de anulación"
            value={filterMotivo}
            onChange={(e) => setFilterMotivo(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none bg-card min-w-[180px]"
          >
            <option value="todos">Todos los motivos</option>
            {Object.entries(MOTIVOS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4" role="group" aria-label="Resumen de anulaciones">
        <div className="bg-card rounded-xl border border-border p-4" role="status">
          <p className="text-secondary text-sm mb-1">Total anulaciones</p>
          <p className="text-3xl font-bold text-foreground">{cancelaciones.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4" role="status">
          <p className="text-secondary text-sm mb-1">Por usuarios</p>
          <p className="text-3xl font-bold text-amber-600">
            {cancelaciones.filter((c) => c.canceladoPor === 'USUARIO').length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4" role="status">
          <p className="text-secondary text-sm mb-1">Por admin / sistema</p>
          <p className="text-3xl font-bold text-red-600">
            {cancelaciones.filter((c) => c.canceladoPor !== 'USUARIO').length}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader size="md" text="Cargando anulaciones..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <XCircle size={48} className="text-muted-foreground" aria-hidden="true" />
            <p className="text-lg font-bold text-muted">
              {searchTerm || filterMotivo !== 'todos' ? 'Sin resultados' : 'No hay anulaciones'}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchTerm || filterMotivo !== 'todos' ? 'Intenta con otros filtros' : 'Las anulaciones aparecerán aquí cuando los usuarios anulen sus reservas'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th scope="col" className="text-left px-4 py-3 font-bold text-secondary">Código</th>
                  <th scope="col" className="text-left px-4 py-3 font-bold text-secondary">Usuario</th>
                  <th scope="col" className="text-left px-4 py-3 font-bold text-secondary">Clase</th>
                  <th scope="col" className="text-left px-4 py-3 font-bold text-secondary">Motivo</th>
                  <th scope="col" className="text-left px-4 py-3 font-bold text-secondary">Anulado por</th>
                  <th scope="col" className="text-left px-4 py-3 font-bold text-secondary">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-surface transition">
                    <td className="px-4 py-3 font-bold text-foreground">#{c.codigoReserva}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-muted-foreground shrink-0" aria-hidden="true" />
                        <span className="font-medium text-secondary">{c.nombreUsuario}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-secondary">{c.nombreClase}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
                        <FileText size={12} aria-hidden="true" />
                        {MOTIVOS_LABEL[c.motivo] || c.motivo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                        c.canceladoPor === 'USUARIO'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
                          : c.canceladoPor === 'ADMIN'
                            ? 'bg-primary/10 text-blue-700 dark:text-blue-300'
                            : 'bg-border-light text-secondary dark:bg-surface dark:text-muted'
                      }`}>
                        {CANCELADO_POR_LABEL[c.canceladoPor] || c.canceladoPor}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-muted">
                        <Calendar size={14} aria-hidden="true" />
                        <span className="text-xs">
                          {c.fechaCancelacion ? new Date(c.fechaCancelacion).toLocaleDateString('es-PE', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          }) : '-'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CancelacionesAdmin;
