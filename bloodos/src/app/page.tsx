
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Home',
  description: 'BloodOS — A mission-driven platform connecting blood donors with hospitals and NGOs.',
};

export default function HomePage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '60px 24px' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
        borderRadius: '16px',
        padding: '60px 40px',
        color: '#fff',
        marginBottom: '48px',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🩸</div>
        <h1 style={{ fontSize: '40px', fontWeight: 800, margin: '0 0 16px' }}>Welcome to BloodOS</h1>
        <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '500px', margin: '0 auto 32px' }}>
          Connecting blood donors with hospitals and NGOs — saving lives, one drop at a time.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{
            background: '#fff',
            color: '#dc2626',
            padding: '12px 28px',
            borderRadius: '8px',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '16px',
          }}>
            Get Started →
          </Link>
          <Link href="/users" style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '16px',
            border: '2px solid rgba(255,255,255,0.4)',
          }}>
            View Users
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {[
          { label: 'Donors Registered', value: '12,450' },
          { label: 'Blood Requests', value: '3,200' },
          { label: 'Lives Saved', value: '8,900' },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#dc2626' }}>{value}</div>
            <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
