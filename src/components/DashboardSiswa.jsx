import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';

function DashboardSiswa() {
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
          <Link to="/siswa/tugas">Tugas Aktif</Link>
          <Link to="/siswa/riwayat">Riwayat</Link>
          <Link to="/login" className="logout" onClick={logout}>Logout</Link>
        </div>
      </div>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardSiswa;