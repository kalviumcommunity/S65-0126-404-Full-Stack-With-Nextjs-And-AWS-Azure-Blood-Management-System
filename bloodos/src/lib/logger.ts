
import { v4 as uuidv4 } from 'uuid';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Structured JSON Logger
 * ─────────────────────────────────────────────────────────────────────────────
 * Outputs logs in a predictable JSON format optimized for CloudWatch & Azure Monitor.
 * This guarantees easy metric filtering, Dashboard analytics, and automatic mapping
 * of Correlation IDs to track a single request across multiple microservices.
 */

export interface LogPayload {
    level: 'info' | 'warn' | 'error' | 'debug';
    requestId: string;
    endpoint?: string;
    method?: string;
    message: string;
    error?: string | Record<string, unknown>;
    metadata?: Record<string, unknown>;
}

class StructuredLogger {
    private formatLog(payload: LogPayload) {
        // Generate ISO Timestamp for exact chronological querying in CloudWatch
        const logEntry = {
            timestamp: new Date().toISOString(),
            ...payload,
        };

        // Use JSON.stringify so AWS/Azure parse it as native fields natively, not as a raw string
        return JSON.stringify(logEntry);
    }

    public info(message: string, reqContext: { requestId: string; path?: string; method?: string }, meta?: Record<string, unknown>) {
        console.info(this.formatLog({
            level: 'info',
            requestId: reqContext.requestId,
            endpoint: reqContext.path,
            method: reqContext.method,
            message,
            metadata: meta,
        }));
    }

    public warn(message: string, reqContext: { requestId: string; path?: string; method?: string }, meta?: Record<string, unknown>) {
        console.warn(this.formatLog({
            level: 'warn',
            requestId: reqContext.requestId,
            endpoint: reqContext.path,
            method: reqContext.method,
            message,
            metadata: meta,
        }));
    }

    public error(message: string, errorObj: unknown, reqContext: { requestId: string; path?: string; method?: string }) {
        console.error(this.formatLog({
            level: 'error',
            requestId: reqContext.requestId,
            endpoint: reqContext.path,
            method: reqContext.method,
            message,
            error: errorObj instanceof Error ? { message: errorObj.message, stack: errorObj.stack } : String(errorObj),
        }));
    }
}

export const logger = new StructuredLogger();

// Helper to generate a correlation ID if the client didn't provide one via header
export const generateCorrelationId = () => uuidv4();
