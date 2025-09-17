# Design Specifications - Quick Todo Application

## Overview
This document provides detailed design specifications for developers implementing the Quick Todo application. It includes precise measurements, colors, typography, spacing, and interaction specifications for all UI components and states.

## Global Specifications

### Layout Container
- **Maximum Width**: 800px
- **Mobile Padding**: 16px (left/right)
- **Tablet Padding**: 24px (left/right)
- **Desktop Padding**: 32px (left/right)
- **Background**: #F9FAFB (Gray 50) for page background
- **Content Background**: #FFFFFF for main content area

### Typography Specifications

#### Font Stack
```
Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
Fallback: system-ui, sans-serif
```

#### Type Scale & Usage
| Element | Size | Weight | Line Height | Letter Spacing | Usage |
|---------|------|--------|-------------|----------------|-------|
| App Title | 48px (desktop), 30px (mobile) | 400 | 1.2 | -0.02em | Main "todos" heading |
| Task Text | 16px | 400 | 1.5 | 0 | Individual task content |
| Input Text | 18px (desktop), 16px (mobile) | 400 | 1.5 | 0 | Main input field |
| Button Text | 14px | 500 | 1.25 | 0 | All button labels |
| Counter Text | 14px | 500 | 1.25 | 0 | "X items left" |
| Placeholder | 16px | 400 | 1.5 | 0 | Input placeholder |
| Error Text | 14px | 400 | 1.4 | 0 | Error messages |

### Color Specifications

#### Primary Colors
- **Primary Blue**: #3B82F6 (RGB: 59, 130, 246)
- **Primary Blue Hover**: #2563EB (RGB: 37, 99, 235)
- **Primary Blue Light**: #DBEAFE (RGB: 219, 234, 254)

#### Text Colors
- **Primary Text**: #111827 (RGB: 17, 24, 39) - Main task text
- **Secondary Text**: #6B7280 (RGB: 107, 114, 128) - Counters, placeholders
- **Muted Text**: #9CA3AF (RGB: 156, 163, 175) - Completed tasks
- **Inverse Text**: #FFFFFF (RGB: 255, 255, 255) - Button text on dark backgrounds

#### Background Colors
- **Page Background**: #F9FAFB (RGB: 249, 250, 251)
- **Content Background**: #FFFFFF (RGB: 255, 255, 255)
- **Hover Background**: #F3F4F6 (RGB: 243, 244, 246)
- **Active Background**: #E5E7EB (RGB: 229, 231, 235)

#### Border Colors
- **Light Border**: #E5E7EB (RGB: 229, 231, 235) - Default borders
- **Medium Border**: #D1D5DB (RGB: 209, 213, 219) - Input focus states
- **Dark Border**: #9CA3AF (RGB: 156, 163, 175) - Hover states

#### Status Colors
- **Success Green**: #10B981 (RGB: 16, 185, 129) - Completed tasks
- **Success Green Light**: #D1FAE5 (RGB: 209, 250, 229)
- **Error Red**: #EF4444 (RGB: 239, 68, 68) - Delete actions
- **Error Red Light**: #FEE2E2 (RGB: 254, 226, 226)

## Component Specifications

### 1. Application Header

#### Dimensions
- **Height**: 120px (desktop), 100px (mobile)
- **Padding**: 32px 16px 24px (desktop), 24px 16px 20px (mobile)

#### Title Specifications
- **Text**: "todos"
- **Color**: #3B82F6 with 80% opacity (#3B82F6CC)
- **Alignment**: Center
- **Font Weight**: 400 (Regular)
- **Mobile**: 30px font size
- **Desktop**: 48px font size

### 2. Main Input Field

#### Dimensions
- **Height**: 56px (desktop), 48px (mobile)
- **Width**: 100% of container
- **Padding**: 16px 20px (desktop), 12px 16px (mobile)
- **Margin Bottom**: 24px

#### Visual Properties
- **Background**: #FFFFFF
- **Border**: 1px solid #E5E7EB
- **Border Radius**: 6px
- **Box Shadow**: 0 1px 2px 0 rgba(0, 0, 0, 0.05)

#### Focus State
- **Border Color**: #3B82F6
- **Box Shadow**: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)
- **Outline**: none

#### Placeholder
- **Text**: "What needs to be done?"
- **Color**: #9CA3AF
- **Style**: Italic (optional)

### 3. Task List Container

#### Dimensions
- **Min Height**: 60px per task item
- **Padding**: 0 (container)
- **Border**: 1px solid #E5E7EB
- **Border Radius**: 6px (top and bottom)

#### Background
- **Default**: #FFFFFF
- **Empty State**: #F9FAFB

### 4. Individual Task Item

#### Dimensions
- **Height**: Minimum 60px (auto-expand for long text)
- **Padding**: 12px 16px
- **Border Bottom**: 1px solid #E5E7EB (except last item)

#### Layout
- **Display**: Flex
- **Align Items**: Center
- **Gap**: 12px between checkbox and text

