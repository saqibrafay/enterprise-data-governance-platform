import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../store/slices/authSlice';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { loading, error, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Already logged in? Skip to dashboard
  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true });
  }, [token, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser(form));
    // Navigation happens automatically via the useEffect above when token arrives
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>Sign In</h2>

        {error && <p style={s.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={s.input}
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            autoFocus
          />
          <input
            style={s.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={s.footer}>
          No account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page:  { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 56px)' },
  card:  { background: '#fff', padding: '2.5rem', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '380px' },
  title: { marginBottom: '1.5rem', color: '#1a1a2e', fontSize: '1.5rem' },
  input: { display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' },
  btn:   { width: '100%', padding: '0.85rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' },
  error: { background: '#fff0f0', color: '#c0392b', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' },
  footer:{ textAlign: 'center', marginTop: '1.2rem', color: '#666', fontSize: '0.9rem' },
};
