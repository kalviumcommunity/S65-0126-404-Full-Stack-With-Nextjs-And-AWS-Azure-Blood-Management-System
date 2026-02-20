
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

/**
 * useAuth — Custom hook to access authentication state and actions.
 *
 * @throws Error if used outside of <AuthProvider>
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an <AuthProvider>. Wrap your app in <AuthProvider>.');
    }

    return {
        // State
        user: context.user,
        isAuthenticated: context.isAuthenticated,
        isLoading: context.isLoading,
        // Actions
        login: context.login,
        logout: context.logout,
    };
}
