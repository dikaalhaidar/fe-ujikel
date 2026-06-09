import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function KelasPage() {
  const [kelas, setKelas] = useState([]);
  const [emailSiswa, setEmailSiswa] = useState('');
  const [kelasId, setKelasId] = useState('');
  const [editKelas, setEditKelas] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchKelas = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/guru/kelas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      console.log('Data kelas:', data);
      if (data.status === 200) {
        setKelas(data.data || []);
      }
    } catch (error) { 
      console.error(error); 
    }
  };

  useEffect(() => { 
    fetchKelas(); 
  }, []);

  const updateKelas = async () => {
    if (!editKelas?.nama) return;
    const formData = new FormData();
    formData.append('nama', editKelas.nama);
    await fetch(`http://localhost:5000/api/guru/kelas/${editKelas.id}`, {
      method: 'PUT', 
      headers: { 'Authorization': `Bearer ${token}` }, 
      body: formData
    });
    setMessage('Kelas berhasil diupdate');
    setEditKelas(null);
    fetchKelas();
    setTimeout(() => setMessage(''), 3000);
  };

  const hapusKelas = async (id) => {
    if (!confirm('Yakin hapus kelas ini?')) return;
    await fetch(`http://localhost:5000/api/guru/kelas/${id}`, {
      method: 'DELETE', 
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setMessage('Kelas berhasil dihapus');
    fetchKelas();
    setTimeout(() => setMessage(''), 3000);
  };

  const tambahSiswa = async () => {
    if (!emailSiswa || !kelasId) 
       {
      setMessage('Email siswa wajib diisi');
      return;
    }
    
    const formData = new FormData();
    formData.append('Email Siswa', emailSiswa);
    
    try {
      const res = await fetch(`http://localhost:5000/api/guru/kelas/${kelasId}/siswa`, {
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` }, 
        body: formData
      });
      const data = await res.json();
      
      if (data.status === 200) {
        setMessage('Siswa berhasil ditambahkan');
        setEmailSiswa('');
        setKelasId('');
        fetchKelas();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Gagal tambah siswa');
      }
    } catch (error) {
      setMessage('Gagal tambah siswa');
    }
  };

  const hapusSiswaDariKelas = async (kelasId, siswaId, siswaNama) => {
    if (!confirm(`Yakin hapus ${siswaNama} dari kelas ini?`)) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/guru/kelas/${kelasId}/siswa/${siswaId}`, {
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.status === 200) {
        setMessage(`${siswaNama} berhasil dihapus dari kelas`);
        fetchKelas();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Gagal hapus siswa');
      }
    } catch (error) {
      setMessage('Gagal hapus siswa');
    }
  };

  return (
    <div>
      {message && <div className="message success-message">{message}</div>}
      
      <div className="card">
        <h3>Daftar Kelas</h3>
        {kelas.length === 0 && <p>Belum ada kelas. Buat kelas dulu!</p>}
        
        {kelas.map(k => (
          <div key={k.id} className="list-item">
            {editKelas?.id === k.id ? (
              // Mode EDIT
              <div>
                <input 
                  type="text" 
                  value={editKelas.nama} 
                  onChange={e => setEditKelas({ ...editKelas, nama: e.target.value })} 
                  style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
                />
                <div style={{ marginTop: '12px' }}>
                  <button className="btn btn-success" onClick={updateKelas}>Simpan</button>
                  <button className="btn btn-secondary" onClick={() => setEditKelas(null)}>Batal</button>
                </div>
              </div>
            ) : (
              // Mode VIEW
              <div>
                <h4>{k.nama}</h4>
                <p>Total Siswa: {k.siswaList?.length || 0} orang</p>
                
                {/* DAFTAR SISWA */}
                {k.siswaList && k.siswaList.length > 0 && (
                  <div style={{ marginTop: '10px', marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <strong>Daftar Siswa:</strong>
                    <ul style={{ marginTop: '8px', marginBottom: '0', paddingLeft: '20px' }}>
                      {k.siswaList.map(s => (
                        <li key={s.id} style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{s.nama} - {s.email}</span>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => hapusSiswaDariKelas(k.id, s.id, s.nama)}
                            style={{ padding: '4px 8px', fontSize: '12px' }}>
                            Hapus
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {kelasId === k.id ? (
                  <div style={{ marginTop: '12px' }}>
                    <input 
                      type="email" 
                      placeholder="Email siswa" 
                      value={emailSiswa} 
                      onChange={e => setEmailSiswa(e.target.value)} 
                      style={{ padding: '8px', marginRight: '8px', width: '250px' }}
                    />
                    <button className="btn btn-primary" onClick={tambahSiswa}>Tambah</button>
                    <button className="btn btn-secondary" onClick={() => setKelasId('')}>Batal</button>
                  </div>
                ) : (
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => setKelasId(k.id)}>
                      Tambah Siswa
                    </button>
                    <Link to={`/guru/kelas/${k.id}/edit`} className="btn btn-warning">
                      Edit
                    </Link>
                    <button className="btn btn-danger" onClick={() => hapusKelas(k.id)}>
                      Hapus Kelas
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default KelasPage;