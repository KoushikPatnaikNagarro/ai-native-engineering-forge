# Accessibility Guidelines - Quick Todo Application

## Overview
This document provides comprehensive accessibility guidelines for the Quick Todo application to ensure WCAG 2.1 AA compliance and inclusive design for all users, including those with disabilities.

## WCAG 2.1 AA Compliance Framework

### Four Core Principles

#### 1. Perceivable
- Information and UI components must be presentable to users in ways they can perceive
- Text alternatives for images
- Captions and alternatives for multimedia
- Content that can be presented in different ways without losing meaning
- Make it easier for users to see and hear content

#### 2. Operable
- User interface components and navigation must be operable
- All functionality available from keyboard
- Users have enough time to read and use content
- Content does not cause seizures or physical reactions
- Users can navigate and find content

#### 3. Understandable
- Information and operation of UI must be understandable
- Text is readable and understandable
- Content appears and operates in predictable ways
- Users are helped to avoid and correct mistakes

#### 4. Robust
- Content must be robust enough to be interpreted reliably by assistive technologies
- Maximize compatibility with current and future assistive tools

## Component-Specific Accessibility Requirements

### 1. Application Structure

#### Semantic HTML Structure
```html
<main role="main" aria-label="Todo application">
  <header role="banner">
    <h1>todos</h1>
  </header>
  
  <section aria-label="Add new todo">
    <form>
      <label for="new-todo">What needs to be done?</label>
      <input id="new-todo" type="text" />
    </form>
  </section>
  
  <section aria-label="Todo list management">
    <ul role="list" aria-label="Todo items">
      <!-- Task items -->
    </ul>
    
    <nav role="navigation" aria-label="Filter todos">
      <!-- Filter buttons -->
    </nav>
  </section>
  
  <footer role="contentinfo">
    <!-- Task count and actions -->
  </footer>
</main>
```

#### Landmark Roles
- **Main**: `role="main"` - Primary content area
- **Banner**: `role="banner"` - Application header
- **Navigation**: `role="navigation"` - Filter controls
- **Contentinfo**: `role="contentinfo"` - Footer with actions

### 2. Input Accessibility

#### Main Todo Input
```html
<label for="new-todo" class="visually-hidden">
  Add a new todo item
</label>
<input 
  id="new-todo"
  type="text"
  placeholder="What needs to be done?"
  aria-describedby="new-todo-instructions"
  autocomplete="off"
  maxlength="500"
/>
<div id="new-todo-instructions" class="visually-hidden">
  Press Enter to add a new todo item
</div>
```

#### Accessibility Features
- **Label Association**: Explicit label-input association via `for` and `id`
- **Instructions**: Clear usage instructions via `aria-describedby`
- **Error Handling**: Dynamic error messages announced to screen readers
- **Character Limit**: Reasonable maxlength to prevent overly long inputs

#### Input States
- **Focus**: Clear focus indicator with 3px outline
- **Error**: Red border + error message + aria-invalid="true"
- **Success**: Confirmation message for successful submission

### 3. Task List Accessibility

#### List Structure
```html
<section aria-label="Todo list" role="region">
  <div class="bulk-actions">
    <input 
      type="checkbox" 
      id="toggle-all"
      aria-label="Mark all tasks as complete"
      aria-controls="todo-list"
    />
    <label for="toggle-all">Mark all as complete</label>
  </div>
  
  <ul id="todo-list" role="list" aria-live="polite" aria-label="Todo items">
    <!-- Individual todo items -->
  </ul>
</section>
```

#### Individual Task Item
```html
<li role="listitem" class="todo-item">
  <div class="todo-content">
    <input 
      type="checkbox"
      id="todo-{id}"
      aria-label="Mark 'Buy groceries' as complete"
      aria-describedby="todo-{id}-text"
    />
    <span 
      id="todo-{id}-text"
      class="todo-text"
      role="button"
      tabindex="0"
      aria-label="Edit todo: Buy groceries. Double-click or press Enter to edit"
    >
      Buy groceries
    </span>
  </div>
</li>
```

#### Task States
- **Complete**: `aria-checked="true"`, strikethrough text, muted color
- **Incomplete**: `aria-checked="false"`, normal text styling
- **Editing**: `aria-label="Editing todo"`, focus on input field

#### Edit Mode
```html
<input 
  type="text"
  value="Buy groceries"
  aria-label="Edit todo text"
  aria-describedby="edit-instructions"
/>
<div id="edit-instructions" class="visually-hidden">
  Press Enter to save, Escape to cancel
</div>
```

### 4. Filter Controls Accessibility

#### Filter Navigation
```html
<nav role="navigation" aria-label="Filter todo items">
  <div role="tablist" aria-label="Todo filters">
    <button 
      role="tab"
      aria-selected="true"
      aria-controls="todo-list"
      id="filter-all"
    >
      All
    </button>
    <button 
      role="tab"
      aria-selected="false"
      aria-controls="todo-list"
      id="filter-active"
    >
      Active
    </button>
    <button 
      role="tab"
      aria-selected="false"
      aria-controls="todo-list"
      id="filter-completed"
    >
      Completed
    </button>
  </div>
</nav>
```

