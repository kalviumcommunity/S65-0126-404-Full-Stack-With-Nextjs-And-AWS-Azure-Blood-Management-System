
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { sendError } from '@/lib/responseHandler';
import { ErrorCodes } from '@/lib/errorCodes';
import {
    generateAccessToken,
    generateRefreshToken,
    getRefreshCookieOptions,
} from '@/lib/tokens';

/**
 * POST /api/auth/login
 *
 * Auth Flow:
 * 1. Validate credentials (email + password)
 * 2. Issue Access Token  (15m) → returned in response body
 * 3. Issue Refresh Token (7d)  → stored in HTTP-only cookie
 *
 * Security:
 * - Generic error message prevents email enumeration
 * - Refresh token never exposed to JavaScript
 * - Access token stored in memory (not localStorage) client-side
 */
export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // 1. Input validation
        if (!email || !password) {
            return sendError('Email and password are required', ErrorCodes.VALIDATION_ERROR, 400);
        }

        // 2. Find user
        const user = await prisma.user.findUnique({ where: { email } });

        // 3. Verify password — generic message prevents user enumeration
        const passwordMatch = user ? await bcrypt.compare(password, user.password) : false;
        if (!user || !passwordMatch) {
            return sendError('Invalid email or password', ErrorCodes.UNAUTHORIZED, 401);
        }

        // 4. Generate token pair
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id, user.role);

        // 5. Set refresh token in HTTP-only cookie
        const cookieOptions = getRefreshCookieOptions();
        const cookieString = [
            `refresh_token=${refreshToken}`,
            `Max-Age=${cookieOptions.maxAge}`,
            `Path=${cookieOptions.path}`,
            `SameSite=${cookieOptions.sameSite}`,
            cookieOptions.httpOnly ? 'HttpOnly' : '',
            cookieOptions.secure ? 'Secure' : '',
        ].filter(Boolean).join('; ');

        // 6. Respond — access token in body, refresh token in cookie
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            data: {
                accessToken,  // Short-lived — store in memory, not localStorage
                expiresIn: 15 * 60, // 900 seconds
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            },
        });

        response.headers.set('Set-Cookie', cookieString);
        return response;

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        if (process.env.NODE_ENV !== 'production') console.error('[Login]', msg);
        return sendError('Login failed', ErrorCodes.INTERNAL_ERROR, 500, msg);
    }
}
