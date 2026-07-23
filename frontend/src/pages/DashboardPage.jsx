import React from 'react';
import { useSelector } from 'react-redux';

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.heading}>Dashboard</h1>
        <p style={s.welcome}>Welcome back, <strong>{user?.name}</strong></p>

        <div style={s.grid}>
          <InfoRow label="Email"  value={user?.email} />
          <InfoRow label="Role"   value={<span style={s.badge}>{user?.role?.name}</span>} />
          <InfoRow label="User ID" value={`#${user?.id}`} />
        </div>

        <p style={s.hint}>
          Week 2 coming next: data catalog, lineage graph, policy management…
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={s.row}>
      <span style={s.label}>{label}</span>
      <span style={s.value}>{value}</span>
    </div>
  );
}

const s = {
  page:    { display: 'flex', justifyContent: 'center', paddingTop: '4rem' },
  card:    { background: '#fff', padding: '2.5rem', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '480px' },
  heading: { color: '#1a1a2e', marginBottom: '0.4rem' },
  welcome: { color: '#555', marginBottom: '2rem', fontSize: '1.05rem' },
  grid:    { display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' },
  row:     { display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f0f0f0' },
  label:   { color: '#888', fontSize: '0.9rem', fontWeight: 600 },
  value:   { color: '#333', fontSize: '0.9rem' },
  badge:   { background: '#1a1a2e', color: '#e94560', padding: '0.2rem 0.7rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem' },
  hint:    { color: '#aaa', fontSize: '0.85rem', fontStyle: 'italic' },
};
