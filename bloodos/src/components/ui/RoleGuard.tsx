
'use client';

import { type Permission, type Role, hasPermission } from '@/config/roles';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  /** Permission required to render children */
  permission: Permission;
  /** Optional: rendered when user lacks permission */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * RoleGuard — UI-level conditional rendering based on user role.
 *
 * ⚠️  IMPORTANT: This is a UX convenience, NOT a security gate.
 * The API must ALWAYS enforce permissions server-side.
 * Hiding a button doesn't prevent direct API calls.
 *
 * @example
 * // Show delete button only to ADMIN
 * <RoleGuard permission="delete">
 *   <Button label="Delete" onClick={handleDelete} />
 * </RoleGuard>
 *
 * // Show fallback to others
 * <RoleGuard permission="delete" fallback={<span>View only</span>}>
 *   <Button label="Delete" />
 * </RoleGuard>
 */
export function RoleGuard({ permission, fallback = null, children }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <>{fallback}</>;

  const allowed = hasPermission(user.role as Role, permission);

  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
}

// ─── Higher-Order Component variant ───────────────────────────────────────────
/**
 * withRoleGuard — HOC that wraps a page component with auth + permission check.
 * Redirects to /login if unauthenticated, shows 403 if insufficient role.
 */
interface WithRoleGuardOptions {
  requiredPermission: Permission;
  redirectTo?: string;
}

export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  { requiredPermission, redirectTo = '/login' }: WithRoleGuardOptions
) {
  return function GuardedComponent(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div role="status" style={{ textAlign: 'center' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              border: '3px solid #fecaca', borderTopColor: '#dc2626',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
            }} />
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Verifying access...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = `${redirectTo}?from=${encodeURIComponent(window.location.pathname)}`;
      }
      return null;
    }

    if (!user || !hasPermission(user.role as Role, requiredPermission)) {
      return (
        <div style={{
          maxWidth: '480px', margin: '60px auto', textAlign: 'center', padding: '24px',
        }}>
          <div style={{
            background: '#fff', border: '1px solid #fca5a5',
            borderRadius: '16px', padding: '40px 32px',
            boxShadow: '0 4px 24px rgba(220,38,38,0.08)',
          }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: '#fef2f2', fontSize: '28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              🔒
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#7f1d1d', margin: '0 0 8px' }}>
              Access Denied
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 20px' }}>
              Your role (<strong>{user?.role}</strong>) does not have{' '}
              <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: '4px' }}>
                {requiredPermission}
              </code>{' '}
              permission required for this page.
            </p>
            <a href="/" style={{
              display: 'inline-block', background: '#dc2626', color: '#fff',
              padding: '10px 24px', borderRadius: '8px',
              fontWeight: 600, fontSize: '14px', textDecoration: 'none',
            }}>
              ← Go Home
            </a>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
