
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * AWS Secrets Manager Utility
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Why use Secret Management?
 * - .env files are risky because they store plaintext secrets on disk.
 * - Secret managers encrypt secrets at rest and in transit.
 * - Centralized management allows for automated rotation without touching app code.
 *
 * This implementation provides secure runtime injection:
 * 1. The app starts using an IAM Role (or access keys in development).
 * 2. It fetches the secret securely from AWS.
 * 3. The secret is injected into memory, never written to disk or logs.
 */

// Initialize client (Fallback to empty strings for environments where it's not configured)
const region = process.env.AWS_REGION || 'us-east-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

// We only pass credentials if they exist (local dev).
// In production on AWS (ECS/EKS/EC2/Lambda), the SDK automatically uses the IAM Role,
// so explicit credentials are not needed — implementing Least Privilege.
const clientParams: ConstructorParameters<typeof SecretsManagerClient>[0] = { region };
if (accessKeyId && secretAccessKey) {
    clientParams.credentials = { accessKeyId, secretAccessKey };
}

const secretsClient = new SecretsManagerClient(clientParams);

/**
 * Retrieve a JSON secret from AWS Secrets Manager
 *
 * @param secretName - The name or ARN of the secret
 * @returns Parsed JSON object containing the secret key-value pairs
 */
export async function getJsonSecret<T extends Record<string, string>>(secretName: string): Promise<T | null> {
    try {
        const response = await secretsClient.send(
            new GetSecretValueCommand({
                SecretId: secretName,
                VersionStage: 'AWSCURRENT', // Ensure we get the latest
            })
        );

        if (response.SecretString) {
            return JSON.parse(response.SecretString) as T;
        }

        // In rare cases where a secret is binary, it would be in response.SecretBinary
        console.warn(`[SecretsManager] Secret ${secretName} exists but is not a string.`);
        return null;
    } catch (error) {
        console.error(`[SecretsManager] Failed to fetch secret ${secretName}:`, error);
        // Silent fail returning null is safer than crashing, allowing the app to handle missing secrets gracefully
        return null;
    }
}
