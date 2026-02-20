
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/health/db
 *
 * Database health check endpoint.
 * Verifies end-to-end connectivity from Next.js → Managed PostgreSQL.
 *
 * Returns:
 * - DB server timestamp (SELECT NOW())
 * - Prisma connection status
 * - User count (proves Prisma queries work against the real schema)
 * - Response time in ms
 *
 * Used to verify RDS / Azure PostgreSQL connection after provisioning.
 *
 * ⚠️  Protect this route in production — only accessible to ADMIN or
 *     internal monitoring tools (e.g., Datadog, CloudWatch synthetic)
 */
export async function GET() {
    const start = Date.now();

    try {
        // 1. Raw SQL: verify direct PostgreSQL connectivity
        // Prisma compiles this to: SELECT NOW() AS current_time
        const timeResult = await prisma.$queryRaw<[{ current_time: Date }]>`
      SELECT NOW() AS current_time
    `;

        // 2. PostgreSQL version info
        const versionResult = await prisma.$queryRaw<[{ version: string }]>`
      SELECT version() AS version
    `;

        // 3. ORM query: verify schema connectivity
        const userCount = await prisma.user.count();

        // 4. Connection pool info
        const dbResult = await prisma.$queryRaw<[{ datname: string; numbackends: number }]>`
      SELECT datname, numbackends
      FROM pg_stat_database
      WHERE datname = current_database()
    `;

        const latency = Date.now() - start;

        return NextResponse.json({
            success: true,
            message: 'Database connection healthy',
            data: {
                status: 'connected',
                latency_ms: latency,
                server_time: timeResult[0].current_time,
                postgres_version: versionResult[0].version.split(' ').slice(0, 2).join(' '),
                active_connections: dbResult[0]?.numbackends ?? 'N/A',
                schema_check: {
                    user_count: userCount,
                    orm: 'Prisma',
                },
                // Strip sensitive info
                endpoint: process.env.DATABASE_URL
                    ? process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@')  // Mask password
                    : 'Not configured',
            },
        });
    } catch (error: unknown) {
        const latency = Date.now() - start;
        const message = error instanceof Error ? error.message : 'Unknown database error';

        // Log full error server-side (safe), return minimal info to client
        console.error('[DB Health]', message);

        // Diagnose common connection errors
        const hint = message.includes('ECONNREFUSED')
            ? 'Check DATABASE_URL host/port and VPC/Security Group inbound rules (port 5432)'
            : message.includes('password authentication')
                ? 'Check DATABASE_URL credentials — username or password incorrect'
                : message.includes('SSL')
                    ? 'Add ?sslmode=require to DATABASE_URL for RDS/Azure SSL enforcement'
                    : message.includes('does not exist')
                        ? 'Database name not found — check DATABASE_URL dbname or run prisma migrate deploy'
                        : 'Check DATABASE_URL env var and network configuration';

        return NextResponse.json(
            {
                success: false,
                message: 'Database connection failed',
                latency_ms: latency,
                error: {
                    message: process.env.NODE_ENV !== 'production' ? message : 'Connection error',
                    hint,
                },
            },
            { status: 503 }
        );
    }
}
