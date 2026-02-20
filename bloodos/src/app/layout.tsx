
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { UIProvider } from '@/context/UIContext';
import { LayoutWrapper } from '@/components';
import './globals.css';

export const metadata: Metadata = {
  title: { template: '%s | BloodOS', default: 'BloodOS — Connecting Lives' },
  description: 'BloodOS is a full-stack blood management platform connecting donors, hospitals, and NGOs.',
};

/**
 * RootLayout — Wraps all pages in the global provider tree:
 *
 * <AuthProvider>        ← Authentication state (user, login, logout)
 *   <UIProvider>        ← UI state (theme, sidebarOpen)
 *     <LayoutWrapper>   ← Header + Sidebar
 *       {children}      ← Page content
 */
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
          }}
        >
          Skip to main content
        </a>

        {/* Global Provider Tree */}
        <AuthProvider>
          <UIProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
