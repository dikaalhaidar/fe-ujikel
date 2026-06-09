import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

function BuatKelasPage() {
  const [namaKelas, setNamaKelas] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const buatKelas = async (e) => {
    e.preventDefault();
    if (!namaKelas) return;
    const formData = new FormData();
    formData.append('nama', namaKelas);
    const res = await fetch('http://localhost:5000/api/guru/kelas', {
      method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData
    });
    const data = await res.json();
    if (data.status === 201) {
      setMessage('Kelas berhasil dibuat');
      setTimeout(() => navigate('/guru/kelas'), 2000);
    } else {
      setMessage('Gagal buat kelas');
    }
  };

  return (
    <div className="card">
      <h3>Buat Kelas Baru</h3>
      {message && <div className="message success-message">{message}</div>}
      <form onSubmit={buatKelas}>
        <div className="form-group">
          <label>Nama Kelas</label>
          <input type="text" value={namaKelas} onChange={e => setNamaKelas(e.target.value)} required />
        </div>
        <Button type="submit" variant="primary">Buat Kelas</Button>
      </form>
    </div>
  );
}

export default BuatKelasPage;