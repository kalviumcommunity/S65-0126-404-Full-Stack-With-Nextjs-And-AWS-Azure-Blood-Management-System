
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: '#dc2626', color: '#fff',
    border: '2px solid #dc2626',
  },
  secondary: {
    background: '#fff', color: '#374151',
    border: '2px solid #e5e7eb',
  },
  danger: {
    background: '#7f1d1d', color: '#fff',
    border: '2px solid #7f1d1d',
  },
  ghost: {
    background: 'transparent', color: '#dc2626',
    border: '2px solid transparent',
  },
};

const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '6px 14px', fontSize: '13px' },
  md: { padding: '10px 20px', fontSize: '14px' },
  lg: { padding: '14px 28px', fontSize: '16px' },
};

/**
 * Button — Reusable, accessible, polymorphic button component.
 *
 * @example
 * <Button label="Donate Now" variant="primary" onClick={handleDonate} />
 * <Button label="Cancel" variant="secondary" size="sm" />
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      disabled={isDisabled}
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '8px',
        fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        transition: 'opacity 0.2s, transform 0.1s',
        outline: 'none',
        ...VARIANT_STYLES[variant],
        ...SIZE_STYLES[size],
        ...props.style,
      }}
    >
      {isLoading ? (
        <span aria-hidden="true" style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
      ) : leftIcon}
      {label}
    </button>
  );
}
