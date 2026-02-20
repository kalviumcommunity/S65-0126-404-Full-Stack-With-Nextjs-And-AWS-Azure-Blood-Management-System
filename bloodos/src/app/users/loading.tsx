
/**
 * loading.tsx — Route-level loading UI for /users
 *
 * Next.js App Router automatically renders this while page.tsx is
 * fetching data (server-side async). No extra code needed in page.tsx.
 *
 * Why Skeleton > Spinner:
 * - Preserves layout shape → less jarring content shift
 * - Users perceive skeleton loads as faster (psychological)
 * - Each placeholder mirrors real content structure
 */

function SkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderRadius: '10px',
        border: '1px solid #f3f4f6',
        background: '#fafafa',
      }}
    >
      {/* Avatar + text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Avatar circle */}
        <div
          aria-hidden="true"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#e5e7eb',
            animation: 'pulse 1.5s ease-in-out infinite',
            flexShrink: 0,
          }}
        />
        {/* Name + email lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            aria-hidden="true"
            style={{
              width: '140px',
              height: '13px',
              borderRadius: '6px',
              background: '#e5e7eb',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              width: '100px',
              height: '11px',
              borderRadius: '6px',
              background: '#f3f4f6',
              animation: 'pulse 1.5s ease-in-out 0.2s infinite',
            }}
          />
        </div>
      </div>
      {/* Role badge */}
      <div
        aria-hidden="true"
        style={{
          width: '64px',
          height: '22px',
          borderRadius: '20px',
          background: '#e5e7eb',
          animation: 'pulse 1.5s ease-in-out 0.1s infinite',
        }}
      />
    </div>
  );
}

export default function UsersLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading users list..."
      style={{ maxWidth: '820px' }}
    >
      {/* Page title skeleton */}
      <div style={{ marginBottom: '24px' }}>
        <div
          aria-hidden="true"
          style={{
            width: '220px',
            height: '28px',
            borderRadius: '8px',
            background: '#e5e7eb',
            marginBottom: '8px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            width: '340px',
            height: '14px',
            borderRadius: '6px',
            background: '#f3f4f6',
            animation: 'pulse 1.5s ease-in-out 0.15s infinite',
          }}
        />
      </div>

      {/* Add user form skeleton */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        borderTop: '3px solid #e5e7eb',
        marginBottom: '20px',
      }}>
        <div aria-hidden="true" style={{
          width: '160px', height: '16px', borderRadius: '6px',
          background: '#e5e7eb', marginBottom: '10px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        <div style={{ display: 'flex', gap: '10px' }}>
          {[200, 120, 80].map((w, i) => (
            <div key={i} aria-hidden="true" style={{
              width: w, height: '36px', borderRadius: '8px',
              background: '#f3f4f6',
              animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
            }} />
          ))}
        </div>
      </div>

      {/* User rows skeleton — 5 rows */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        borderTop: '3px solid #e5e7eb',
      }}>
        <div aria-hidden="true" style={{
          width: '100px', height: '15px', borderRadius: '6px',
          background: '#e5e7eb', marginBottom: '16px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>

      {/* Screen-reader-only label */}
      <span style={{
        position: 'absolute',
        width: '1px', height: '1px',
        padding: 0, margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}>
        Loading users, please wait...
      </span>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