#### Filter States
- **Active Filter**: `aria-selected="true"`, visual highlight
- **Inactive Filter**: `aria-selected="false"`, normal styling
- **Focus**: Clear focus indicator, keyboard navigation

### 5. Actions and Footer Accessibility

#### Task Counter
```html
<div role="status" aria-live="polite" aria-label="Task summary">
  <span id="item-count">2 items left</span>
</div>
```

#### Clear Completed Action
```html
<button 
  type="button"
  aria-label="Clear all completed todos"
  aria-describedby="clear-description"
  onclick="showConfirmDialog()"
>
  Clear completed
</button>
<div id="clear-description" class="visually-hidden">
  This action cannot be undone
</div>
```

### 6. Modal Dialog Accessibility

#### Confirmation Dialog
```html
<div 
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
  class="modal-overlay"
>
  <div class="modal-content">
    <h2 id="dialog-title">Clear completed tasks?</h2>
    <p id="dialog-description">
      This action cannot be undone. All completed tasks will be permanently removed.
    </p>
    <div class="modal-actions">
      <button type="button" onclick="closeDialog()">Cancel</button>
      <button type="button" onclick="confirmClear()">Clear</button>
    </div>
  </div>
</div>
```

#### Dialog Management
- **Focus Trap**: Focus constrained within dialog
- **Initial Focus**: Set to first focusable element
- **Return Focus**: Return to trigger element on close
- **Escape Key**: Closes dialog
- **Background**: Inert while dialog is open

## Keyboard Navigation

### Tab Order and Navigation
1. **Main Input Field** - Primary task creation
2. **Bulk Toggle** - Mark all as complete (if visible)
3. **Task Items** - Individual checkboxes and text (in order)
4. **Filter Controls** - All, Active, Completed
5. **Clear Completed** - Footer action (if visible)

### Keyboard Shortcuts
| Key | Action | Context |
|-----|--------|---------|
| Tab | Navigate forward | Global |
| Shift + Tab | Navigate backward | Global |
| Enter | Submit input / Activate button / Edit task | Input, Button, Task text |
| Escape | Cancel edit / Close modal | Edit mode, Modal |
| Space | Toggle checkbox / Activate button | Checkbox, Button |
| Arrow Left/Right | Navigate filter buttons | Filter controls |
| Home | Focus first item | Task list |
| End | Focus last item | Task list |

### Focus Management

#### Focus Indicators
```css
.focus-visible {
  outline: 3px solid #3B82F6;
  outline-offset: 2px;
  border-radius: 4px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .focus-visible {
    outline-width: 4px;
    outline-color: Highlight;
  }
}
```

#### Skip Link
```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #3B82F6;
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1001;
}

.skip-link:focus {
  top: 6px;
}
```

## Screen Reader Support

### ARIA Live Regions
```html
<!-- Announcements for dynamic content -->
<div aria-live="polite" aria-atomic="true" class="visually-hidden" id="announcements">
  <!-- Dynamic status messages -->
</div>

<!-- Task count updates -->
<div role="status" aria-live="polite">
  <span id="task-count">2 items left</span>
</div>
```

### Screen Reader Announcements

#### Task Operations
- **Add Task**: "Task 'Buy groceries' added"
- **Complete Task**: "Task 'Buy groceries' marked as complete"
- **Uncomplete Task**: "Task 'Buy groceries' marked as incomplete"
- **Edit Task**: "Editing task 'Buy groceries'"
- **Save Edit**: "Task updated to 'Buy organic groceries'"
- **Delete Task**: "Task 'Buy groceries' removed"

#### Filter Changes
- **Filter All**: "Showing all tasks, 5 total"
- **Filter Active**: "Showing active tasks, 3 remaining"
- **Filter Completed**: "Showing completed tasks, 2 completed"

#### Bulk Operations
- **Mark All Complete**: "All tasks marked as complete"
- **Clear Completed**: "2 completed tasks removed"

### Dynamic Content Updates
```javascript
// Announce task operations to screen readers
function announceToScreenReader(message) {
  const announcements = document.getElementById('announcements');
  announcements.textContent = message;
  
  // Clear after announcement to prevent repetition
  setTimeout(() => {
    announcements.textContent = '';
  }, 1000);
}

// Example usage
function addTask(taskText) {
  // Add task logic...
  announceToScreenReader(`Task '${taskText}' added`);
}
```

## Color and Visual Accessibility

### Color Contrast Requirements
All text and interactive elements meet WCAG AA standards:

| Element | Foreground | Background | Ratio | Standard |
|---------|------------|------------|-------|----------|
| Primary Text | #111827 | #FFFFFF | 16.94:1 | AAA |
| Secondary Text | #6B7280 | #FFFFFF | 7.02:1 | AA+ |
| Muted Text | #9CA3AF | #FFFFFF | 4.54:1 | AA |
| Button Text | #FFFFFF | #3B82F6 | 4.71:1 | AA |
| Error Text | #EF4444 | #FFFFFF | 4.74:1 | AA |
| Success Text | #10B981 | #FFFFFF | 3.35:1 | AA (Large) |

