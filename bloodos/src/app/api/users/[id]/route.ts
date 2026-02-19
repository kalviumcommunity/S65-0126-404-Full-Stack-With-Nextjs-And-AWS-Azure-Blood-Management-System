
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ErrorCodes } from '@/lib/errorCodes';

// GET /api/users/[id]
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
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
            return sendError(
                'User not found',
                ErrorCodes.NOT_FOUND,
                404
            );
        }

        return sendSuccess(user, 'User details fetched successfully');

    } catch (error: any) {
        return sendError(
            'Failed to fetch user',
            ErrorCodes.DATABASE_ERROR,
            500,
            error.message
        );
    }
}

// PATCH /api/users/[id]
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

        return sendSuccess(updatedUser, 'User updated successfully');

    } catch (error: any) {
        if (error.code === 'P2025') {
            return sendError(
                'User not found',
                ErrorCodes.NOT_FOUND,
                404
            );
        }
        return sendError(
            'Failed to update user',
            ErrorCodes.INTERNAL_ERROR,
            500,
            error.message
        );
    }
}

// DELETE /api/users/[id]
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.user.delete({
            where: { id },
        });

        return sendSuccess(null, 'User deleted successfully');

    } catch (error: any) {
        if (error.code === 'P2025') {
            return sendError(
                'User not found',
                ErrorCodes.NOT_FOUND,
                404
            );
        }
        return sendError(
            'Failed to delete user',
            ErrorCodes.INTERNAL_ERROR,
            500,
            error.message
        );
    }
}
