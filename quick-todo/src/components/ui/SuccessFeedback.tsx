'use client';

import React, { useEffect } from 'react';
import './SuccessFeedback.css';

interface SuccessFeedbackProps {
  /**
   * The success message to display
   */
  message: string;
  
  /**
   * Called when the feedback should be dismissed
   */
  onDismiss?: () => void;
  
  /**
   * Auto-dismiss timeout in milliseconds
   * @default 3000
   */
  timeout?: number;
  
  /**
   * Whether to auto-dismiss the feedback
   * @default true
   */
  autoDismiss?: boolean;
  
  /**
   * Whether the feedback is manually dismissible
   * @default true
   */
  dismissible?: boolean;
  
  /**
   * The icon to display
   * @default '✓'
   */
  icon?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Test identifier for automated testing
   */
  testId?: string;
}

/**
 * SuccessFeedback Component
 * 
 * US14 AC04: Displays success feedback for user actions.
 * Provides accessible success notifications with auto-dismiss functionality.
 * 
 * @example
 * ```tsx
 * <SuccessFeedback 
 *   message="Todo added successfully!"
 *   onDismiss={() => setSuccess(null)}
 * />
 * ```
 */
export const SuccessFeedback: React.FC<SuccessFeedbackProps> = ({
  message,
  onDismiss,
  timeout = 3000,
  autoDismiss = true,
  dismissible = true,
  icon = '✓',
  className = '',
  testId,
}) => {
  // Auto-dismiss functionality
  useEffect(() => {
    if (autoDismiss && onDismiss && timeout > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onDismiss, timeout]);

  const classes = [
    'success-feedback',
    className,
  ].filter(Boolean).join(' ');

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && dismissible && onDismiss) {
      onDismiss();
    }
  };

  return (
    <div 
      className={classes}
      role="status"
      aria-live="polite"
      aria-label={message}
      data-testid={testId}
      onKeyDown={handleKeyDown}
      tabIndex={dismissible ? 0 : -1}
    >
      <div className="success-feedback__content">
        <span 
          className="success-feedback__icon"
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="success-feedback__message">
          {message}
        </span>
      </div>
      
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="success-feedback__dismiss"
          aria-label="Dismiss success message"
        >
          ✕
        </button>
      )}
    </div>
  );
};

SuccessFeedback.displayName = 'SuccessFeedback';