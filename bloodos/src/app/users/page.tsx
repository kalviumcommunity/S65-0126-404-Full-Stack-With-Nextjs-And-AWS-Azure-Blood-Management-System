
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Browse registered BloodOS donors and hospital users.',
};

// Mock user list — in production, fetch from /api/users with server-side auth
const MOCK_USERS = [
  { id: '1', name: 'Alice Kumar', role: 'DONOR', bloodType: 'O+' },
  { id: '2', name: 'City General Hospital', role: 'HOSPITAL', bloodType: '—' },
  { id: '3', name: 'Bob Sharma', role: 'DONOR', bloodType: 'A-' },
  { id: '4', name: 'NGO LifeBlood', role: 'NGO', bloodType: '—' },
  { id: '5', name: 'Admin User', role: 'ADMIN', bloodType: '—' },
];

const ROLE_COLORS: Record<string, string> = {
  DONOR: '#16a34a',
  HOSPITAL: '#2563eb',
  ADMIN: '#dc2626',
  NGO: '#d97706',
};

export default function UsersPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '24px', fontSize: '13px', color: '#6b7280' }}>
        <Link href="/" style={{ color: '#dc2626', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#374151', fontWeight: 600 }}>Users</span>
      </nav>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: 0 }}>All Users</h1>
        <span style={{
          background: '#fef2f2', color: '#dc2626',
          padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
        }}>
          {MOCK_USERS.length} users
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {MOCK_USERS.map((user) => (
          <Link key={user.id} href={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px 24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.15s, box-shadow 0.15s',
              cursor: 'pointer',
              border: '1px solid #f3f4f6',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: '#fef2f2', color: '#dc2626',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '18px',
                }}>
                  {user.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#111827', fontSize: '15px' }}>{user.name}</div>
                  {user.bloodType !== '—' && (
                    <div style={{ color: '#6b7280', fontSize: '13px' }}>Blood Type: {user.bloodType}</div>
                  )}
                </div>
              </div>
              <span style={{
                background: `${ROLE_COLORS[user.role]}20`,
                color: ROLE_COLORS[user.role],
                padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
              }}>
                {user.role}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
