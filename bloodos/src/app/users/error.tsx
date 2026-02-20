
'use client';

/**
 * error.tsx — Route-level Error Boundary for /users
 *
 * Next.js renders this automatically when:
 * - A Server Component throws during render
 * - An unhandled promise rejection occurs in the route
 *
 * Must be a Client Component ('use client').
 * Receives { error, reset } props from Next.js.
 */
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function UsersError({ error, reset }: ErrorProps) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        maxWidth: '560px',
        margin: '40px auto',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      {/* Error card */}
      <div style={{
        background: '#fff',
        border: '1px solid #fca5a5',
        borderRadius: '16px',
        padding: '40px 32px',
        boxShadow: '0 4px 24px rgba(220,38,38,0.08)',
      }}>
        {/* Icon */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: '#fef2f2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', margin: '0 auto 20px',
        }}>
          ⚠️
        </div>

        <h1 style={{
          fontSize: '20px', fontWeight: 800,
          color: '#7f1d1d', margin: '0 0 10px',
        }}>
          Failed to Load Users
        </h1>

        <p style={{
          color: '#6b7280', fontSize: '14px',
          lineHeight: 1.6, margin: '0 0 8px',
        }}>
          Something went wrong while fetching the users list.
          This may be a temporary network issue.
        </p>

        {/* Show error detail only in development */}
        {isDev && error?.message && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderRadius: '8px', padding: '10px 14px',
            margin: '12px 0', textAlign: 'left',
          }}>
            <p style={{ margin: 0, fontSize: '12px', fontFamily: 'monospace', color: '#dc2626' }}>
              <strong>Dev:</strong> {error.message}
            </p>
            {error.digest && (
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' }}>
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
          <button
            onClick={reset}
            aria-label="Retry loading users"
            style={{
              background: '#dc2626', color: '#fff',
              padding: '10px 24px', borderRadius: '8px',
              border: 'none', fontWeight: 700, fontSize: '14px',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseOver={(e) => { (e.target as HTMLButtonElement).style.background = '#b91c1c'; }}
            onMouseOut={(e) => { (e.target as HTMLButtonElement).style.background = '#dc2626'; }}
          >
            🔄 Try Again
          </button>
          <a
            href="/"
            style={{
              background: '#f9fafb', color: '#374151',
              padding: '10px 20px', borderRadius: '8px',
              border: '1px solid #e5e7eb', fontWeight: 600,
              fontSize: '14px', textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            ← Go Home
          </a>
        </div>
      </div>

      {/* Testing hint for dev */}
      {isDev && (
        <p style={{ marginTop: '16px', fontSize: '12px', color: '#9ca3af' }}>
          Dev hint: Add <code>?error=1</code> to URL to simulate this error
        </p>
      )}
    </div>
  );
}
