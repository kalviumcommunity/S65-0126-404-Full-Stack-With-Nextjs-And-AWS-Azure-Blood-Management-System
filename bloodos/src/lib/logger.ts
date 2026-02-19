
/**
 * Structured Logger using standard console methods
 * ensuring consistent JSON formatting for observability tools.
 */

type LogLevel = 'info' | 'error' | 'warn' | 'debug';

interface LogEntry {
    level: LogLevel;
    message: string;
    meta?: Record<string, any>;
    timestamp: string;
}

const formatLog = (level: LogLevel, message: string, meta?: Record<string, any>): LogEntry => {
    return {
        level,
        message,
        meta,
        timestamp: new Date().toISOString(),
    };
};

export const logger = {
    info: (message: string, meta?: Record<string, any>) => {
        // In production, we assume stdout is captured by a logging agent (e.g., CloudWatch, Datadog)
        console.log(JSON.stringify(formatLog('info', message, meta)));
    },

    error: (message: string, meta?: Record<string, any>) => {
        console.error(JSON.stringify(formatLog('error', message, meta)));
    },

    warn: (message: string, meta?: Record<string, any>) => {
        console.warn(JSON.stringify(formatLog('warn', message, meta)));
    },

    debug: (message: string, meta?: Record<string, any>) => {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(JSON.stringify(formatLog('debug', message, meta)));
        }
    },
};
