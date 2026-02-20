
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/tokens';
import { hasPermission, type Permission, type Role } from '@/config/roles';
import { logAllow, logDeny } from '@/lib/rbacLogger';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface AuthenticatedRequest extends NextRequest {
    user?: {
        userId: string;
        role: Role;
    };
}

// ─── withAuth — Token Verification Middleware ──────────────────────────────────
/**
 * Wraps an API route handler with JWT verification.
 * Attaches { userId, role } to the extended request object.
 *
 * @example
 * export const GET = withAuth(async (req) => {
 *   const { userId, role } = req.user!;
 *   return NextResponse.json({ userId, role });
 * });
 */
export function withAuth(
    handler: (req: AuthenticatedRequest, ctx: { params: Promise<Record<string, string>> }) => Promise<NextResponse>
) {
    return async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
        const authHeader = req.headers.get('authorization');

        if (!authHeader?.startsWith('Bearer ')) {
            logDeny(undefined, 'api_access', req.nextUrl.pathname, 'No token');
            return NextResponse.json(
                { success: false, message: 'Authentication required', error: { code: 'UNAUTHORIZED' } },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = verifyAccessToken(token);
            const extendedReq = req as AuthenticatedRequest;
            extendedReq.user = { userId: payload.userId, role: payload.role as Role };
            return handler(extendedReq, ctx);
        } catch (err: unknown) {
            const isExpired = err instanceof Error && err.name === 'TokenExpiredError';
            logDeny(undefined, 'api_access', req.nextUrl.pathname, isExpired ? 'Token expired' : 'Invalid token');
            return NextResponse.json(
                {
                    success: false,
                    message: isExpired ? 'Access token expired' : 'Invalid token',
                    error: { code: 'TOKEN_EXPIRED' },
                    expired: isExpired,
                },
                { status: 401 }
            );
        }
    };
}

// ─── withPermission — RBAC Permission Gate ────────────────────────────────────
/**
 * Wraps a handler with both authentication and a specific permission check.
 *
 * @example
 * export const DELETE = withPermission('delete', async (req, ctx) => {
 *   const id = (await ctx.params).id;
 *   // ...delete logic
 * }, 'blood_requests');
 */
export function withPermission(
    permission: Permission,
    handler: (req: AuthenticatedRequest, ctx: { params: Promise<Record<string, string>> }) => Promise<NextResponse>,
    resource = 'resource'
) {
    return withAuth(async (req: AuthenticatedRequest, ctx) => {
        const { userId, role } = req.user!;

        if (!hasPermission(role, permission)) {
            logDeny(role, permission, resource, `Role lacks ${permission} permission`, userId);
            return NextResponse.json(
                {
                    success: false,
                    message: `Access denied: Your role (${role}) does not have "${permission}" permission.`,
                    error: { code: 'FORBIDDEN' },
                },
                { status: 403 }
            );
        }

        logAllow(role, permission, resource, userId);
        return handler(req, ctx);
    });
}
