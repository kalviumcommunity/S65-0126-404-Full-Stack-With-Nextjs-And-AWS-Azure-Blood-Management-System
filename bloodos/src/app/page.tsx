
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { Button, Card } from '@/components';

/**
 * Home Page — demonstrates AuthContext and UIContext in action.
 * Shows login/logout, theme toggle, sidebar toggle, and real-time state.
 */
export default function HomePage() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const { theme, isDark, sidebarOpen, toggleTheme, toggleSidebar } = useUI();

  const handleLogin = () => {
    login({
      id: 'usr_001',
      name: 'Alice Kumar',
      email: 'alice@bloodos.com',
      role: 'DONOR',
    });
  };

  const textPrimary = isDark ? '#f9fafb' : '#111827';
  const textSecondary = isDark ? '#9ca3af' : '#6b7280';

  return (
    <div style={{ maxWidth: '800px', color: textPrimary }}>
      <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px', color: textPrimary }}>
        🌐 Global State Demo
      </h1>
      <p style={{ color: textSecondary, marginBottom: '32px', fontSize: '14px' }}>
        Live view of AuthContext + UIContext — Assignment 2.28
      </p>

      {/* ── State Inspector ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>

        <Card title="🔐 Auth State" subtitle="From AuthContext via useAuth()" accentColor="#dc2626">
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', marginTop: '8px' }}>
            <tbody>
              {[
                { key: 'isAuthenticated', value: isAuthenticated.toString() },
                { key: 'isLoading', value: isLoading.toString() },
                { key: 'user.name', value: user?.name ?? 'null' },
                { key: 'user.role', value: user?.role ?? 'null' },
                { key: 'user.email', value: user?.email ?? 'null' },
              ].map(({ key, value }) => (
                <tr key={key} style={{ borderBottom: `1px solid ${isDark ? '#374151' : '#f3f4f6'}` }}>
                  <td style={{ padding: '6px 0', color: textSecondary, fontFamily: 'monospace' }}>{key}</td>
                  <td style={{
                    padding: '6px 0',
                    fontWeight: 600,
                    fontFamily: 'monospace',
                    color: value === 'null' ? '#9ca3af' : value === 'true' ? '#16a34a' : textPrimary,
                  }}>
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="🎨 UI State" subtitle="From UIContext via useUI()" accentColor="#7c3aed">
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', marginTop: '8px' }}>
            <tbody>
              {[
                { key: 'theme', value: theme },
                { key: 'isDark', value: isDark.toString() },
                { key: 'sidebarOpen', value: sidebarOpen.toString() },
              ].map(({ key, value }) => (
                <tr key={key} style={{ borderBottom: `1px solid ${isDark ? '#374151' : '#f3f4f6'}` }}>
                  <td style={{ padding: '6px 0', color: textSecondary, fontFamily: 'monospace' }}>{key}</td>
                  <td style={{
                    padding: '6px 0',
                    fontWeight: 600,
                    fontFamily: 'monospace',
                    color: value === 'dark' ? '#7c3aed' : value === 'true' ? '#16a34a' : textPrimary,
                  }}>
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* ── Auth Actions ── */}
      <Card title="Auth Actions" subtitle="dispatch({ type: 'LOGIN' | 'LOGOUT' })" accentColor="#dc2626">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
          {!isAuthenticated ? (
            <Button
              label={isLoading ? 'Signing in...' : 'Login as Alice Kumar'}
              variant="primary"
              isLoading={isLoading}
              onClick={handleLogin}
            />
          ) : (
            <Button
              label={`Logout (${user?.name})`}
              variant="danger"
              onClick={logout}
            />
          )}
        </div>

        {isAuthenticated && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: '#f0fdf4',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#16a34a',
            fontWeight: 600,
          }}>
            ✅ Logged in as <strong>{user?.name}</strong> ({user?.role})
          </div>
        )}
      </Card>

      {/* ── UI Actions ── */}
      <div style={{ marginTop: '20px' }}>
        <Card title="UI Actions" subtitle="dispatch({ type: 'TOGGLE_THEME' | 'TOGGLE_SIDEBAR' })" accentColor="#7c3aed">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
            <Button
              label={isDark ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
              variant="secondary"
              onClick={toggleTheme}
            />
            <Button
              label={sidebarOpen ? '◀ Close Sidebar' : '▶ Open Sidebar'}
              variant="ghost"
              onClick={toggleSidebar}
            />
          </div>
          <p style={{ marginTop: '12px', fontSize: '12px', color: textSecondary, fontFamily: 'monospace' }}>
            Theme persisted to: localStorage[&apos;bloodos_theme&apos;] = &apos;{theme}&apos;
          </p>
        </Card>
      </div>
    </div>
  );
}
