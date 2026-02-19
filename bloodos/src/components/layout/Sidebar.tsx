
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/users', label: 'Users', icon: '👥' },
  { href: '/users/1', label: 'My Profile', icon: '👤' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      role="complementary"
      aria-label="Sidebar navigation"
      style={{
        width: '220px',
        minHeight: 'calc(100vh - 60px)',
        background: '#fff',
        borderRight: '1px solid #f3f4f6',
        padding: '24px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flexShrink: 0,
      }}
    >
      <p style={{
        fontSize: '11px',
        fontWeight: 700,
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '8px',
        padding: '0 12px',
      }}>
        Navigation
      </p>

      <nav role="navigation" aria-label="Sidebar navigation">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#dc2626' : '#374151',
                background: isActive ? '#fef2f2' : 'transparent',
                transition: 'background 0.15s, color 0.15s',
                marginBottom: '2px',
              }}
            >
              <span style={{ fontSize: '16px' }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ marginTop: 'auto', padding: '16px 12px', borderTop: '1px solid #f3f4f6' }}>
        <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
          BloodOS v1.0
        </p>
        <p style={{ fontSize: '11px', color: '#d1d5db', margin: '2px 0 0' }}>
          Connecting Lives
        </p>
      </div>
    </aside>
  );
}
