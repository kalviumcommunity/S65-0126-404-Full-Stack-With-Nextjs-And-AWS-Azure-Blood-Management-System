
import { NextResponse } from 'next/server';
import { sendError } from '@/lib/responseHandler';
import { ErrorCodes } from '@/lib/errorCodes';
import { verifyAccessToken } from '@/lib/tokens';

/**
 * GET /api/auth/logout
 * Clears the refresh_token cookie by setting Max-Age=0
 */
export async function POST() {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    // Expire the cookie immediately
    response.headers.set(
        'Set-Cookie',
        'refresh_token=; Path=/api/auth; Max-Age=0; HttpOnly; SameSite=Strict'
    );
    return response;
}

/**
 * GET /api/auth/me — Protected profile endpoint.
 *
 * Middleware flow:
 * 1. Extract Bearer token from Authorization header
 * 2. Verify + decode access token
 * 3. Return user info from token payload (no DB hit needed)
 *
 * Returns 401 if token is missing, expired, or invalid.
 */
export async function GET(req: Request) {
    try {
        // 1. Extract Bearer token
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return sendError(
                'Authorization header missing or malformed. Expected: Bearer <token>',
                ErrorCodes.UNAUTHORIZED,
                401
            );
        }

        const token = authHeader.split(' ')[1];

        // 2. Verify access token
        let payload;
        try {
            payload = verifyAccessToken(token);
        } catch (err: unknown) {
            const isExpired = err instanceof Error && err.name === 'TokenExpiredError';
            return NextResponse.json(
                {
                    success: false,
                    message: isExpired
                        ? 'Access token expired. Call POST /api/auth/refresh to get a new one.'
                        : 'Invalid access token.',
                    error: { code: 'TOKEN_EXPIRED' },
                    expired: isExpired,
                },
                { status: 401 }
            );
        }

        // 3. Return decoded user info (no extra DB query needed)
        return NextResponse.json({
            success: true,
            message: 'Authenticated',
            data: {
                userId: payload.userId,
                role: payload.role,
                // Note: Never store sensitive data (password, PII) in JWT payload
            },
        });

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        return sendError('Authentication check failed', ErrorCodes.INTERNAL_ERROR, 500, msg);
    }
}
