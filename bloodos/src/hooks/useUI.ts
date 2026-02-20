
import { useContext } from 'react';
import { UIContext } from '@/context/UIContext';

/**
 * useUI — Custom hook to access UI state and theme/sidebar actions.
 *
 * @throws Error if used outside of <UIProvider>
 *
 * @example
 * const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUI();
 */
export function useUI() {
    const context = useContext(UIContext);

    if (context === undefined) {
        throw new Error('useUI must be used within a <UIProvider>. Wrap your app in <UIProvider>.');
    }

    return {
        // State
        theme: context.theme,
        sidebarOpen: context.sidebarOpen,
        isDark: context.theme === 'dark',
        // Actions
        toggleTheme: context.toggleTheme,
        toggleSidebar: context.toggleSidebar,
        setSidebar: context.setSidebar,
    };
}
