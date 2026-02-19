
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

/**
 * LayoutWrapper — the root UI wrapper for all authenticated/app pages.
 *
 * Hierarchy:
 *   <LayoutWrapper>
 *     ├── <Header />        (sticky top bar)
 *     └── <div> (flex row)
 *           ├── <Sidebar />    (left nav)
 *           └── <main>         (page content)
 */
export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Sticky header spans full width */}
      <Header />

      {/* Body: sidebar + scrollable content */}
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        {/* Main content area */}
        <main
          id="main-content"
          role="main"
          tabIndex={-1}
          style={{
            flex: 1,
            padding: '32px 40px',
            overflowY: 'auto',
            background: '#f8fafc',
            minHeight: 'calc(100vh - 60px)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
