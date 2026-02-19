
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ErrorCodes } from '@/lib/errorCodes';
import { UserRole } from '@prisma/client';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // 1. Validate Input (Keep it simple for login)
        if (!email || !password) {
            return sendError(
                'Email and password are required',
                ErrorCodes.VALIDATION_ERROR,
                400
            );
        }

        // 2. Find User
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Security: Return generic error to prevent email enumeration
            return sendError(
                'Invalid email or password',
                ErrorCodes.UNAUTHORIZED,
                401
            );
        }

        // 3. Compare Passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return sendError(
                'Invalid email or password',
                ErrorCodes.UNAUTHORIZED,
                401
            );
        }

        // 4. Generate JWT Token
        // In production, use process.env.JWT_SECRET (and require it!)
        const jwtSecret = process.env.JWT_SECRET || 'development-secret-key';
        const token = jwt.sign(
            { userId: user.id, role: user.role }, // Payload
            jwtSecret,
            { expiresIn: '1h' } // Expiry
        );

        // 5. Respond
        // Return token and minimal user data
        return sendSuccess(
            {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            },
            'Login successful'
        );

    } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') console.error(error);
        return sendError(
            'Login failed',
            ErrorCodes.INTERNAL_ERROR,
            500,
            error.message
        );
    }
}
