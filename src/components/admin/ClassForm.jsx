import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { instructorService } from '../../services/instructorService.js';
import { genreService } from '../../services/genreService.js';

const INTENSIDADES = ['BAJA', 'MEDIA', 'ALTA'];
const ESTADOS = ['ACTIVA', 'CANCELADA', 'COMPLETA', 'FINALIZADA'];

const todayStr = () => new Date().toISOString().split('T')[0];

const initialForm = {
  nombre_clase: '',
  id_genero: 1,
  id_instructor: 1,
  descripcion: '',
  intensidad: 'MEDIA',
  reglas_vestimenta: '',
  duracion_minutos: 60,
  fecha: todayStr(),
  hora_inicio: '08:00',
  hora_fin: '09:00',
  precio: 0,
  cupos_totales: 20,
  alumnos_minimos: 5,
  imagen_clase: '',
  estado: 'ACTIVA',
};

const ClassForm = ({ onSubmit, onClose, initialData = null, loading = false }) => {
  const navigate = useNavigate();
  const handleClose = onClose || (() => navigate('/admin/clases'));
  const [instructors, setInstructors] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    instructorService.getAll().then(setInstructors).catch(() => {
      setInstructors([
        { id_instructor: 1, nombre_completo: 'Ana Torres' },
        { id_instructor: 2, nombre_completo: 'Luis Bizarro' },
        { id_instructor: 3, nombre_completo: 'María Ramos' },
      ]);
    });
    genreService.getAll().then(setGenres).catch(() => {
      setGenres([
        { id_genero: 1, nombre_genero: 'Baile' },
        { id_genero: 2, nombre_genero: 'Cardio' },
        { id_genero: 3, nombre_genero: 'Fuerza' },
      ]);
    });
  }, []);

  const [formData, setFormData] = useState(() => {
    if (!initialData) return { ...initialForm };

    return {
      nombre_clase: initialData.name ?? initialData.nombre_clase ?? '',
      id_genero: initialData.id_genero ?? 1,
      id_instructor: initialData.id_instructor ?? 1,
      descripcion: initialData.description ?? initialData.descripcion ?? '',
      intensidad: initialData.intensidad ?? 'MEDIA',
      reglas_vestimenta: initialData.reglas_vestimenta ?? '',
      duracion_minutos: Number(initialData.duracion_minutos ?? initialData.duration ?? 60),
      fecha: initialData.fecha ?? todayStr(),
      hora_inicio: initialData.hora_inicio ?? '08:00',
      hora_fin: initialData.hora_fin ?? '09:00',
      precio: Number(initialData.precio ?? initialData.price ?? 0),
      cupos_totales: Number(initialData.cupos_totales ?? initialData.capacity ?? 20),
      alumnos_minimos: Number(initialData.alumnos_minimos ?? 5),
      imagen_clase: initialData.imagen_clase ?? initialData.image ?? '',
      estado: initialData.estado ?? initialData.status ?? 'ACTIVA',
    };
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre_clase.trim()) newErrors.nombre_clase = 'El nombre es requerido';
    if (!formData.duracion_minutos || formData.duracion_minutos < 1)
      newErrors.duracion_minutos = 'La duración debe ser mayor a 0';
    if (!formData.cupos_totales || formData.cupos_totales < 1)
      newErrors.cupos_totales = 'La capacidad debe ser mayor a 0';
    if (!formData.fecha) newErrors.fecha = 'La fecha es requerida';
    if (!formData.hora_inicio) newErrors.hora_inicio = 'La hora de inicio es requerida';
    if (!formData.hora_fin) newErrors.hora_fin = 'La hora de fin es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit?.({
        ...formData,
        duracion_minutos: Number(formData.duracion_minutos),
        cupos_totales: Number(formData.cupos_totales),
        alumnos_minimos: Number(formData.alumnos_minimos),
        precio: Number(formData.precio),
        id_genero: Number(formData.id_genero),
        id_instructor: Number(formData.id_instructor),
        cupos_disponibles: Number(formData.cupos_totales),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between gap-3 z-10">
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
            {initialData ? 'Editar Clase' : 'Crear Nueva Clase'}
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Nombre de la Clase</label>
            <input
              type="text"
              name="nombre_clase"
              value={formData.nombre_clase}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.nombre_clase ? 'border-red-500' : 'border-slate-300'}`}
              placeholder="ej: Zumba"
            />
            {errors.nombre_clase && <p className="text-red-600 text-xs mt-1">{errors.nombre_clase}</p>}
          </div>

          {/* Instructor y Género */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Instructor</label>
              <select
                name="id_instructor"
                value={formData.id_instructor}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {instructors.map((i) => (
                  <option key={i.id_instructor} value={i.id_instructor}>{i.nombre_completo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Género / Tipo</label>
              <select
                name="id_genero"
                value={formData.id_genero}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {genres.map((g) => (
                  <option key={g.id_genero} value={g.id_genero}>{g.nombre_genero}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Describe la clase..."
            />
          </div>

          {/* Fecha y Horarios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.fecha ? 'border-red-500' : 'border-slate-300'}`}
              />
              {errors.fecha && <p className="text-red-600 text-xs mt-1">{errors.fecha}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Hora Inicio</label>
              <input
                type="time"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.hora_inicio ? 'border-red-500' : 'border-slate-300'}`}
              />
              {errors.hora_inicio && <p className="text-red-600 text-xs mt-1">{errors.hora_inicio}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Hora Fin</label>
              <input
                type="time"
                name="hora_fin"
                value={formData.hora_fin}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.hora_fin ? 'border-red-500' : 'border-slate-300'}`}
              />
              {errors.hora_fin && <p className="text-red-600 text-xs mt-1">{errors.hora_fin}</p>}
            </div>
          </div>

          {/* Duración, Capacidad, Precio, Alumnos Mínimos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Duración (min)</label>
              <input
                type="number"
                name="duracion_minutos"
                value={formData.duracion_minutos}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.duracion_minutos ? 'border-red-500' : 'border-slate-300'}`}
              />
              {errors.duracion_minutos && <p className="text-red-600 text-xs mt-1">{errors.duracion_minutos}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Capacidad</label>
              <input
                type="number"
                name="cupos_totales"
                value={formData.cupos_totales}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.cupos_totales ? 'border-red-500' : 'border-slate-300'}`}
              />
              {errors.cupos_totales && <p className="text-red-600 text-xs mt-1">{errors.cupos_totales}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Precio (S/)</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Alumnos Mín.</label>
              <input
                type="number"
                name="alumnos_minimos"
                value={formData.alumnos_minimos}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Intensidad y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Intensidad</label>
              <select
                name="intensidad"
                value={formData.intensidad}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {INTENSIDADES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {ESTADOS.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Reglas de Vestimenta */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Reglas de Vestimenta (opcional)</label>
            <textarea
              name="reglas_vestimenta"
              value={formData.reglas_vestimenta}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="ej: Ropa cómoda, zapatillas deportivas..."
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">URL de Imagen (opcional)</label>
            <input
              type="text"
              name="imagen_clase"
              value={formData.imagen_clase}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear Clase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;
