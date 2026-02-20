
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { FormInput } from '@/components/ui/FormInput';
import { Button } from '@/components';
import Link from 'next/link';

// ─── Zod Schema ────────────────────────────────────────────────────────────────
const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name too long'),
    email: z
      .string()
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[0-9]/, 'Password must include at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Error shown on confirmPassword field
  });

// Derive TypeScript type from schema
type SignupFormData = z.infer<typeof signupSchema>;

// ─── Page Component ───────────────────────────────────────────────────────────
export default function SignupPage() {
  const [submitted, setSubmitted] = useState<SignupFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    console.info('[SignupForm] Submitted:', { name: data.name, email: data.email });
    setSubmitted(data);
    reset(); // Reset form after submission
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '20px', fontSize: '13px', color: '#6b7280' }}>
        <Link href="/" style={{ color: '#dc2626', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#374151', fontWeight: 600 }}>Sign Up</span>
      </nav>

      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '36px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        border: '1px solid #f3f4f6',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '40px' }}>🩸</span>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '8px 0 4px' }}>
            Create Account
          </h1>
          <p style={{ color: '#6b7280', fontSize: '13px' }}>Join BloodOS and save lives</p>
        </div>

        {/* Success Message */}
        {submitted && (
          <div style={{
            background: '#f0fdf4', border: '1px solid #86efac',
            borderRadius: '10px', padding: '16px 20px', marginBottom: '24px',
          }}>
            <p style={{ color: '#16a34a', fontWeight: 700, margin: '0 0 4px' }}>
              ✅ Account created successfully!
            </p>
            <p style={{ color: '#4ade80', fontSize: '13px', margin: 0 }}>
              Welcome, <strong>{submitted.name}</strong>!
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
        >
          <FormInput
            label="Full Name"
            name="name"
            type="text"
            placeholder="Alice Kumar"
            register={register}
            error={errors.name}
            required
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="alice@bloodos.com"
            register={register}
            error={errors.email}
            required
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Min 6 chars, 1 uppercase, 1 number"
            register={register}
            error={errors.password}
            required
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            register={register}
            error={errors.confirmPassword}
            required
          />

          <Button
            label={isSubmitting ? 'Creating Account...' : 'Create Account →'}
            variant="primary"
            size="lg"
            type="submit"
            isLoading={isSubmitting}
            style={{ width: '100%', justifyContent: 'center' }}
          />
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>

      {/* Schema debug (dev only) */}
      {process.env.NODE_ENV === 'development' && Object.keys(errors).length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>🔍 Validation Errors (Dev)</p>
          <pre style={{
            background: '#111827', color: '#f87171',
            padding: '12px', borderRadius: '8px', fontSize: '11px', overflowX: 'auto',
          }}>
            {JSON.stringify(
              Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v?.message])),
              null, 2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
