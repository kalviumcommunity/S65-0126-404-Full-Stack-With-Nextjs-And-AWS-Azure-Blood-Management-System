
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ErrorCodes } from '@/lib/errorCodes';
import { UserSchema } from '@/lib/schemas/userSchema';
import bcrypt from 'bcrypt';
import { handleError } from '@/lib/errorHandler';
import { redis } from '@/lib/redis'; // Import Redis
import { logger } from '@/lib/logger';

// GET /api/users
// PROTECTED ROUTE: Auth handled by Middleware
export async function GET(req: Request) {
    try {
        const start = Date.now(); // Start Timer

        // Simulate Error for Testing
        const { searchParams } = new URL(req.url);
        if (searchParams.get('simulateError') === 'true') {
            throw new Error('Simulated Database Connection Failed');
        }

        // Middleware Validation Check
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return sendError('Unauthorized', ErrorCodes.UNAUTHORIZED, 401);
        }

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // 1️⃣ CACHE STRATEGY: Try Redis Cache (only for page 1 default for simplicity)
        const cacheKey = `users:list:page:${page}:limit:${limit}`;

        try {
            if (redis.status === 'ready') {
                const cachedData = await redis.get(cacheKey);
                if (cachedData) {
                    const executionTime = Date.now() - start;
                    logger.info('Cache Hit - Returning from Redis', { executionTime: `${executionTime}ms` });

                    return sendSuccess(JSON.parse(cachedData), 'Users fetched from cache');
                }
            }
        } catch (redisError) {
            logger.error('Redis Fetch Error', { error: redisError });
            // Fallback to DB quietly if Redis fails
        }

        logger.info('Cache Miss - Fetching from Database');

        // 2️⃣ DB FETCH
        const [total, users] = await Promise.all([
            prisma.user.count(),
            prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    donorProfile: { select: { fullName: true } },
                    hospitalProfile: { select: { name: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        const result = {
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };

        // 3️⃣ CACHE WRITE (TTL: 60s)
        try {
            if (redis.status === 'ready') {
                await redis.set(cacheKey, JSON.stringify(result), 'EX', 60);
            }
        } catch (saveError) {
            logger.error('Redis Save Error', { error: saveError });
        }

        const executionTime = Date.now() - start;
        logger.info('Request Completed', { executionTime: `${executionTime}ms` });

        return sendSuccess(result, 'Users fetched successfully');

    } catch (error: any) {
        return handleError(error, 'GET /api/users');
    }
}

// POST /api/users
// PROTECTED ROUTE: Auth handled by Middleware
export async function POST(req: Request) {
    try {
        // Middleware Validation Check
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return sendError('Unauthorized', ErrorCodes.UNAUTHORIZED, 401);
        }

        const body = await req.json();

        // 1️⃣ VALIDATION
        const validationResult = UserSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            return sendError(
                'Validation Error',
                ErrorCodes.VALIDATION_ERROR,
                400,
                errors
            );
        }

        const { email, password, role } = validationResult.data;

        // 2️⃣ CHECK EXISTS
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return sendError(
                'User with this email already exists',
                ErrorCodes.DUPLICATE_ENTRY,
                409
            );
        }

        // 3️⃣ HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ CREATE USER
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role as UserRole,
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        // 5️⃣ CACHE INVALIDATION
        try {
            if (redis.status === 'ready') {
                // Invalidate all page lists (simple approach: scan & delete, or just specific keys)
                // For this assignment, we use specific key invalidation or wildcard if possible.
                // Redis basic doesn't support wildcard delete cleanly without Lua/KEYS, 
                // safely here we just delete page 1 and 2 common defaults.
                await redis.del('users:list:page:1:limit:10');
                await redis.del('users:list:page:2:limit:10');
                logger.info('Cache Invalidated for User Lists');
            }
        } catch (invalError) {
            logger.error('Redis Invalidation Failed', { error: invalError });
        }

        return sendSuccess(newUser, 'User created successfully', 201);

    } catch (error: any) {
        return handleError(error, 'POST /api/users');
    }
}
