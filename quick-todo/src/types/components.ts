import React from 'react';

/**
 * Base props that all components should extend
 * Provides common properties for consistent component behavior
 */
export interface BaseComponentProps {
  /** Custom CSS class name */
  className?: string;
  
  /** Test ID for automated testing */
  testId?: string;
  
  /** Accessibility label */
  'aria-label'?: string;
  
  /** Custom inline styles (use sparingly) */
  style?: React.CSSProperties;
  
  /** Children elements */
  children?: React.ReactNode;
}

/**
 * Button component props
 * Extends base props with button-specific properties
 */
export interface ButtonProps extends BaseComponentProps {
  /** Button variant/style */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  
  /** Whether button is disabled */
  disabled?: boolean;
  
  /** Loading state */
  loading?: boolean;
  
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  /** Optional icon to display */
  icon?: React.ReactNode;
  
  /** Icon position */
  iconPosition?: 'left' | 'right';
  
  /** Full width button */
  fullWidth?: boolean;
}

/**
 * Input component props
 * For text inputs, textareas, and similar form controls
 */
export interface InputProps extends BaseComponentProps {
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  
  /** Input value */
  value?: string;
  
  /** Default value for uncontrolled inputs */
  defaultValue?: string;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Whether input is disabled */
  disabled?: boolean;
  
  /** Whether input is required */
  required?: boolean;
  
  /** Whether input is read-only */
  readOnly?: boolean;
  
  /** Input size */
  size?: 'small' | 'medium' | 'large';
  
  /** Error state */
  error?: boolean;
  
  /** Error message */
  errorMessage?: string;
  
  /** Help text */
  helpText?: string;
  
  /** Label text */
  label?: string;
  
  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  
  /** Focus handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  
  /** Blur handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  
  /** Key press handler */
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  
  /** Key down handler */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  
  /** Autocomplete attribute */
  autoComplete?: string;
  
  /** Auto focus on mount */
  autoFocus?: boolean;
  
  /** Maximum length */
  maxLength?: number;
  
  /** Minimum length */
  minLength?: number;
}

/**
 * Icon component props
 * For SVG icons and icon components
 */
export interface IconProps extends BaseComponentProps {
  /** Icon name/identifier */
  name: string;
  
  /** Icon size */
  size?: 'small' | 'medium' | 'large' | number;
  
  /** Icon color */
  color?: string;
  
  /** Custom SVG title for accessibility */
  title?: string;
  
  /** Whether icon is decorative (hidden from screen readers) */
  decorative?: boolean;
}

/**
 * Modal component props
 * For overlay dialogs and modal windows
 */
export interface ModalProps extends BaseComponentProps {
  /** Whether modal is open */
  isOpen: boolean;
  
  /** Close handler */
  onClose: () => void;
  
  /** Modal title */
  title?: string;
  
  /** Modal size */
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  
  /** Whether modal can be closed by clicking backdrop */
  closeOnBackdrop?: boolean;
  
  /** Whether modal can be closed by pressing ESC */
  closeOnEsc?: boolean;
  
  /** Whether to show close button */
  showCloseButton?: boolean;
  
  /** Custom header content */
  header?: React.ReactNode;
  
  /** Custom footer content */
  footer?: React.ReactNode;
  
  /** Initial focus element selector */
  initialFocus?: string;
  
  /** Return focus element selector */
  returnFocus?: string;
}

/**
 * Toast notification props
 * For temporary notification messages
 */
export interface ToastProps extends BaseComponentProps {
  /** Toast message */
  message: string;
  
  /** Toast type/severity */
  type?: 'info' | 'success' | 'warning' | 'error';
  
  /** Auto-dismiss duration in milliseconds */
  duration?: number;
  
  /** Whether toast can be manually dismissed */
  dismissible?: boolean;
  
  /** Dismiss handler */
  onDismiss?: () => void;
  
  /** Toast position */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  
  /** Custom action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Generic list component props
 * For rendering lists of items with consistent behavior
 */
export interface ListProps<T = any> extends BaseComponentProps {
  /** Array of items to render */
  items: T[];
  
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  
  /** Key extractor function */
  keyExtractor?: (item: T, index: number) => string | number;
  
  /** Empty state content */
  emptyState?: React.ReactNode;
  
  /** Loading state */
  loading?: boolean;
  
  /** Loading content */
  loadingState?: React.ReactNode;
  
  /** Error state */
  error?: string;
  
  /** Error content */
  errorState?: React.ReactNode;
  
  /** Whether list is virtualized */
  virtualized?: boolean;
  
  /** Item height for virtualization */
  itemHeight?: number;
}