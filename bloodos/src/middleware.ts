
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { handlePreflightRequest, applyCorsHeaders, getAllowedOrigin } from '@/lib/cors';

const isProd = process.env.NODE_ENV === 'production';

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
    const isApiPath = path.startsWith('/api/');

    // ── 1. HTTPS Enforcement ─────────────────────────────────────────────────────
    // Redirect HTTP → HTTPS in production.
    // On Vercel this rarely triggers (Vercel handles it at edge),
    // but provides defence-in-depth on custom servers.
    if (isProd && request.headers.get('x-forwarded-proto') === 'http') {
        const httpsUrl = new URL(request.url);
        httpsUrl.protocol = 'https:';
        return NextResponse.redirect(httpsUrl, 301); // Permanent redirect
    }

    // ── 2. CORS Preflight (OPTIONS) ───────────────────────────────────────────────
    // OPTIONS requests must be handled BEFORE auth checks — preflight has no cookie/token.
    if (isApiPath && request.method === 'OPTIONS') {
        const preflightResponse = handlePreflightRequest(request);
        if (preflightResponse) return preflightResponse;
        // Unknown origin — reject
        return new NextResponse(JSON.stringify({ success: false, message: 'CORS: Origin not allowed' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // ── 3. CORS Origin Check for API routes ──────────────────────────────────────
    // If request comes from a browser (has Origin header), validate it.
    // Server-to-server requests (no Origin header) pass through but still need auth.
    if (isApiPath) {
        const origin = request.headers.get('origin');
        if (origin && !getAllowedOrigin(origin)) {
            console.warn(`[CORS] Blocked request from unknown origin: ${origin} → ${path}`);
            return new NextResponse(
                JSON.stringify({ success: false, message: 'CORS: Origin not permitted' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'development-secret-key'
    );

    // ── 4. Protected Page Routes (cookie-based JWT) ───────────────────────────────
    if (isProtectedPageRoute(path)) {
        const tokenCookie = request.cookies.get('auth_token')?.value;

        if (!tokenCookie) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('from', path);
            return NextResponse.redirect(loginUrl);
        }

        try {
            await jwtVerify(tokenCookie, secret);
            return NextResponse.next();
        } catch {
            const loginUrl = new URL('/login', request.url);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('auth_token');
            return response;
        }
    }

    // ── 5. Protected API Routes (Bearer token) ────────────────────────────────────
    if (isProtectedApiRoute(path)) {
        const authHeader = request.headers.get('authorization');

        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'Authentication required.', error: { code: 'UNAUTHORIZED' }, timestamp: new Date().toISOString() },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        try {
            const { payload } = await jwtVerify(token, secret);
            const userRole = payload.role as string;

            if (isAdminApiRoute(path) && userRole !== 'ADMIN') {
                return NextResponse.json(
                    { success: false, message: 'Admin privileges required.', error: { code: 'FORBIDDEN' }, timestamp: new Date().toISOString() },
                    { status: 403 }
                );
            }

            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-user-id', payload.userId as string);
            requestHeaders.set('x-user-role', userRole);

            const nextResp = NextResponse.next({ request: { headers: requestHeaders } });

            // Apply CORS headers to the forwarded response
            return applyCorsHeaders(request, nextResp);
        } catch {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired token.', error: { code: 'FORBIDDEN' }, timestamp: new Date().toISOString() },
                { status: 403 }
            );
        }
    }

    // ── 6. All other API routes — apply CORS headers ─────────────────────────────
    if (isApiPath) {
        const nextResp = NextResponse.next();
        return applyCorsHeaders(request, nextResp);
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
