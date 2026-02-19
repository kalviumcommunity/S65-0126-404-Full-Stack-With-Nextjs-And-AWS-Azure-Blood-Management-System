
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET() {
    try {
        // 1. Create a test user (using upsert to avoid duplicate errors)
        const testUser = await prisma.user.upsert({
            where: { email: 'test-api@bloodos.com' },
            update: {},
            create: {
                email: 'test-api@bloodos.com',
                password: 'hashed-password',
                role: UserRole.DONOR,
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // 2. Fetch all users
        const allUsers = await prisma.user.findMany({
            select: { id: true, email: true, role: true },
        });

        console.log('✅ API Test Success: Fetched', allUsers.length, 'users');

        return NextResponse.json({
            success: true,
            data: {
                created: testUser,
                totalUsers: allUsers.length,
                users: allUsers,
            },
        });
    } catch (error) {
        console.error('❌ API Test Error:', error);
        return NextResponse.json(
            { success: false, error: 'Database connection failed' },
            { status: 500 }
        );
    }
}
