import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardGuru from './components/DashboardGuru';
import DashboardSiswa from './components/DashboardSiswa';
import KelasPage from './pages/guru/KelasPage';
import TugasPage from './pages/guru/TugasPage';
import TugasSelesaiPage from './pages/guru/TugasSelesaiPage';
import BuatKelasPage from './pages/guru/CreateKelasPage';
import BuatTugasPage from './pages/guru/CreateTugasPage';
import SiswaTugasPage from './pages/siswa/TugasPage';
import SiswaRiwayatPage from './pages/siswa/RiwayatPage';
import EditKelasPage from './pages/guru/EditKelasPage';
import EditTugasPage from './pages/guru/EditTugasPage';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || !user.role) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/guru" element={<ProtectedRoute role="guru"><DashboardGuru /></ProtectedRoute>}>
        <Route path="kelas" element={<KelasPage />} />
        <Route path="tugas" element={<TugasPage />} />
        <Route path="tugas-selesai" element={<TugasSelesaiPage />} />
        <Route path="buat-kelas" element={<BuatKelasPage />} />
        <Route path="buat-tugas" element={<BuatTugasPage />} />
        <Route index element={<Navigate to="kelas" />} />
       
        <Route path="kelas/:id/edit" element={<EditKelasPage />} />
        <Route path="tugas/:id/edit" element={<EditTugasPage />} />
      </Route>

      <Route path="/siswa" element={<ProtectedRoute role="siswa"><DashboardSiswa /></ProtectedRoute>}>
        <Route path="tugas" element={<SiswaTugasPage />} />
        <Route path="riwayat" element={<SiswaRiwayatPage />} />
        <Route index element={<Navigate to="tugas" />} />
      </Route>

      <Route path="/" element={user && user.role ? <Navigate to={`/${user.role}`} /> : <Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;