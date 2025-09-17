'use client';

import React, { useState } from 'react';
import { Input, Button } from '../ui';
import { useTodoContext } from '../../lib/TodoContext';
import { validateTodoText } from '../../lib/todoUtils';
import { useTodoListKeyboard, useInputKeyboard } from '../../lib/useKeyboardNavigation';

/**
 * TodoForm Component Props
 */
interface TodoFormProps {
  /** Custom CSS class name */
  className?: string;
  /** Test ID for automated testing */
  testId?: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether to show the add button */
  showButton?: boolean;
}

/**
 * TodoForm Component
 * 
 * Handles adding new todo items. Implements US03 acceptance criteria:
 * - AC01: Input field accepts task text
 * - AC02: Enter key or click adds task
 * - AC03: Task appears at top of list (handled by state management)
 * - AC04: Input clears after adding
 * - AC05: Empty tasks not allowed
 * 
 * @example
 * ```tsx
 * <TodoForm placeholder="Add a new todo..." />
 * ```
 */
export const TodoForm: React.FC<TodoFormProps> = ({
  className = '',
  testId,
  placeholder = 'Add a new todo...',
  showButton = true,
}) => {
  const { dispatch } = useTodoContext();
  const { announceTaskAdded } = useTodoListKeyboard();
  const [todoText, setTodoText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  // Enhanced keyboard handling
  const { handleKeyDown } = useInputKeyboard({
    onEnter: () => handleSubmit(),
    preventEmptySubmit: true,
  });

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTodoText(value);
    
    // Clear error when user starts typing
    if (error && value.trim()) {
      setError('');
    }
  };

  // Handle form submission
  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    // Validate input (AC05: Empty tasks not allowed)
    const validation = validateTodoText(todoText);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid todo');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Add todo to state management
      // AC03: Task appears at top of list (handled by reducer logic)
      dispatch({
        type: 'ADD_TODO',
        payload: {
          text: todoText.trim(),
        },
      });

      // AC04: Input clears after adding
      setTodoText('');
      
      // Announce to screen readers
      announceTaskAdded(todoText.trim());
      
      // Optional: Provide user feedback
      // Focus could be maintained on input for continuous adding
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error('Error adding todo:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key press (AC02: Enter key adds task)
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(event as any);
  };

  // Handle button click (AC02: Click adds task)
  const handleButtonClick = () => {
    handleSubmit();
  };

  // Construct CSS classes
  const formClasses = [
    'todo-form',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <form 
      className={formClasses} 
      onSubmit={handleSubmit}
      data-testid={testId}
      noValidate
    >
      <div className="todo-form__container">
        <div className="todo-form__input-wrapper">
          <Input
            type="text"
            value={todoText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isSubmitting}
            error={!!error}
            errorMessage={error}
            className="todo-form__input"
            testId="todo-form-input"
            aria-label="Add new todo"
            autoComplete="off"
          />
        </div>
        
        {showButton && (
          <div className="todo-form__button-wrapper">
            <Button
              type="button"
              variant="primary"
              onClick={handleButtonClick}
              disabled={isSubmitting}
              loading={isSubmitting}
              className="todo-form__button"
              testId="todo-form-button"
              aria-label="Add todo"
            >
              Add
            </Button>
          </div>
        )}
      </div>
      
      {/* Hidden submit button for form submission via Enter */}
      <button
        type="submit"
        style={{ display: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
      />
    </form>
  );
};

TodoForm.displayName = 'TodoForm';