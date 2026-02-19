
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  hint?: string;
}

/**
 * InputField — Accessible, reusable form input with label, error, and hint states.
 *
 * @example
 * <InputField id="email" label="Email Address" type="email" error="Invalid email" />
 */
export function InputField({ label, id, error, hint, ...props }: InputFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        htmlFor={id}
        style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}
      >
        {label}
        {props.required && <span aria-hidden="true" style={{ color: '#dc2626', marginLeft: '2px' }}>*</span>}
      </label>

      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
        style={{
          padding: '10px 14px',
          borderRadius: '8px',
          border: `1.5px solid ${error ? '#dc2626' : '#d1d5db'}`,
          fontSize: '14px',
          outline: 'none',
          background: '#fff',
          color: '#111827',
          transition: 'border-color 0.2s',
          ...props.style,
        }}
      />

      {hint && !error && (
        <p id={`${id}-hint`} style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" style={{ fontSize: '12px', color: '#dc2626', margin: 0 }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
