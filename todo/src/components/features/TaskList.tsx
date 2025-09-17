import React from 'react';
import { TodoItem } from '@/types/todo';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  todos: TodoItem[];
  onToggleStatus: (id: string) => void;
  onUpdateContent: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export function TaskList({ 
  todos, 
  onToggleStatus, 
  onUpdateContent, 
  onDelete,
  emptyMessage = "No tasks yet. Add one above to get started!"
}: TaskListProps) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-[rgba(6,4,31,0.5)] text-lg mb-2">
          {emptyMessage}
        </div>
        <div className="text-[rgba(6,4,31,0.4)] text-sm">
          Double-click any task to edit it
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#bfbfbf] rounded-lg shadow-sm overflow-hidden">
      {todos.map((todo) => (
        <TaskItem
          key={todo.id}
          todo={todo}
          onToggleStatus={onToggleStatus}
          onUpdateContent={onUpdateContent}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}