
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Loader } from '@/components/ui/Loader';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button, Card } from '@/components';

// Mock user list for delete demonstration
const INITIAL_USERS = [
  { id: 1, name: 'Alice Kumar', role: 'DONOR', email: 'alice@bloodos.com' },
  { id: 2, name: 'City General Hospital', role: 'HOSPITAL', email: 'admin@citygeneral.com' },
  { id: 3, name: 'Bob Sharma', role: 'DONOR', email: 'bob@bloodos.com' },
];

export default function FeedbackDemoPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ── Full delete flow: Modal → Loader → Toast ────────────────────────────────
  const handleDeleteClick = (id: number) => setPendingDeleteId(id);

  const handleDeleteConfirm = async () => {
    const id = pendingDeleteId!;
    setPendingDeleteId(null); // Close modal
    setDeletingId(id);        // Show inline loader

    const loadingToast = toast.loading('Deleting user...');

    try {
      // Simulate async API call
      await new Promise((r) => setTimeout(r, 1800));

      // 80% success, 20% failure for demo
      if (Math.random() > 0.2) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success('User deleted successfully', { id: loadingToast });
      } else {
        throw new Error('Server error');
      }
    } catch {
      toast.error('Failed to delete user. Please try again.', { id: loadingToast });
    } finally {
      setDeletingId(null);
    }
  };

  // ── Manual toast triggers for demo ─────────────────────────────────────────
  const showSuccessToast = () => toast.success('Operation completed successfully!');
  const showErrorToast = () => toast.error('Something went wrong. Please try again.');
  const showLoadingToast = async () => {
    setIsLoading(true);
    const t = toast.loading('Processing your request...');
    await new Promise((r) => setTimeout(r, 2000));
    toast.success('Done! Data saved.', { id: t });
    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: '860px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
            🎨 Feedback UI & Theming — Assignment 2.31
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
            Toasts · Modals · Loaders · Dark Mode · Responsive Design
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* ── SECTION 1: Toast Demos ──────────────────────────────────────────── */}
      <Card title="🔔 Toast Notifications" subtitle="react-hot-toast — auto-dismiss with aria-live" accentColor="#16a34a">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
          <Button label="✅ Success Toast" variant="primary" size="sm"
            onClick={showSuccessToast}
            style={{ background: '#16a34a', borderColor: '#16a34a' }}
          />
          <Button label="❌ Error Toast" variant="danger" size="sm" onClick={showErrorToast} />
          <Button
            label={isLoading ? 'Loading...' : '⏳ Loading Toast'}
            variant="secondary"
            size="sm"
            isLoading={isLoading}
            onClick={showLoadingToast}
          />
        </div>
        <div style={{
          marginTop: '14px', padding: '10px 14px', background: 'var(--bg-primary)',
          borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace',
        }}>
          toast.success() → toast.error() → toast.loading() + toast.success(id)
        </div>
      </Card>

      {/* ── SECTION 2: Loader Demo ──────────────────────────────────────────── */}
      <div style={{ marginTop: '20px' }}>
        <Card title="⏳ Loader / Spinner" subtitle="role='status' aria-live='polite' — 3 sizes" accentColor="#2563eb">
          <div style={{
            display: 'flex', alignItems: 'center', gap: '32px',
            flexWrap: 'wrap', marginTop: '16px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <Loader size="sm" label="Small" />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>sm</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Loader size="md" label="Medium" />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>md</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Loader size="lg" label="Large" />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>lg</p>
            </div>
            <div>
              <Loader size="sm" label="Inline loader" inline />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>inline mode</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── SECTION 3: Delete Flow Demo ─────────────────────────────────────── */}
      <div style={{ marginTop: '20px' }}>
        <Card
          title="🗑️ Full Delete Flow"
          subtitle="Click Delete → Modal → Confirm → Loader → Toast"
          accentColor="#dc2626"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            {users.map((user) => (
              <div key={user.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: '10px',
                border: '1px solid var(--border)', background: 'var(--bg-primary)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: '#fef2f2', color: '#dc2626',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700,
                  }}>
                    {user.name[0]}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{user.name}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                </div>

                {deletingId === user.id ? (
                  <Loader size="sm" label="Deleting..." inline />
                ) : (
                  <Button
                    label="Delete"
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(user.id)}
                  />
                )}
              </div>
            ))}
            {users.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
                ✅ All users deleted. Refresh to reset.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── SECTION 4: Responsive Grid Demo ─────────────────────────────────── */}
      <div style={{ marginTop: '20px' }}>
        <Card title="📐 Responsive Grid" subtitle="1 col mobile → 2 col tablet → 3 col desktop" accentColor="#7c3aed">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '16px',
          }}>
            {['Mobile', 'Tablet', 'Desktop', 'Wide'].map((label, i) => (
              <div key={label} style={{
                padding: '20px',
                borderRadius: '10px',
                background: `hsl(${i * 60}, 70%, 95%)`,
                border: `1px solid hsl(${i * 60}, 60%, 85%)`,
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: 600,
                color: `hsl(${i * 60}, 50%, 35%)`,
              }}>
                {['📱', '📟', '💻', '🖥️'][i]} {label}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '10px', fontFamily: 'monospace' }}>
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))
          </p>
        </Card>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={pendingDeleteId !== null}
        title="Delete User"
        message={`Are you sure you want to delete "${users.find(u => u.id === pendingDeleteId)?.name}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Keep User"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
