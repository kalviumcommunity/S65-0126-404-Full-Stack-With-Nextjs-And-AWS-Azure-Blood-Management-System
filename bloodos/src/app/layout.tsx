
import type { Metadata } from 'next';
import { LayoutWrapper } from '@/components';
import './globals.css';

export const metadata: Metadata = {
  title: { template: '%s | BloodOS', default: 'BloodOS — Connecting Lives' },
  description: 'BloodOS is a full-stack blood management platform connecting donors, hospitals, and NGOs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        {/* Skip to main content — accessibility best practice */}
        <a
          href="#main-content"
          style={{
            position: 'absolute',
            top: '-40px',
            left: 0,
            background: '#dc2626',
            color: '#fff',
            padding: '8px 16px',
            zIndex: 100,
            borderRadius: '0 0 8px 0',
            transition: 'top 0.2s',
            fontWeight: 600,
            fontSize: '14px',
          }}
          onFocus={(e) => { (e.target as HTMLElement).style.top = '0'; }}
          onBlur={(e) => { (e.target as HTMLElement).style.top = '-40px'; }}
        >
          Skip to main content
        </a>

        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
