
import { NextResponse } from 'next/server';
import { sendSuccess, sendError } from '@/lib/responseHandler';

export async function GET(request: Request) {
    // Use middleware-enriched headers
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    return sendSuccess(
        {
            userId,
            userRole,
            data: 'This is protected Admin data',
            stats: {
                totalUsers: 100, // Dummy data
                totalDonations: 45
            }
        },
        'Welcome Admin! Access Granted.',
        200
    );
}
