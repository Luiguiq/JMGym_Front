import { apiRequest } from './api.js';

function mapClass(backendClass) {
  return {
    id: backendClass.id_clase,
    name: backendClass.nombre_clase,
    trainer: backendClass.instructor_nombre ?? `Instructor #${backendClass.id_instructor}`,
    trainerId: backendClass.id_instructor,
    time: backendClass.hora_inicio?.slice(0, 5) ?? '',
    duration: `${backendClass.duracion_minutos} min`,
    level: backendClass.intensidad === 'ALTA' ? 'Energia alta' : backendClass.intensidad === 'MEDIA' ? 'Moderado' : 'Principiante',
    reserved: (backendClass.cupos_totales ?? 0) - (backendClass.cupos_disponibles ?? 0),
    capacity: backendClass.cupos_totales,
    availableSpots: backendClass.cupos_disponibles,
    description: backendClass.descripcion,
    clothingRules: backendClass.reglas_vestimenta,
    date: backendClass.fecha,
    status: backendClass.estado,
    price: backendClass.precio,
    color: backendClass.id_genero === 1 ? 'orange' : backendClass.id_genero === 2 ? 'blue' : 'blue',
    icon: backendClass.id_genero === 1 ? '🏃‍♀️' : backendClass.id_genero === 2 ? '🕺' : '💪',
    // Campos adicionales para el admin
    id_genero: backendClass.id_genero,
    id_instructor: backendClass.id_instructor,
    intensidad: backendClass.intensidad,
    reglas_vestimenta: backendClass.reglas_vestimenta,
    precio: backendClass.precio,
    alumnos_minimos: backendClass.alumnos_minimos,
    imagen_clase: backendClass.imagen_clase,
    hora_inicio: backendClass.hora_inicio?.slice(0, 5) ?? '',
    hora_fin: backendClass.hora_fin?.slice(0, 5) ?? '',
    fecha: backendClass.fecha,
  };
}

function mapForAdmin(apiItem) {
  return {
    id: apiItem.id,
    name: apiItem.name,
    instructor: apiItem.trainer,
    schedule: apiItem.time,
    duration: apiItem.duration,
    capacity: apiItem.capacity,
    enrolled: apiItem.reserved,
    status: apiItem.estado ?? apiItem.status,
    description: apiItem.description,
    // pasar los datos extra que necesita el formulario de edición
    id_genero: apiItem.id_genero,
    id_instructor: apiItem.id_instructor,
    intensidad: apiItem.intensidad,
    precio: apiItem.precio,
    fecha: apiItem.fecha,
    hora_inicio: apiItem.hora_inicio,
    hora_fin: apiItem.hora_fin,
    duracion_minutos: parseInt(apiItem.duration) || 60,
    cupos_totales: apiItem.capacity,
    alumnos_minimos: apiItem.alumnos_minimos,
    imagen_clase: apiItem.imagen_clase,
    reglas_vestimenta: apiItem.reglas_vestimenta,
    estado: apiItem.estado ?? apiItem.status,
  };
}

export const classService = {
  getTodayClasses: async () => {
    const data = await apiRequest('/classes/today');
    return (data ?? []).map(mapClass);
  },
  getClassById: async (id) => {
    const data = await apiRequest(`/classes/${id}`);
    return mapClass(data);
  },
  getClassSeats: async (classId) => {
    const data = await apiRequest(`/classes/${classId}/seats`);
    return data;
  },
  getByInstructor: async (instructorId) => {
    const data = await apiRequest(`/classes/instructor/${instructorId}`);
    return (data ?? []).map(mapClass);
  },
  getAllClasses: async () => {
    const data = await apiRequest('/classes');
    return (data ?? []).map(mapClass);
  },
  getAllForAdmin: async () => {
    const data = await apiRequest('/classes');
    return (data ?? []).map(mapClass).map(mapForAdmin);
  },
  createClass: (data) => apiRequest('/classes', { method: 'POST', body: JSON.stringify(data) }),
  updateClass: (id, data) => apiRequest(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClass: (id) => apiRequest(`/classes/${id}`, { method: 'DELETE' }),
};
