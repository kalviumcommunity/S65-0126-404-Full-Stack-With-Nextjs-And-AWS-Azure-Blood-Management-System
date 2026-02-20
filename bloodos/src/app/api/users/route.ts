
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod'; // Presuming Zod is used for runtime validation commonly

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * API Route: /api/users
 * ─────────────────────────────────────────────────────────────────────────────
 * Demonstrates an integration point performing a READ (GET) mapping over Prisma
 * and a WRITE (POST) mapping protected by strict Input Validation logic.
 *
 * It extracts headers to simulate Authentication middleware.
 */

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, error: 'Unauthorized token missing' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const take = parseInt(searchParams.get('limit') || '10');

        // Natively querying PostgreSQL via Prisma
        const users = await prisma.user.findMany({
            take,
            select: { id: true, email: true, role: true },
        });

        return NextResponse.json({ success: true, count: users.length, users });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

// Ensure the schema explicitly prevents random Object injections
const CreateUserSchema = z.object({

    email: z.string().email(),
    password: z.string().min(6), // A strict requirement
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = CreateUserSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ success: false, error: 'Validation failed', details: result.error.format() }, { status: 400 });
        }

        // In a real app we would bcrypt hash earlier, but this is a DB integration mock point
        const newUser = await prisma.user.create({
            data: {
                email: result.data.email,
                password: result.data.password,
            },
        });

        return NextResponse.json({ success: true, id: newUser.id, message: 'User provisioned.' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
    }
}
