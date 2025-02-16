'use client';
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const res = await API.get('/auth/me');
      console.log('Auth Check:', res.data);
      setUser(res.data);
    } catch (error) {
      console.log('Not Authenticated');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    try {
      const res = await API.post('/auth/login', formData);
      console.log('Login Response:', res.data);
     setUser(res.data);
      router.push('/'); // Redirect after login
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout'); // Backend should clear HTTP-only cookie
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};
