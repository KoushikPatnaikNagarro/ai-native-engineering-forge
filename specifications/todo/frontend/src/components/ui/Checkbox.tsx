import React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <label className={cn('inline-flex items-center cursor-pointer', className)}>
        <input
          type="checkbox"
          className={cn(
            'checkbox-base',
            props.checked && 'checkbox-checked',
            error && 'border-error',
            'sr-only'
          )}
          ref={ref}
          {...props}
        />
        <div className={cn(
          'checkbox-base touch-target flex items-center justify-center',
          props.checked && 'checkbox-checked',
          error && 'border-error'
        )}>
          {props.checked && (
            <svg className="w-4 h-4 text-white animate-checkbox" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        {(label || children) && (
          <span className="ml-3 text-task-text">
            {label || children}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
