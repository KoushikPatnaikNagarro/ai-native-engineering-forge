# Design System Documentation

## Overview
This document outlines the design system implementation for the Quick Todo application. The design system provides a consistent set of design tokens, components, and patterns that ensure a cohesive user experience across the entire application.

## Design Tokens

### Colors

#### Primary Colors
- **Primary Blue**: `#3B82F6` (primary)
- **Primary Blue Hover**: `#2563EB` (primary-hover)  
- **Primary Blue Light**: `#DBEAFE` (primary-light)

#### Text Colors
- **Primary Text**: `#111827` (text-primary) - Main content text
- **Secondary Text**: `#6B7280` (text-secondary) - Supporting text, labels
- **Muted Text**: `#9CA3AF` (text-muted) - Placeholder text, completed tasks
- **Inverse Text**: `#FFFFFF` (text-inverse) - Text on dark backgrounds

#### Background Colors
- **Page Background**: `#F9FAFB` (background-page) - Overall page background
- **Content Background**: `#FFFFFF` (background-content) - Cards, inputs, buttons
- **Hover Background**: `#F3F4F6` (background-hover) - Interactive element hover states
- **Active Background**: `#E5E7EB` (background-active) - Active/pressed states

#### Border Colors
- **Light Border**: `#E5E7EB` (border-light) - Default borders
- **Medium Border**: `#D1D5DB` (border-medium) - Input focus states
- **Dark Border**: `#9CA3AF` (border-dark) - Hover states

#### Status Colors
- **Success Green**: `#10B981` (success) - Completed tasks, success states
- **Success Green Light**: `#D1FAE5` (success-light) - Success backgrounds
- **Error Red**: `#EF4444` (error) - Error states, delete actions
- **Error Red Light**: `#FEE2E2` (error-light) - Error backgrounds

### Typography

#### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, system-ui;
```

#### Typography Scale
- **App Title Desktop**: 48px, Line Height 1.2, Letter Spacing -0.02em, Font Weight 400
- **App Title Mobile**: 30px, Line Height 1.2, Letter Spacing -0.02em, Font Weight 400
- **Task Text**: 16px, Line Height 1.5, Letter Spacing 0, Font Weight 400
- **Input Text Desktop**: 18px, Line Height 1.5, Letter Spacing 0, Font Weight 400
- **Input Text Mobile**: 16px, Line Height 1.5, Letter Spacing 0, Font Weight 400
- **Button Text**: 14px, Line Height 1.25, Letter Spacing 0, Font Weight 500
- **Counter Text**: 14px, Line Height 1.25, Letter Spacing 0, Font Weight 500
- **Error Text**: 14px, Line Height 1.4, Letter Spacing 0, Font Weight 400
- **Dialog Title**: 18px, Line Height 1.4, Letter Spacing 0, Font Weight 600
- **Dialog Text**: 14px, Line Height 1.6, Letter Spacing 0, Font Weight 400

### Spacing Scale

#### Core Spacing (Tailwind defaults + extensions)
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px) 
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **18**: 4.5rem (72px)
- **22**: 5.5rem (88px)
- **30**: 7.5rem (120px)

#### Component-Specific Spacing
- **Container Mobile**: 16px
- **Container Tablet**: 24px  
- **Container Desktop**: 32px
- **Task Padding**: 12px (vertical) × 16px (horizontal)
- **Task Gap**: 12px (between checkbox and text)
- **Input Padding Desktop**: 16px (vertical) × 20px (horizontal)
- **Input Padding Mobile**: 12px (vertical) × 16px (horizontal)
- **Button Padding**: 8px (vertical) × 16px (horizontal)
- **Button Small Padding**: 6px (vertical) × 12px (horizontal)

### Border Radius
- **None**: 0
- **Small**: 2px
- **Default**: 4px
- **Medium**: 6px (inputs, buttons)
- **Large**: 8px (cards)
- **Extra Large**: 12px (dialogs)
- **Full**: 9999px (pills)

### Shadows
- **Input**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **Input Focus**: `0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- **Button**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **Card**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **Dialog**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **Focus Primary**: `0 0 0 3px rgba(59, 130, 246, 0.1)`

### Animation & Transitions

#### Durations
- **Fast**: 150ms - Hover states, focus indicators
- **Normal**: 250ms - State changes, toggles
- **Slow**: 400ms - Layout changes, modal open/close

#### Easing Functions
- **Ease Out**: `cubic-bezier(0, 0, 0.2, 1)` - Entry animations
- **Ease In**: `cubic-bezier(0.4, 0, 1, 1)` - Exit animations
- **Ease In Out**: `cubic-bezier(0.4, 0, 0.2, 1)` - Bidirectional animations

## Component Library

### Button Component
A flexible button component with multiple variants and sizes.

