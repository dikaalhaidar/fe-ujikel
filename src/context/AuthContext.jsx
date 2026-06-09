import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      const res = await fetch('http://localhost:5000/api/auth/login', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.status === 200) {
        const { token, user } = data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Login gagal' };
    }
  };

  const register = async (nama, email, password, role) => {
    try {
      const formData = new FormData();
      formData.append('nama', nama);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);
      const res = await fetch('http://localhost:5000/api/auth/register', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.status === 201) return { success: true };
      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Registrasi gagal' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};