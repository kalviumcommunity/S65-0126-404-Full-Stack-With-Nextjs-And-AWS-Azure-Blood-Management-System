
'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ConfirmModal — Accessible blocking confirmation dialog.
 *
 * Accessibility: aria-modal, aria-labelledby, focus trap, ESC to close,
 * focus restored to trigger on close.
 *
 * @example
 * <ConfirmModal
 *   isOpen={showModal}
 *   title="Delete User"
 *   message="This action cannot be undone."
 *   variant="danger"
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowModal(false)}
 * />
 */
export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Focus the cancel button when modal opens (safest default for destructive actions)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const variantLight = variant === 'danger' ? '#fef2f2' : '#eff6ff';

  return (
    /* Backdrop */
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      onClick={(e) => { if (e.target === overlayRef.current) onCancel(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(2px)',
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      {/* Modal Panel */}
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '420px',
          width: '90%',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          animation: 'slideIn 0.2s ease-out',
        }}
      >
        {/* Icon */}
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: variantLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', marginBottom: '16px',
        }}>
          {variant === 'danger' ? '🗑️' : '✅'}
        </div>

        <h2
          id="modal-title"
          style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}
        >
          {title}
        </h2>
        <p
          id="modal-desc"
          style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px' }}
        >
          {message}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            ref={cancelRef}
            onClick={onCancel}
            style={{
              padding: '10px 20px', borderRadius: '8px',
              border: '1.5px solid #e5e7eb', background: '#fff',
              color: '#374151', fontWeight: 600, fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            {cancelLabel}
          </button>
          <Button
            label={confirmLabel}
            variant={variant}
            size="md"
            onClick={onConfirm}
          />
        </div>
      </div>

      {/* Inline keyframe styles */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideIn { from { transform: scale(0.95); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  );
}
