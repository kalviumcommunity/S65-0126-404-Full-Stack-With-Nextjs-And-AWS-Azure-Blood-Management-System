
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ErrorCodes } from '@/lib/errorCodes';

// GET /api/users
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

        // Construct response with metadata
        return sendSuccess(
            {
                users,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                }
            },
            'Users fetched successfully'
        );

    } catch (error: any) {
        return sendError(
            'Failed to fetch users',
            ErrorCodes.DATABASE_ERROR,
            500,
            error.message
        );
    }
}

// POST /api/users
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, role } = body;

        if (!email || !password || !role) {
            return sendError(
                'Missing required fields (email, password, role)',
                ErrorCodes.VALIDATION_ERROR,
                400
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return sendError(
                'User with this email already exists',
                ErrorCodes.DUPLICATE_ENTRY,
                409
            );
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                password, // In production, usually verify hashing here!
                role: role as UserRole,
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return sendSuccess(newUser, 'User created successfully', 201);

    } catch (error: any) {
        return sendError(
            'Failed to create user',
            ErrorCodes.INTERNAL_ERROR,
            500,
            error.message
        );
    }
}
