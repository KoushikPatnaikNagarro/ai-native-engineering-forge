import React, { useState, useId } from 'react';
import { InputProps } from '../../types/components';

/**
 * Input Component
 * 
 * A flexible input component that supports various types, states, and validation.
 * Includes built-in accessibility features and consistent styling.
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Todo Text"
 *   placeholder="Enter your todo..."
 *   value={text}
 *   onChange={(e) => setText(e.target.value)}
 *   required
 * />
 * 
 * <Input
 *   type="search"
 *   placeholder="Search todos..."
 *   value={searchText}
 *   onChange={(e) => setSearchText(e.target.value)}
 * />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  defaultValue,
  placeholder,
  disabled = false,
  required = false,
  readOnly = false,
  size = 'medium',
  error = false,
  errorMessage,
  helpText,
  label,
  onChange,
  onFocus,
  onBlur,
  onKeyPress,
  onKeyDown,
  autoComplete,
  autoFocus,
  maxLength,
  minLength,
  className = '',
  testId,
  style,
  children,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();
  const errorId = useId();
  const helpId = useId();

  // Construct CSS classes
  const inputClasses = [
    'input',
    `input--${size}`,
    error && 'input--error',
    disabled && 'input--disabled',
    readOnly && 'input--readonly',
    isFocused && 'input--focused',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const containerClasses = [
    'input-container',
    disabled && 'input-container--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  // Handle focus events
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  // Handle key press events
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyPress?.(event);
  };

  // Handle key down events
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
  };

  // Build aria attributes
  const ariaDescribedBy = [
    helpText && helpId,
    error && errorMessage && errorId,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} style={style}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="input-label"
          data-required={required}
        >
          {label}
          {required && (
            <span className="input-label__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      
      <div className="input-wrapper">
        <input
          id={inputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          className={inputClasses}
          data-testid={testId}
          aria-invalid={error}
          aria-describedby={ariaDescribedBy || undefined}
          {...props}
        />
        
        {children && (
          <div className="input-addon">
            {children}
          </div>
        )}
      </div>
      
      {helpText && !error && (
        <div id={helpId} className="input-help">
          {helpText}
        </div>
      )}
      
      {error && errorMessage && (
        <div id={errorId} className="input-error" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

Input.displayName = 'Input';