import React, { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { CreateTodoDto } from '@/types/todo';

interface TaskInputProps {
  onAddTask: (dto: CreateTodoDto) => void;
  disabled?: boolean;
}

export function TaskInput({ onAddTask, disabled = false }: TaskInputProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter a task');
      return;
    }

    onAddTask({ content: content.trim() });
    setContent('');
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    if (error) setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={content}
            onChange={handleInputChange}
            disabled={disabled}
            error={error}
            className="text-base"
            autoFocus
          />
        </div>
        <Button 
          type="submit" 
          disabled={disabled}
          size="lg"
        >
          Add Task
        </Button>
      </div>
    </form>
  );
}