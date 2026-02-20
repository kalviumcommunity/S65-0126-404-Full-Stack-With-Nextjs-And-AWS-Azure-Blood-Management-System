
'use client';

import React, { createContext, useCallback, useEffect, useReducer } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────
type Theme = 'light' | 'dark';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
}

type UIAction =
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean };

interface UIContextValue extends UIState {
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
const initialState: UIState = {
  theme: 'light',
  sidebarOpen: true,
};

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'TOGGLE_THEME': {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      console.info('[UIContext] Theme →', newTheme);
      return { ...state, theme: newTheme };
    }
    case 'TOGGLE_SIDEBAR':
      console.info('[UIContext] Sidebar →', !state.sidebarOpen);
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const UIContext = createContext<UIContextValue | undefined>(undefined);
UIContext.displayName = 'UIContext'; // Visible in React DevTools

// ─── Provider ─────────────────────────────────────────────────────────────────
export function UIProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  // Persist theme preference to localStorage
  useEffect(() => {
    const stored = localStorage.getItem('bloodos_theme') as Theme | null;
    if (stored && stored !== state.theme) {
      dispatch({ type: 'TOGGLE_THEME' });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    localStorage.setItem('bloodos_theme', state.theme);
    // Apply theme class to html element for CSS variables
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const toggleTheme = useCallback(() => dispatch({ type: 'TOGGLE_THEME' }), []);
  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const setSidebar = useCallback((open: boolean) => dispatch({ type: 'SET_SIDEBAR', payload: open }), []);

  return (
    <UIContext.Provider value={{ ...state, toggleTheme, toggleSidebar, setSidebar }}>
      {children}
    </UIContext.Provider>
  );
}

// ─── Raw context export for custom hook ───────────────────────────────────────
export { UIContext };
