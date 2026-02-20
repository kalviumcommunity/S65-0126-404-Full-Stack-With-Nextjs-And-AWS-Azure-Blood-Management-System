
import { S3Client } from '@aws-sdk/client-s3';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * AWS S3 Client Initialization — Presigned URL Uploads
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * This client is used ONLY server-side to generate short-lived Presigned URLs.
 * The Next.js backend NEVER handles the file bytes directly.
 *
 * Security & IAM Setup:
 * 1. Create an IAM User (e.g., bloodos-s3-uploader)
 * 2. Attach inline policy (Least Privilege):
 *    {
 *      "Version": "2012-10-17",
 *      "Statement": [
 *        {
 *          "Effect": "Allow",
 *          "Action": ["s3:PutObject", "s3:GetObject"],
 *          "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
 *        }
 *      ]
 *    }
 * 3. Never expose AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY to the browser.
 */

// We check if values exist to avoid throwing immediately in environments that
// don't use S3 (e.g., CI/CD build environments).
const bucketName = process.env.AWS_S3_BUCKET_NAME || '';
const region = process.env.AWS_REGION || 'us-east-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

export const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export const BUCKET_NAME = bucketName;
