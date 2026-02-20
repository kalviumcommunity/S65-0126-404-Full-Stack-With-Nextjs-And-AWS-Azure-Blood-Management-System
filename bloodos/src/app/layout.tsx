
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { UIProvider } from '@/context/UIContext';
import { LayoutWrapper } from '@/components';
import './globals.css';

export const metadata: Metadata = {
  title: { template: '%s | BloodOS', default: 'BloodOS — Connecting Lives' },
  description: 'BloodOS is a full-stack blood management platform connecting donors, hospitals, and NGOs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Skip to main content */}
        <a
          href="#main-content"
          style={{
            position: 'absolute', top: '-48px', left: 0,
            background: '#dc2626', color: '#fff',
            padding: '8px 16px', zIndex: 100,
            borderRadius: '0 0 8px 0', fontWeight: 600, fontSize: '14px',
            transition: 'top 0.2s',
          }}
          onFocus={(e) => { (e.target as HTMLElement).style.top = '0'; }}
          onBlur={(e) => { (e.target as HTMLElement).style.top = '-48px'; }}
        >
          Skip to main content
        </a>

        {/* Global Provider Tree */}
        <AuthProvider>
          <UIProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </UIProvider>
        </AuthProvider>

        {/*
          ── Global Toast Container ──────────────────────────────────────────
          react-hot-toast renders here; accessible via aria-live regions.
          position: top-right — minimal obstruction of content.
        */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 500,
              maxWidth: '380px',
            },
            success: {
              iconTheme: { primary: '#16a34a', secondary: '#f0fdf4' },
              style: { background: '#f0fdf4', color: '#14532d', border: '1px solid #86efac' },
            },
            error: {
              iconTheme: { primary: '#dc2626', secondary: '#fef2f2' },
              style: { background: '#fef2f2', color: '#7f1d1d', border: '1px solid #fca5a5' },
            },
            loading: {
              style: { background: '#f0f9ff', color: '#0c4a6e', border: '1px solid #bae6fd' },
            },
          }}
        />
      </body>
    </html>
  );
}
