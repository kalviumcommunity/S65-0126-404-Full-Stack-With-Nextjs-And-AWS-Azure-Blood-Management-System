
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

// GET /api/users
// Fetch all users with pagination
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const [total, users] = await Promise.all([
            prisma.user.count(),
            prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    donorProfile: { select: { fullName: true } },
                    hospitalProfile: { select: { name: true } },
                },
                orderBy: { createdAt: 'desc' },
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
            data: users,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

// POST /api/users
// Create a new user
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, role } = body;

        if (!email || !password || !role) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'User already exists' },
                { status: 409 }
            );
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                password, // In production, hash this password!
                role: role as UserRole,
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ success: true, data: newUser }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: 'Failed to create user' },
            { status: 500 }
        );
    }
}
