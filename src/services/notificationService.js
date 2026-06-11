import { apiRequest } from './api.js';

function mapNotification(item) {
  return {
    id: item.id_notificacion,
    userId: item.id_usuario,
    title: item.titulo,
    message: item.mensaje,
    type: item.tipo,
    requiresResponse: item.requiere_respuesta,
    userResponse: item.respuesta_usuario,
    responseDate: item.fecha_respuesta,
    read: item.leido,
    sentAt: item.fecha_envio,
    reservationId: item.id_reserva,
    classId: item.id_clase,
  };
}

export const notificationService = {
  getMyNotifications: () =>
    apiRequest('/notifications/me').then((d) => (d ?? []).map(mapNotification)),

  getUnreadCount: () =>
    apiRequest('/notifications/me/unread-count'),

  markAsRead: (notificationId) =>
    apiRequest(`/notifications/${notificationId}/read`, { method: 'PATCH' }),

  markAllAsRead: () =>
    apiRequest('/notifications/read-all', { method: 'POST' }),

  respondToNotification: (notificationId, respuesta) =>
    apiRequest(`/notifications/${notificationId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ respuesta }),
    }),

  // Admin
  getAllNotifications: () =>
    apiRequest('/notifications').then((d) => (d ?? []).map(mapNotification)),

  sendNotification: (data) =>
    apiRequest('/notifications/send', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