#### Hover State
- **Background**: #F9FAFB
- **Transition**: background-color 150ms ease-out

#### Checkbox Specifications
- **Size**: 24px × 24px
- **Border**: 2px solid #D1D5DB
- **Border Radius**: 4px
- **Background**: #FFFFFF (unchecked), #10B981 (checked)
- **Touch Target**: 44px × 44px (minimum)

#### Checkbox States
- **Default**: 2px border, #D1D5DB
- **Hover**: 2px border, #9CA3AF, background #F9FAFB
- **Checked**: Background #10B981, border #10B981, white checkmark
- **Focus**: Box shadow 0 0 0 3px rgba(59, 130, 246, 0.1)

#### Task Text
- **Font Size**: 16px
- **Line Height**: 1.5
- **Color**: #111827 (default), #9CA3AF (completed)
- **Text Decoration**: line-through (when completed)
- **Word Wrap**: break-word
- **Flex**: 1 (takes remaining space)

#### Edit Mode
- **Border**: 1px solid #3B82F6
- **Border Radius**: 4px
- **Padding**: 4px 8px
- **Background**: #FFFFFF
- **Outline**: none

### 5. Bulk Actions (Select All)

#### Dimensions
- **Height**: 48px
- **Padding**: 12px 16px
- **Border Bottom**: 1px solid #E5E7EB

#### Checkbox (Larger)
- **Size**: 20px × 20px
- **Touch Target**: 44px × 44px minimum

#### Label
- **Text**: "Mark all as complete"
- **Font Size**: 14px
- **Color**: #6B7280
- **Font Weight**: 500

### 6. Filter Controls

#### Container
- **Height**: 48px
- **Padding**: 8px
- **Background**: #F9FAFB
- **Border**: 1px solid #E5E7EB
- **Border Radius**: 8px
- **Gap**: 4px between buttons

#### Individual Filter Buttons
- **Height**: 32px
- **Padding**: 6px 12px
- **Min Width**: 60px
- **Border Radius**: 6px
- **Font Size**: 14px
- **Font Weight**: 500

#### Button States
- **Inactive**: Background transparent, color #6B7280
- **Hover**: Background #E5E7EB, color #111827
- **Active**: Background #3B82F6, color #FFFFFF, box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- **Focus**: Box shadow 0 0 0 3px rgba(59, 130, 246, 0.1)

### 7. Footer/Actions Area

#### Dimensions
- **Height**: 60px (minimum)
- **Padding**: 16px
- **Border Top**: 1px solid #E5E7EB
- **Background**: #F9FAFB

#### Layout
- **Display**: Flex
- **Justify Content**: Space between
- **Align Items**: Center
- **Mobile**: Stack vertically with 8px gap

#### Task Counter
- **Font Size**: 14px
- **Font Weight**: 500
- **Color**: #6B7280
- **Format**: "X item(s) left"

#### Clear Completed Button
- **Height**: 36px
- **Padding**: 6px 12px
- **Background**: Transparent
- **Color**: #EF4444
- **Border**: none
- **Border Radius**: 6px
- **Font Size**: 14px
- **Font Weight**: 500

#### Clear Button Hover
- **Background**: #FEE2E2
- **Color**: #DC2626

### 8. Empty State

#### Dimensions
- **Padding**: 48px 16px
- **Text Align**: Center

#### Content
- **Primary Text**: "No tasks yet"
- **Font Size**: 18px
- **Color**: #6B7280
- **Font Weight**: 500
- **Margin Bottom**: 8px

#### Secondary Text
- **Text**: "Start by adding your first task"
- **Font Size**: 14px
- **Color**: #9CA3AF
- **Line Height**: 1.6

### 9. Modal/Confirmation Dialog

#### Overlay
- **Background**: rgba(0, 0, 0, 0.5)
- **Position**: Fixed, full viewport
- **Z-Index**: 1000

#### Dialog Container
- **Max Width**: 400px
- **Width**: 90% (mobile)
- **Background**: #FFFFFF
- **Border Radius**: 12px
- **Box Shadow**: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
- **Padding**: 24px

#### Dialog Content
- **Title Font Size**: 18px
- **Title Font Weight**: 600
- **Title Color**: #111827
- **Title Margin Bottom**: 12px

#### Dialog Description
- **Font Size**: 14px
- **Color**: #6B7280
- **Line Height**: 1.6
- **Margin Bottom**: 24px

#### Dialog Actions
- **Display**: Flex
- **Gap**: 12px
- **Justify Content**: Flex-end

#### Action Buttons
- **Height**: 36px
- **Padding**: 8px 16px
- **Border Radius**: 6px
- **Font Size**: 14px
- **Font Weight**: 500

## Animation Specifications

### Transition Timings
- **Fast**: 150ms - Hover states, focus indicators
- **Normal**: 250ms - State changes, toggles
- **Slow**: 400ms - Layout changes, modal open/close

