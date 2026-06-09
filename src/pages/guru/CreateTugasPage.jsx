import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

function BuatTugasPage() {
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [deadline, setDeadline] = useState('');
  const [kelasId, setKelasId] = useState('');
  const [kelas, setKelas] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/guru/kelas', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { if (data.status === 200) setKelas(data.data || []); })
      .catch(console.error);
  }, []);

  const buatTugas = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('deadline', deadline);
    formData.append('kelasId', kelasId);
    const res = await fetch('http://localhost:5000/api/guru/tugas', {
      method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData
    });
    if (res.status === 201) {
      setMessage('✅ Tugas berhasil dibuat');
      setTimeout(() => navigate('/guru/tugas'), 2000);
    } else {
      setMessage('❌ Gagal buat tugas');
    }
  };

  return (
    <div className="card form-container">   {/* ← TAMBAHKAN form-container */}
      <h3>📋 Buat Tugas Baru</h3>
      {message && <div className="message success-message">{message}</div>}
      <form onSubmit={buatTugas}>
        <div className="form-group">
          <label>Judul</label>
          <input type="text" value={judul} onChange={e => setJudul(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Deskripsi</label>
          <textarea rows="3" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Deadline</label>
          <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Kelas</label>
          <select value={kelasId} onChange={e => setKelasId(e.target.value)} required>
            <option value="">Pilih Kelas</option>
            {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </div>
        <Button type="submit" variant="primary">Buat Tugas</Button>
      </form>
    </div>
  );
}

export default BuatTugasPage;