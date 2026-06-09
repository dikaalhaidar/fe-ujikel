import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

function TugasPage() {
  const [tugas, setTugas] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [editTugas, setEditTugas] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const tugasRes = await fetch('http://localhost:5000/api/guru/tugas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const tugasData = await tugasRes.json();
      if (tugasData.status === 200) setTugas(tugasData.data || []);

      const kelasRes = await fetch('http://localhost:5000/api/guru/kelas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const kelasData = await kelasRes.json();
      if (kelasData.status === 200) setKelas(kelasData.data || []);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchData(); }, []);

  const updateTugas = async () => {
    if (!editTugas) return;
    const formData = new FormData();
    formData.append('judul', editTugas.judul);
    formData.append('deskripsi', editTugas.deskripsi);
    formData.append('deadline', editTugas.deadline);
    formData.append('kelasId', editTugas.kelasId);
    await fetch(`http://localhost:5000/api/guru/tugas/${editTugas.id}`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: formData
    });
    setMessage('✅ Tugas berhasil diupdate');
    setEditTugas(null);
    fetchData();
    setTimeout(() => setMessage(''), 3000);
  };

  const hapusTugas = async (id) => {
    if (!confirm('Yakin hapus tugas ini?')) return;
    await fetch(`http://localhost:5000/api/guru/tugas/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
    });
    setMessage('🗑️ Tugas berhasil dihapus');
    fetchData();
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      {message && <div className="message success-message">{message}</div>}
      <div className="card">
        <h3>📝 Daftar Tugas</h3>
        {tugas.length === 0 && <p>Belum ada tugas. Buat tugas dulu!</p>}
        {tugas.map(t => (
          <div key={t.id} className="list-item">
            {editTugas?.id === t.id ? (
              <div className="edit-form-inline">
                <input 
                  type="text" 
                  value={editTugas.judul} 
                  onChange={e => setEditTugas({ ...editTugas, judul: e.target.value })} 
                  placeholder="Judul" 
                />
                <textarea 
                  value={editTugas.deskripsi} 
                  onChange={e => setEditTugas({ ...editTugas, deskripsi: e.target.value })} 
                  placeholder="Deskripsi" 
                  rows="2" 
                />
                <input 
                  type="datetime-local" 
                  value={editTugas.deadline} 
                  onChange={e => setEditTugas({ ...editTugas, deadline: e.target.value })} 
                />
                <select 
                  value={editTugas.kelasId} 
                  onChange={e => setEditTugas({ ...editTugas, kelasId: e.target.value })}
                >
                  <option value="">Pilih Kelas</option>
                  {kelas.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                </select>
                <div style={{ marginTop: '12px' }}>
                  <Button variant="success" onClick={updateTugas}>Simpan</Button>
                  <Button variant="secondary" onClick={() => setEditTugas(null)}>Batal</Button>
                </div>
              </div>
            ) : (
              <div>
                <h4>{t.judul}</h4>
                <p>{t.deskripsi}</p>
                <p>📚 Kelas: {t.kelas?.nama}</p>
                <p>⏰ Deadline: {new Date(t.deadline).toLocaleString()}</p>
                <div style={{ marginTop: '12px' }}>
                  <Link to={`/guru/tugas/${t.id}/edit`} className="btn btn-warning">
                    ✏️ Edit
                  </Link>
                  <Button variant="danger" onClick={() => hapusTugas(t.id)}>
                    🗑️ Hapus
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TugasPage;