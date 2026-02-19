
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users/[id]/donations
// Fetch all donations for a specific user (nested route)
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params;
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10');

        // Verify user exists first
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        const donations = await prisma.donationRecord.findMany({
            where: { donorId: userId },
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                bloodType: true,
                quantity: true,
                status: true,
                donationDate: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: donations,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user donations' },
            { status: 500 }
        );
    }
}
