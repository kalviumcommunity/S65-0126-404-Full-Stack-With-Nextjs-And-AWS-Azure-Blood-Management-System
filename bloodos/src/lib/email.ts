
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { logger } from './logger';

// ─── SES Client Initialization ────────────────────────────────────────────────
const sesClient = new SESClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const SENDER_EMAIL = process.env.SES_EMAIL_SENDER || 'noreply@bloodos.com';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

interface SendEmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

// ─── Reusable sendEmail Function ──────────────────────────────────────────────
export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<SendEmailResult> {
    const command = new SendEmailCommand({
        Source: SENDER_EMAIL,
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Subject: {
                Data: subject,
                Charset: 'UTF-8',
            },
            Body: {
                Html: {
                    Data: html,
                    Charset: 'UTF-8',
                },
            },
        },
    });

    try {
        const response = await sesClient.send(command);
        const messageId = response.MessageId;

        logger.info('Email sent successfully', {
            to,
            subject,
            messageId,
        });

        return { success: true, messageId };
    } catch (error: any) {
        // Log the full error internally — never expose it in responses
        logger.error('Email sending failed', {
            to,
            subject,
            errorCode: error?.name,
            errorMessage: error?.message,
        });

        return {
            success: false,
            error: 'Email delivery failed. Please try again later.',
        };
    }
}
