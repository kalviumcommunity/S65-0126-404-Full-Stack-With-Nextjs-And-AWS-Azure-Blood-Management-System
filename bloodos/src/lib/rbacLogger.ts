
/**
 * rbacLogger.ts — Structured RBAC Audit Logger
 *
 * Every allow/deny decision is logged with a consistent format.
 * In production this would ship to a log aggregator (e.g. CloudWatch, Datadog).
 *
 * Log format:
 * [RBAC] ROLE=ADMIN ACTION=delete RESOURCE=users/123 RESULT=ALLOWED
 * [RBAC] ROLE=NGO   ACTION=delete RESOURCE=users/123 RESULT=DENIED
 */

type AuditResult = 'ALLOWED' | 'DENIED';

interface AuditEvent {
    role: string | undefined;
    action: string;
    resource: string;
    result: AuditResult;
    userId?: string;
    reason?: string;
    ip?: string;
}

/**
 * Log an RBAC access decision.
 * In production: replace console.info with your log transport.
 */
export function logRbacDecision(event: AuditEvent): void {
    const { role = 'UNKNOWN', action, resource, result, userId, reason, ip } = event;

    const timestamp = new Date().toISOString();
    const emoji = result === 'ALLOWED' ? '✅' : '🚫';

    // Structured log line (easily parseable by log aggregators)
    console.info(
        `[RBAC] ${emoji} ` +
        `ROLE=${role.padEnd(8)} ` +
        `ACTION=${action.padEnd(12)} ` +
        `RESOURCE=${resource.padEnd(20)} ` +
        `RESULT=${result}` +
        (userId ? ` USER=${userId}` : '') +
        (ip ? ` IP=${ip}` : '') +
        (reason ? ` REASON=${reason}` : '') +
        ` TS=${timestamp}`
    );
}

/**
 * Log a successful permission check
 */
export function logAllow(role: string, action: string, resource: string, userId?: string): void {
    logRbacDecision({ role, action, resource, result: 'ALLOWED', userId });
}

/**
 * Log a denied permission check
 */
export function logDeny(
    role: string | undefined,
    action: string,
    resource: string,
    reason?: string,
    userId?: string
): void {
    logRbacDecision({ role, action, resource, result: 'DENIED', reason, userId });
}