### Easing Functions
- **Ease Out**: cubic-bezier(0, 0, 0.2, 1) - Entry animations
- **Ease In**: cubic-bezier(0.4, 0, 1, 1) - Exit animations
- **Ease In Out**: cubic-bezier(0.4, 0, 0.2, 1) - Bidirectional animations

### Specific Animations

#### Task Addition
- **Duration**: 250ms
- **Easing**: ease-out
- **Transform**: translateY(-10px) to translateY(0)
- **Opacity**: 0 to 1

#### Task Removal
- **Duration**: 250ms
- **Easing**: ease-in
- **Transform**: translateX(0) to translateX(100%)
- **Opacity**: 1 to 0
- **Height**: Current height to 0

#### Checkbox Toggle
- **Duration**: 150ms
- **Easing**: ease-out
- **Transform**: scale(0.8) to scale(1.1) to scale(1)

#### Filter Transition
- **Duration**: 250ms
- **Easing**: ease-in-out
- **Opacity**: 1 to 0 to 1 (crossfade effect)

## Responsive Breakpoints

### Mobile (320px - 767px)
- **Container Padding**: 16px
- **Task Item Height**: Minimum 60px
- **Input Height**: 48px
- **Touch Targets**: Minimum 44px × 44px
- **Font Sizes**: Use mobile sizes from typography scale
- **Footer**: Stack elements vertically

### Tablet (768px - 1023px)
- **Container Padding**: 24px
- **Enhanced Touch Targets**: 48px × 48px
- **Input Height**: 52px
- **Slightly larger font sizes**: 17px for input text
- **Footer**: Horizontal layout maintained

### Desktop (1024px+)
- **Container Padding**: 32px
- **Maximum Container Width**: 800px, centered
- **Input Height**: 56px
- **Hover States**: Fully active
- **Mouse Interactions**: Optimized cursor states
- **Keyboard Shortcuts**: Visible focus indicators

## Accessibility Specifications

### Focus Indicators
- **Outline**: 2px solid #3B82F6
- **Outline Offset**: 2px
- **Border Radius**: 4px (follows element shape)

### Color Contrast Ratios
- **Primary Text on White**: 16.94:1 (AAA)
- **Secondary Text on White**: 7.02:1 (AA+)
- **Muted Text on White**: 4.54:1 (AA)
- **Primary Button Text**: 4.71:1 (AA)
- **Error Text**: 4.74:1 (AA)

### Touch Target Sizes
- **Minimum**: 44px × 44px (WCAG AAA)
- **Preferred**: 48px × 48px
- **Spacing**: Minimum 8px between targets

### Keyboard Navigation
- **Tab Order**: Input → Tasks (in order) → Filters → Actions
- **Enter Key**: Submit input, toggle checkbox, activate buttons
- **Escape Key**: Cancel edit mode, close modals
- **Arrow Keys**: Navigate between filter buttons

## Performance Specifications

### Loading Requirements
- **First Contentful Paint**: < 1.2s on 3G
- **Largest Contentful Paint**: < 2.5s on 3G
- **Time to Interactive**: < 3.8s on 3G
- **Cumulative Layout Shift**: < 0.1

### Animation Performance
- **Frame Rate**: 60fps for all animations
- **Hardware Acceleration**: Use transform and opacity for animations
- **Avoid**: Animating layout properties (width, height, margin, padding)

### Bundle Size Targets
- **CSS**: < 15KB gzipped
- **Critical CSS**: < 5KB inline
- **Font Loading**: System fonts only (no web fonts)

## Browser Support

### Target Browsers
- **Chrome**: 90+ (95% support)
- **Firefox**: 88+ (95% support)
- **Safari**: 14+ (95% support)
- **Edge**: 90+ (95% support)
- **Mobile Safari**: 14+ (iOS 14+)
- **Chrome Mobile**: 90+

### Graceful Degradation
- **CSS Grid**: Fallback to flexbox for older browsers
- **Custom Properties**: Fallback values provided
- **Animation**: Respect prefers-reduced-motion
- **Focus-visible**: Fallback to focus pseudo-class

## Implementation Notes

### CSS Architecture
- **Methodology**: Component-based CSS with CSS Modules or styled-components
- **Custom Properties**: Use for theming and dynamic values
- **Mobile-First**: Write CSS mobile-first, enhance for larger screens
- **Print Styles**: Include print-friendly styles

### Asset Optimization
- **Images**: WebP with JPEG fallback
- **Icons**: SVG sprites or icon fonts
- **Compression**: Gzip/Brotli compression enabled
- **Caching**: Long-term caching for static assets

### Testing Requirements
- **Cross-browser**: Test in all target browsers
- **Responsive**: Test across all breakpoints
- **Accessibility**: Automated testing with axe-core
- **Performance**: Lighthouse audits scoring 90+
- **Visual Regression**: Snapshot testing for UI consistency

This specification document provides all the detailed information needed for pixel-perfect implementation of the Quick Todo application design.
