
import sanitizeHtml from 'sanitize-html';

/**
 * OWASP XSS Prevention — Input Sanitization Utility
 *
 * Three levels of sanitization for different use cases:
 *
 * 1. sanitizeStrict()  — Plain text only. No HTML whatsoever. Use for names, emails, IDs.
 * 2. sanitizeRich()    — Safe subset of HTML (bold, italic, links). Use for user content.
 * 3. sanitizeObject()  — Recursively sanitize all string fields in an object.
 *
 * Difference: Validation vs Sanitization vs Encoding
 * - Validation : Reject bad input ("email must be valid")
 * - Sanitization: Clean bad input ("<script>" → "")
 * - Encoding   : Escape output for safe rendering ("&lt;script&gt;")
 * React handles encoding automatically — this file handles sanitization.
 */

// ─── Strict config — strip ALL HTML ──────────────────────────────────────────
const STRICT_OPTIONS: sanitizeHtml.IOptions = {
    allowedTags: [],           // No tags allowed — plain text only
    allowedAttributes: {},     // No attributes
    disallowedTagsMode: 'recursiveEscape',
};

// ─── Rich text config — safe subset of HTML ───────────────────────────────────
const RICH_OPTIONS: sanitizeHtml.IOptions = {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    allowedAttributes: {},                          // No attributes (blocks onclick, href, etc.)
    disallowedTagsMode: 'recursiveEscape',
};

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Strips ALL HTML from a string. Use for: names, emails, form fields, IDs.
 *
 * @example
 * sanitizeStrict('<script>alert("Hacked")</script>Hello')
 * // → "Hello"
 *
 * sanitizeStrict("'; DROP TABLE users; --")
 * // → "'; DROP TABLE users; --"  (safe — Prisma already uses parameterized queries)
 */
export function sanitizeStrict(input: unknown): string {
    if (typeof input !== 'string') return '';
    const cleaned = sanitizeHtml(input.trim(), STRICT_OPTIONS);
    return cleaned;
}

/**
 * Allows a safe subset of HTML (b, i, p, ul, li). Use for: blog posts, comments.
 * Strips <script>, event handlers, <iframe>, <object>, etc.
 *
 * @example
 * sanitizeRich('<b>Hello</b><script>alert(1)</script>')
 * // → "<b>Hello</b>"
 */
export function sanitizeRich(input: unknown): string {
    if (typeof input !== 'string') return '';
    return sanitizeHtml(input.trim(), RICH_OPTIONS);
}

/**
 * Recursively sanitize all string fields in a plain object.
 * Skips non-string values. Use in API middleware to clean req.body.
 *
 * @example
 * sanitizeObject({ name: '<script>x</script>', age: 30 })
 * // → { name: '', age: 30 }
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            result[key] = sanitizeStrict(value);
        } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            result[key] = sanitizeObject(value as Record<string, unknown>);
        } else if (Array.isArray(value)) {
            result[key] = value.map((item) =>
                typeof item === 'string'
                    ? sanitizeStrict(item)
                    : typeof item === 'object' && item !== null
                        ? sanitizeObject(item as Record<string, unknown>)
                        : item
            );
        } else {
            result[key] = value;
        }
    }
    return result as T;
}

/**
 * Enforce a maximum length on any string input.
 * Prevents payload bloat and certain DoS patterns.
 */
export function truncate(input: string, maxLength: number): string {
    return input.slice(0, maxLength);
}

// ─── Demo / Logging Helper ────────────────────────────────────────────────────
/**
 * Log a before/after sanitization comparison (dev only).
 */
export function logSanitization(label: string, before: string, after: string): void {
    if (process.env.NODE_ENV === 'production') return;
    const changed = before !== after;
    console.info(
        `[Sanitize] ${changed ? '🧹' : '✅'} ${label}\n` +
        `  BEFORE: ${before.slice(0, 120)}\n` +
        `  AFTER : ${after.slice(0, 120)}` +
        (changed ? '\n  ⚠️  Malicious content stripped' : '')
    );
}
