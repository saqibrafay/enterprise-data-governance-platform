import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../store/slices/authSlice';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [success, setSuccess] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(registerUser(form));
    // registerUser.fulfilled.match() is a type-safe way to check the outcome
    if (registerUser.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>Create Account</h2>

        {success && <p style={s.success}>Account created! Redirecting to login…</p>}
        {error   && <p style={s.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={s.input}
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
            autoFocus
          />
          <input
            style={s.input}
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
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
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <p style={s.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page:    { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 56px)' },
  card:    { background: '#fff', padding: '2.5rem', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '380px' },
  title:   { marginBottom: '1.5rem', color: '#1a1a2e', fontSize: '1.5rem' },
  input:   { display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' },
  btn:     { width: '100%', padding: '0.85rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' },
  error:   { background: '#fff0f0', color: '#c0392b', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' },
  success: { background: '#f0fff4', color: '#27ae60', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' },
  footer:  { textAlign: 'center', marginTop: '1.2rem', color: '#666', fontSize: '0.9rem' },
};
