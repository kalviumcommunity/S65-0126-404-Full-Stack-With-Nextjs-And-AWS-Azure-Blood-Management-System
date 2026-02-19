
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'BloodOS Dashboard — Overview of blood donations, requests, and inventory.',
};

// In a real app, you'd fetch real stats from an API here using cookies
export default function DashboardPage() {
  const stats = [
    { label: 'My Donations', value: '3', icon: '🩸', color: '#dc2626' },
    { label: 'Active Requests', value: '2', icon: '📋', color: '#2563eb' },
    { label: 'Notifications', value: '5', icon: '🔔', color: '#d97706' },
    { label: 'Matched Donors', value: '12', icon: '🤝', color: '#16a34a' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '24px', fontSize: '13px', color: '#6b7280' }}>
        <Link href="/" style={{ color: '#dc2626', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#374151', fontWeight: 600 }}>Dashboard</span>
      </nav>

      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
        Welcome Back 👋
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>Here&rsquo;s your BloodOS overview</p>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            borderLeft: `4px solid ${color}`,
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color }}>{value}</div>
            <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { href: '/users', label: 'View All Users' },
            { href: '/users/1', label: 'My Profile' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              background: '#fef2f2', color: '#dc2626',
              padding: '8px 20px', borderRadius: '8px',
              textDecoration: 'none', fontSize: '14px', fontWeight: 600,
            }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
