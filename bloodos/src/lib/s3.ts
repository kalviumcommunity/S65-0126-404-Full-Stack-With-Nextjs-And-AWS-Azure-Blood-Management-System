
import { S3Client } from '@aws-sdk/client-s3';

// Ensure environment variables are set
const region = process.env.AWS_REGION || 'us-east-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
    throw new Error('Missing AWS credentials in environment variables');
}

export const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'bloodos-uploads';
