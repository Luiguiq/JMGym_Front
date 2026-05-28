import { apiRequest } from './api.js';

export const classService = {
  getTodayClasses: () => apiRequest('/classes/today'),
  getClassById: (id) => apiRequest(`/classes/${id}`),
};
