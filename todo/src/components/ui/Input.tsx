import React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || React.useId();
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-[#06041f] mb-2"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-md border border-[#bfbfbf] bg-white px-3 py-2',
            'text-sm text-[#06041f] placeholder:text-[rgba(6,4,31,0.5)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0904a3] focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[#dc2626] focus-visible:ring-[#dc2626]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-[#dc2626]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';