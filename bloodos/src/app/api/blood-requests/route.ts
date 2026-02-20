
import { NextResponse } from 'next/server';
import { withPermission } from '@/lib/withPermission';
import { prisma } from '@/lib/prisma';
import { logAllow, logDeny } from '@/lib/rbacLogger';
import { PERMISSIONS } from '@/config/roles';
import type { AuthenticatedRequest } from '@/lib/withPermission';

const RESOURCE = 'blood_requests';

/**
 * GET /api/blood-requests — Read blood requests (all authenticated roles)
 * Permission: READ
 */
export const GET = withPermission(
    PERMISSIONS.READ,
    async (req: AuthenticatedRequest) => {
        const { userId, role } = req.user!;

        try {
            const requests = await prisma.bloodRequest.findMany({
                // ADMIN and HOSPITAL see all; DONOR sees own requests only
                where: role === 'DONOR' ? { requesterId: userId } : {},
                orderBy: { createdAt: 'desc' },
                take: 20,
                select: {
                    id: true,
                    bloodType: true,
                    urgency: true,
                    status: true,
                    createdAt: true,
                    requester: { select: { email: true } },
                },
            });

            logAllow(role, PERMISSIONS.READ, RESOURCE, userId);
            return NextResponse.json({ success: true, data: { requests } });
        } catch {
            return NextResponse.json({ success: false, message: 'Failed to fetch blood requests' }, { status: 500 });
        }
    },
    RESOURCE
);

/**
 * POST /api/blood-requests — Create blood request
 * Permission: CREATE (DONOR, ADMIN)
 */
export const POST = withPermission(
    PERMISSIONS.CREATE,
    async (req: AuthenticatedRequest) => {
        const { userId, role } = req.user!;

        try {
            const body = await req.json();
            const { bloodType, urgency, hospitalId, quantity, neededByDate } = body;

            if (!bloodType || !urgency || !hospitalId) {
                return NextResponse.json(
                    { success: false, message: 'bloodType, urgency, and hospitalId are required' },
                    { status: 400 }
                );
            }

            const request = await prisma.bloodRequest.create({
                data: {
                    bloodType,
                    urgency,
                    hospitalId,
                    requesterId: userId,
                    status: 'PENDING',
                    quantity: quantity ?? 1,
                    neededByDate: neededByDate ? new Date(neededByDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });

            logAllow(role, PERMISSIONS.CREATE, RESOURCE, userId);
            return NextResponse.json({ success: true, data: { request } }, { status: 201 });
        } catch {
            return NextResponse.json({ success: false, message: 'Failed to create blood request' }, { status: 500 });
        }
    },
    RESOURCE
);

/**
 * DELETE /api/blood-requests/[id] — Delete blood request
 * Permission: DELETE (ADMIN only)
 *
 * Demo log output:
 * [RBAC] ✅ ROLE=ADMIN     ACTION=delete       RESOURCE=blood_requests      RESULT=ALLOWED
 * [RBAC] 🚫 ROLE=DONOR     ACTION=delete       RESOURCE=blood_requests      RESULT=DENIED
 * [RBAC] 🚫 ROLE=NGO       ACTION=delete       RESOURCE=blood_requests      RESULT=DENIED
 */
export const DELETE = withPermission(
    PERMISSIONS.DELETE,
    async (req: AuthenticatedRequest, ctx) => {
        const { userId, role } = req.user!;
        const { id } = await ctx.params;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Request ID required' }, { status: 400 });
        }

        try {
            await prisma.bloodRequest.delete({ where: { id } });
            logAllow(role, PERMISSIONS.DELETE, `${RESOURCE}/${id}`, userId);
            return NextResponse.json({ success: true, message: 'Blood request deleted' });
        } catch {
            logDeny(role, PERMISSIONS.DELETE, `${RESOURCE}/${id}`, 'Not found', userId);
            return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
        }
    },
    RESOURCE
);
