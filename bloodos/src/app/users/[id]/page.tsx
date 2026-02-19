
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mock data store — production would fetch from DB
const MOCK_USERS: Record<string, { id: string; name: string; role: string; bloodType: string; email: string; city: string; donations: number }> = {
  '1': { id: '1', name: 'Alice Kumar', role: 'DONOR', bloodType: 'O+', email: 'alice@example.com', city: 'Bangalore', donations: 5 },
  '2': { id: '2', name: 'City General Hospital', role: 'HOSPITAL', bloodType: '—', email: 'admin@citygeneral.com', city: 'Mumbai', donations: 0 },
  '3': { id: '3', name: 'Bob Sharma', role: 'DONOR', bloodType: 'A-', email: 'bob@example.com', city: 'Delhi', donations: 3 },
  '4': { id: '4', name: 'NGO LifeBlood', role: 'NGO', bloodType: '—', email: 'contact@lifeblood.org', city: 'Chennai', donations: 0 },
  '5': { id: '5', name: 'Admin User', role: 'ADMIN', bloodType: '—', email: 'admin@bloodos.com', city: 'Hyderabad', donations: 0 },
};

// Dynamic metadata per user
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const user = MOCK_USERS[id];
  if (!user) return { title: 'User Not Found' };
  return {
    title: `${user.name}`,
    description: `Profile of ${user.name} — ${user.role} at BloodOS`,
  };
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = MOCK_USERS[id];

  // Trigger Next.js 404 if user not found
  if (!user) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      {/* Breadcrumb — Home > Users > User {id} */}
      <nav style={{ marginBottom: '24px', fontSize: '13px', color: '#6b7280' }}>
        <Link href="/" style={{ color: '#dc2626', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <Link href="/users" style={{ color: '#dc2626', textDecoration: 'none' }}>Users</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#374151', fontWeight: 600 }}>User {id}</span>
      </nav>

      {/* Profile Card */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', fontWeight: 700, color: '#fff',
            border: '3px solid rgba(255,255,255,0.4)',
          }}>
            {user.name[0]}
          </div>
          <div>
            <h1 style={{ color: '#fff', margin: 0, fontSize: '26px', fontWeight: 800 }}>{user.name}</h1>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
              display: 'inline-block', marginTop: '8px',
            }}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              { label: 'User ID', value: `#${user.id}` },
              { label: 'Email', value: user.email },
              { label: 'City', value: user.city },
              { label: 'Blood Type', value: user.bloodType },
              { label: 'Total Donations', value: user.donations.toString() },
              { label: 'Route', value: `/users/${user.id}` },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: '#f9fafb',
                padding: '16px',
                borderRadius: '8px',
              }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {label}
                </div>
                <div style={{ fontSize: '15px', color: '#111827', fontWeight: 600, marginTop: '4px' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f3f4f6' }}>
            <Link href="/users" style={{
              background: '#fef2f2', color: '#dc2626',
              padding: '10px 20px', borderRadius: '8px',
              textDecoration: 'none', fontSize: '14px', fontWeight: 600,
            }}>
              ← Back to Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
