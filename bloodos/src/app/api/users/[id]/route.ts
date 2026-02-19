
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Correct type for dynamic routes in Next.js 15+
) {
    try {
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                donorProfile: true,
                hospitalProfile: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { email, role } = body;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email,
                role: role as UserRole,
            },
            select: {
                id: true,
                email: true,
                role: true,
                updatedAt: true,
            },
        });

        return NextResponse.json({ success: true, data: updatedUser });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: false, error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json(
            { success: true, message: 'User deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: false, error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}
