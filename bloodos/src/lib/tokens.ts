
import jwt from 'jsonwebtoken';

// ─── Constants ─────────────────────────────────────────────────────────────────
const ACCESS_SECRET = process.env.JWT_SECRET || 'access-secret-dev';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-dev';

export const ACCESS_TOKEN_EXPIRY = '15m';  // Short-lived — limits exposure window
export const REFRESH_TOKEN_EXPIRY = '7d';   // Long-lived — stored in HTTP-only cookie

// ─── Payload Types ─────────────────────────────────────────────────────────────
export interface TokenPayload {
    userId: string;
    role: string;
    type: 'access' | 'refresh';
}

// ─── Token Generation ──────────────────────────────────────────────────────────

/**
 * Generate a short-lived access token (15 minutes).
 * Returned in API response body — stored in memory client-side.
 */
export function generateAccessToken(userId: string, role: string): string {
    return jwt.sign(
        { userId, role, type: 'access' } satisfies TokenPayload,
        ACCESS_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
}

/**
 * Generate a long-lived refresh token (7 days).
 * Stored in HTTP-only cookie — never accessible to JavaScript.
 */
export function generateRefreshToken(userId: string, role: string): string {
    return jwt.sign(
        { userId, role, type: 'refresh' } satisfies TokenPayload,
        REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
}

// ─── Token Verification ────────────────────────────────────────────────────────

/**
 * Verify an access token. Throws if expired or invalid.
 */
export function verifyAccessToken(token: string): TokenPayload {
    const payload = jwt.verify(token, ACCESS_SECRET) as TokenPayload;
    if (payload.type !== 'access') throw new Error('Invalid token type');
    return payload;
}

/**
 * Verify a refresh token. Throws if expired or invalid.
 */
export function verifyRefreshToken(token: string): TokenPayload {
    const payload = jwt.verify(token, REFRESH_SECRET) as TokenPayload;
    if (payload.type !== 'refresh') throw new Error('Invalid token type');
    return payload;
}

// ─── Cookie Helper ─────────────────────────────────────────────────────────────

/** Returns secure cookie options — enforced in production */
export function getRefreshCookieOptions() {
    const isProd = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,              // ✅ Blocks JavaScript access → prevents XSS token theft
        secure: isProd,              // ✅ HTTPS only in production
        sameSite: 'strict' as const, // ✅ Blocks cross-site requests → prevents CSRF
        path: '/api/auth',           // ✅ Scoped to auth routes only
        maxAge: 7 * 24 * 60 * 60,   // 7 days in seconds
    };
}
