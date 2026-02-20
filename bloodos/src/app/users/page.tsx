
'use client';

import useSWR, { useSWRConfig } from 'swr';
import { useState } from 'react';
import { fetcher } from '@/lib/fetcher';
import { Card, Button } from '@/components';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  donorProfile?: { fullName: string } | null;
  hospitalProfile?: { name: string } | null;
}

interface UsersResponse {
  users: User[];
  pagination: { total: number; page: number; totalPages: number };
}

// ─── Role Badge Colors ─────────────────────────────────────────────────────────
const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  DONOR:    { bg: '#dcfce7', text: '#16a34a' },
  HOSPITAL: { bg: '#dbeafe', text: '#2563eb' },
  ADMIN:    { bg: '#fee2e2', text: '#dc2626' },
  NGO:      { bg: '#fef9c3', text: '#ca8a04' },
};

// ─── Loading Skeleton ──────────────────────────────────────────────────────────
function UserSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{
          height: '72px', borderRadius: '10px',
          background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.4s infinite',
        }} />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
    </div>
  );
}

// ─── Cache Inspector ──────────────────────────────────────────────────────────
function CacheInspector({ swrKey }: { swrKey: string }) {
  const { cache } = useSWRConfig();
  const [log, setLog] = useState<string>('');

  const inspect = () => {
    const cached = cache.get(swrKey);
    const output = JSON.stringify(cached, null, 2);
    setLog(output ?? 'No cache entry found');
    console.info('[SWR Cache]', swrKey, cached);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <Button label="🔍 Inspect SWR Cache" variant="ghost" size="sm" onClick={inspect} />
      {log && (
        <pre style={{
          marginTop: '10px', padding: '12px', borderRadius: '8px',
          background: '#111827', color: '#86efac',
          fontSize: '11px', overflowX: 'auto', maxHeight: '200px',
        }}>
          {log}
        </pre>
      )}
    </div>
  );
}

// ─── Add User Form (Optimistic UI) ────────────────────────────────────────────
function AddUserForm({ onMutate }: { onMutate: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('DONOR');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password: 'Password123!', role }),
      });

      if (!res.ok) throw new Error('Failed to create user');

      setStatus('success');
      setEmail('');

      // 🔄 Revalidate cache — SWR refetches /api/users
      onMutate();

      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '24px',
    }}>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
          Email
        </label>
        <input
          type="email"
          required
          placeholder="new@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #d1d5db',
            fontSize: '13px', outline: 'none', width: '200px',
          }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #d1d5db',
            fontSize: '13px', background: '#fff',
          }}
        >
          {['DONOR', 'HOSPITAL', 'NGO', 'ADMIN'].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <Button
        label={status === 'loading' ? 'Adding...' : '+ Add User'}
        variant="primary"
        size="sm"
        type="submit"
        isLoading={status === 'loading'}
      />
      {status === 'success' && (
        <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: 600 }}>✅ User added!</span>
      )}
      {status === 'error' && (
        <span style={{ color: '#dc2626', fontSize: '13px', fontWeight: 600 }}>❌ Failed to add user</span>
      )}
    </form>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function UsersPage() {
  // 1️⃣ SWR_KEY defines cache identity — same key = shared cache across components
  const SWR_KEY = '/api/users?page=1&limit=10';

  // 2️⃣ useSWR with revalidation config
  const { data, error, isLoading, mutate } = useSWR<UsersResponse>(
    SWR_KEY,
    fetcher,
    {
      revalidateOnFocus: true,       // Revalidate when tab regains focus
      refreshInterval: 30_000,       // Poll every 30 seconds
      onErrorRetry: (err, _key, _config, revalidate, { retryCount }) => {
        // Stop retrying after 3 attempts or on 404
        if (err.status === 404) return;
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 3000 * retryCount);
      },
    }
  );

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  return (
    <div style={{ maxWidth: '820px' }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '20px', fontSize: '13px', color: '#6b7280' }}>
        <a href="/" style={{ color: '#dc2626', textDecoration: 'none' }}>Home</a>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#374151', fontWeight: 600 }}>Users (SWR)</span>
      </nav>

      <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
        👥 Users — SWR Data Fetching
      </h1>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
        Cache key: <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{SWR_KEY}</code>
        {' • '}revalidateOnFocus: ON {' • '} refreshInterval: 30s
      </p>

      {/* Add User Form */}
      <Card title="➕ Add New User" subtitle="Optimistic UI — cache invalidated on success" accentColor="#16a34a">
        <div style={{ marginTop: '12px' }}>
          <AddUserForm onMutate={() => mutate()} />
        </div>
      </Card>

      {/* Users List */}
      <div style={{ marginTop: '24px' }}>
        {/* Loading State */}
        {isLoading && (
          <Card title="Loading..." accentColor="#e5e7eb">
            <div style={{ marginTop: '12px' }}>
              <UserSkeleton />
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderRadius: '12px', padding: '24px',
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <span style={{ fontSize: '32px' }}>⚠️</span>
            <div>
              <p style={{ color: '#dc2626', fontWeight: 700, margin: 0 }}>Failed to load users</p>
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: '4px 0 12px' }}>
                {error.message} {error.status ? `(HTTP ${error.status})` : ''}
              </p>
              <Button label="Retry" variant="danger" size="sm" onClick={() => mutate()} />
            </div>
          </div>
        )}

        {/* Data State */}
        {!isLoading && !error && (
          <Card
            title={`Users (${pagination?.total ?? 0} total)`}
            subtitle={`Page ${pagination?.page ?? 1} of ${pagination?.totalPages ?? 1}`}
            accentColor="#dc2626"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
              {users.length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                  No users found
                </p>
              ) : (
                users.map((user) => {
                  const roleStyle = ROLE_COLORS[user.role] ?? { bg: '#f3f4f6', text: '#374151' };
                  const displayName = user.donorProfile?.fullName
                    ?? user.hospitalProfile?.name
                    ?? user.email.split('@')[0];

                  return (
                    <div key={user.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', borderRadius: '10px',
                      border: '1px solid #f3f4f6', background: '#fafafa',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '38px', height: '38px', borderRadius: '50%',
                          background: '#fef2f2', color: '#dc2626',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '16px',
                        }}>
                          {displayName[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#111827' }}>{displayName}</p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{user.email}</p>
                        </div>
                      </div>
                      <span style={{
                        background: roleStyle.bg, color: roleStyle.text,
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                      }}>
                        {user.role}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Manual revalidation button */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '10px' }}>
              <Button label="🔄 Refresh Now" variant="secondary" size="sm" onClick={() => mutate()} />
            </div>
          </Card>
        )}
      </div>

      {/* Cache Inspector */}
      <div style={{ marginTop: '24px' }}>
        <Card title="🔍 SWR Cache Inspector" subtitle="Inspect live cache state in the browser" accentColor="#7c3aed">
          <CacheInspector swrKey={SWR_KEY} />
        </Card>
      </div>
    </div>
  );
}
