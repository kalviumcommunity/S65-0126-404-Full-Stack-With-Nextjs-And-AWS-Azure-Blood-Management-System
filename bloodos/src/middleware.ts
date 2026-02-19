
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// ─── Route Classification ──────────────────────────────────────────────────────

/** API routes that require Bearer token auth */
const isProtectedApiRoute = (path: string) =>
    path.startsWith('/api/users') || path.startsWith('/api/admin');

/** API routes that require ADMIN role */
const isAdminApiRoute = (path: string) => path.startsWith('/api/admin');

/** Page routes that require login (cookie-based JWT) */
const isProtectedPageRoute = (path: string) =>
    path.startsWith('/dashboard') || path.startsWith('/users');

// ─── Main Middleware ───────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'development-secret-key'
    );

    // ── 1. Handle Protected PAGE Routes (cookie-based JWT) ──────────────────────
    if (isProtectedPageRoute(path)) {
        const tokenCookie = request.cookies.get('auth_token')?.value;

        if (!tokenCookie) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('from', path); // preserve intended route
            return NextResponse.redirect(loginUrl);
        }

        try {
            await jwtVerify(tokenCookie, secret);
            return NextResponse.next();
        } catch {
            // Token invalid/expired → clear cookie and redirect to login
            const loginUrl = new URL('/login', request.url);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('auth_token');
            return response;
        }
    }

    // ── 2. Handle Protected API Routes (Bearer token) ───────────────────────────
    if (isProtectedApiRoute(path)) {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Authentication required. Token missing.',
                    error: { code: 'UNAUTHORIZED' },
                    timestamp: new Date().toISOString(),
                },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        try {
            const { payload } = await jwtVerify(token, secret);
            const userRole = payload.role as string;

            if (isAdminApiRoute(path) && userRole !== 'ADMIN') {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Access denied. Admin privileges required.',
                        error: { code: 'FORBIDDEN' },
                        timestamp: new Date().toISOString(),
                    },
                    { status: 403 }
                );
            }

            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-user-id', payload.userId as string);
            requestHeaders.set('x-user-role', userRole);

            return NextResponse.next({ request: { headers: requestHeaders } });
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid or expired token',
                    error: { code: 'FORBIDDEN' },
                    timestamp: new Date().toISOString(),
                },
                { status: 403 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/:path*',
        '/dashboard/:path*',
        '/users/:path*',
    ],
};
