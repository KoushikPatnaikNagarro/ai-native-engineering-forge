# Component Library & Design System - Quick Todo Application

## Overview
This design system provides a comprehensive set of reusable components, design tokens, and usage guidelines for the Quick Todo application. It ensures consistency, accessibility, and maintainability across the entire user interface.

## Design Tokens

### Typography Scale
```css
/* Font Family */
--font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

/* Font Sizes */
--font-size-xs: 12px;    /* 0.75rem */
--font-size-sm: 14px;    /* 0.875rem */
--font-size-base: 16px;  /* 1rem */
--font-size-lg: 18px;    /* 1.125rem */
--font-size-xl: 20px;    /* 1.25rem */
--font-size-2xl: 24px;   /* 1.5rem */
--font-size-3xl: 30px;   /* 1.875rem */

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;

/* Line Heights */
--line-height-tight: 1.25;
--line-height-snug: 1.375;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
```

### Color Palette
```css
/* Brand Colors */
--color-primary: #3B82F6;      /* Blue 500 */
--color-primary-hover: #2563EB; /* Blue 600 */
--color-primary-light: #DBEAFE; /* Blue 100 */

/* Neutral Colors */
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-300: #D1D5DB;
--color-gray-400: #9CA3AF;
--color-gray-500: #6B7280;
--color-gray-600: #4B5563;
--color-gray-700: #374151;
--color-gray-800: #1F2937;
--color-gray-900: #111827;

/* Semantic Colors */
--color-success: #10B981;      /* Emerald 500 */
--color-success-light: #D1FAE5; /* Emerald 100 */
--color-warning: #F59E0B;      /* Amber 500 */
--color-warning-light: #FEF3C7; /* Amber 100 */
--color-error: #EF4444;        /* Red 500 */
--color-error-light: #FEE2E2;  /* Red 100 */

/* Background Colors */
--color-bg-primary: #FFFFFF;
--color-bg-secondary: #F9FAFB;
--color-bg-overlay: rgba(0, 0, 0, 0.5);

/* Text Colors */
--color-text-primary: #111827;   /* Gray 900 */
--color-text-secondary: #6B7280; /* Gray 500 */
--color-text-muted: #9CA3AF;     /* Gray 400 */
--color-text-inverse: #FFFFFF;

/* Border Colors */
--color-border-light: #E5E7EB;   /* Gray 200 */
--color-border-medium: #D1D5DB;  /* Gray 300 */
--color-border-dark: #9CA3AF;    /* Gray 400 */
```

### Spacing Scale
```css
/* Base Unit: 4px */
--space-1: 4px;    /* 0.25rem */
--space-2: 8px;    /* 0.5rem */
--space-3: 12px;   /* 0.75rem */
--space-4: 16px;   /* 1rem */
--space-5: 20px;   /* 1.25rem */
--space-6: 24px;   /* 1.5rem */
--space-8: 32px;   /* 2rem */
--space-10: 40px;  /* 2.5rem */
--space-12: 48px;  /* 3rem */
--space-16: 64px;  /* 4rem */

/* Component Specific */
--space-input-padding: var(--space-3) var(--space-4);
--space-button-padding: var(--space-2) var(--space-4);
--space-card-padding: var(--space-4);
```

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-full: 9999px;
```

### Shadow System
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-focus: 0 0 0 3px rgba(59, 130, 246, 0.1);
```

### Animation Timings
```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;
--easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
--easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
--easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

## Core Components

### 1. Button Component

#### Primary Button
```css
.button-primary {
  /* Base Styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-button-padding);
  font-family: var(--font-family-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--duration-fast) var(--easing-ease-out);
  
  /* Primary Variant */
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  
  /* Minimum Touch Target */
  min-height: 44px;
  min-width: 44px;
}

