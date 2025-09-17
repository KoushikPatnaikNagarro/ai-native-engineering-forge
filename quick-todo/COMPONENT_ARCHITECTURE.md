# Component Architecture Documentation

## Overview

The Quick Todo application follows a modern React component architecture that emphasizes reusability, type safety, and maintainability. The architecture is built on the following principles:

- **Component Composition**: Small, focused components that can be composed together
- **Type Safety**: Full TypeScript support with comprehensive interfaces
- **State Management**: Centralized state using React Context API with reducer pattern
- **Design System**: Consistent styling using CSS custom properties and design tokens
- **Accessibility**: WCAG compliant components with proper ARIA attributes

## Architecture Patterns

### Component Hierarchy

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button/      # Generic button component
│   │   ├── Input/       # Form input component
│   │   └── index.ts     # UI components export
│   ├── todo/            # Feature-specific components
│   │   ├── TodoItem/    # Individual todo item
│   │   ├── TodoList/    # Todo list container
│   │   └── index.ts     # Todo components export
│   ├── layout/          # Layout components (future)
│   └── index.ts         # Main components export
├── lib/
│   ├── TodoContext.tsx  # State management
│   ├── todoUtils.ts     # Utility functions
│   └── index.ts         # Library export
├── types/
│   ├── todo.ts          # Todo-related types
│   ├── app.ts           # App state types
│   ├── components.ts    # Component prop types
│   └── index.ts         # Types export
└── styles/
    └── globals.css      # Design tokens and global styles
```

### State Management Pattern

The application uses React Context API with useReducer for state management:

```tsx
// Central state structure
interface AppState {
  todos: Todo[];
  filter: TodoFilter;
  sort: TodoSort;
  loading: boolean;
  error: string | null;
  ui: UIState;
}

// Action-based updates
type AppAction = 
  | { type: 'ADD_TODO'; payload: CreateTodoInput }
  | { type: 'UPDATE_TODO'; payload: UpdateTodoInput }
  | ...
```

Benefits:
- **Predictable state updates** through actions
- **Centralized state** accessible throughout the app
- **Type-safe** state mutations
- **Persistence** through localStorage integration

## Component Types

### UI Components (`src/components/ui/`)

Generic, reusable components that implement the design system:

#### Button Component
- **Purpose**: Consistent button styling and behavior
- **Variants**: primary, secondary, ghost, danger
- **Sizes**: small, medium, large
- **Features**: Loading states, icons, full width option
- **Accessibility**: ARIA labels, keyboard navigation

```tsx
<Button variant="primary" size="medium" onClick={handleSave}>
  Save Todo
</Button>
```

#### Input Component
- **Purpose**: Form input with validation and accessibility
- **Types**: text, email, password, search, etc.
- **Features**: Error states, help text, auto-focus
- **Accessibility**: Label association, ARIA descriptions

```tsx
<Input
  label="Todo Text"
  value={text}
  onChange={(e) => setText(e.target.value)}
  error={hasError}
  errorMessage="Please enter todo text"
  required
/>
```

### Feature Components (`src/components/todo/`)

Todo-specific components that implement business logic:

#### TodoItem Component
- **Purpose**: Display and edit individual todo items
- **Features**: Inline editing, completion toggle, deletion
- **States**: Display mode, edit mode, loading states
- **Props**: Comprehensive TypeScript interfaces

```tsx
<TodoItem 
  todo={todo}
  isEditing={editingId === todo.id}
  compact={compactView}
