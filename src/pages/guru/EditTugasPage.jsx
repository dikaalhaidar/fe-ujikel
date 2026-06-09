import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditTugasPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [deadline, setDeadline] = useState('');
  const [kelasId, setKelasId] = useState('');
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTugas();
    fetchKelas();
  }, [id]);

  const fetchTugas = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/guru/tugas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 200) {
        const tugas = data.data.find(t => t.id == id);
        if (tugas) {
          setJudul(tugas.judul);
          setDeskripsi(tugas.deskripsi);
          setDeadline(tugas.deadline ? tugas.deadline.slice(0, 16) : '');
          setKelasId(tugas.kelasId);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchKelas = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/guru/kelas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 200) setKelasList(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul || !deskripsi || !deadline || !kelasId) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('deadline', deadline);
    formData.append('kelasId', kelasId);
    
    try {
      const res = await fetch(`http://localhost:5000/api/guru/tugas/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.status === 200) {
        setMessage('Tugas berhasil diupdate');
        setTimeout(() => navigate('/guru/tugas'), 2000);
      } else {
        setMessage(data.message || 'Gagal update tugas');
      }
    } catch (error) {
      setMessage('Gagal update tugas');
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h3>Edit Tugas</h3>
      {message && <div className="message success-message">{message}</div>}
      <form onSubmit={handleSubmit}>
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
            {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/guru/tugas')}>
          Batal
        </button>
      </form>
    </div>
  );
}

export default EditTugasPage;