.button-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.button-primary:focus {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.button-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.button-primary:disabled {
  background-color: var(--color-gray-300);
  color: var(--color-gray-500);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

#### Secondary Button
```css
.button-secondary {
  /* Inherits base button styles */
  background-color: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-medium);
}

.button-secondary:hover {
  background-color: var(--color-gray-50);
  border-color: var(--color-border-dark);
}
```

#### Ghost Button
```css
.button-ghost {
  /* Inherits base button styles */
  background-color: transparent;
  color: var(--color-text-secondary);
  border: none;
  padding: var(--space-2) var(--space-3);
}

.button-ghost:hover {
  background-color: var(--color-gray-100);
  color: var(--color-text-primary);
}
```

### 2. Input Component

#### Text Input
```css
.input-text {
  /* Base Styles */
  width: 100%;
  padding: var(--space-input-padding);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--easing-ease-out);
  
  /* Minimum Touch Target */
  min-height: 44px;
}

.input-text::placeholder {
  color: var(--color-text-muted);
}

.input-text:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.input-text:invalid {
  border-color: var(--color-error);
}

.input-text:disabled {
  background-color: var(--color-gray-50);
  color: var(--color-gray-500);
  cursor: not-allowed;
}
```

#### Main Todo Input (Large Variant)
```css
.input-todo-main {
  /* Inherits input-text styles */
  font-size: var(--font-size-lg);
  padding: var(--space-4) var(--space-5);
  box-shadow: var(--shadow-sm);
  min-height: 56px;
}

.input-todo-main:focus {
  box-shadow: var(--shadow-focus), var(--shadow-md);
}
```

### 3. Checkbox Component

#### Base Checkbox
```css
.checkbox {
  /* Hide default checkbox */
  appearance: none;
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border-medium);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-primary);
  cursor: pointer;
  position: relative;
  transition: all var(--duration-fast) var(--easing-ease-out);
  
  /* Minimum Touch Target */
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox:hover {
  border-color: var(--color-border-dark);
  background-color: var(--color-gray-50);
}

.checkbox:focus {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.checkbox:checked {
  background-color: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

.checkbox:checked::after {
  content: '✓';
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  line-height: 1;
}

/* Large checkbox for bulk actions */
.checkbox-large {
  width: 20px;
  height: 20px;
  min-width: 48px;
  min-height: 48px;
}
```

### 4. Task Item Component

#### Task Container
```css
.task-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border-light);
  transition: all var(--duration-fast) var(--easing-ease-out);
  min-height: 60px;
}

.task-item:hover {
  background-color: var(--color-gray-50);
}

.task-item:last-child {
  border-bottom: none;
}

/* Task text */
.task-text {
  flex: 1;
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  word-wrap: break-word;
  cursor: text;
}

.task-text:hover {
  color: var(--color-text-secondary);
}

/* Completed state */
.task-item.completed .task-text {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.task-item.completed {
  opacity: 0.7;
}

/* Edit mode */
.task-text.editing {
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  padding: var(--space-1) var(--space-2);
  background-color: var(--color-bg-primary);
  outline: none;
}
```

### 5. Filter Controls Component

#### Filter Button Group
```css
.filter-group {
  display: flex;
  gap: var(--space-1);
  padding: var(--space-2);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}

.filter-button {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: none;
  border-radius: var(--radius-md);
  background-color: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--easing-ease-out);
  min-height: 36px;
  min-width: 60px;
}

.filter-button:hover {
  background-color: var(--color-gray-100);
  color: var(--color-text-primary);
}

.filter-button.active {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-sm);
}

.filter-button:focus {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

### 6. Header Component

#### Main Header
```css
.app-header {
  text-align: center;
  padding: var(--space-8) var(--space-4) var(--space-6);
  background-color: var(--color-bg-primary);
}

.app-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-normal);
  color: var(--color-primary);
  margin: 0;
  letter-spacing: -0.02em;
  opacity: 0.8;
}

@media (min-width: 768px) {
  .app-title {
    font-size: 48px;
  }
}
```

### 7. Footer Component

#### Footer Controls
```css
.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  border-top: 1px solid var(--color-border-light);
  background-color: var(--color-bg-secondary);
  min-height: 60px;
}

.task-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.clear-completed {
  /* Inherits button-ghost styles */
  color: var(--color-error);
}

.clear-completed:hover {
  background-color: var(--color-error-light);
  color: var(--color-error);
}

@media (max-width: 767px) {
  .app-footer {
    flex-direction: column;
    gap: var(--space-2);
    text-align: center;
  }
}
```

### 8. Modal Component

#### Modal Overlay and Content
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  z-index: 1000;
  animation: fadeIn var(--duration-normal) var(--easing-ease-out);
}

.modal-content {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-6);
  max-width: 400px;
  width: 100%;
  animation: slideUp var(--duration-normal) var(--easing-ease-out);
}

.modal-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3) 0;
}

.modal-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-6) 0;
  line-height: var(--line-height-relaxed);
}

.modal-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Layout Components

### 9. Container Component

#### Main Container
```css
.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.container-narrow {
  max-width: 600px;
}

