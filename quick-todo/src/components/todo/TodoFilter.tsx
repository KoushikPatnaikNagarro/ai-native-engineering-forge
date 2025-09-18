import React from 'react';
import { useTodoContext } from '../../lib/TodoContext';
import { TodoFilter as TodoFilterType } from '../../types';
import { calculateTodoStats } from '../../lib/todoUtils';
import { useFilterKeyboard } from '../../lib/useKeyboardNavigation';
import './TodoFilter.css';

/**
 * TodoFilter Component Props
 */
interface TodoFilterProps {
  /** Custom CSS class name */
  className?: string;
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * TodoFilter Component
 * 
 * US07 - Filter Tasks by Status Implementation
 * 
 * Provides three filter buttons (All, Active, Completed) allowing users to filter
 * tasks by completion status. Implements all US07 acceptance criteria:
 * - AC01: Three filter buttons available
 * - AC02: Active filter highlighted
 * - AC03: List updates based on filter
 * - AC04: Filter state persists (handled by TodoContext + localStorage)
 * - AC05: Task count updates correctly
 * 
 * @example
 * ```tsx
 * <TodoFilter />
 * ```
 */
export const TodoFilter: React.FC<TodoFilterProps> = ({
  className = '',
  testId = 'todo-filter',
}) => {
  const { state, dispatch } = useTodoContext();
  const { filter, todos } = state;
  const { containerRef } = useFilterKeyboard();
  
  // Calculate stats for displaying counts
  const stats = calculateTodoStats(todos);
  
  /**
   * Handle filter button click
   * Updates the filter state which triggers list re-render
   */
  const handleFilterChange = (newFilter: TodoFilterType) => {
    dispatch({ 
      type: 'SET_FILTER', 
      payload: { filter: newFilter } 
    });
  };
  
  // Filter button configuration
  const filterButtons = [
    {
      key: 'all' as const,
      label: 'All',
      count: stats.total,
      isActive: filter === 'all',
    },
    {
      key: 'active' as const,
      label: 'Active', 
      count: stats.active,
      isActive: filter === 'active',
    },
    {
      key: 'completed' as const,
      label: 'Completed',
      count: stats.completed,
      isActive: filter === 'completed',
    },
  ];
  
  // Construct CSS classes
  const filterClasses = [
    'todo-filter',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <div 
      className={filterClasses} 
      data-testid={testId}
      ref={containerRef as React.RefObject<HTMLDivElement>}
    >
      <div className="todo-filter__label">
        <span className="todo-filter__label-text">Show:</span>
      </div>
      
      <div className="todo-filter__buttons" role="tablist" aria-label="Filter todos by status">
        {filterButtons.map(({ key, label, count, isActive }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="main-todo-list"
            className={[
              'todo-filter__button',
              isActive && 'todo-filter__button--active',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleFilterChange(key)}
            data-testid={`filter-${key}`}
          >
            <span className="todo-filter__button-text">
              {label}
            </span>
            <span className="todo-filter__button-count">
              {count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

TodoFilter.displayName = 'TodoFilter';