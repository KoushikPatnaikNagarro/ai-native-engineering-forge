import React from 'react';
import { TodoItem } from './TodoItem';
import { useTodoContext } from '../../lib/TodoContext';
import { getProcessedTodos, calculateTodoStats } from '../../lib/todoUtils';
import { useTodoListKeyboard } from '../../lib/useKeyboardNavigation';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';

/**
 * TodoList Component Props
 */
interface TodoListProps {
  /** Custom CSS class name */
  className?: string;
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * TodoList Component
 * 
 * Displays a list of todo items with filtering, sorting, and search functionality.
 * Shows statistics and handles empty states gracefully.
 * 
 * @example
 * ```tsx
 * <TodoList />
 * ```
 */
export const TodoList: React.FC<TodoListProps> = ({
  className = '',
  testId,
}) => {
  const { state } = useTodoContext();
  const { todos, filter, sort, ui, loading } = state;
  const { containerRef, announceFilterChange } = useTodoListKeyboard();
  
  // Get processed todos based on current filter and sort
  const processedTodos = getProcessedTodos(todos, filter, sort, ui.searchText);
  const stats = calculateTodoStats(todos);
  
  // Announce filter changes for screen readers
  React.useEffect(() => {
    if (processedTodos.length >= 0) {
      announceFilterChange(filter, processedTodos.length);
    }
  }, [filter, processedTodos.length, announceFilterChange]);
  
  // Construct CSS classes
  const listClasses = [
    'todo-list',
    ui.compactView && 'todo-list--compact',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // US14 AC01: Show loading spinner during async operations
  if (loading) {
    return (
      <div className={`todo-list todo-list--loading ${className}`} data-testid={testId}>
        <LoadingSpinner 
          message="Loading todos..." 
          testId="todo-list-loading"
        />
      </div>
    );
  }

  // US14 AC03: Render empty state with helpful guidance
  if (todos.length === 0) {
    return (
      <div className={`${listClasses} todo-list--empty`} data-testid={testId}>
        <EmptyState 
          type="no-tasks"
          testId="todo-list-empty-state"
        />
      </div>
    );
  }

  // US14 AC03: Render no results state with contextual guidance
  if (processedTodos.length === 0) {
    const emptyType = ui.searchText ? 'no-search-results' : 
                     filter === 'active' ? 'no-open' : 
                     filter === 'completed' ? 'no-completed' : 'no-tasks';
    
    return (
      <div className={`${listClasses} todo-list--no-results`} data-testid={testId}>
        <EmptyState 
          type={emptyType}
          searchTerm={ui.searchText}
          testId="todo-list-no-results-state"
        />
      </div>
    );
  }

  return (
    <div 
      className={listClasses} 
      data-testid={testId}
      ref={containerRef as React.RefObject<HTMLDivElement>}
      role="region"
      aria-label="Todo list"
      aria-live="polite"
    >
      {/* Statistics */}
      <div className="todo-list__stats">
        <div className="todo-list__stats-summary">
          {processedTodos.length} of {stats.total} todos
          {ui.searchText && (
            <span className="todo-list__search-indicator">
              {' '}matching &quot;{ui.searchText}&quot;
            </span>
          )}
        </div>
        
        {!ui.compactView && stats.total > 0 && (
          <div className="todo-list__stats-details">
            <span className="todo-list__stat">
              {stats.active} active
            </span>
            <span className="todo-list__stat">
              {stats.completed} completed
            </span>
            {stats.byPriority.high > 0 && (
              <span className="todo-list__stat todo-list__stat--high">
                {stats.byPriority.high} high priority
              </span>
            )}
          </div>
        )}
      </div>

      {/* Todo Items */}
      <div className="todo-list__items" role="list">
        {processedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={ui.editingTodoId === todo.id}
            compact={ui.compactView}
          />
        ))}
      </div>
      
      {/* Load more placeholder for future pagination */}
      {processedTodos.length >= 50 && (
        <div className="todo-list__load-more">
          <p>Showing first 50 todos. Use search to find specific items.</p>
        </div>
      )}
    </div>
  );
};

TodoList.displayName = 'TodoList';