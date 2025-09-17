'use client';

import React from 'react';

interface ErrorBannerProps {
  /**
   * The error message to display
   */
  message: string;
  
  /**
   * Called when the dismiss button is clicked
   */
  onDismiss?: () => void;
  
  /**
   * Whether the error is dismissible
   * @default true
   */
  dismissible?: boolean;
  
  /**
   * The variant/severity of the error
   * @default 'error'
   */
  variant?: 'error' | 'warning' | 'info';
  
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
 * ErrorBanner Component
 * 
 * US13: Displays storage errors and other app-level errors to users.
 * Provides accessible error feedback with dismissible functionality.
 * 
 * @example
 * ```tsx
 * <ErrorBanner 
 *   message="Storage full. Some changes may not be saved."
 *   variant="warning"
 *   onDismiss={() => setError(null)}
 * />
 * ```
 */
export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onDismiss,
  dismissible = true,
  variant = 'error',
  className = '',
  testId,
}) => {
  const baseClasses = 'error-banner';
  const variantClasses = {
    error: 'error-banner--error',
    warning: 'error-banner--warning',
    info: 'error-banner--info',
  };

  const iconMap = {
    error: '⚠️',
    warning: '⚠️', 
    info: 'ℹ️',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      role="alert"
      aria-live="polite"
      data-testid={testId}
    >
      <div className="error-banner__content">
        <span 
          className="error-banner__icon"
          aria-hidden="true"
        >
          {iconMap[variant]}
        </span>
        <span className="error-banner__message">
          {message}
        </span>
      </div>
      
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="error-banner__dismiss"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
};