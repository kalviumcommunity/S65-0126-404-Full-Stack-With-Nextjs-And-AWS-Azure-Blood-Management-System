
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Browse registered BloodOS donors and hospital users.',
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  donorProfile?: { fullName: string } | null;
  hospitalProfile?: { name: string } | null;
}

// ─── Role Badge Colors ─────────────────────────────────────────────────────────
const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  DONOR:    { bg: '#dcfce7', text: '#16a34a' },
  HOSPITAL: { bg: '#dbeafe', text: '#2563eb' },
  ADMIN:    { bg: '#fee2e2', text: '#dc2626' },
  NGO:      { bg: '#fef9c3', text: '#ca8a04' },
};

/**
 * Server-side data fetch — simulates realistic API latency.
 * loading.tsx renders automatically while this resolves.
 * error.tsx renders automatically if this throws.
 */
async function fetchUsers(simulateError: boolean): Promise<User[]> {
  // Simulate network delay — loading.tsx shows during this wait
  await new Promise((r) => setTimeout(r, 2000));

  // Simulate server error when ?error=1 is passed
  if (simulateError) {
    throw new Error('Failed to load user data: Database connection timeout');
  }

  // Fetch real data from our API
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/users?page=1&limit=10`, {
    cache: 'no-store', // Always fresh — disable Next.js caching for this demo
  });

  if (!res.ok) {
    throw new Error(`API responded with status ${res.status}`);
  }

  const json = await res.json();
  return json.data?.users ?? [];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const simulateError = params.error === '1';

  // This await triggers loading.tsx; throwing triggers error.tsx
  const users = await fetchUsers(simulateError);

  return (
    <div style={{ maxWidth: '820px' }}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '20px', fontSize: '13px', color: '#6b7280' }}>
        <Link href="/" style={{ color: '#dc2626', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#374151', fontWeight: 600 }} aria-current="page">Users</span>
      </nav>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>
            👥 Users
          </h1>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
            Server component — 2s simulated fetch delay
          </p>
        </div>

        {/* Test links */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link href="/users" style={{
            padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
            background: '#dcfce7', color: '#16a34a', textDecoration: 'none', border: '1px solid #86efac',
          }}>
            ✅ Normal
          </Link>
          <Link href="/users?error=1" style={{
            padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
            background: '#fef2f2', color: '#dc2626', textDecoration: 'none', border: '1px solid #fca5a5',
          }}>
            💥 Simulate Error
          </Link>
        </div>
      </div>

      {/* Users list */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        borderTop: '3px solid #dc2626',
      }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>
          {users.length} Users Found
        </p>

        {users.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '32px' }}>
            No users found. The database may be empty.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {users.map((user) => {
              const roleStyle = ROLE_COLORS[user.role] ?? { bg: '#f3f4f6', text: '#374151' };
              const displayName =
                user.donorProfile?.fullName ??
                user.hospitalProfile?.name ??
                user.email.split('@')[0];

              return (
                <Link key={user.id} href={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderRadius: '10px',
                    border: '1px solid #f3f4f6', background: '#fafafa',
                    cursor: 'pointer', transition: 'border-color 0.15s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: '#fef2f2', color: '#dc2626',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '16px', flexShrink: 0,
                      }}>
                        {displayName[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#111827' }}>
                          {displayName}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{user.email}</p>
                      </div>
                    </div>
                    <span style={{
                      background: roleStyle.bg, color: roleStyle.text,
                      padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                    }}>
                      {user.role}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Implementation note */}
      <div style={{
        marginTop: '20px', padding: '16px 20px',
        background: '#f0f9ff', borderRadius: '10px',
        border: '1px solid #bae6fd', fontSize: '13px', color: '#0369a1',
      }}>
        <strong>How it works:</strong> This page is a Server Component. The 2s fetch delay
        triggers <code>loading.tsx</code> automatically. Passing <code>?error=1</code> throws
        an error which triggers <code>error.tsx</code> automatically — no extra code needed.
      </div>
    </div>
  );
}
