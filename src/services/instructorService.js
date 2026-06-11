import { apiRequest } from './api.js';

export const instructorService = {
  async getById(id) {
    return await apiRequest(`/instructors/${id}`);
  },

  async getAll() {
    return await apiRequest('/instructors');
  },
};