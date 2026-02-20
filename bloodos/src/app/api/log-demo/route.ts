
import { NextRequest, NextResponse } from 'next/server';
import { logger, generateCorrelationId } from '@/lib/logger';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * POST /api/log-demo
 * ─────────────────────────────────────────────────────────────────────────────
 * Demonstrates how to pass context into a JSON logger to generate CloudWatch-ready
 * traces. Shows how a single Request ID follows code execution, tracking
 * processing time, warnings, and error occurrences.
 */
export async function POST(req: NextRequest) {
    // Extract or generate Correlation ID
    const requestId = req.headers.get('x-correlation-id') || generateCorrelationId();
    const reqContext = { requestId, path: req.nextUrl.pathname, method: req.method };

    logger.info('Incoming request received', reqContext, { userAgent: req.headers.get('user-agent') });

    try {
        const body = await req.json();

        if (body.simulateSlowQuery) {
            logger.warn('Triggering slow processing delay', reqContext, { delayMs: 2000 });
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (body.throwError) {
            // Simulate Database or API Crash
            throw new Error('Fake DB Connection Timeout Error: 504 Gateway');
        }

        const resPayload = { success: true, message: 'Processing completed safely', requestTraceId: requestId };
        logger.info('Request fulfilled successfully', reqContext, { responseObj: resPayload });

        return NextResponse.json(resPayload, { status: 200 });

    } catch (error) {
        // Log the error natively so CloudWatch Metric Filters ({ $.level = "error" }) trigger alarms
        logger.error('Critical processing array exception', error, reqContext);

        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error occurred.',
                requestTraceId: requestId, // Send the ID back so user can report it to support
            },
            { status: 500 }
        );
    }
}