.container-wide {
  max-width: 1200px;
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-6);
  }
}
```

### 10. Main Layout Component

#### App Layout
```css
.app-layout {
  min-height: 100vh;
  background-color: var(--color-bg-secondary);
  font-family: var(--font-family-base);
}

.main-content {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  margin: 0 auto;
  max-width: 800px;
}

@media (max-width: 767px) {
  .main-content {
    border-radius: 0;
    box-shadow: none;
    min-height: 100vh;
  }
}
```

## State Variations

### Loading States
```css
.loading-skeleton {
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 25%,
    var(--color-gray-100) 50%,
    var(--color-gray-200) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: var(--radius-sm);
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.loading-spinner {
  border: 2px solid var(--color-gray-200);
  border-top: 2px solid var(--color-primary);
  border-radius: var(--radius-full);
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Empty States
```css
.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-4);
  color: var(--color-text-muted);
}

.empty-state-icon {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-4);
  opacity: 0.5;
}

.empty-state-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-2) 0;
}

.empty-state-description {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  margin: 0;
}
```

### Error States
```css
.error-message {
  background-color: var(--color-error-light);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  color: var(--color-error);
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.error-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}
```

## Animation Library

### Micro-interactions
```css
/* Task addition animation */
.task-enter {
  opacity: 0;
  transform: translateY(-10px);
  animation: taskEnter var(--duration-normal) var(--easing-ease-out);
}

@keyframes taskEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Task removal animation */
.task-exit {
  animation: taskExit var(--duration-normal) var(--easing-ease-in);
}

@keyframes taskExit {
  to {
    opacity: 0;
    transform: translateX(100%);
    height: 0;
    padding: 0;
    margin: 0;
  }
}

/* Checkbox check animation */
.checkbox-check {
  animation: checkboxCheck var(--duration-fast) var(--easing-ease-out);
}

@keyframes checkboxCheck {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Filter transition */
.filter-transition {
  transition: all var(--duration-normal) var(--easing-ease-in-out);
}

/* Hover lift effect */
.lift-on-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

## Responsive Design Patterns

### Mobile-First Utilities
```css
/* Show/Hide utilities */
.mobile-only {
  display: block;
}

.tablet-up {
  display: none;
}

@media (min-width: 768px) {
  .mobile-only {
    display: none;
  }
  
  .tablet-up {
    display: block;
  }
}

/* Responsive text sizing */
.text-responsive {
  font-size: var(--font-size-sm);
}

@media (min-width: 768px) {
  .text-responsive {
    font-size: var(--font-size-base);
  }
}

@media (min-width: 1024px) {
  .text-responsive {
    font-size: var(--font-size-lg);
  }
}

/* Responsive spacing */
.space-responsive {
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .space-responsive {
    padding: var(--space-6);
  }
}
```

## Accessibility Patterns

### Focus Management
```css
/* Focus visible for keyboard navigation */
.focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Skip to content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: var(--radius-sm);
  z-index: 1001;
}

.skip-link:focus {
  top: 6px;
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### High Contrast Mode Support
```css
@media (prefers-contrast: high) {
  :root {
    --color-border-light: var(--color-gray-600);
    --color-border-medium: var(--color-gray-700);
    --color-text-muted: var(--color-gray-600);
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Usage Guidelines

### Component Composition Examples

#### Basic Todo Item
```html
<div class="task-item">
  <input type="checkbox" class="checkbox" aria-label="Mark as complete">
  <span class="task-text">Buy groceries</span>
</div>
```

#### Todo App Header
```html
<header class="app-header">
  <h1 class="app-title">todos</h1>
</header>
```

#### Filter Controls
```html
<div class="filter-group" role="tablist" aria-label="Filter tasks">
  <button class="filter-button active" role="tab" aria-selected="true">All</button>
  <button class="filter-button" role="tab" aria-selected="false">Open</button>
  <button class="filter-button" role="tab" aria-selected="false">Completed</button>
</div>
```

### Implementation Best Practices

1. **Component Modularity**: Each component is self-contained with its own styles
2. **Consistent Naming**: Use BEM-style naming for clarity and maintainability
3. **Responsive Design**: Mobile-first approach with progressive enhancement
4. **Accessibility First**: Built-in ARIA labels and keyboard navigation
5. **Performance**: Efficient CSS with minimal repaints and reflows
6. **Maintainability**: Clear component boundaries and documented usage patterns

This design system provides a solid foundation for implementing the Quick Todo application with consistent, accessible, and maintainable user interface components.
