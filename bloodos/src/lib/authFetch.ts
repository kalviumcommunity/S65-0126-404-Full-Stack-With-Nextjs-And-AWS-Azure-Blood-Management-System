
/**
 * authFetch — Authenticated fetch wrapper with automatic token refresh.
 *
 * Flow:
 * 1. Attach Authorization: Bearer <accessToken> header
 * 2. Make the request
 * 3. If 401 with { expired: true }:
 *    a. Call POST /api/auth/refresh to get new access token
 *    b. Retry original request with new token
 *    c. If refresh also fails → redirect to /login
 * 4. Prevent infinite refresh loops via `_retry` flag
 *
 * Usage:
 *   const data = await authFetch('/api/auth/me');
 */

let accessToken: string | null = null; // In-memory store — not localStorage (XSS-safe)
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

/** Store token in memory after login */
export function setAccessToken(token: string) {
    accessToken = token;
}

/** Clear token on logout */
export function clearAccessToken() {
    accessToken = null;
}

/** Attempt to refresh the access token using the HTTP-only refresh cookie */
async function refreshAccessToken(): Promise<string> {
    if (isRefreshing) {
        // Queue concurrent requests — resolve them all when refresh completes
        return new Promise((resolve) => {
            refreshQueue.push(resolve);
        });
    }

    isRefreshing = true;

    try {
        const res = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include', // Include HTTP-only cookies
        });

        if (!res.ok) {
            throw new Error('Refresh failed');
        }

        const data = await res.json();
        const newToken: string = data.data.accessToken;

        accessToken = newToken;

        // Resolve all queued requests
        refreshQueue.forEach((resolve) => resolve(newToken));
        refreshQueue = [];

        return newToken;
    } catch {
        // Refresh failed — clear state and redirect to login
        accessToken = null;
        refreshQueue = [];
        if (typeof window !== 'undefined') {
            window.location.href = `/login?from=${encodeURIComponent(window.location.pathname)}`;
        }
        throw new Error('Session expired. Redirecting to login...');
    } finally {
        isRefreshing = false;
    }
}

/** Core authenticated fetch — handles 401 and auto-refresh */
export async function authFetch(
    url: string,
    options: RequestInit = {},
    _retry = false
): Promise<Response> {
    const headers = new Headers(options.headers);

    // Attach access token if available
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const res = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
    });

    // If 401 + not already retrying → attempt token refresh
    if (res.status === 401 && !_retry) {
        const body = await res.clone().json().catch(() => ({}));

        if (body?.expired) {
            // Token expired — refresh and retry
            try {
                const newToken = await refreshAccessToken();
                headers.set('Authorization', `Bearer ${newToken}`);
                return authFetch(url, { ...options, headers }, true); // Retry once
            } catch {
                return res; // Return original 401 if refresh fails
            }
        }
    }

    return res;
}
