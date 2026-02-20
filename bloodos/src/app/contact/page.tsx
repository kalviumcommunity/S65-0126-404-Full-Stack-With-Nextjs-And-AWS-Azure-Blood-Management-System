
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { FormInput } from '@/components/ui/FormInput';
import { Button } from '@/components';
import Link from 'next/link';

// ─── Zod Schema ────────────────────────────────────────────────────────────────
// Separate schema from Signup — demonstrates reusability of the FormInput component
const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject is too long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be under 1000 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ─── Page Component ───────────────────────────────────────────────────────────
export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // Live character count on message
  const messageValue = watch('message');
  const currentLength = messageValue?.length ?? 0;

  const onSubmit = async (data: ContactFormData) => {
    await new Promise((r) => setTimeout(r, 1000));
    console.info('[ContactForm] Submitted:', data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '20px', fontSize: '13px', color: '#6b7280' }}>
        <Link href="/" style={{ color: '#dc2626', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#374151', fontWeight: 600 }}>Contact</span>
      </nav>

      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '36px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        border: '1px solid #f3f4f6',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>
            📬 Contact Us
          </h1>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
            Same <code style={{ background: '#f3f4f6', padding: '1px 5px', borderRadius: '4px' }}>FormInput</code> component as Signup — different Zod schema.
          </p>
        </div>

        {/* Success Banner */}
        {submitted && (
          <div style={{
            background: '#f0fdf4', border: '1px solid #86efac',
            borderRadius: '10px', padding: '14px 18px', marginBottom: '20px',
          }}>
            <p style={{ color: '#16a34a', fontWeight: 700, margin: 0 }}>
              ✅ Message sent! We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
        >
          {/* Two-column row for Name + Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <FormInput
              label="Your Name"
              name="name"
              placeholder="Alice Kumar"
              register={register}
              error={errors.name}
              required
            />
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="alice@example.com"
              register={register}
              error={errors.email}
              required
            />
          </div>

          <FormInput
            label="Subject"
            name="subject"
            placeholder="Blood donation inquiry..."
            register={register}
            error={errors.subject}
            required
          />

          {/* Textarea with character counter */}
          <div>
            <FormInput
              label="Message"
              name="message"
              as="textarea"
              rows={5}
              placeholder="Describe your enquiry in at least 10 characters..."
              register={register}
              error={errors.message}
              required
            />
            <p style={{
              textAlign: 'right', fontSize: '11px', marginTop: '4px',
              color: currentLength > 900 ? '#dc2626' : '#9ca3af',
            }}>
              {currentLength} / 1000
            </p>
          </div>

          <Button
            label={isSubmitting ? 'Sending...' : 'Send Message →'}
            variant="primary"
            size="lg"
            type="submit"
            isLoading={isSubmitting}
            style={{ width: '100%', justifyContent: 'center' }}
          />
        </form>
      </div>
    </div>
  );
}
