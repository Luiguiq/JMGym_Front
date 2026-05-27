const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error('Error en la solicitud al servidor');
  }

  return response.json();
}
