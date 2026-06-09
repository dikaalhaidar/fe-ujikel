import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';

function SiswaTugasPage() {
  const [tugas, setTugas] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchTugas = async () => {
    const res = await fetch('http://localhost:5000/api/siswa/tugas-saya', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.status === 200) setTugas(data.data || []);
  };

  useEffect(() => { fetchTugas(); }, []);

  const kumpulTugas = async (tugasId) => {
    if (!file) { setMessage('Pilih file dulu'); setTimeout(() => setMessage(''), 3000); return; }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`http://localhost:5000/api/siswa/tugas/${tugasId}/kumpul`, {
      method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData
    });
    const data = await res.json();
    if (data.status === 201) {
      setMessage('Tugas berhasil dikumpulkan');
      setFile(null);
      fetchTugas();
    } else {
      setMessage(data.message || 'Gagal');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const tugasAktif = tugas.filter(t => !t.sudahKumpul);

  return (
    <div>
      {message && <div className="message success-message">{message}</div>}
      <div className="card">
        <h3>Tugas yang Harus Dikerjakan!!!</h3>
        {tugasAktif.length === 0 && <p>Tidak ada tugas aktif. Selamat!</p>}
        {tugasAktif.map(t => (
          <div key={t.id} className="list-item">
            <h4>{t.judul}</h4>
            <p>{t.deskripsi}</p>
            <p>Kelas: {t.kelas?.nama}</p>
            <p>Deadline: {new Date(t.deadline).toLocaleString()}</p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="file" onChange={e => setFile(e.target.files[0])} style={{ flex: 1 }} />
              <Button
                variant="primary"
                onClick={() => kumpulTugas(t.id)}
                disabled={loading}
              >
                {loading ? 'Mengirim...' : 'Kumpulkan'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SiswaTugasPage;