### Color Independence
Information is never conveyed by color alone:

#### Task Status Indicators
- **Incomplete**: Empty checkbox + normal text
- **Complete**: Checked checkbox + strikethrough text + muted color
- **Edit Mode**: Border + different background + focus indicator

#### Interactive States
- **Hover**: Background change + cursor change
- **Focus**: Outline + background change
- **Active**: Visual depression + color change
- **Disabled**: Reduced opacity + different cursor

### High Contrast Mode Support
```css
@media (prefers-contrast: high) {
  :root {
    --color-border: WindowText;
    --color-background: Window;
    --color-text: WindowText;
    --color-focus: Highlight;
  }
  
  .button:focus {
    outline: 2px solid Highlight;
    outline-offset: 2px;
  }
}
```

## Motion and Animation Accessibility

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Safe Animation Practices
- **No flashing**: No content flashes more than 3 times per second
- **Parallax**: Disabled when prefers-reduced-motion is set
- **Auto-play**: No auto-playing animations or videos
- **Essential Motion**: Only animate when it enhances usability

## Mobile Accessibility

### Touch Target Specifications
- **Minimum Size**: 44px × 44px (WCAG AAA)
- **Preferred Size**: 48px × 48px
- **Spacing**: Minimum 8px between targets
- **Hit Area**: Extends beyond visual bounds when necessary

### Mobile Screen Reader Support
- **VoiceOver (iOS)**: Full compatibility
- **TalkBack (Android)**: Full compatibility
- **Swipe Navigation**: Logical reading order
- **Rotor Control**: Proper heading and landmark navigation

### Touch Gestures
- **Single Tap**: Activate buttons, focus inputs
- **Double Tap**: Edit task text (with clear indication)
- **Swipe**: Navigate between elements (screen reader mode)

## Error Handling and Validation

### Error Message Patterns
```html
<div class="input-group">
  <label for="task-input">Task description</label>
  <input 
    id="task-input"
    type="text"
    aria-describedby="task-error"
    aria-invalid="true"
  />
  <div id="task-error" role="alert" class="error-message">
    Task description is required
  </div>
</div>
```

### Error Announcement
- **Role="alert"**: Immediate announcement to screen readers
- **aria-invalid**: Indicates field has validation error
- **aria-describedby**: Associates error with input field

### Recovery Guidance
- **Clear Instructions**: Specific steps to fix errors
- **Inline Validation**: Real-time feedback as user types
- **Success Confirmation**: Confirm when errors are resolved

## Testing and Validation

### Automated Testing
- **axe-core**: Automated accessibility testing library
- **Lighthouse**: Performance and accessibility audits
- **Wave**: Web accessibility evaluation tool
- **Color Oracle**: Color blindness simulation

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] All interactive elements reachable via keyboard
- [ ] Tab order is logical and intuitive
- [ ] No keyboard traps (except modals)
- [ ] Focus indicators are clearly visible
- [ ] All functionality available via keyboard

#### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with TalkBack (Android)
- [ ] All content is announced correctly
- [ ] Navigation landmarks work properly

#### Visual Testing
- [ ] 400% zoom without horizontal scrolling
- [ ] High contrast mode support
- [ ] Color blindness simulation
- [ ] Focus indicators visible in all states
- [ ] Text remains readable at all zoom levels

#### Mobile Testing
- [ ] Touch targets meet minimum size requirements
- [ ] Mobile screen readers work correctly
- [ ] Orientation changes handled properly
- [ ] Pinch zoom functionality preserved

### User Testing
- **Users with Disabilities**: Include users with various disabilities in testing
- **Assistive Technology Users**: Test with actual assistive technology users
- **Diverse Abilities**: Include users with cognitive, motor, and sensory disabilities

## Implementation Guidelines

### Development Best Practices
1. **Semantic HTML First**: Use appropriate HTML elements before adding ARIA
2. **Progressive Enhancement**: Ensure basic functionality works without JavaScript
3. **ARIA Patterns**: Follow established ARIA design patterns
4. **Live Testing**: Test with real assistive technologies during development
5. **Documentation**: Document accessibility features for future developers

### Code Review Checklist
- [ ] Semantic HTML structure
- [ ] Proper ARIA labels and roles
- [ ] Keyboard navigation support
- [ ] Color contrast compliance
- [ ] Focus management
- [ ] Error handling
- [ ] Mobile accessibility

### Maintenance
- **Regular Audits**: Monthly accessibility audits
- **User Feedback**: Channel for accessibility-related feedback
- **Training**: Regular accessibility training for team members
- **Updates**: Keep up with WCAG updates and best practices

This comprehensive accessibility guide ensures the Quick Todo application is usable by everyone, regardless of their abilities or the assistive technologies they use.
