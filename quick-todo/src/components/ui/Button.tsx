import React from 'react';
import { ButtonProps } from '../../types/components';

/**
 * Button Component
 * 
 * A flexible button component that supports multiple variants, sizes, and states.
 * Built with accessibility in mind and follows the design system tokens.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   Save Todo
 * </Button>
 * 
 * <Button variant="ghost" icon={<PlusIcon />} iconPosition="left">
 *   Add Item
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  testId,
  style,
  ...props
}) => {
  // Construct CSS classes based on props
  const baseClasses = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth && 'button--full-width',
    loading && 'button--loading',
    disabled && 'button--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Handle click events
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  // Render icon if provided
  const renderIcon = () => {
    if (!icon) return null;
    return (
      <span className={`button__icon button__icon--${iconPosition}`}>
        {icon}
      </span>
    );
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={baseClasses}
      data-testid={testId}
      style={style}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="button__spinner" aria-hidden="true">
          {/* Loading spinner */}
          <svg
            className="button__spinner-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="31.416"
              strokeDashoffset="31.416"
            />
          </svg>
        </span>
      )}
      
      {iconPosition === 'left' && renderIcon()}
      
      {children && (
        <span className="button__content">
          {children}
        </span>
      )}
      
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};

Button.displayName = 'Button';