
import Link from 'next/link';

interface HeaderProps {
  brandName?: string;
}

export function Header({ brandName = 'BloodOS' }: HeaderProps) {
  return (
    <header
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      {/* Brand */}
      <Link
        href="/"
        aria-label="Go to BloodOS Homepage"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
        }}
      >
        <span style={{ fontSize: '24px' }}>🩸</span>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '20px', letterSpacing: '0.5px' }}>
          {brandName}
        </span>
      </Link>

      {/* Top-right Nav */}
      <nav role="navigation" aria-label="Primary navigation" style={{ display: 'flex', gap: '8px' }}>
        {[
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/users', label: 'Users' },
          { href: '/login', label: 'Login' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              color: '#fecaca',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 500,
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'background 0.2s',
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
