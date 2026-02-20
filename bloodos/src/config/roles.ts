
/**
 * roles.ts — Centralised Role & Permission Configuration
 *
 * Design Philosophy:
 * Broad role grouping (Admin/Editor/Viewer) is preferred over fine-grained
 * per-action roles because:
 *  1. Easier to audit — 3 roles vs 20+ permission flags
 *  2. Simpler onboarding — "You're an Editor" is self-explanatory
 *  3. Less privilege creep — permissions are added at the role level, not per-user
 *  4. ABAC (Attribute-Based) can be layered on top if fine-grained control is needed later
 */

// ─── Role Enum ─────────────────────────────────────────────────────────────────
export const ROLES = {
    ADMIN: 'ADMIN',
    DONOR: 'DONOR',
    HOSPITAL: 'HOSPITAL',
    NGO: 'NGO',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// ─── Permission Set ────────────────────────────────────────────────────────────
export const PERMISSIONS = {
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
    MANAGE_USERS: 'manage_users',
    VIEW_REPORTS: 'view_reports',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ─── Role → Permissions Map ────────────────────────────────────────────────────
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    // Admin: full access + user management
    ADMIN: [
        PERMISSIONS.CREATE,
        PERMISSIONS.READ,
        PERMISSIONS.UPDATE,
        PERMISSIONS.DELETE,
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.VIEW_REPORTS,
    ],

    // Donor: can create donations, read own data, update own profile
    DONOR: [
        PERMISSIONS.CREATE,
        PERMISSIONS.READ,
        PERMISSIONS.UPDATE,
    ],

    // Hospital: read blood requests, update request status
    HOSPITAL: [
        PERMISSIONS.READ,
        PERMISSIONS.UPDATE,
        PERMISSIONS.VIEW_REPORTS,
    ],

    // NGO: read-only access to donor lists and reports
    NGO: [
        PERMISSIONS.READ,
        PERMISSIONS.VIEW_REPORTS,
    ],
};

// ─── Helper Functions ──────────────────────────────────────────────────────────

/**
 * Check if a role has a specific permission.
 *
 * @example
 * hasPermission('ADMIN', 'delete') // true
 * hasPermission('NGO', 'delete')   // false
 */
export function hasPermission(role: Role, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    if (!permissions) return false;
    return permissions.includes(permission);
}

/**
 * Check if a role has ALL of the required permissions.
 */
export function hasAllPermissions(role: Role, required: Permission[]): boolean {
    return required.every((p) => hasPermission(role, p));
}

/**
 * Check if a role has ANY of the required permissions.
 */
export function hasAnyPermission(role: Role, required: Permission[]): boolean {
    return required.some((p) => hasPermission(role, p));
}

/**
 * Assert permission — throws a structured error if denied.
 * Use in API routes for clean permission gates.
 */
export function assertPermission(role: Role | undefined, permission: Permission): void {
    if (!role || !hasPermission(role, permission)) {
        const err = new Error(`RBAC: Role "${role}" lacks permission "${permission}"`) as Error & {
            statusCode: number;
            code: string;
        };
        err.statusCode = 403;
        err.code = 'FORBIDDEN';
        throw err;
    }
}
