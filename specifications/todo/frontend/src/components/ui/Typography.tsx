import React from 'react';
import { cn } from '@/lib/utils';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const Typography = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        className={cn(className)}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    );
  }
);

Typography.displayName = 'Typography';

// Specific typography components based on design specifications
const AppTitle = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'as'>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h1
        className={cn('app-title', className)}
        ref={ref}
        {...props}
      >
        {children}
      </h1>
    );
  }
);

AppTitle.displayName = 'AppTitle';

const TaskText = React.forwardRef<HTMLSpanElement, Omit<TypographyProps, 'as'> & { completed?: boolean }>(
  ({ className, children, completed, ...props }, ref) => {
    return (
      <span
        className={cn(
          'task-text',
          completed && 'task-text-completed',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

TaskText.displayName = 'TaskText';

const CounterText = React.forwardRef<HTMLSpanElement, Omit<TypographyProps, 'as'>>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        className={cn('task-counter', className)}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

CounterText.displayName = 'CounterText';

const ErrorText = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'as'>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        className={cn('error-text', className)}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    );
  }
);

ErrorText.displayName = 'ErrorText';

const EmptyStateTitle = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'as'>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        className={cn('empty-state-title', className)}
        ref={ref}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

EmptyStateTitle.displayName = 'EmptyStateTitle';

const EmptyStateSubtitle = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'as'>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        className={cn('empty-state-subtitle', className)}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    );
  }
);

EmptyStateSubtitle.displayName = 'EmptyStateSubtitle';

export {
  Typography,
  AppTitle,
  TaskText,
  CounterText,
  ErrorText,
  EmptyStateTitle,
  EmptyStateSubtitle,
};
