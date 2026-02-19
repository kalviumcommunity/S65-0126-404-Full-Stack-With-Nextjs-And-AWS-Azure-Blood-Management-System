
import { NextResponse } from 'next/server';
import { ErrorCode, ErrorCodes } from '@/lib/errorCodes';

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: {
        code: string;
        details?: any;
        stack?: string;
    };
    timestamp: string;
}

/**
 * Standard Success Response Handler
 * @param data - The payload to return
 * @param message - Optional success message (default: "Operation successful")
 * @param status - HTTP status code (default: 200)
 */
export function sendSuccess<T>(data: T, message = 'Operation successful', status = 200) {
    const responsePayload: ApiResponse<T> = {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responsePayload, { status });
}

/**
 * Standard Error Response Handler
 * @param message - User-friendly error message
 * @param code - Application specific error code (e.g., E100)
 * @param status - HTTP status code (default: 500)
 * @param details - Optional additional context or validation errors
 */
export function sendError(
    message = 'Internal Server Error',
    code: ErrorCode = ErrorCodes.INTERNAL_ERROR,
    status = 500,
    details?: any
) {
    const responsePayload: ApiResponse = {
        success: false,
        message,
        error: {
            code,
            details,
        },
        timestamp: new Date().toISOString(),
    };

    // Only log detailed errors in non-production environments
    if (process.env.NODE_ENV !== 'production' && status >= 500) {
        console.error(`[API Error] ${code}: ${message}`, details);
    }

    return NextResponse.json(responsePayload, { status });
}
