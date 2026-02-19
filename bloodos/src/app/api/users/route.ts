
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ErrorCodes } from '@/lib/errorCodes';
import { UserSchema } from '@/lib/schemas/userSchema';
import bcrypt from 'bcrypt'; // Import needed for password hashing in manual create
import jwt from 'jsonwebtoken'; // For verification

// GET /api/users
// PROTECTED ROUTE: Requires valid Bearer Token
export async function GET(req: Request) {
    try {
        // 1. Extract Token
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendError(
                'Authentication required',
                ErrorCodes.UNAUTHORIZED,
                401
            );
        }

        const token = authHeader.split(' ')[1];

        // 2. Verify Token
        try {
            const jwtSecret = process.env.JWT_SECRET || 'development-secret-key';
            jwt.verify(token, jwtSecret);
        } catch (err) {
            return sendError(
                'Invalid or expired token',
                ErrorCodes.UNAUTHORIZED,
                403
            );
        }

        // 3. Process Request (if valid)
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
// PROTECTED ROUTE: Only Admins should create users manually (conceptually, but we enforce token presence here)
export async function POST(req: Request) {
    try {
        // 1. Extract Token
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendError(
                'Authentication required',
                ErrorCodes.UNAUTHORIZED,
                401
            );
        }
        // Verify... (Shortened for brevity as logic duplicates GET)
        const token = authHeader.split(' ')[1];
        try {
            const jwtSecret = process.env.JWT_SECRET || 'development-secret-key';
            jwt.verify(token, jwtSecret);
        } catch (err) {
            return sendError('Invalid or expired token', ErrorCodes.UNAUTHORIZED, 403);
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
