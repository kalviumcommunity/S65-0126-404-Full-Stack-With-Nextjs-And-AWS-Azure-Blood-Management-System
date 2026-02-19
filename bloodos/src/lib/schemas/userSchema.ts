
import { z } from 'zod';

export const UserRoleSchema = z.enum(['DONOR', 'HOSPITAL', 'ADMIN', 'NGO']);

export const UserSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(100, { message: 'Password is too long' }),
    role: UserRoleSchema.default('DONOR'),
});

export type UserInput = z.infer<typeof UserSchema>;
