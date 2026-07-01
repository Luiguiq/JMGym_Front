import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ImageIcon } from 'lucide-react';
import { instructorService } from '../../services/instructorService.js';
import { genreService } from '../../services/genreService.js';
import { classService } from '../../services/classService.js';
import cardioImage from '../../assets/images/cardio.jpg';
import trenSuperiorImage from '../../assets/images/trensuperior.jpg';
import zumbaImage from '../../assets/images/zumba.jpg';

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
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [availableImages, setAvailableImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const loadAvailableImages = useCallback(async () => {
    setLoadingImages(true);
    const urls = [];

    // Imágenes locales por defecto
    const defaultImages = [
      { url: cardioImage, label: 'Cardio' },
      { url: trenSuperiorImage, label: 'Tren Superior' },
      { url: zumbaImage, label: 'Zumba' },
    ];
    urls.push(...defaultImages);

    // Imágenes de clases existentes del backend
    try {
      const allClasses = await classService.getAllClasses();
      const existing = allClasses
        .filter((c) => c.imagen_clase && !urls.some((u) => u.url === c.imagen_clase))
        .map((c) => ({ url: c.imagen_clase, label: c.name }));
      urls.push(...existing);
    } catch {
      // Si falla el backend, solo mostramos las locales
    }

    setAvailableImages(urls);
    setLoadingImages(false);
  }, []);

  const handleOpenImagePicker = () => {
    loadAvailableImages();
    setShowImagePicker(true);
  };

  const handleSelectImage = (url) => {
    setFormData((prev) => ({ ...prev, imagen_clase: url }));
    setShowImagePicker(false);
  };

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
      <div className="bg-card rounded-2xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between gap-3 z-10">
          <h2 className="text-lg sm:text-2xl font-bold text-foreground">
            {initialData ? 'Editar Clase' : 'Crear Nueva Clase'}
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-border-light rounded-lg transition-colors flex-shrink-0" aria-label="Cerrar formulario">
            <X size={20} className="text-secondary" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5" noValidate>
          {/* Nombre */}
          <div>
            <label htmlFor="class-nombre" className="block text-sm font-semibold text-foreground mb-2">
              Nombre de la Clase <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="class-nombre"
              type="text"
              name="nombre_clase"
              value={formData.nombre_clase}
              onChange={handleChange}
              required
              aria-required="true"
              aria-invalid={!!errors.nombre_clase}
              aria-describedby={errors.nombre_clase ? 'error-nombre_clase' : undefined}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.nombre_clase ? 'border-red-500' : 'border-border'}`}
              placeholder="ej: Zumba"
            />
            {errors.nombre_clase && <p id="error-nombre_clase" className="text-red-600 text-xs mt-1" role="alert">{errors.nombre_clase}</p>}
          </div>

          {/* Instructor y Género */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border-0 p-0 m-0">
            <legend className="sr-only">Instructor y tipo de clase</legend>
            <div>
              <label htmlFor="class-instructor" className="block text-sm font-semibold text-foreground mb-2">Instructor</label>
              <select
                id="class-instructor"
                name="id_instructor"
                value={formData.id_instructor}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {instructors.map((i) => (
                  <option key={i.id_instructor} value={i.id_instructor}>{i.nombre_completo}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="class-genero" className="block text-sm font-semibold text-foreground mb-2">Género / Tipo</label>
              <select
                id="class-genero"
                name="id_genero"
                value={formData.id_genero}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {genres.map((g) => (
                  <option key={g.id_genero} value={g.id_genero}>{g.nombre_genero}</option>
                ))}
              </select>
            </div>
          </fieldset>

          {/* Descripción */}
          <div>
            <label htmlFor="class-descripcion" className="block text-sm font-semibold text-foreground mb-2">Descripción</label>
            <textarea
              id="class-descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Describe la clase..."
            />
          </div>

          {/* Fecha y Horarios */}
          <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4 border-0 p-0 m-0">
            <legend className="sr-only">Fecha y horario</legend>
            <div>
              <label htmlFor="class-fecha" className="block text-sm font-semibold text-foreground mb-2">
                Fecha <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="class-fecha"
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.fecha}
                aria-describedby={errors.fecha ? 'error-fecha' : undefined}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.fecha ? 'border-red-500' : 'border-border'}`}
              />
              {errors.fecha && <p id="error-fecha" className="text-red-600 text-xs mt-1" role="alert">{errors.fecha}</p>}
            </div>
            <div>
              <label htmlFor="class-hora-inicio" className="block text-sm font-semibold text-foreground mb-2">
                Hora Inicio <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="class-hora-inicio"
                type="time"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.hora_inicio}
                aria-describedby={errors.hora_inicio ? 'error-hora_inicio' : undefined}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.hora_inicio ? 'border-red-500' : 'border-border'}`}
              />
              {errors.hora_inicio && <p id="error-hora_inicio" className="text-red-600 text-xs mt-1" role="alert">{errors.hora_inicio}</p>}
            </div>
            <div>
              <label htmlFor="class-hora-fin" className="block text-sm font-semibold text-foreground mb-2">
                Hora Fin <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="class-hora-fin"
                type="time"
                name="hora_fin"
                value={formData.hora_fin}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.hora_fin}
                aria-describedby={errors.hora_fin ? 'error-hora_fin' : undefined}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.hora_fin ? 'border-red-500' : 'border-border'}`}
              />
              {errors.hora_fin && <p id="error-hora_fin" className="text-red-600 text-xs mt-1" role="alert">{errors.hora_fin}</p>}
            </div>
          </fieldset>

          {/* Duración, Capacidad, Precio, Alumnos Mínimos */}
          <fieldset className="grid grid-cols-2 md:grid-cols-4 gap-4 border-0 p-0 m-0">
            <legend className="sr-only">Detalles de la clase</legend>
            <div>
              <label htmlFor="class-duracion" className="block text-sm font-semibold text-foreground mb-2">
                Duración (min) <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="class-duracion"
                type="number"
                name="duracion_minutos"
                value={formData.duracion_minutos}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.duracion_minutos}
                aria-describedby={errors.duracion_minutos ? 'error-duracion_minutos' : undefined}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.duracion_minutos ? 'border-red-500' : 'border-border'}`}
              />
              {errors.duracion_minutos && <p id="error-duracion_minutos" className="text-red-600 text-xs mt-1" role="alert">{errors.duracion_minutos}</p>}
            </div>
            <div>
              <label htmlFor="class-capacidad" className="block text-sm font-semibold text-foreground mb-2">
                Capacidad <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="class-capacidad"
                type="number"
                name="cupos_totales"
                value={formData.cupos_totales}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.cupos_totales}
                aria-describedby={errors.cupos_totales ? 'error-cupos_totales' : undefined}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.cupos_totales ? 'border-red-500' : 'border-border'}`}
              />
              {errors.cupos_totales && <p id="error-cupos_totales" className="text-red-600 text-xs mt-1" role="alert">{errors.cupos_totales}</p>}
            </div>
            <div>
              <label htmlFor="class-precio" className="block text-sm font-semibold text-foreground mb-2">Precio (S/)</label>
              <input
                id="class-precio"
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label htmlFor="class-alumnos" className="block text-sm font-semibold text-foreground mb-2">Alumnos Mín.</label>
              <input
                id="class-alumnos"
                type="number"
                name="alumnos_minimos"
                value={formData.alumnos_minimos}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </fieldset>

          {/* Intensidad y Estado */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 border-0 p-0 m-0">
            <legend className="sr-only">Configuración adicional</legend>
            <div>
              <label htmlFor="class-intensidad" className="block text-sm font-semibold text-foreground mb-2">Intensidad</label>
              <select
                id="class-intensidad"
                name="intensidad"
                value={formData.intensidad}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {INTENSIDADES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="class-estado" className="block text-sm font-semibold text-foreground mb-2">Estado</label>
              <select
                id="class-estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {ESTADOS.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </fieldset>

          {/* Reglas de Vestimenta */}
          <div>
            <label htmlFor="class-vestimenta" className="block text-sm font-semibold text-foreground mb-2">Reglas de Vestimenta <span className="text-muted-foreground text-xs font-normal">(opcional)</span></label>
            <textarea
              id="class-vestimenta"
              name="reglas_vestimenta"
              value={formData.reglas_vestimenta}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="ej: Ropa cómoda, zapatillas deportivas..."
            />
          </div>

          {/* Imagen */}
          <div>
            <label htmlFor="class-imagen" className="block text-sm font-semibold text-foreground mb-2">Imagen de la Clase <span className="text-muted-foreground text-xs font-normal">(opcional)</span></label>
            <div className="flex gap-2">
              <input
                id="class-imagen"
                type="text"
                name="imagen_clase"
                value={formData.imagen_clase}
                onChange={handleChange}
                className="flex-1 min-w-0 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <button
                type="button"
                onClick={handleOpenImagePicker}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-medium text-secondary hover:bg-surface transition-colors shrink-0"
                aria-label="Elegir imagen de la galería"
              >
                <ImageIcon size={18} aria-hidden="true" />
                <span className="hidden sm:inline">Elegir</span>
              </button>
            </div>
            {formData.imagen_clase && (
              <div className="mt-3 relative inline-block">
                <img
                  src={formData.imagen_clase}
                  alt="Vista previa de la imagen seleccionada"
                  className="h-28 w-48 rounded-xl object-cover border border-border"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Image Picker Modal */}
          {showImagePicker && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={(e) => { if (e.target === e.currentTarget) setShowImagePicker(false); }}
            >
              <div
                className="w-full max-w-lg rounded-2xl bg-card shadow-2xl max-h-[80vh] flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-labelledby="image-picker-title"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h3 id="image-picker-title" className="text-lg font-bold text-foreground">Elegir imagen</h3>
                  <button onClick={() => setShowImagePicker(false)} className="p-1 hover:bg-border-light rounded-lg transition-colors" aria-label="Cerrar selector de imágenes">
                    <X size={20} className="text-muted" aria-hidden="true" />
                  </button>
                </div>
                <div className="overflow-y-auto p-5">
                  {loadingImages ? (
                    <div className="flex items-center justify-center py-10" role="status">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500" />
                      <span className="sr-only">Cargando imágenes...</span>
                    </div>
                  ) : availableImages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">No hay imágenes disponibles</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="listbox" aria-label="Seleccionar imagen">
                      {availableImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectImage(img.url)}
                          role="option"
                          aria-selected={formData.imagen_clase === img.url}
                          className={`group relative rounded-xl overflow-hidden border-2 transition-all ${
                            formData.imagen_clase === img.url
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-border hover:border-brand-400'
                          }`}
                        >
                          <div className="aspect-[4/3] bg-border-light">
                            <img
                              src={img.url}
                              alt={img.label}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.parentElement.innerHTML = '<div class="flex h-full items-center justify-center text-muted-foreground text-sm font-medium">Sin vista</div>';
                              }}
                            />
                          </div>
                          <div className="px-2 py-1.5 text-left">
                            <p className="text-[11px] font-semibold text-secondary truncate">{img.label}</p>
                          </div>
                          {formData.imagen_clase === img.url && (
                            <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary" aria-hidden="true">
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="white">
                                <path d="M4 8.5L2 6.5L1 7.5L4 10.5L10 3.5L9 2.5Z" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-surface transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
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
