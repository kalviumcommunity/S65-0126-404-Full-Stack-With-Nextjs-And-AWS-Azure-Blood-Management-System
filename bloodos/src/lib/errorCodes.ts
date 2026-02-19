
// Error code dictionary following standard format
// E100-E199: Validation and Input Errors
// E200-E299: Authentication and Authorization Errors
// E300-E399: Resource and Database Errors
// E500-E599: System and Internal Errors

export const ErrorCodes = {
    VALIDATION_ERROR: 'E100',
    INVALID_INPUT: 'E101',
    MISSING_FIELD: 'E102',

    UNAUTHORIZED: 'E200',
    FORBIDDEN: 'E201',

    NOT_FOUND: 'E300',
    DATABASE_ERROR: 'E301',
    DUPLICATE_ENTRY: 'E302',

    INTERNAL_ERROR: 'E500',
    UNKNOWN_ERROR: 'E599',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];
