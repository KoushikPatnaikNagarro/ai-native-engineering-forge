import React, { useState } from 'react';
import { Button } from '@/components/ui';

interface BulkActionsProps {
  openTodos: Array<{ id: string; content: string }>;
  completedCount: number;
  onMarkAllCompleted: (ids: string[]) => void;
  onClearCompleted: () => void;
  disabled?: boolean;
}

export function BulkActions({ 
  openTodos, 
  completedCount, 
  onMarkAllCompleted, 
  onClearCompleted,
  disabled = false 
}: BulkActionsProps) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleMarkAllCompleted = () => {
    if (openTodos.length > 0) {
      onMarkAllCompleted(openTodos.map(todo => todo.id));
    }
  };

  const handleClearCompleted = () => {
    if (showConfirmClear) {
      onClearCompleted();
      setShowConfirmClear(false);
    } else {
      setShowConfirmClear(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowConfirmClear(false), 3000);
    }
  };

  if (openTodos.length === 0 && completedCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 justify-between items-center">
      <div className="flex gap-2">
        {openTodos.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllCompleted}
            disabled={disabled}
          >
            Mark All Complete ({openTodos.length})
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {completedCount > 0 && (
          <Button
            variant={showConfirmClear ? "destructive" : "ghost"}
            size="sm"
            onClick={handleClearCompleted}
            disabled={disabled}
          >
            {showConfirmClear 
              ? `Confirm Clear (${completedCount})` 
              : `Clear Completed (${completedCount})`
            }
          </Button>
        )}
      </div>
    </div>
  );
}