
import { NextResponse } from 'next/server';
import { sendError } from '@/lib/responseHandler';
import { ErrorCodes } from '@/lib/errorCodes';
import {
    verifyRefreshToken,
    generateAccessToken,
    generateRefreshToken,
    getRefreshCookieOptions,
} from '@/lib/tokens';

/**
 * POST /api/auth/refresh
 *
 * Token Refresh Flow:
 * 1. Read refresh_token from HTTP-only cookie
 * 2. Verify + decode payload
 * 3. Issue new access token (15m)
 * 4. Rotate refresh token (7d) — old token is replaced
 * 5. Return new access token in response body
 *
 * Token Rotation Strategy:
 * Issuing a new refresh token on every refresh means stolen tokens
 * become invalid as soon as the legitimate user next refreshes.
 * This limits the window of abuse for any leaked refresh token.
 */
export async function POST(req: Request) {
    try {
        // 1. Extract refresh token from HTTP-only cookie
        const cookieHeader = req.headers.get('cookie') ?? '';
        const refreshToken = cookieHeader
            .split(';')
            .map((c) => c.trim())
            .find((c) => c.startsWith('refresh_token='))
            ?.split('=')[1];

        if (!refreshToken) {
            return sendError(
                'Refresh token missing. Please log in again.',
                ErrorCodes.UNAUTHORIZED,
                401
            );
        }

        // 2. Verify refresh token (throws on expiry or invalid signature)
        let payload;
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch (err: unknown) {
            const isExpired = err instanceof Error && err.name === 'TokenExpiredError';
            return sendError(
                isExpired ? 'Session expired. Please log in again.' : 'Invalid refresh token.',
                ErrorCodes.UNAUTHORIZED,
                401
            );
        }

        // 3. Generate new access token
        const newAccessToken = generateAccessToken(payload.userId, payload.role);

        // 4. Rotate refresh token — issue a fresh 7d token
        const newRefreshToken = generateRefreshToken(payload.userId, payload.role);

        const cookieOptions = getRefreshCookieOptions();
        const cookieString = [
            `refresh_token=${newRefreshToken}`,
            `Max-Age=${cookieOptions.maxAge}`,
            `Path=${cookieOptions.path}`,
            `SameSite=${cookieOptions.sameSite}`,
            cookieOptions.httpOnly ? 'HttpOnly' : '',
            cookieOptions.secure ? 'Secure' : '',
        ].filter(Boolean).join('; ');

        // 5. Respond with new access token + rotated refresh cookie
        const response = NextResponse.json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken: newAccessToken,
                expiresIn: 15 * 60, // 900 seconds
            },
        });

        response.headers.set('Set-Cookie', cookieString);
        return response;

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        if (process.env.NODE_ENV !== 'production') console.error('[Refresh]', msg);
        return sendError('Token refresh failed', ErrorCodes.INTERNAL_ERROR, 500, msg);
    }
}
