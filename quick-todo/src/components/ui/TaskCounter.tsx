'use client';

import React from 'react';
import { useTodoContext } from '../../lib/TodoContext';
import { calculateTodoStats } from '../../lib/todoUtils';
import './TaskCounter.css';

/**
 * TaskCounter Component Props
 */
interface TaskCounterProps {
  /** Additional CSS classes */
  className?: string;
  /** Test identifier for automated testing */
  testId?: string;
  /** Show detailed breakdown (active/completed) */
  showBreakdown?: boolean;
}

/**
 * TaskCounter Component
 * 
 * US15 Implementation - Task Counter
 * Displays remaining open tasks with proper pluralization and dynamic updates.
 * 
 * Acceptance Criteria:
 * - AC01: Counter shows remaining open tasks
 * - AC02: Updates dynamically with changes  
 * - AC03: Proper pluralization (1 item vs 2 items)
 * - AC04: Counter visible and prominent
 * 
 * @example
 * ```tsx
 * <TaskCounter />
 * <TaskCounter showBreakdown />
 * ```
 */
export const TaskCounter: React.FC<TaskCounterProps> = ({
  className = '',
  testId = 'task-counter',
  showBreakdown = false,
}) => {
  const { state } = useTodoContext();
  const { todos } = state;
  
  // Calculate statistics using existing utility
  const stats = calculateTodoStats(todos);
  
  // US15 AC03: Proper pluralization for remaining open tasks
  const getRemainingText = (count: number): string => {
    if (count === 0) {
      return 'No items left';
    } else if (count === 1) {
      return '1 item left';
    } else {
      return `${count} items left`;
    }
  };
  
  // Get completed text for breakdown
  const getCompletedText = (count: number): string => {
    if (count === 0) {
      return 'No completed items';
    } else if (count === 1) {
      return '1 completed';
    } else {
      return `${count} completed`;
    }
  };
  
  // Construct CSS classes
  const counterClasses = [
    'task-counter',
    showBreakdown && 'task-counter--detailed',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <div 
      className={counterClasses}
      data-testid={testId}
      role="status"
      aria-live="polite"
      aria-label={`Todo status: ${getRemainingText(stats.active)}`}
    >
      {/* Main counter display - US15 AC01 & AC04: Shows remaining open tasks prominently */}
      <div className="task-counter__main">
        <span className="task-counter__number">
          {stats.active}
        </span>
        <span className="task-counter__text">
          {stats.active === 1 ? 'item left' : 'items left'}
        </span>
      </div>
      
      {/* Optional breakdown display */}
      {showBreakdown && stats.total > 0 && (
        <div className="task-counter__breakdown">
          <span className="task-counter__breakdown-item">
            <span className="task-counter__breakdown-number">
              {stats.completed}
            </span>
            <span className="task-counter__breakdown-text">
              {stats.completed === 1 ? 'completed' : 'completed'}
            </span>
          </span>
          <span className="task-counter__breakdown-separator">•</span>
          <span className="task-counter__breakdown-item">
            <span className="task-counter__breakdown-number">
              {stats.total}
            </span>
            <span className="task-counter__breakdown-text">
              {stats.total === 1 ? 'total' : 'total'}
            </span>
          </span>
        </div>
      )}
      
      {/* Special state for no todos */}
      {stats.total === 0 && (
        <div className="task-counter__empty">
          <span className="task-counter__empty-text">
            Ready to add your first todo!
          </span>
        </div>
      )}
    </div>
  );
};

TaskCounter.displayName = 'TaskCounter';