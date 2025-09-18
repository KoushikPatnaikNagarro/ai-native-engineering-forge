import React from 'react';
import { useTodoContext } from '../../lib/TodoContext';
import { calculateTodoStats } from '../../lib/todoUtils';
import './TodoToggleAll.css';

/**
 * TodoToggleAll Component Props
 */
interface TodoToggleAllProps {
  /** Custom CSS class name */
  className?: string;
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * TodoToggleAll Component
 * 
 * US08 - Mark All Tasks Complete Implementation
 * 
 * Provides a toggle all button that allows users to mark all open tasks as complete
 * with a single click. Implements all US08 acceptance criteria:
 * - AC01: Toggle all button available
 * - AC02: Marks all open tasks complete
 * - AC03: Button state reflects current status
 * - AC04: Works with filtered views
 * 
 * @example
 * ```tsx
 * <TodoToggleAll />
 * ```
 */
export const TodoToggleAll: React.FC<TodoToggleAllProps> = ({
  className = '',
  testId = 'todo-toggle-all',
}) => {
  const { state, dispatch } = useTodoContext();
  const { todos, filter } = state;
  
  // Calculate stats to determine button state
  const stats = calculateTodoStats(todos);
  
  // Determine if the button should be visible
  // Only show when there are tasks
  const hasAnyTasks = stats.total > 0;
  
  // Determine button state based on tasks
  const hasOpenTasks = stats.active > 0;
  const allTasksComplete = stats.total > 0 && stats.active === 0;
  
  /**
   * Handle toggle all action
   * Marks all open tasks as complete
   */
  const handleToggleAll = () => {
    // Only mark incomplete tasks as complete (US08 AC02)
    if (hasOpenTasks) {
      dispatch({ type: 'MARK_ALL_COMPLETE' });
    }
  };
  
  // Don't render if no tasks exist
  if (!hasAnyTasks) {
    return null;
  }
  
  // Construct CSS classes
  const buttonClasses = [
    'todo-toggle-all__button',
    allTasksComplete && 'todo-toggle-all__button--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  // Button text based on current state (AC03)
  const buttonText = hasOpenTasks 
    ? `Mark all complete (${stats.active})`
    : 'All tasks complete';
  
  // ARIA label for accessibility
  const ariaLabel = hasOpenTasks
    ? `Mark all ${stats.active} open tasks as complete`
    : 'All tasks are already complete';
  
  return (
    <div 
      className={`todo-toggle-all ${className}`.trim()} 
      data-testid={testId}
    >
      <button
        type="button"
        className={buttonClasses}
        onClick={handleToggleAll}
        disabled={!hasOpenTasks}
        aria-label={ariaLabel}
        data-testid={`${testId}-button`}
      >
        <span className="todo-toggle-all__icon" aria-hidden="true">
          {allTasksComplete ? '✓' : '○'}
        </span>
        <span className="todo-toggle-all__text">
          {buttonText}
        </span>
      </button>
      
      {/* Status indicator for screen readers */}
      <span className="todo-toggle-all__status" aria-live="polite" aria-atomic="true">
        {/* This will be announced when the state changes */}
        {allTasksComplete && (
          <span className="sr-only">
            All tasks have been marked as complete
          </span>
        )}
      </span>
    </div>
  );
};

TodoToggleAll.displayName = 'TodoToggleAll';