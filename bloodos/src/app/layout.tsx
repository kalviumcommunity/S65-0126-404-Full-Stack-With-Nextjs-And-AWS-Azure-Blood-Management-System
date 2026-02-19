
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: { template: '%s | BloodOS', default: 'BloodOS — Connecting Lives' },
  description: 'BloodOS is a full-stack blood management platform connecting donors, hospitals, and NGOs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f8fafc' }}>
        {/* ── Navigation Bar ── */}
        <nav style={{
          background: '#dc2626',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '60px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <Link href="/" style={{ color: '#fff', fontWeight: 700, fontSize: '20px', textDecoration: 'none' }}>
            🩸 BloodOS
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { href: '/', label: 'Home' },
              { href: '/login', label: 'Login' },
              { href: '/dashboard', label: 'Dashboard' },
              { href: '/users', label: 'Users' },
              { href: '/users/1', label: 'User #1' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                color: '#fecaca',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}>
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* ── Page Content ── */}
        <main style={{ minHeight: 'calc(100vh - 60px)', padding: '40px 24px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
