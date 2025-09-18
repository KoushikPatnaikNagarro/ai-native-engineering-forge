import React, { useState } from 'react';
import { Todo, TodoPriority } from '../../types';
import { useTodoContext } from '../../lib/TodoContext';
import { Button, Input } from '../ui';
import { formatRelativeTime, validateTodoText } from '../../lib/todoUtils';
import { useTodoListKeyboard } from '../../lib/useKeyboardNavigation';
import './TodoItem.css';

/**
 * TodoItem Component Props
 */
interface TodoItemProps {
  /** The todo item to display */
  todo: Todo;
  /** Whether the todo is currently being edited */
  isEditing?: boolean;
  /** Compact view mode */
  compact?: boolean;
  /** Custom CSS class name */
  className?: string;
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * TodoItem Component
 * 
 * Displays a single todo item with options to edit, delete, and toggle completion.
 * Supports inline editing and shows metadata like creation time and priority.
 * 
 * @example
 * ```tsx
 * <TodoItem 
 *   todo={todo} 
 *   isEditing={editingId === todo.id}
 *   compact={compactView}
 * />
 * ```
 */
export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isEditing = false,
  compact = false,
  className = '',
  testId,
}) => {
  const { dispatch } = useTodoContext();
  const { 
    announceTaskToggle, 
    announceTaskDeleted, 
    announceTaskUpdated 
  } = useTodoListKeyboard();
  
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<TodoPriority>(todo.priority || 'medium');
  const [editCategory, setEditCategory] = useState(todo.category || '');
  const [validationError, setValidationError] = useState<string>('');

  // Handle todo completion toggle
  const handleToggleComplete = () => {
    dispatch({
      type: 'TOGGLE_TODO',
      payload: { id: todo.id },
    });
    
    // Announce to screen readers
    announceTaskToggle(todo.text, !todo.completed);
  };

  // Handle edit mode activation
  const handleStartEdit = () => {
    setEditText(todo.text);
    setEditPriority(todo.priority || 'medium');
    setEditCategory(todo.category || '');
    setValidationError('');
    dispatch({
      type: 'SET_EDITING_TODO',
      payload: { id: todo.id },
    });
  };

  // Handle double-click on task text to enter edit mode (US05: AC01)
  const handleDoubleClick = () => {
    // Don't allow editing of completed todos
    if (todo.completed) {
      return;
    }
    handleStartEdit();
  };

  // Handle edit cancellation
  const handleCancelEdit = () => {
    setEditText(todo.text);
    setEditPriority(todo.priority || 'medium');
    setEditCategory(todo.category || '');
    setValidationError('');
    dispatch({
      type: 'SET_EDITING_TODO',
      payload: { id: null },
    });
  };

  // Handle edit save
  const handleSaveEdit = () => {
    const validation = validateTodoText(editText);
    
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid input');
      return;
    }

    const oldText = todo.text;
    dispatch({
      type: 'UPDATE_TODO',
      payload: {
        id: todo.id,
        text: editText.trim(),
        priority: editPriority as any,
        category: editCategory.trim() || undefined,
      },
    });
    
    // Announce to screen readers
    if (oldText !== editText.trim()) {
      announceTaskUpdated(oldText, editText.trim());
    }
    
    setValidationError('');
  };

  // Handle todo deletion
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      announceTaskDeleted(todo.text);
      dispatch({
        type: 'DELETE_TODO',
        payload: { id: todo.id },
      });
    }
  };

  // Handle key press in edit mode
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSaveEdit();
    } else if (event.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Handle keyboard navigation on todo text
  const handleTextKeyDown = (event: React.KeyboardEvent) => {
    // Enter key on todo text enters edit mode
    if (event.key === 'Enter' && !todo.completed) {
      event.preventDefault();
      handleStartEdit();
    }
    // Space key toggles completion
    else if (event.key === ' ') {
      event.preventDefault();
      handleToggleComplete();
    }
    // Delete key deletes todo (with confirmation)
    else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      handleDelete();
    }
  };

  // Construct CSS classes
  const itemClasses = [
    'todo-item',
    todo.completed && 'todo-item--completed',
    isEditing && 'todo-item--editing',
    compact && 'todo-item--compact',
    todo.priority && `todo-item--priority-${todo.priority}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Render edit mode
  if (isEditing) {
    return (
      <div className={itemClasses} data-testid={testId}>
        <div className="todo-item__edit-form">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter todo text..."
            error={!!validationError}
            errorMessage={validationError}
            autoFocus
            className="todo-item__edit-input"
          />
          
          {!compact && (
            <div className="todo-item__edit-meta">
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as TodoPriority)}
                className="todo-item__priority-select"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              
              <Input
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                placeholder="Category (optional)"
                size="small"
                className="todo-item__category-input"
              />
            </div>
          )}
          
          <div className="todo-item__edit-actions">
            <Button
              variant="primary"
              size="small"
              onClick={handleSaveEdit}
              disabled={!editText.trim()}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render display mode
  return (
    <div 
      className={itemClasses} 
      data-testid={testId}
      role="listitem"
    >
      <div className="todo-item__content">
        <label className="todo-item__checkbox-wrapper">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            className="todo-item__checkbox"
            aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="todo-item__checkbox-custom" />
        </label>
        
        <div className="todo-item__main">
          <div 
            className="todo-item__text"
            onDoubleClick={handleDoubleClick}
            onKeyDown={handleTextKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Task: ${todo.text}. Double-click or press Enter to edit, Space to toggle completion, Delete to remove`}
            title="Double-click to edit, Enter to edit, Space to toggle, Delete to remove"
          >
            {todo.text}
          </div>
          
          {!compact && (
            <div className="todo-item__meta">
              {todo.priority && (
                <span className={`todo-item__priority todo-item__priority--${todo.priority}`}>
                  {todo.priority}
                </span>
              )}
              
              {todo.category && (
                <span className="todo-item__category">
                  {todo.category}
                </span>
              )}
              
              <span className="todo-item__time">
                {formatRelativeTime(todo.createdAt)}
              </span>
            </div>
          )}
        </div>
        
        <div className="todo-item__actions">
          <Button
            variant="ghost"
            size="small"
            onClick={handleStartEdit}
            aria-label={`Edit "${todo.text}"`}
          >
            Edit
          </Button>
          
          <Button
            variant="ghost"
            size="small"
            onClick={handleDelete}
            aria-label={`Delete "${todo.text}"`}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

TodoItem.displayName = 'TodoItem';