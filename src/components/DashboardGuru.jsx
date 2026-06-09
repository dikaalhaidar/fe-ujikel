import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Button from './Button';

function DashboardGuru() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div>
      <div className="navbar">
        <h2>Classroom Management - {user?.nama}</h2>
        <div>
          <Link to="/guru/kelas">Kelas</Link>
          <Link to="/guru/tugas">Tugas</Link>
          <Link to="/guru/tugas-selesai">Tugas Selesai</Link>
          <Link to="/guru/buat-kelas">Buat Kelas</Link>
          <Link to="/guru/buat-tugas">Buat Tugas</Link>
          <Link to="/login" className="logout" onClick={logout}>Logout</Link>
        </div>
      </div>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardGuru;