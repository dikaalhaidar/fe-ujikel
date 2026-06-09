import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function KelasPage() {
  const [kelas, setKelas] = useState([]);
  const [emailSiswa, setEmailSiswa] = useState('');
  const [kelasId, setKelasId] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchKelas = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/guru/kelas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
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

  const hapusKelas = async (id) => {
    if (!confirm('Yakin hapus kelas ini?')) return;

    await fetch(`http://localhost:5000/api/guru/kelas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setMessage('Kelas berhasil dihapus');
    fetchKelas();
    setTimeout(() => setMessage(''), 3000);
  };

  const tambahSiswa = async () => {
    if (!emailSiswa || !kelasId) {
      setMessage('Email siswa wajib diisi');
      return;
    }

    const formData = new FormData();
    formData.append('emailSiswa', emailSiswa);

    try {
      const res = await fetch(`http://localhost:5000/api/guru/kelas/${kelasId}/siswa`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
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
        headers: { Authorization: `Bearer ${token}` },
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
    <div className="container">
      {message && <div className="message success-message">{message}</div>}

      <section className="page-header">
        <div>
          <span className="section-label">Guru • Kelas</span>
          
        </div>
        <div className="summary-chip">{kelas.length} Kelas Aktif</div>
      </section>

      <div className="kelas-list">
        {kelas.length === 0 ? (
          <div className="empty-state glass-card">
            <h3>Belum ada kelas</h3>
            <p>Buat kelas terlebih dahulu agar siswa dapat ditambahkan secara mudah.</p>
          </div>
        ) : (
          kelas.map((k) => (
            <article key={k.id} className="kelas-card glass-card">
              <div className="kelas-card-main">
                <div>
                  <h2>{k.nama}</h2>
                  <p className="kelas-meta">
                    Total siswa: <strong>{k.siswaList?.length || 0}</strong>
                  </p>
                </div>
                <span className="badge">Kelas aktif</span>
              </div>

              <>
                  {k.siswaList && k.siswaList.length > 0 && (
                    <div className="student-panel">
                      <div className="student-title">Daftar Siswa</div>
                      <ul className="student-list">
                        {k.siswaList.map((s) => (
                          <li key={s.id} className="student-item">
                            <div>
                              <strong>{s.nama}</strong>
                              <div className="student-email">{s.email}</div>
                            </div>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => hapusSiswaDariKelas(k.id, s.id, s.nama)}
                            >
                              Hapus
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {kelasId === k.id ? (
                    <div className="input-panel">
                      <label className="form-group flex-grow">
                        <span>Masukkan email siswa</span>
                        <input
                          type="email"
                          className="input-text"
                          placeholder="contoh@mail.com"
                          value={emailSiswa}
                          onChange={(e) => setEmailSiswa(e.target.value)}
                        />
                      </label>
                      <div className="btn-group wrap">
                        <button className="btn btn-primary" onClick={tambahSiswa}>
                          Tambah Siswa
                        </button>
                        <button className="btn btn-outline" onClick={() => setKelasId('')}>
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="kelas-actions">
                      <div className="btn-group wrap">
                        <button className="btn btn-primary" onClick={() => setKelasId(k.id)}>
                          Tambah Siswa
                        </button>
                        <button className="btn btn-danger" onClick={() => hapusKelas(k.id)}>
                          Hapus
                        </button>
                      </div>
                      <Link to={`/guru/kelas/${k.id}/edit`} className="btn btn-warning btn-sm">
                        Edit Kelas
                      </Link>
                    </div>
                  )}
                </>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default KelasPage;
