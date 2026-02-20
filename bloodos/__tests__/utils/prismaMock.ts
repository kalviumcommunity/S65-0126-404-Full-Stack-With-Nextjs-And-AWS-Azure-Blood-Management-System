
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import prisma from '@/lib/prisma'; // Import original instance

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Prisma Deep Mock Framework
 * ─────────────────────────────────────────────────────────────────────────────
 * Instead of spinning up a Docker PostgreSQL test container which is very slow
 * and requires setup, this intercepts all database calls. By leveraging 
 * jest-mock-extended, the TS signatures are perfectly mocked, guaranteeing type
 * safety when writing API mocked payloads during Integration testing.
 */

// Tell Jest to replace the real prisma module with this mock object entirely
jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}));

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
