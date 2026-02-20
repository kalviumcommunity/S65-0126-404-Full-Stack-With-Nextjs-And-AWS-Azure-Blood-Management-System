
import { NextResponse } from 'next/server';
import { getJsonSecret } from '@/lib/secrets';
import { withPermission } from '@/lib/withPermission';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * GET /api/admin/secrets
 * ─────────────────────────────────────────────────────────────────────────────
 * Retrieve and demonstrate the successful fetching of an AWS Secret.
 *
 * Security measures:
 * 1. RBAC Protected: Requires ADMIN role.
 * 2. Key-Only Response: Never returns the raw Secret values to the client,
 *    even to admins. It only returns the Object Keys to demonstrate that
 *    the secret was fetched successfully.
 *
 * Using process.env.AWS_SECRET_NAME as the dynamic pointer.
 */
export const GET = withPermission('manage_users', async () => {
    const secretName = process.env.AWS_SECRET_NAME || 'bloodos/prod/secrets';

    try {
        const rawSecret = await getJsonSecret(secretName);

        if (!rawSecret) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Secret Manager failed to retrieve secret: ${secretName}`,
                    error: { code: 'NOT_FOUND_OR_DENIED' },
                },
                { status: 404 }
            );
        }

        // Never return the values, only the keys
        // This allows the admin client to verify the structure, without leaking the secrets
        const secretKeys = Object.keys(rawSecret);

        return NextResponse.json({
            success: true,
            message: 'Secret successfully retrieved and verified.',
            data: {
                secretName,
                retrievedKeysCount: secretKeys.length,
                retrievedKeys: secretKeys,
                notice: 'Secret values are masked and will not be returned in API endpoints.',
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                success: false,
                message: 'A critical error occurred while accessing the Secrets Manager.',
                error: { message: errorMessage },
            },
            { status: 500 }
        );
    }
});
