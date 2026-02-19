
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ErrorCodes } from '@/lib/errorCodes';
import { handleError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';

// POST /api/files
// Records uploaded file metadata in database AFTER successful upload
export async function POST(req: Request) {
    try {
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return sendError('Unauthorized', ErrorCodes.UNAUTHORIZED, 401);
        }

        const { fileName, fileURL, size, type } = await req.json();

        if (!fileName || !fileURL || !size || !type) {
            return sendError('Missing file metadata', ErrorCodes.VALIDATION_ERROR, 400);
        }

        // Insert into DB
        const fileRecord = await prisma.file.create({
            data: {
                userId,
                name: fileName,
                url: fileURL,
                size,
                type
            }
        });

        logger.info('File Metadata Saved', { id: fileRecord.id, url: fileURL });

        return sendSuccess(fileRecord, 'File uploaded and recorded successfully', 201);

    } catch (error: any) {
        return handleError(error, 'POST /api/files');
    }
}
