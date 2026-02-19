
import Redis from 'ioredis';
import { logger } from './logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const getRedisClient = () => {
    const client = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            if (times > 3) {
                logger.error('Redis connection failed too many times, implementing fallback');
                return null; // Stop retrying
            }
            return Math.min(times * 50, 2000);
        },
    });

    client.on('error', (err) => {
        // Suppress lengthy stack traces for connection refused in dev
        if (process.env.NODE_ENV !== 'production' && err.message.includes('ECONNREFUSED')) {
            logger.warn('Redis Connection Failed', { message: 'Is Redis running?' });
        } else {
            logger.error('Redis Client Error', { error: err.message });
        }
    });

    client.on('connect', () => {
        logger.info('Redis Connected Successfully');
    });

    return client;
};

// Global instance for reuse
export const redis = getRedisClient();
