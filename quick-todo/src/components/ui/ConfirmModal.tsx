import React, { useEffect, useRef } from 'react';
import './ConfirmModal.css';

/**
 * ConfirmModal Component Props
 */
interface ConfirmModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Modal title */
  title: string;
  /** Modal message/description */
  message: string;
  /** Text for the confirm button */
  confirmText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Whether the action is destructive (affects styling) */
  destructive?: boolean;
  /** Callback when user confirms */
  onConfirm: () => void;
  /** Callback when user cancels or closes */
  onCancel: () => void;
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * ConfirmModal Component
 * 
 * A reusable confirmation modal component that meets WCAG accessibility standards.
 * Used for confirming destructive actions like clearing completed tasks.
 * 
 * Features:
 * - Focus management (traps focus within modal)
 * - Keyboard navigation (Escape to cancel, Enter to confirm)
 * - ARIA attributes for screen readers
 * - Click outside to cancel
 * - Smooth animations
 * 
 * @example
 * ```tsx
 * <ConfirmModal
 *   isOpen={showConfirm}
 *   title="Clear Completed Tasks"
 *   message="Are you sure you want to clear all completed tasks?"
 *   destructive
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
  testId = 'confirm-modal',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the first button when modal opens
      firstFocusableRef.current?.focus();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onCancel();
    } else if (event.key === 'Tab') {
      // Trap focus within modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  // Handle confirm with focus management
  const handleConfirm = () => {
    onConfirm();
  };

  // Handle cancel with focus management  
  const handleCancel = () => {
    onCancel();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="confirm-modal-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${testId}-title`}
      aria-describedby={`${testId}-message`}
      data-testid={testId}
    >
      <div
        ref={modalRef}
        className={`confirm-modal ${destructive ? 'confirm-modal--destructive' : ''}`}
        role="document"
      >
        <header className="confirm-modal__header">
          <h2 
            id={`${testId}-title`}
            className="confirm-modal__title"
          >
            {title}
          </h2>
        </header>
        
        <div className="confirm-modal__content">
          <p 
            id={`${testId}-message`}
            className="confirm-modal__message"
          >
            {message}
          </p>
        </div>
        
        <footer className="confirm-modal__actions">
          <button
            ref={firstFocusableRef}
            type="button"
            className="confirm-modal__button confirm-modal__button--cancel"
            onClick={handleCancel}
            data-testid={`${testId}-cancel`}
          >
            {cancelText}
          </button>
          <button
            ref={lastFocusableRef}
            type="button"
            className={`confirm-modal__button confirm-modal__button--confirm ${
              destructive ? 'confirm-modal__button--destructive' : ''
            }`}
            onClick={handleConfirm}
            data-testid={`${testId}-confirm`}
          >
            {confirmText}
          </button>
        </footer>
      </div>
    </div>
  );
};

ConfirmModal.displayName = 'ConfirmModal';