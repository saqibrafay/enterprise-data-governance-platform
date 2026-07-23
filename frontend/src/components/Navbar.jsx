import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // clears token + user from Redux
    navigate('/login');
  };

  return (
    <nav style={s.nav}>
      <Link to="/dashboard" style={s.brand}>Data Governance Platform</Link>
      <div style={s.right}>
        {token ? (
          <>
            <span style={s.meta}>{user?.name} · {user?.role?.name}</span>
            <button onClick={handleLogout} style={s.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={s.link}>Login</Link>
            <Link to="/register" style={s.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const s = {
  nav:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 2rem', background: '#1a1a2e', color: '#fff' },
  brand: { color: '#e94560', fontWeight: 700, fontSize: '1.1rem' },
  right: { display: 'flex', alignItems: 'center', gap: '1.2rem' },
  link:  { color: '#ddd', fontSize: '0.95rem' },
  meta:  { color: '#aaa', fontSize: '0.9rem' },
  btn:   { background: '#e94560', color: '#fff', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 },
};
