import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-[#0904a3] text-white hover:bg-[#0904a3]/90 focus-visible:ring-[#0904a3]',
      secondary: 'border border-[#bfbfbf] bg-transparent text-[#06041f] hover:bg-[#f8feff]',
      destructive: 'bg-[#dc2626] text-white hover:bg-[#dc2626]/90 focus-visible:ring-[#dc2626]',
      ghost: 'hover:bg-[#f8feff] text-[#06041f]',
    };

    const sizeClasses = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 text-base',
    };

    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md text-sm font-bold transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          
          // Variant and size styles
          variantClasses[variant],
          sizeClasses[size],
          
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';