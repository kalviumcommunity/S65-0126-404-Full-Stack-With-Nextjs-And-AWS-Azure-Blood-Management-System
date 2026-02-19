
import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  accentColor?: string;
}

/**
 * Card — Reusable content container with optional title, subtitle, and footer.
 *
 * @example
 * <Card title="Total Donors" subtitle="This month">
 *   <p>3,200</p>
 * </Card>
 */
export function Card({ title, subtitle, children, footer, accentColor = '#dc2626' }: CardProps) {
  return (
    <article
      style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        borderTop: `3px solid ${accentColor}`,
      }}
    >
      {(title || subtitle) && (
        <div style={{ padding: '20px 24px 0' }}>
          {title && (
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111827' }}>{title}</h3>
          )}
          {subtitle && (
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9ca3af' }}>{subtitle}</p>
          )}
        </div>
      )}

      <div style={{ padding: '16px 24px' }}>{children}</div>

      {footer && (
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid #f3f4f6',
          background: '#f9fafb',
        }}>
          {footer}
        </div>
      )}
    </article>
  );
}
