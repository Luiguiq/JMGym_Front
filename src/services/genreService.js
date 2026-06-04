import { apiRequest } from './api.js';

export const genreService = {
  getAll: () => apiRequest('/genres'),
};
