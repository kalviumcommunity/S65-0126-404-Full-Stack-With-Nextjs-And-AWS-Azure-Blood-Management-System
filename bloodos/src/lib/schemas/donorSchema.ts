
import { z } from 'zod';

export const BloodTypeSchema = z.enum([
    'A_POS',
    'A_NEG',
    'B_POS',
    'B_NEG',
    'AB_POS',
    'AB_NEG',
    'O_POS',
    'O_NEG',
]);

export const DonorProfileSchema = z.object({
    fullName: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long' })
        .max(100, { message: 'Name is too long' }),
    bloodType: BloodTypeSchema,
    phone: z
        .string()
        .min(10, { message: 'Phone number is too short' })
        .max(15, { message: 'Phone number is too long' })
        .regex(/^\+?[0-9]{10,15}$/, { message: 'Invalid phone number format' }),
    city: z.string().min(1, { message: 'City is required' }),
    state: z.string().min(1, { message: 'State is required' }),
});

export type DonorInput = z.infer<typeof DonorProfileSchema>;
