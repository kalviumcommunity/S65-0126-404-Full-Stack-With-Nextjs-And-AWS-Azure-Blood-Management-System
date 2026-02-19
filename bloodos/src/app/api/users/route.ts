
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ErrorCodes } from '@/lib/errorCodes';
import { UserSchema } from '@/lib/schemas/userSchema';
import bcrypt from 'bcrypt';

// GET /api/users
// PROTECTED ROUTE: Auth handled by Middleware
export async function GET(req: Request) {
    try {
        // Middleware Validation Check (for extra safety)
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return sendError('Unauthorized', ErrorCodes.UNAUTHORIZED, 401);
        }

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
// PROTECTED ROUTE: Auth handled by Middleware
export async function POST(req: Request) {
    try {
        // Middleware Validation Check
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return sendError('Unauthorized', ErrorCodes.UNAUTHORIZED, 401);
        }

        const body = await req.json();

        // 1️⃣ VALIDATION
        const validationResult = UserSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            return sendError(
                'Validation Error',
                ErrorCodes.VALIDATION_ERROR,
                400,
                errors
            );
        }

        const { email, password, role } = validationResult.data;

        // 2️⃣ CHECK EXISTS
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

        // 3️⃣ HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ CREATE USER
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
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
