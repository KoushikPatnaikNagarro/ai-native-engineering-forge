'use client'

import React from 'react';
import { useTodos } from '@/hooks/useTodos';
import { TaskInput } from '@/components/features/TaskInput';
import { TaskList } from '@/components/features/TaskList';
import { FilterBar } from '@/components/features/FilterBar';
import { BulkActions } from '@/components/features/BulkActions';

export default function TodoApp() {
  const {
    todos,
    allTodos,
    filter,
    isLoading,
    error,
    stats,
    createTodo,
    updateTodo,
    toggleTodoStatus,
    markMultipleCompleted,
    clearCompleted,
    setFilter,
    clearError,
  } = useTodos();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8feff] to-[#d1f5ea] flex items-center justify-center">
        <div className="text-[#06041f] text-lg">Loading your tasks...</div>
      </div>
    );
  }

  const openTodos = allTodos.filter(todo => todo.status === 'open');
  const completedTodos = allTodos.filter(todo => todo.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8feff] to-[#d1f5ea] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#06041f] mb-2">
            Quick Todo
          </h1>
          <p className="text-[rgba(6,4,31,0.7)] text-lg">
            Simple, fast task management. No signup required.
          </p>
        </header>

        {/* Error Display */}
        {error && (
          <div className="bg-[#dc2626]/10 border border-[#dc2626] text-[#dc2626] px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={clearError}
              className="text-[#dc2626] hover:text-[#dc2626]/80 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Task Input */}
        <div className="bg-white rounded-lg shadow-sm border border-[#bfbfbf] p-6 mb-6">
          <TaskInput 
            onAddTask={createTodo}
            disabled={isLoading}
          />
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar
            currentFilter={filter}
            onFilterChange={setFilter}
            stats={stats}
          />
        </div>

        {/* Bulk Actions */}
        {(openTodos.length > 0 || completedTodos.length > 0) && (
          <div className="mb-6">
            <BulkActions
              openTodos={openTodos.map(todo => ({ id: todo.id, content: todo.content }))}
              completedCount={completedTodos.length}
              onMarkAllCompleted={markMultipleCompleted}
              onClearCompleted={clearCompleted}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Task List */}
        <div className="mb-8">
          <TaskList
            todos={todos}
            onToggleStatus={toggleTodoStatus}
            onUpdateContent={(id, content) => updateTodo({ id, content })}
            emptyMessage={
              filter === 'open' ? "No open tasks! 🎉" :
              filter === 'completed' ? "No completed tasks yet." :
              "No tasks yet. Add one above to get started!"
            }
          />
        </div>

        {/* Footer */}
        <footer className="text-center text-[rgba(6,4,31,0.5)] text-sm">
          <p>Your tasks are saved for this browser session only.</p>
          <p className="mt-1">Double-click any task to edit it.</p>
        </footer>
      </div>
    </div>
  );
}
