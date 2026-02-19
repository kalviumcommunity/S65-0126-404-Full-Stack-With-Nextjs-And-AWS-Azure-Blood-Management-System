
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ErrorCodes } from '@/lib/errorCodes';
import { sendEmail } from '@/lib/email';
import { welcomeTemplate } from '@/lib/templates/welcomeTemplate';
import { handleError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';

// Basic email regex validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/email
// Sends transactional emails using AWS SES
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { to, subject, templateType, userName } = body;

        // 1️⃣ Validate required fields
        if (!to || !subject) {
            return sendError('Missing required fields: to, subject', ErrorCodes.VALIDATION_ERROR, 400);
        }

        // 2️⃣ Validate email format
        if (!EMAIL_REGEX.test(to)) {
            return sendError('Invalid email address format', ErrorCodes.VALIDATION_ERROR, 400);
        }

        // 3️⃣ Resolve HTML content from template or use default
        let html: string;

        if (templateType === 'welcome') {
            html = welcomeTemplate(userName || 'Donor');
        } else {
            // Generic fallback: plain HTML message
            html = `<p>${subject}</p>`;
        }

        // 4️⃣ Send Email
        const result = await sendEmail({ to, subject, html });

        if (!result.success) {
            logger.error('Email delivery failed at route level', { to, subject });
            return sendError(
                'Email could not be delivered. Please try again later.',
                ErrorCodes.INTERNAL_ERROR,
                500
            );
        }

        return sendSuccess(
            { messageId: result.messageId },
            'Email sent successfully'
        );

    } catch (error: any) {
        return handleError(error, 'POST /api/email');
    }
}
