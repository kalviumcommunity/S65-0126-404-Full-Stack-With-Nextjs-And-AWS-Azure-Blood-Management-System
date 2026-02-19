
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Helper to check if a route is protected
const isProtectedRoute = (path: string) => {
    return path.startsWith('/api/users') || path.startsWith('/api/admin');
};

// Helper to check if a route is admin-only
const isAdminRoute = (path: string) => {
    return path.startsWith('/api/admin');
};

export async function middleware(request: NextRequest) {
    // 1. Check if route needs protection
    if (!isProtectedRoute(request.nextUrl.pathname)) {
        return NextResponse.next();
    }

    // 2. Extract Token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
            {
                success: false,
                message: 'Authentication required. token missing.',
                error: { code: 'UNAUTHORIZED' },
                timestamp: new Date().toISOString(),
            },
            { status: 401 }
        );
    }

    const token = authHeader.split(' ')[1];

    try {
        // 3. Verify Token using jose (Edge compatible)
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'development-secret-key'
        );
        const { payload } = await jwtVerify(token, secret);

        // 4. Role-Based Access Control (RBAC)
        const userRole = payload.role as string;

        // Check Admin Access
        if (isAdminRoute(request.nextUrl.pathname) && userRole !== 'ADMIN') {
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

        // 5. Attach User Info to Headers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.userId as string);
        requestHeaders.set('x-user-role', userRole);

        // Continue with modified headers
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

    } catch (error) {
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

// Config matches all API routes except auth
export const config = {
    matcher: '/api/:path*',
};
