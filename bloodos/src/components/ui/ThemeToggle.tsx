
'use client';

import { useEffect, useState } from 'react';

/**
 * ThemeToggle — switches between light and dark mode.
 * Persists preference to localStorage and applies 'dark' class to <html>.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load persisted preference or system preference
    const stored = localStorage.getItem('bloodos_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored === 'dark' || (!stored && prefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('bloodos_theme', next ? 'dark' : 'light');
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background: isDark ? '#374151' : '#fef2f2',
        color: isDark ? '#fde68a' : '#dc2626',
        border: `1.5px solid ${isDark ? '#4b5563' : '#fca5a5'}`,
        borderRadius: '8px',
        padding: '6px 12px',
        fontSize: '18px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        lineHeight: 1,
      }}
    >
      {isDark ? '☀️' : '🌙'}
      <span style={{ fontSize: '12px', fontWeight: 600 }}>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
