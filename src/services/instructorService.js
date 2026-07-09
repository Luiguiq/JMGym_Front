import { apiRequest } from './api.js';

export const instructorService = {
  getById: (id) =>
    apiRequest(`/instructors/${id}`),

  getAll: () =>
    apiRequest('/instructors'),

  create: (data) =>
    apiRequest('/instructors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiRequest(`/instructors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiRequest(`/instructors/${id}`, { method: 'DELETE' }),

  toggleStatus: (id) =>
    apiRequest(`/instructors/${id}/toggle-status`, { method: 'PATCH' }),

  getSchedules: (instructorId) =>
    apiRequest(`/instructors/${instructorId}/schedules`),

  createSchedule: (instructorId, data) =>
    apiRequest(`/instructors/${instructorId}/schedules`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateSchedule: (scheduleId, data) =>
    apiRequest(`/instructors/schedules/${scheduleId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteSchedule: (scheduleId) =>
    apiRequest(`/instructors/schedules/${scheduleId}`, { method: 'DELETE' }),
};
