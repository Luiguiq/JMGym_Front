import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

function getFromStorage(key) {
  return sessionStorage.getItem(key) || localStorage.getItem(key);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = getFromStorage('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => getFromStorage('token'));

  function persist(key, value, remember) {
    if (value !== null && value !== undefined) {
      sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      if (remember) {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    } else {
      sessionStorage.removeItem(key);
      if (remember) localStorage.removeItem(key);
    }
  }

  function mapUser(backendUser) {
    const stored = getFromStorage('user');
    let existingYapeVinculado = false;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        existingYapeVinculado = parsed.yapeVinculado === true;
      } catch {}
    }
    return {
      id: backendUser.id,
      name: backendUser.name ?? backendUser.nombre ?? '',
      email: backendUser.email ?? backendUser.correo ?? '',
      dni: backendUser.dni,
      role: backendUser.role ?? backendUser.rol ?? 'client',
      foto_perfil: backendUser.foto_perfil,
      yapeVinculado: existingYapeVinculado,
    };
  }

  const login = useCallback(async ({ identifier, password }, remember = true) => {
    const data = await authService.login({ correo_personal: identifier, password });
    const user = mapUser(data.user);
    setUser(user);
    setToken(data.token);
    persist('token', data.token, remember);
    persist('user', user, remember);
    return { ...data, user };
  }, []);

  const register = useCallback(async ({ name, dni, email, password }, remember = false) => {
    const data = await authService.register({
      nombre_completo: name,
      correo_personal: email,
      password,
      dni,
    });
    const user = mapUser(data.user);
    setUser(user);
    setToken(data.token);
    persist('token', data.token, remember);
    persist('user', user, remember);
    return { ...data, user };
  }, []);

  const adminLogin = useCallback(async ({ correo_institucional, password }, remember = false) => {
    const data = await authService.adminLogin({ correo_institucional, password });
    const user = {
      id: data.user.id,
      name: data.user.nombre ?? '',
      email: data.user.email ?? '',
      role: 'admin',
      estado: data.user.estado,
    };
    setUser(user);
    setToken(data.token);
    persist('token', data.token, remember);
    persist('user', user, remember);
    return { ...data, user };
  }, []);

  const vincularYape = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, yapeVinculado: true };
      sessionStorage.setItem('user', JSON.stringify(updated));
      const localRaw = localStorage.getItem('user');
      if (localRaw) {
        const localUser = JSON.parse(localRaw);
        if (localUser.id === updated.id) {
          localStorage.setItem('user', JSON.stringify(updated));
        }
      }
      return updated;
    });
  }, []);

  const desvincularYape = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, yapeVinculado: false };
      sessionStorage.setItem('user', JSON.stringify(updated));
      const localRaw = localStorage.getItem('user');
      if (localRaw) {
        const localUser = JSON.parse(localRaw);
        if (localUser.id === updated.id) {
          localStorage.setItem('user', JSON.stringify(updated));
        }
      }
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    setUser,
    login,
    register,
    adminLogin,
    logout,
    vincularYape,
    desvincularYape,
    isAuthenticated: Boolean(user),
  }), [user, token, login, register, adminLogin, logout, vincularYape, desvincularYape]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
