
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BloodType, DonationStatus } from '@prisma/client';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const [total, donations] = await Promise.all([
            prisma.donationRecord.count(),
            prisma.donationRecord.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    donor: {
                        select: {
                            email: true,
                            donorProfile: { select: { fullName: true } },
                        },
                    },
                },
            }),
        ]);

        return NextResponse.json({
            success: true,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            data: donations,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch donations' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { donorId, hospitalId, bloodType, quantity, notes } = body;

        if (!donorId || !hospitalId || !bloodType || !quantity) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const donation = await prisma.donationRecord.create({
            data: {
                donorId,
                hospitalId,
                bloodType: bloodType as BloodType,
                quantity: parseInt(quantity),
                status: DonationStatus.SCHEDULED,
                notes,
            },
        });

        return NextResponse.json({ success: true, data: donation }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to create donation record' },
            { status: 500 }
        );
    }
}
