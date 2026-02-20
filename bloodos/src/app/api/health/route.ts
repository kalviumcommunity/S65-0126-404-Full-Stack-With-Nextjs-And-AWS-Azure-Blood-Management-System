import { NextResponse } from 'next/server';

/**
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
