import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';

function SiswaRiwayatPage() {
  const [riwayat, setRiwayat] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/siswa/riwayat-saya', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { if (data.status === 200) setRiwayat(data.data || []); })
      .catch(console.error);
  }, []);

  return (
    <div className="card">
      <h3>Riwayat Tugas</h3>
      {riwayat.length === 0 && <p>Belum ada riwayat.</p>}
      {riwayat.map(r => (
        <div key={r.id} className="list-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h4>{r.tugas?.judul}</h4>
              <p>Dikumpulkan: {new Date(r.waktuKumpul).toLocaleString()}</p>
              {r.nilai ? (
                <p style={{ color: '#28a745', fontWeight: '500' }}>Nilai: {r.nilai}</p>
              ) : (
                <p style={{ color: '#ffc107', fontWeight: '500' }}>Belum dinilai</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SiswaRiwayatPage;