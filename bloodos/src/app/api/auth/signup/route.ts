
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { UserSchema } from '@/lib/schemas/userSchema'; // Reuse validation schema
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ErrorCodes } from '@/lib/errorCodes';
import { UserRole } from '@prisma/client';

export async function POST(req: Request) {
    try {
        // 1. Parse & Validate
        const body = await req.json();
        const result = UserSchema.safeParse(body);

        if (!result.success) {
            const errors = result.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            return sendError(
                'Validation failed',
                ErrorCodes.VALIDATION_ERROR,
                400,
                errors
            );
        }

        // NOTE: Zod validates email format, but we also check uniqueness below.
        const { email, password, role } = result.data;

        // 2. Check Existing User
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return sendError(
                'User with this email already exists',
                ErrorCodes.DUPLICATE_ENTRY,
                400
            );
        }

        // 3. Hash Password (Salt Rounds = 10)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create User
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role as UserRole
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                // Do NOT return password
            },
        });

        // 5. Respond
        return sendSuccess(newUser, 'User registered successfully', 201);

    } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') console.error(error);
        return sendError(
            'Registration failed',
            ErrorCodes.INTERNAL_ERROR,
            500,
            error.message
        );
    }
}
