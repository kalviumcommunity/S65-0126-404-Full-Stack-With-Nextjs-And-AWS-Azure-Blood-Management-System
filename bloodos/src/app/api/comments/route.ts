
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sanitizeStrict, sanitizeRich, logSanitization, truncate } from '@/utils/sanitize';
import { withAuth } from '@/lib/withPermission';
import type { AuthenticatedRequest } from '@/lib/withPermission';

// ─── Zod Schema — Validation layer (before sanitization) ─────────────────────
// OWASP: Validate THEN sanitize. Reject clearly invalid data first.
const commentSchema = z.object({
    content: z
        .string()
        .min(1, 'Comment cannot be empty')
        .max(1000, 'Comment must be under 1000 characters'),   // Length restriction
    requestId: z.string().cuid('Invalid request ID format'), // Structural validation
});

/**
 * POST /api/comments
 *
 * OWASP XSS Prevention flow:
 * 1. Validate structure with Zod (reject malformed inputs)
 * 2. Sanitize with sanitize-html (strip script/events)
 * 3. Store clean version (safe in DB)
 * 4. Return sanitized output (safe in UI)
 *
 * SQL Injection Prevention:
 * Prisma ALWAYS uses parameterized queries — string interpolation into
 * SQL is architecturally impossible via the ORM client.
 */
export const POST = withAuth(async (req: AuthenticatedRequest) => {
    const { userId } = req.user!;

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    // ── Step 1: Schema validation ──────────────────────────────────────────────
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { success: false, message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const { content: rawContent, requestId } = parsed.data;

    // ── Step 2: Sanitization — strip ALL HTML for strict fields ───────────────
    const sanitizedContent = sanitizeRich(rawContent);    // Allow basic formatting like <b>, <i>
    const sanitizedRequestId = sanitizeStrict(requestId); // ID fields: plain text only

    // Log before/after in development for transparency
    logSanitization('comment.content', rawContent, sanitizedContent);
    logSanitization('comment.requestId', requestId, sanitizedRequestId);

    // ── Step 3: Enforce max length (secondary defense) ────────────────────────
    const finalContent = truncate(sanitizedContent, 1000);

    // ── Step 4: Parameterized Prisma query — SQLi safe by design ──────────────
    //
    // VULNERABLE (NEVER DO THIS):
    // await prisma.$queryRawUnsafe(`SELECT * FROM comments WHERE id = '${requestId}'`)
    //
    // SAFE — Prisma client always uses prepared statements:
    // The query below compiles to: INSERT INTO comments (content, ...) VALUES ($1, $2, ...)
    // User input is passed as bound parameters — never interpolated into SQL.
    let comment;
    try {
        comment = await prisma.comment.create({
            data: {
                content: finalContent,    // Already sanitized
                requestId: sanitizedRequestId,
                authorId: userId,
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: { select: { email: true } },
            },
        });
    } catch (err: unknown) {
        // Prisma will reject mismatched types at the query level regardless of input
        const msg = err instanceof Error ? err.message : 'Unknown error';
        console.error('[Comments API]', msg);
        return NextResponse.json({ success: false, message: 'Failed to save comment' }, { status: 500 });
    }

    return NextResponse.json(
        {
            success: true,
            message: 'Comment saved',
            data: {
                comment,
                // Return sanitized version so client knows what was stored
                _debug: process.env.NODE_ENV !== 'production'
                    ? { rawContent: rawContent.slice(0, 80), sanitizedContent: finalContent.slice(0, 80) }
                    : undefined,
            },
        },
        { status: 201 }
    );
});

/**
 * GET /api/comments?requestId=xxx
 *
 * SQLi Prevention — safe parameterized lookup.
 *
 * VULNERABLE (NEVER DO THIS):
 * const sql = `SELECT * FROM comments WHERE request_id = '${req.url}'`
 *
 * Prisma compiles this to: SELECT ... FROM comments WHERE request_id = $1
 */
export const GET = withAuth(async (req: AuthenticatedRequest) => {
    const { searchParams } = new URL(req.url);
    const requestId = sanitizeStrict(searchParams.get('requestId') ?? '');

    if (!requestId) {
        return NextResponse.json({ success: false, message: 'requestId query param required' }, { status: 400 });
    }

    try {
        const comments = await prisma.comment.findMany({
            where: { requestId },               // Parameterized — safe
            orderBy: { createdAt: 'desc' },
            take: 50,
            select: {
                id: true,
                content: true,                  // Already sanitized at write time
                createdAt: true,
                author: { select: { email: true } },
            },
        });

        return NextResponse.json({ success: true, data: { comments } });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to load comments' }, { status: 500 });
    }
});
