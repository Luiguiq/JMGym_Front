const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

function clearSessionAndRedirect() {
  const storedUser = localStorage.getItem('user');
  let user = null;
  try { user = storedUser ? JSON.parse(storedUser) : null; } catch {}
  const loginPath = user?.role === 'admin' ? '/admin/login' : '/cliente/login';
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  window.location.href = loginPath;
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method || 'GET',
      headers,
      body: options.body,
    });
  } catch (err) {
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté funcionando.');
    }
    throw new Error(err.message || 'Error de conexión');
  }

  if (response.status === 403 && !options.skipAuthRedirect) {
    const error = await response.json().catch(() => ({}));
    clearSessionAndRedirect();
    throw new Error(error.detail || 'Tu cuenta ha sido bloqueada. Contacta al administrador.');
  }

  if (response.status === 401 && !options.skipAuthRedirect) {
    clearSessionAndRedirect();
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const detail = Array.isArray(error.detail)
      ? error.detail.map((item) => item.msg).filter(Boolean).join(', ')
      : error.detail;
    throw new Error(error.message || detail || 'Error en la solicitud al servidor');
  }

  return response.json();
}
