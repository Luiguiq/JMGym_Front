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
    date: backendClass.fecha,
    status: backendClass.estado,
    price: backendClass.precio,
    color: backendClass.id_genero === 1 ? 'orange' : backendClass.id_genero === 2 ? 'blue' : 'blue',
    icon: backendClass.id_genero === 1 ? '🏃‍♀️' : backendClass.id_genero === 2 ? '🕺' : '💪',
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
  getAllClasses: async () => {
    const data = await apiRequest('/classes');
    return (data ?? []).map(mapClass);
  },
  createClass: (data) => apiRequest('/classes', { method: 'POST', body: JSON.stringify(data) }),
  updateClass: (id, data) => apiRequest(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClass: (id) => apiRequest(`/classes/${id}`, { method: 'DELETE' }),
};
