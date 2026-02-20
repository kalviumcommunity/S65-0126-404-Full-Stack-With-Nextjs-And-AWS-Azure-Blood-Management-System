
import { PrismaClient } from '@prisma/client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Prisma Singleton — Managed PostgreSQL Connection
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Why singleton pattern?
 * Next.js Hot Module Replacement (HMR) recreates modules on every save in
 * development. Without globalThis caching, each HMR cycle would create a new
 * PrismaClient → new connection pool → "too many connections" error on the DB.
 *
 * Connection Pool:
 * Prisma uses a query engine that manages a connection pool automatically.
 * Default pool size: min(num_cpus * 2 + 1, 10)
 * For RDS / Azure: explicitly configure via DATABASE_URL query params:
 *   ?connection_limit=10&pool_timeout=20&connect_timeout=10
 *
 * SSL:
 * RDS and Azure PostgreSQL enforce SSL in production.
 * Add ?sslmode=require to DATABASE_URL (see .env.example for templates).
 */

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// DATABASE_URL is read automatically by Prisma from process.env.
// Set it in .env.local (dev) or hosting platform env vars (prod).
// Never hardcode credentials — rotate regularly and store in Secrets Manager.
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'info', 'warn', 'error']
            : ['error'],
    });

// Cache in globalThis to survive HMR in development
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
