
import { NextRequest, NextResponse } from 'next/server';
import { sanitizeObject } from '@/utils/sanitize';

// Fields that should NOT be sanitized (structured data, hashes, tokens)
const SKIP_FIELDS = new Set([
    'password',        // Bcrypt hashes should not be touched
    'token',           // JWT tokens contain dots/slashes
    'refreshToken',
    'authorization',
    'csrfToken',
]);

/**
 * withSanitizedBody — Middleware HOC that deep-sanitizes all string
 * fields in the request body before passing to the handler.
 *
 * Applied selectively to routes that accept raw user text.
 * Internal/trusted fields listed in SKIP_FIELDS are preserved.
 *
 * @example
 * export const POST = withSanitizedBody(async (req, ctx) => {
 *   const body = await req.json(); // Already sanitized
 *   ...
 * });
 */
export function withSanitizedBody(
    handler: (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => Promise<NextResponse>
) {
    return async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
        // Only apply to requests with a JSON body
        const contentType = req.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) {
            return handler(req, ctx);
        }

        let rawBody: Record<string, unknown>;
        try {
            rawBody = await req.json();
        } catch {
            return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
        }

        // Separate trusted fields from user-supplied fields
        const trusted: Record<string, unknown> = {};
        const userSupplied: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(rawBody)) {
            if (SKIP_FIELDS.has(key)) {
                trusted[key] = value;
            } else {
                userSupplied[key] = value;
            }
        }

        // Sanitize user-supplied portion only
        const sanitized = sanitizeObject(userSupplied);
        const cleanBody = { ...sanitized, ...trusted };

        if (process.env.NODE_ENV !== 'production') {
            const changed = JSON.stringify(sanitized) !== JSON.stringify(userSupplied);
            if (changed) {
                console.warn('[Sanitize Middleware] ⚠️ Body content was modified by sanitization');
                console.info('[Sanitize Middleware] BEFORE:', JSON.stringify(userSupplied).slice(0, 200));
                console.info('[Sanitize Middleware] AFTER :', JSON.stringify(sanitized).slice(0, 200));
            }
        }

        // Monkey-patch the request with a new json() that returns the sanitized body.
        // We do this by overriding the request body with a new ReadableStream.
        const sanitizedRequest = new NextRequest(req.url, {
            method: req.method,
            headers: req.headers,
            body: JSON.stringify(cleanBody),
        });

        return handler(sanitizedRequest, ctx);
    };
}
