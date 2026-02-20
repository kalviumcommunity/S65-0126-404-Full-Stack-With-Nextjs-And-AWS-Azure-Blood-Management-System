
'use client';

import { UseFormRegister, FieldError } from 'react-hook-form';

interface FormInputProps {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: FieldError;
  required?: boolean;
  rows?: number; // for textarea
  as?: 'input' | 'textarea';
}

/**
 * FormInput — Reusable, accessible form field component.
 * Works with any React Hook Form instance via the `register` prop.
 *
 * @example
 * <FormInput label="Email" name="email" type="email" register={register} error={errors.email} />
 */
export function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  required,
  rows = 4,
  as = 'input',
}: FormInputProps) {
  const hasError = !!error;

  const sharedStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1.5px solid ${hasError ? '#dc2626' : '#d1d5db'}`,
    fontSize: '14px',
    outline: 'none',
    background: hasError ? '#fff5f5' : '#fff',
    color: '#111827',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Accessible Label */}
      <label
        htmlFor={name}
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#374151',
        }}
      >
        {label}
        {required && (
          <span aria-hidden="true" style={{ color: '#dc2626', marginLeft: '3px' }}>
            *
          </span>
        )}
      </label>

      {/* Input or Textarea */}
      {as === 'textarea' ? (
        <textarea
          id={name}
          rows={rows}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          style={sharedStyle}
          {...register(name)}
        />
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          style={sharedStyle}
          {...register(name)}
        />
      )}

      {/* Validation Error Message */}
      {hasError && (
        <p
          id={`${name}-error`}
          role="alert"
          style={{
            fontSize: '12px',
            color: '#dc2626',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span aria-hidden="true">⚠</span> {error.message}
        </p>
      )}
    </div>
  );
}