#### Usage
```tsx
import { Button } from '@/components/ui/Button';

// Primary button (default)
<Button>Save Task</Button>

// Secondary button  
<Button variant="secondary">Cancel</Button>

// Ghost button
<Button variant="ghost">Clear</Button>

// Danger button
<Button variant="danger">Delete</Button>

// Small button
<Button size="small">Filter</Button>
```

#### Variants
- **Primary**: Blue background, white text (main actions)
- **Secondary**: White background, border, dark text (secondary actions)
- **Ghost**: Transparent background, gray text (tertiary actions)
- **Danger**: Transparent background, red text (destructive actions)

#### Sizes
- **Default**: Standard button size (8px × 16px padding)
- **Small**: Compact button size (6px × 12px padding)

### Input Component
A styled input field that matches the design specifications.

#### Usage
```tsx
import { Input } from '@/components/ui/Input';

// Basic input
<Input placeholder="What needs to be done?" />

// Input with error state
<Input error placeholder="Enter task description" />
```

#### Features
- Responsive font sizes (16px mobile, 18px desktop)
- Focus states with blue border and shadow
- Error state support
- Built-in accessibility features

### Checkbox Component
A custom checkbox component with proper accessibility and animations.

#### Usage
```tsx
import { Checkbox } from '@/components/ui/Checkbox';

// Basic checkbox
<Checkbox checked={completed} onChange={handleToggle} />

// Checkbox with label
<Checkbox checked={completed} onChange={handleToggle} label="Task completed" />

// Checkbox with error state
<Checkbox error checked={false} label="Required field" />
```

#### Features
- Custom styled checkbox matching design specs
- Checkmark animation on toggle
- Touch-friendly 44px touch target
- Accessible label support

### Card Component
A container component for grouping related content.

#### Usage
```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';

<Card>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog Component
A modal dialog component for confirmations and additional content.

#### Usage
```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/Dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete all completed tasks?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={confirmDelete}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Features
- Overlay backdrop with click-to-close
- Keyboard support (Escape to close)
- Focus trapping
- Body scroll lock when open

### Typography Components
Pre-styled typography components for consistent text styling.

#### Usage
```tsx
import { 
  AppTitle, 
  TaskText, 
  CounterText, 
  ErrorText,
  EmptyStateTitle,
  EmptyStateSubtitle 
} from '@/components/ui/Typography';

// App title
<AppTitle>todos</AppTitle>

// Task text
<TaskText completed={task.completed}>{task.text}</TaskText>

// Counter text
<CounterText>{activeCount} items left</CounterText>

// Error message
<ErrorText>Please enter a task description</ErrorText>

// Empty state
<EmptyStateTitle>No tasks yet</EmptyStateTitle>
<EmptyStateSubtitle>Start by adding your first task</EmptyStateSubtitle>
```

### Container Component
A responsive container component that handles the app's max-width and padding.

#### Usage
```tsx
import { Container } from '@/components/ui/Container';

<Container>
  <div>Your app content</div>
</Container>
```

#### Features
- Max width of 800px on desktop
- Responsive padding (16px mobile, 24px tablet, 32px desktop)
- Automatic centering

## Responsive Design

The design system includes responsive utilities and components that adapt to different screen sizes:

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Responsive Features
- Responsive typography (app title, input text)
- Responsive container padding
- Touch-friendly tap targets (44px minimum)
- Mobile-optimized component spacing

## Accessibility

All components follow WCAG 2.1 AA guidelines:

### Focus Management
- Visible focus indicators on all interactive elements
- Proper focus trapping in modals
- Keyboard navigation support

### Color Contrast
- All text meets minimum contrast ratios
- Focus indicators use sufficient contrast
- Error states use accessible color combinations

### Touch Targets
- Minimum 44px touch targets on mobile
- Sufficient spacing between interactive elements
- Touch-friendly component sizing

### Screen Reader Support
- Proper semantic HTML structure
- ARIA labels where appropriate
- Meaningful component names and descriptions

## CSS Architecture

The design system uses a component-based CSS architecture:

### Tailwind CSS
- Utility-first approach with custom design tokens
- Component classes for complex UI patterns
- Responsive design utilities

### CSS Layers
- **Base**: Reset styles and global defaults
- **Components**: Reusable component styles
- **Utilities**: Helper classes and responsive utilities

### Performance
- CSS is optimized and tree-shaken by Tailwind
- Component styles are scoped and reusable
- Minimal CSS bundle size

## Usage Guidelines

### Import Components
Always import components from the main UI index:
```tsx
import { Button, Input, Card } from '@/components/ui';
```

### Customization
Components accept className props for customization:
```tsx
<Button className="w-full mt-4">Custom styling</Button>
```

### Consistency
- Use design tokens instead of arbitrary values
- Follow component API patterns across the app
- Maintain consistent spacing and typography

This design system provides a solid foundation for building the Quick Todo application with consistent, accessible, and responsive UI components.
