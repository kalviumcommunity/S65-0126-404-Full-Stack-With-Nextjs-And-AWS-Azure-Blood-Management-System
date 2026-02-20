
import { NextResponse } from 'next/server';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * GET /api/health
 * ─────────────────────────────────────────────────────────────────────────────
 * Load Balancer Health Probe
 * 
 * This endpoint is extremely fast and lightweight. It is used by AWS Application 
 * Load Balancer (ALB) and Azure App Service Health checks to guarantee the 
 * underlying Node.js runtime process is alive and accepting incoming requests.
 * 
 * Unlike /api/health/db, it intentionally avoids calling databases, caches,
 * or 3rd party APIs, preventing false positive failures (e.g. if the DB is restarting,
 * the frontend UI shouldn't be killed by the load balancer).
 */
export function GET() {
    return NextResponse.json(
        {
            status: 'UP',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory_usage: process.memoryUsage(),
        },
        {
            status: 200,
            headers: {
                // Enforce no caching to guarantee the LB hits the running memory process directly
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
        }
    );
}