/>
```

#### TodoList Component
- **Purpose**: Display filtered and sorted todo collections
- **Features**: Empty states, statistics, responsive design
- **Integration**: Works with TodoContext for state

```tsx
<TodoList />
```

## TypeScript Integration

### Interface Design

All components use comprehensive TypeScript interfaces:

```typescript
// Base component props
interface BaseComponentProps {
  className?: string;
  testId?: string;
  'aria-label'?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Specific component props extend base
interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // ... additional props
}
```

### Type Safety Benefits

1. **Compile-time error checking**
2. **IntelliSense support** in IDEs
3. **Refactoring safety**
4. **Self-documenting interfaces**

## Styling Architecture

### CSS Custom Properties (Design Tokens)

All styling uses CSS custom properties defined in `globals.css`:

```css
:root {
  /* Colors */
  --color-primary-base: #205463;
  --color-text-primary: #06041f;
  
  /* Typography */
  --font-family-primary: 'Mulish', sans-serif;
  --font-size-body: 16px;
  
  /* Spacing (8px grid) */
  --spacing-2: 8px;
  --spacing-4: 16px;
  
  /* Radius */
  --radius-md: 8px;
}
```

### Component-Specific Styles

Each component has its own CSS file with BEM-like naming:

```css
.todo-item {
  /* Base styles */
}

.todo-item--completed {
  /* Modifier styles */
}

.todo-item__text {
  /* Element styles */
}
```

## Accessibility Features

### WCAG Compliance

All components implement accessibility best practices:

1. **Semantic HTML** structure
2. **ARIA attributes** for enhanced semantics
3. **Keyboard navigation** support
4. **Focus management** and indicators
5. **Screen reader** compatibility

### Examples

```tsx
// Accessible checkbox
<label className="todo-item__checkbox-wrapper">
  <input
    type="checkbox"
    checked={todo.completed}
    onChange={handleToggle}
    aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
  />
  <span className="todo-item__checkbox-custom" />
</label>

// Skip links for keyboard users
<a href="#main" className="skip-link">
  Skip to main content
</a>
```

## Testing Strategy

### Component Testing

Each component should be tested for:

1. **Rendering** with different props
2. **User interactions** (clicks, keyboard input)
3. **State changes** and side effects
4. **Accessibility** compliance

```typescript
// Example test structure
describe('Button Component', () => {
  test('renders with correct variant styles', () => {
    render(<Button variant="primary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--primary');
  });
  
  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Test</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Performance Considerations

### Optimization Strategies

1. **React.memo** for pure components
2. **useMemo** for expensive calculations
3. **useCallback** for stable function references
4. **Code splitting** with dynamic imports
5. **Bundle optimization** with tree shaking

### Example Optimizations

```tsx
// Memoized component
const TodoItem = React.memo<TodoItemProps>(({ todo, isEditing }) => {
  // Component implementation
});

// Memoized calculations
const processedTodos = useMemo(() => 
  getProcessedTodos(todos, filter, sort, searchText),
  [todos, filter, sort, searchText]
);
```

## Future Extensibility

### Design for Growth

The architecture supports future enhancements:

1. **New UI components** can extend `BaseComponentProps`
2. **Additional features** can add new action types
3. **Layout components** can be added to the hierarchy
4. **Theming system** is ready for multiple themes
5. **Internationalization** can be added through context

### Extension Points

```typescript
// Adding new component types
export interface NewComponentProps extends BaseComponentProps {
  // New component specific props
}

// Adding new state actions
export type AppAction = 
  | ExistingActions
  | { type: 'NEW_ACTION'; payload: NewPayload };
```

## Best Practices

### Component Development

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Build complex UIs by composing simple components
3. **Props Interface Design**: Make props intuitive and well-documented
4. **Error Boundaries**: Handle errors gracefully
5. **Performance**: Optimize rendering with memoization when needed

### State Management

1. **Immutability**: Never mutate state directly
2. **Action Creators**: Use consistent action patterns
3. **Derived State**: Calculate derived values in selectors/utils
4. **Side Effects**: Handle side effects in useEffect hooks
5. **Persistence**: Save important state to localStorage

### Styling

1. **Design Tokens**: Use CSS custom properties consistently
2. **Component Scope**: Keep styles component-specific
3. **Responsive Design**: Mobile-first approach
4. **Accessibility**: Include focus styles and high contrast support
5. **Performance**: Minimize CSS bundle size

This architecture provides a solid foundation for building scalable, maintainable React applications with excellent developer experience and user accessibility.