'use client';

import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * The loading message to display
   */
  message?: string;
  
  /**
   * Whether to show the loading text
   * @default true
   */
  showText?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Test identifier for automated testing
   */
  testId?: string;
  
  /**
   * Whether the spinner is inline (no padding/margins)
   * @default false
   */
  inline?: boolean;
}

/**
 * LoadingSpinner Component
 * 
 * US14 AC01: Displays loading indicators for async operations.
 * Provides accessible loading feedback with customizable sizes and messages.
 * 
 * @example
 * ```tsx
 * <LoadingSpinner message="Loading todos..." />
 * <LoadingSpinner size="small" showText={false} inline />
 * ```
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message = 'Loading...',
  showText = true,
  className = '',
  testId,
  inline = false,
}) => {
  const containerClasses = [
    'loading-spinner-container',
    inline && 'loading-spinner-container--inline',
    className,
  ].filter(Boolean).join(' ');

  const spinnerClasses = [
    'loading-spinner',
    `loading-spinner--${size}`,
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={containerClasses}
      role="status"
      aria-live="polite"
      aria-label={message}
      data-testid={testId}
    >
      <div className={spinnerClasses} aria-hidden="true" />
      {showText && (
        <span className="loading-spinner__text">
          {message}
        </span>
      )}
    </div>
  );
};

LoadingSpinner.displayName = 'LoadingSpinner';