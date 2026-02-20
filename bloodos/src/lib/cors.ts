
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * CORS Configuration — Runtime allowed origins.
 *
 * Why not wildcard (*)?
 * - '*' allows ANY website to call your API from a browser
 * - A malicious site could make authenticated requests on behalf of logged-in users
 * - Specific origins restrict access to trusted frontends only
 *
 * Why CORS is ONLY a browser protection:
 * - CORS headers are enforced by browsers — server-to-server calls ignore CORS
 * - Your API still needs authentication for all routes regardless of CORS
 *
 * Origins are environment-specific to allow local development.
 */
const ALLOWED_ORIGINS: string[] = [
    'https://bloodos.com',
    'https://www.bloodos.com',
    'https://app.bloodos.com',
    ...(process.env.NODE_ENV !== 'production'
        ? ['http://localhost:3000', 'http://localhost:3001']
        : []),
];

const ALLOWED_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
const ALLOWED_HEADERS = 'Content-Type, Authorization, X-Requested-With';
const MAX_AGE = '86400'; // Preflight cache: 24 hours

/**
 * Check if a given origin is in the allowlist.
 * Returns the origin if allowed, undefined if not.
 */
export function getAllowedOrigin(requestOrigin: string | null): string | undefined {
    if (!requestOrigin) return undefined;
    return ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : undefined;
}

/**
 * Apply CORS headers to any NextResponse.
 * Used in API route handlers.
 *
 * @example
 * export async function GET(req: NextRequest) {
 *   const res = NextResponse.json({ data });
 *   return applyCorsHeaders(req, res);
 * }
 */
export function applyCorsHeaders(req: NextRequest, res: NextResponse): NextResponse {
    const origin = req.headers.get('origin');
    const allowedOrigin = getAllowedOrigin(origin);

    if (allowedOrigin) {
        // Only set to the SPECIFIC requesting origin (not '*')
        res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
        res.headers.set('Access-Control-Allow-Credentials', 'true'); // Required for cookies
    }

    res.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS);
    res.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS);
    res.headers.set('Vary', 'Origin'); // Cache must vary by Origin header

    return res;
}

/**
 * Handle OPTIONS preflight request.
 * Browsers send OPTIONS before cross-origin requests with non-simple headers.
 * Must respond with 204 + CORS headers for the actual request to proceed.
 */
export function handlePreflightRequest(req: NextRequest): NextResponse | null {
    if (req.method !== 'OPTIONS') return null;

    const origin = req.headers.get('origin');
    const allowedOrigin = getAllowedOrigin(origin);

    if (!allowedOrigin) {
        // Unknown origin — reject preflight
        return new NextResponse(null, {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new NextResponse(null, {
        status: 204, // No Content — standard for OPTIONS
        headers: {
            'Access-Control-Allow-Origin': allowedOrigin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': ALLOWED_METHODS,
            'Access-Control-Allow-Headers': ALLOWED_HEADERS,
            'Access-Control-Max-Age': MAX_AGE,
            'Vary': 'Origin',
        },
    });
}
