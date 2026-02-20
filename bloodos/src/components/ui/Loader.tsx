
interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  inline?: boolean;
}

const SIZE_MAP = {
  sm: { ring: 20, border: 2 },
  md: { ring: 36, border: 3 },
  lg: { ring: 56, border: 4 },
};

/**
 * Loader — Accessible animated spinner for async operations.
 *
 * @example
 * <Loader size="md" label="Deleting user..." />
 * <Loader size="sm" inline />
 */
export function Loader({ size = 'md', label = 'Loading...', inline = false }: LoaderProps) {
  const { ring, border } = SIZE_MAP[size];

  const spinner = (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      style={{
        display: 'inline-flex',
        flexDirection: inline ? 'row' : 'column',
        alignItems: 'center',
        gap: inline ? '10px' : '12px',
      }}
    >
      {/* Animated ring */}
      <div
        aria-hidden="true"
        style={{
          width: ring,
          height: ring,
          borderRadius: '50%',
          border: `${border}px solid #fecaca`,
          borderTopColor: '#dc2626',
          animation: 'spin 0.8s linear infinite',
          flexShrink: 0,
        }}
      />
      {/* Visually visible label */}
      <span style={{ fontSize: size === 'sm' ? '12px' : '14px', color: '#6b7280', fontWeight: 500 }}>
        {label}
      </span>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  if (inline) return spinner;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
      {spinner}
    </div>
  );
}
