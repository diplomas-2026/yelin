import { createContext, useContext, useMemo, useState } from 'react';
import { api, setAuthToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  async function login(email, password) {
    const response = await api.login({ email, password });
    setAuthToken(response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    setUser(response.user);
  }

  function logout() {
    setAuthToken(null);
    localStorage.removeItem('user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, logout, isAuthenticated: Boolean(user) }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
