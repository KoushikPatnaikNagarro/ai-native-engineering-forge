import React from 'react';
import { Button } from '@/components/ui';
import { TodoFilter } from '@/types/todo';
import { cn } from '@/utils/cn';

interface FilterBarProps {
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  stats: {
    total: number;
    open: number;
    completed: number;
  };
}

export function FilterBar({ currentFilter, onFilterChange, stats }: FilterBarProps) {
  const filters: { value: TodoFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: stats.total },
    { value: 'open', label: 'Open', count: stats.open },
    { value: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={currentFilter === filter.value ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              'transition-all duration-200',
              currentFilter === filter.value && 'shadow-sm'
            )}
          >
            {filter.label} ({filter.count})
          </Button>
        ))}
      </div>
      
      <div className="text-sm text-[rgba(6,4,31,0.7)]">
        {stats.open > 0 && (
          <span>{stats.open} task{stats.open !== 1 ? 's' : ''} remaining</span>
        )}
      </div>
    </div>
  );
}