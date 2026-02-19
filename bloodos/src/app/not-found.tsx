
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '60px 48px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        maxWidth: '480px',
        width: '100%',
      }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>🔍</div>
        <div style={{ fontSize: '96px', fontWeight: 900, color: '#dc2626', lineHeight: 1, marginBottom: '8px' }}>
          404
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>
          Page Not Found
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.6, margin: '0 0 32px' }}>
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved. Let&rsquo;s get you back on track.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            background: '#dc2626', color: '#fff',
            padding: '12px 24px', borderRadius: '8px',
            textDecoration: 'none', fontWeight: 700, fontSize: '14px',
          }}>
            Go Home
          </Link>
          <Link href="/dashboard" style={{
            background: '#f9fafb', color: '#374151',
            padding: '12px 24px', borderRadius: '8px',
            textDecoration: 'none', fontWeight: 600, fontSize: '14px',
            border: '1px solid #e5e7eb',
          }}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
