
import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, BUCKET_NAME } from '@/lib/s3';
import { v4 as uuidv4 } from 'uuid';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ErrorCodes } from '@/lib/errorCodes';
import { logger } from '@/lib/logger';
import { handleError } from '@/lib/errorHandler';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

// POST /api/upload
// Generates a Pre-Signed URL for Client-Side Uploads
export async function POST(req: Request) {
    try {
        // 1️⃣ Auth Check (Optional: Require login to upload)
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return sendError('Unauthorized', ErrorCodes.UNAUTHORIZED, 401);
        }

        const body = await req.json();
        const { filename, fileType, fileSize } = body;

        // 2️⃣ Validation
        if (!filename || !fileType || !fileSize) {
            return sendError('Missing file metadata', ErrorCodes.VALIDATION_ERROR, 400);
        }

        if (!ALLOWED_FILE_TYPES.includes(fileType)) {
            return sendError('Invalid file type. Only Images and PDFs are allowed.', ErrorCodes.VALIDATION_ERROR, 400);
        }

        if (fileSize > MAX_FILE_SIZE) {
            return sendError('File too large. Maximum size is 5MB.', ErrorCodes.VALIDATION_ERROR, 400);
        }

        // 3️⃣ Generate Unique Key (UUID + Extension)
        const fileExtension = filename.split('.').pop();
        const uniqueKey = `uploads/${userId}/${uuidv4()}.${fileExtension}`;

        // 4️⃣ Create Command & Sign URL
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: uniqueKey,
            ContentType: fileType,
            ContentLength: fileSize,
            Metadata: {
                userId: userId,
                originalName: filename
            }
        });

        // URL Expiry: 60 seconds (Client must start upload immediately)
        const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 60 });

        logger.info('Pre-signed URL Generated', { userId, filename, uniqueKey });

        return sendSuccess({
            uploadURL,
            fileKey: uniqueKey,
            expiresIn: 60
        }, 'Upload URL generated successfully');

    } catch (error: any) {
        return handleError(error, 'POST /api/upload');
    }
}
