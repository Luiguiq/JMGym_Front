import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

function getFromStorage(key) {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
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
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
    if (value !== null && value !== undefined) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  }

  function mapUser(backendUser) {
    return {
      id: backendUser.id,
      name: backendUser.name ?? backendUser.nombre ?? '',
      email: backendUser.email ?? backendUser.correo ?? '',
      dni: backendUser.dni,
      role: backendUser.role ?? backendUser.rol ?? 'client',
      foto_perfil: backendUser.foto_perfil,
    };
  }

  const login = useCallback(async ({ email, password }, remember = true) => {
    const data = await authService.login({ correo_personal: email, password });
    const user = mapUser(data.user);
    setUser(user);
    setToken(data.token);
    persist('token', data.token, remember);
    persist('user', user, remember);
    return { ...data, user };
  }, []);

  const register = useCallback(async ({ name, dni, email, password }) => {
    const data = await authService.register({
      nombre_completo: name,
      correo_personal: email,
      password,
      dni,
    });
    const user = mapUser(data.user);
    setUser(user);
    setToken(data.token);
    persist('token', data.token, true);
    persist('user', user, true);
    return { ...data, user };
  }, []);

  const adminLogin = useCallback(async ({ correo_institucional, password }) => {
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
    persist('token', data.token, true);
    persist('user', user, true);
    return { ...data, user };
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
    isAuthenticated: Boolean(user),
  }), [user, token, login, register, adminLogin, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
