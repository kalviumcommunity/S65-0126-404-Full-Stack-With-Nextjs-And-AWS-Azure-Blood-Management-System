import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Deployment Health Hook
 *     description: Lightweight load-balancer verification endpoint securely mapped to Native Node execution without Database invocation bounds.
 *     responses:
 *       200:
 *         description: Node structure bounds responding correctly.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 uptime:
 *                   type: number
 *                   example: 120.45
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 * 
 * ─────────────────────────────────────────────────────────────────────────────
 * Deployment Health Check API
 * ─────────────────────────────────────────────────────────────────────────────
 * Extremely lightweight Edge/Node route designed strictly for AWS Elastic Load 
 * Balancers (ALB) and CI/CD Pipeline Verification steps to validate the container
 * didn't crash upon launching.
 * 
 * Notice it strictly avoids Database queries (`prisma.user.findFirst()`) to 
 * prevent DDoS loops from external uptime ping services overwhelming connection pools.
 */
export async function GET() {
    return NextResponse.json(
        {
            status: 'OK',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        },
        { status: 200 }
    );
}
