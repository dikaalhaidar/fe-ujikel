import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';

function TugasSelesaiPage() {
  const [tugasList, setTugasList] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Ambil semua tugas guru
  const fetchTugas = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/guru/tugas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 200) {
        // Filter tugas yang sudah ada pengumpulan
        setTugasList(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tugas:', error);
    }
  };

  // Ambil pengumpulan berdasarkan tugas ID
  const fetchSubmissions = async (tugasId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/guru/tugas/${tugasId}/pengumpulan`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 200) {
        const submissionsData = data.data || [];
        setSubmissions(submissionsData);
        const gradesObj = {};
        submissionsData.forEach(sub => {
          gradesObj[sub.id] = sub.nilai || '';
        });
        setGrades(gradesObj);
      }
    } catch (error) {
      console.error(error);
      setSubmissions([]);
    }
  };

  useEffect(() => {
    fetchTugas();
  }, []);

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    fetchSubmissions(task.id);
  };

  const handleGradeChange = (submissionId, value) => {
    setGrades({ ...grades, [submissionId]: value });
  };

  const saveGrade = async (submissionId) => {
    if (!grades[submissionId]) {
      setMessage('Nilai tidak boleh kosong');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nilai', grades[submissionId]);
      const res = await fetch(`http://localhost:5000/api/guru/pengumpulan/${submissionId}/nilai`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.status === 200) {
        setMessage('Nilai berhasil disimpan');
        fetchSubmissions(selectedTask.id);
      } else {
        setMessage(data.message || 'Gagal menyimpan nilai');
      }
    } catch (error) {
      setMessage('Error menyimpan nilai');
      console.error(error);
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const downloadFile = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000${fileUrl}`;
    link.download = fileName;
    link.click();
  };

  // Filter tugas yang sudah ada pengumpulan
  const tugasDenganPengumpulan = tugasList.filter(t => t.totalDikumpulkan > 0);

  return (
    <div>
      {message && <div className="message success-message">{message}</div>}
      
      <div className="card">
        <h3>Penilaian Tugas Siswa</h3>
        {tugasDenganPengumpulan.length === 0 ? (
          <p>Belum ada tugas yang dikumpulkan siswa.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {tugasDenganPengumpulan.map(task => (
              <div
                key={task.id}
                style={{
                  padding: '16px',
                  border: selectedTask?.id === task.id ? '2px solid #0458f4' : '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedTask?.id === task.id ? '#f0f7ff' : 'white',
                }}
                onClick={() => handleSelectTask(task)}
              >
                <h4>{task.judul}</h4>
                <p>Kelas: {task.kelas?.nama}</p>
                <Button variant="primary" style={{ width: '100%' }}>
                  Lihat Penilaian
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTask && (
        <div className="card">
          <h3>{selectedTask.judul} - Penilaian</h3>
          <p>Kelas: {selectedTask.kelas?.nama}</p>
          <p>Total yang dikumpulkan: {submissions.length} siswa</p>

          {submissions.length === 0 ? (
            <p>Belum ada siswa yang mengumpulkan tugas ini.</p>
          ) : (
            <div style={{ marginTop: '20px' }}>
              {submissions.map(sub => (
                <div key={sub.id} className="list-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <h4>{sub.siswa?.nama}</h4>
                      <p>Email: {sub.siswa?.email}</p>
                      <p>Dikumpulkan: {new Date(sub.waktuKumpul).toLocaleString()}</p>
                      <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                        <Button
                          variant="primary"
                          onClick={() => downloadFile(sub.fileUrl, `${sub.siswa?.nama}-${selectedTask.judul}`)}
                        >
                          Download File
                        </Button>
                      </div>
                    </div>
                    <div style={{ minWidth: '200px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                        Nilai (0-100):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grades[sub.id]}
                        onChange={e => handleGradeChange(sub.id, e.target.value)}
                        placeholder="Masukkan nilai"
                        style={{
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          width: '100%',
                          marginBottom: '8px'
                        }}
                      />
                      {sub.nilai && (
                        <p style={{ color: '#28a745', fontSize: '12px', marginBottom: '8px' }}>
                          Nilai tersimpan: {sub.nilai}
                        </p>
                      )}
                      <Button
                        variant="success"
                        onClick={() => saveGrade(sub.id)}
                        disabled={loading}
                        style={{ width: '100%' }}
                      >
                        {loading ? 'Menyimpan...' : 'Simpan Nilai'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TugasSelesaiPage;