import React, { useState, useRef, FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { TaskInputProps } from '@/types';

/**
 * TaskInput Component
 * 
 * Provides a text input field for quickly adding new tasks.
 * Implements the core task creation functionality for the todo application.
 * 
 * Features:
 * - Text input at the top of the app (AC01)
 * - Enter key adds task (AC02)
 * - Input clears after adding (AC03)
 * - Focus returns to input (AC04)
 */
export const TaskInput: React.FC<TaskInputProps> = ({ 
  onAdd, 
  placeholder = "What needs to be done?" 
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Get trimmed text to avoid empty/whitespace-only tasks
    const trimmedText = inputValue.trim();
    
    // Only add task if there's actual content
    if (trimmedText) {
      // Call the onAdd callback with the task text (AC02)
      onAdd(trimmedText);
      
      // Clear the input after adding (AC03)
      setInputValue('');
      
      // Return focus to input for immediate next task entry (AC04)
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter key to add task (AC02)
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-input-form">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="task-input mb-6"
        autoFocus
        aria-label="Add new task"
        aria-describedby="task-input-help"
      />
      <span id="task-input-help" className="sr-only">
        Type your task and press Enter to add it to your list
      </span>
    </form>
  );
};
