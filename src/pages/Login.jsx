import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.role) {
        navigate(user.role === 'guru' ? '/guru' : '/siswa');
      } else {
        setError('Data user tidak valid');
      }
    } else {
      setError(result.error || 'Login gagal');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2> Selamat Datang</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label> Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
            />
          </div>
          <div className="form-group">
            <label> Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />
          </div>
          <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? ' Loading...' : ' Login'}
          </Button>
        </form>
        <div className="auth-link">
          Belum punya akun? <Link to="/register">Daftar Sekarang</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;