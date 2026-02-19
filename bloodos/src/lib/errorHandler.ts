
import { NextResponse } from 'next/server';
import { logger } from './logger';
import { ErrorCodes } from './errorCodes';

interface ErrorResponse {
    success: boolean;
    message: string;
    error?: {
        code: string;
        stack?: string;
    };
    timestamp: string;
}

/**
 * Global Error Handling Logic
 * @param error - The caught error object
 * @param context - Where the error occurred (e.g., 'GET /api/users')
 * @returns NextResponse with standardized error format
 */
export function handleError(error: unknown, context: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    const timestamp = new Date().toISOString();

    // 1. Identify Error Type & Message
    let message = 'An unexpected error occurred';
    let stack = undefined;
    let code = ErrorCodes.INTERNAL_ERROR;

    if (error instanceof Error) {
        message = error.message;
        stack = error.stack;
    } else if (typeof error === 'string') {
        message = error;
    }

    // 2. Structured Logging (Always Log Full Details)
    logger.error(message, {
        context,
        stack, // Log stack trace internally even in production
        rawError: error,
    });

    // 3. Construct Safe Response
    const responsePayload: ErrorResponse = {
        success: false,
        message: isProduction ? 'Something went wrong. Please try again later.' : message,
        error: {
            code,
            stack: isProduction ? undefined : stack, // Hide stack in production
        },
        timestamp,
    };

    return NextResponse.json(responsePayload, { status: 500 });
}
