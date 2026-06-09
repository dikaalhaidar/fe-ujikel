import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditKelasPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchKelas();
  }, [id]);

  const fetchKelas = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/guru/kelas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 200) {
        const kelas = data.data.find(k => k.id == id);
        if (kelas) setNama(kelas.nama);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('nama', nama);
    
    try {
      const res = await fetch(`http://localhost:5000/api/guru/kelas/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.status === 200) {
        setMessage('Kelas berhasil diupdate');
        setTimeout(() => navigate('/guru/kelas'), 2000);
      } else {
        setMessage(data.message || 'Gagal update kelas');
      }
    } catch (error) {
      setMessage('Gagal update kelas');
    }
    setLoading(false);
  };

  return (
    <div className="edit-page">
      <div className="card edit-card">
        <header className="card-header">
          <h3>Edit Kelas</h3>
          <p className="card-subtitle">Ubah nama kelas yang dipilih, lalu tekan simpan untuk menyimpan perubahan.</p>
        </header>

        {message && <div className="message success-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Kelas</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/guru/kelas')}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditKelasPage;