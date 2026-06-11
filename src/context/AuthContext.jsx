import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  function mapUser(backendUser) {
    return {
      id: backendUser.id,
      name: backendUser.name ?? backendUser.nombre ?? '',
      email: backendUser.email ?? backendUser.correo ?? '',
      dni: backendUser.dni,
      role: backendUser.role ?? backendUser.rol ?? 'client',
    };
  }

  const login = useCallback(async ({ email, password }) => {
    const data = await authService.login({ correo_personal: email, password });
    const user = mapUser(data.user);
    setUser(user);
    setToken(data.token);
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
    return { ...data, user };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
