import React, { useState } from 'react';
import { TodoItem } from '@/types/todo';
import { Checkbox } from '@/components/ui';
import { cn } from '@/utils/cn';

interface TaskItemProps {
  todo: TodoItem;
  onToggleStatus: (id: string) => void;
  onUpdateContent: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskItem({ todo, onToggleStatus, onUpdateContent, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(todo.content);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditContent(todo.content);
  };

  const handleSave = () => {
    if (editContent.trim() && editContent.trim() !== todo.content) {
      onUpdateContent(todo.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(todo.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleCheckboxChange = () => {
    onToggleStatus(todo.id);
  };

  return (
    <div 
      className={cn(
        'flex items-center gap-3 p-4 border-b border-[#bfbfbf]/20 last:border-b-0',
        'hover:bg-[#f8feff] transition-colors',
        todo.status === 'completed' && 'opacity-60'
      )}
    >
      <Checkbox
        checked={todo.status === 'completed'}
        onChange={handleCheckboxChange}
        className="flex-shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={cn(
              'w-full px-2 py-1 text-base border border-[#0904a3] rounded',
              'focus:outline-none focus:ring-2 focus:ring-[#0904a3] focus:ring-offset-1'
            )}
            autoFocus
          />
        ) : (
          <span
            onDoubleClick={handleDoubleClick}
            className={cn(
              'block text-base cursor-pointer select-none',
              'text-[#06041f] break-words',
              todo.status === 'completed' && 'line-through text-[rgba(6,4,31,0.7)]'
            )}
          >
            {todo.content}
          </span>
        )}
      </div>

      <div className="flex items-center text-xs text-[rgba(6,4,31,0.5)]">
        {todo.createdAt.toLocaleDateString()}
      </div>
    </div>
  );
}