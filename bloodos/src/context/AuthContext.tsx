
'use client';

import React, { createContext, useCallback, useReducer } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

interface AuthContextValue extends AuthState {
  login: (user: User) => void;
  logout: () => void;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      console.info('[AuthContext] State → LOGIN', { user: action.payload });
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':
      console.info('[AuthContext] State → LOGOUT');
      return { ...initialState };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
AuthContext.displayName = 'AuthContext'; // Visible in React DevTools

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback((user: User) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Simulate async (e.g. token validation)
    setTimeout(() => {
      dispatch({ type: 'LOGIN', payload: user });
    }, 300);
  }, []);

  const logout = useCallback(() => {
    // Clear auth cookie
    document.cookie = 'auth_token=; path=/; max-age=0';
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Raw context export for custom hook ───────────────────────────────────────
export { AuthContext };
