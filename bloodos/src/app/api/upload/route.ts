
import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { s3Client, BUCKET_NAME } from '@/lib/s3';
import { withAuth } from '@/lib/withPermission';
import type { AuthenticatedRequest } from '@/lib/withPermission';

// ─── File Validation Config ──────────────────────────────────────────────────
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_CONTENT_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
];

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * POST /api/upload
 * ─────────────────────────────────────────────────────────────────────────────
 * Generate an AWS S3 Presigned URL for direct, secure uploads.
 *
 * Why Presigned URLs?
 * 1. The Next.js backend doesn't handle the file stream (saves CPU & memory)
 * 2. Vercel max duration limits are bypassed (because file uploads straight to S3)
 * 3. Secure temporal access (the URL expires in 60s)
 * 4. Content length and type are strictly enforced
 *
 * Flow:
 * Browser -> POST /api/upload (filename, type, size)
 * API validates -> generates presigned URL
 * Browser -> fetch PUT (presigned URL) with file data -> S3
 */
export const POST = withAuth(async (req: AuthenticatedRequest) => {
    const { userId } = req.user!;

    try {
        const body = await req.json();
        const { filename, contentType, size } = body;

        // ── 1. Validation: Reject invalid or too-large requests early ──────────
        if (!filename || !contentType || !size) {
            return NextResponse.json(
                { success: false, message: 'Missing filename, contentType, or size' },
                { status: 400 }
            );
        }

        if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
            return NextResponse.json(
                { success: false, message: 'Invalid file type. Only JPEG, PNG, WEBP, and PDF allowed.' },
                { status: 400 }
            );
        }

        if (size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { success: false, message: `File size exceeds limit (${MAX_FILE_SIZE / 1024 / 1024}MB).` },
                { status: 400 }
            );
        }

        // ── 2. Create standard folder structure and safe filename ───────────────
        // Scope files by user to prevent IDOR attacks and overwrites
        const fileExtension = filename.split('.').pop();
        const uniqueKey = `uploads/users/${userId}/${uuidv4()}.${fileExtension}`;

        // ── 3. Build AWS Command ─────────────────────────────────────────────────
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: uniqueKey,
            ContentType: contentType, // Force S3 to accept ONLY this specific type
            ContentLength: size,      // Hint to S3 — though presigned URL enforcement requires CORS config
            Metadata: {
                userId,
                originalName: filename,
            },
            // ACL: 'private' is default. Never use public-read for sensitive files.
        });

        // ── 4. Generate short-lived presigned URL ────────────────────────────────
        // URL strictly expires in 60 seconds to limit intercept attack window
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

        const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`;

        return NextResponse.json({
            success: true,
            message: 'Presigned URL generated successfully',
            data: {
                uploadUrl: signedUrl,
                key: uniqueKey,
                publicUrl, // the final URL the file will live at (if bucket has read policy, or accessed via CloudFront)
                // Important: if the bucket blocks public read,
                // you will need ANOTHER route to generate a presigned GET url.
            },
        });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to generate upload URL' },
            { status: 500 }
        );
    }
});
