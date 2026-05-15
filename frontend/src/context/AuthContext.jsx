import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(() => JSON.parse(localStorage.getItem('rb_user') || 'null'));
  const [token, setToken]   = useState(() => localStorage.getItem('rb_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('rb_token', data.token);
      localStorage.setItem('rb_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      localStorage.setItem('rb_token', data.token);
      localStorage.setItem('rb_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('rb_token');
    localStorage.removeItem('rb_user');
    setToken(null);
    setUser(null);
  };

  const isAdmin  = user?.role === 'admin';
  const isParent = user?.role === 'parent';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, isAdmin, isParent, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
