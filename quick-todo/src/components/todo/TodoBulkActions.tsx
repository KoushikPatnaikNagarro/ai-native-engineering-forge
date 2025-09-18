import React, { useState, useCallback } from 'react';
import { useTodoContext } from '../../lib/TodoContext';
import { calculateTodoStats } from '../../lib/todoUtils';
import { TodoToggleAll } from './TodoToggleAll';
import { ConfirmModal } from '../ui/ConfirmModal';
import './TodoBulkActions.css';

/**
 * TodoBulkActions Component Props
 */
interface TodoBulkActionsProps {
  /** Custom CSS class name */
  className?: string;
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * TodoBulkActions Component
 * 
 * Provides bulk operations for task management including:
 * - US08: Mark All Tasks Complete (TodoToggleAll)
 * - Clear Completed Tasks functionality
 * 
 * Positioned at the bottom of the task list as shown in wireframes.
 * Only displays when there are tasks to operate on.
 * 
 * @example
 * ```tsx
 * <TodoBulkActions />
 * ```
 */
export const TodoBulkActions: React.FC<TodoBulkActionsProps> = ({
  className = '',
  testId = 'todo-bulk-actions',
}) => {
  const { state, dispatch } = useTodoContext();
  const { todos } = state;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lastClearedCount, setLastClearedCount] = useState(0);
  
  // Calculate stats to determine which actions to show
  const stats = calculateTodoStats(todos);
  
  /**
   * Announce message to screen readers
   * US09 DOD04: Accessibility announcements
   */
  const announceToScreenReader = useCallback((message: string) => {
    // Use the persistent live region first
    const liveRegion = document.querySelector(`[data-testid="${testId}-announcements"]`);
    if (liveRegion) {
      liveRegion.textContent = message;
      // Clear after a short delay to allow for re-announcements
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 500);
    }
    
    // Also create a temporary assertive announcement for immediate feedback
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, [testId]);

  /**
   * Handle show clear confirmation modal
   * US09 AC03: Confirmation for destructive action
   */
  const handleShowClearConfirmation = useCallback(() => {
    if (stats.completed > 0) {
      setShowConfirmModal(true);
    }
  }, [stats.completed]);
  
  /**
   * Handle clear completed action after confirmation
   * US09 AC02: Removes all completed tasks
   * US09 DOD03: Animation/transition for removal
   */
  const handleConfirmClearCompleted = useCallback(() => {
    if (stats.completed > 0) {
      setLastClearedCount(stats.completed);
      
      // Add removing animation to completed tasks
      const completedElements = document.querySelectorAll('.todo-item--completed');
      const todoListItems = document.querySelector('.todo-list__items');
      
      if (todoListItems) {
        todoListItems.classList.add('todo-list__items--clearing');
      }
      
      completedElements.forEach((element, index) => {
        element.classList.add('todo-item--removing');
      });
      
      // Wait for animation to complete before dispatching action
      setTimeout(() => {
        dispatch({ type: 'CLEAR_ALL_COMPLETED' });
        setShowConfirmModal(false);
        
        // Clean up animation classes
        if (todoListItems) {
          todoListItems.classList.remove('todo-list__items--clearing');
        }
        
        // Announce to screen readers
        const announcement = `${stats.completed} completed ${stats.completed === 1 ? 'task' : 'tasks'} cleared`;
        announceToScreenReader(announcement);
        
        // Add success animation to button briefly
        const clearButton = document.querySelector(`[data-testid="${testId}-clear-completed"]`);
        if (clearButton) {
          clearButton.classList.add('todo-bulk-actions__clear-button--success');
          setTimeout(() => {
            clearButton.classList.remove('todo-bulk-actions__clear-button--success');
          }, 600);
        }
      }, 600); // Wait for staggered animations to complete
    }
  }, [dispatch, stats.completed, testId, announceToScreenReader]);
  
  /**
   * Handle cancel confirmation modal
   */
  const handleCancelClearConfirmation = useCallback(() => {
    setShowConfirmModal(false);
  }, []);
  
  // Don't render if no tasks exist - moved after hooks to avoid hook order issues
  if (stats.total === 0) {
    return null;
  }
  
  // Construct CSS classes
  const containerClasses = [
    'todo-bulk-actions',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <div className={containerClasses} data-testid={testId}>
      <div className="todo-bulk-actions__container">
        {/* US08 - Mark All Tasks Complete */}
        <TodoToggleAll testId={`${testId}-toggle-all`} />
        
        {/* Clear Completed Tasks - only show if there are completed tasks */}
        {/* US09 AC01: Clear completed button visible when applicable */}
        {/* US09 AC04: Button disabled when no completed tasks */}
        {stats.completed > 0 && (
          <button
            type="button"
            className="todo-bulk-actions__clear-button"
            onClick={handleShowClearConfirmation}
            disabled={stats.completed === 0}
            aria-label={`Clear ${stats.completed} completed ${stats.completed === 1 ? 'task' : 'tasks'}`}
            data-testid={`${testId}-clear-completed`}
          >
            <span className="todo-bulk-actions__clear-icon" aria-hidden="true">
              🗑️
            </span>
            <span className="todo-bulk-actions__clear-text">
              Clear completed ({stats.completed})
            </span>
          </button>
        )}
      </div>
      
      {/* Status announcement for screen readers */}
      {/* US09 DOD04: Accessibility announcements */}
      <div 
        className="todo-bulk-actions__status" 
        aria-live="assertive" 
        aria-atomic="true"
        data-testid={`${testId}-announcements`}
      >
        {/* Live region for dynamic announcements */}
      </div>
      
      {/* Confirmation Modal for Clear Completed Action */}
      {/* US09 AC03: Confirmation for destructive action, DOD01: Destructive action requires confirmation */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Clear Completed Tasks"
        message={`Are you sure you want to clear ${stats.completed} completed ${stats.completed === 1 ? 'task' : 'tasks'}? This action cannot be undone.`}
        confirmText="Clear Tasks"
        cancelText="Cancel"
        destructive
        onConfirm={handleConfirmClearCompleted}
        onCancel={handleCancelClearConfirmation}
        testId={`${testId}-confirm-modal`}
      />
    </div>
  );
};

TodoBulkActions.displayName = 'TodoBulkActions';