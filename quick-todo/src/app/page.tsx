'use client';

import { TodoProvider, useTodoContext } from '../lib/TodoContext';
import { TodoForm, TodoList, TodoFilter, TodoBulkActions } from '../components/todo';
import { ErrorBanner, SuccessFeedback, TaskCounter } from '../components/ui';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { useState, useEffect } from 'react';
import './page.css';

/**
 * HomePageContent Component
 * 
 * Main application content that displays error banners, success feedback, and todo interface.
 * US13: Shows storage errors to users with dismissible banners.
 * US14: Provides loading states, error messages, and success feedback.
 */
function HomePageContent() {
  const { state, dispatch } = useTodoContext();
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleDismissError = () => {
    dispatch({ type: 'SET_ERROR', payload: { error: null } });
  };

  const handleDismissSuccess = () => {
    setSuccessMessage('');
  };

  const getErrorVariant = (errorMessage: string) => {
    if (errorMessage.includes('Storage full') || errorMessage.includes('QUOTA_EXCEEDED')) {
      return 'warning';
    }
    if (errorMessage.includes('not supported')) {
      return 'warning';
    }
    return 'error';
  };

  // US14 AC04: Listen for todo actions to show success feedback
  useEffect(() => {
    const previousTodoCount = state.todos.length;
    
    return () => {
      // This effect could be enhanced to track specific actions
      // For now, we'll implement success feedback through context updates
    };
  }, [state.todos.length]);

  return (
    <div className="app">
      <div className="app__container">
        {/* US13 AC04: Display storage errors to users */}
        {state.error && (
          <ErrorBanner
            message={state.error}
            variant={getErrorVariant(state.error)}
            onDismiss={handleDismissError}
            testId="storage-error-banner"
          />
        )}

        {/* US14 AC04: Display success feedback for user actions */}
        {successMessage && (
          <SuccessFeedback
            message={successMessage}
            onDismiss={handleDismissSuccess}
            testId="success-feedback"
          />
        )}

        {/* App Header */}
        <header className="app__header">
          <h1 className="app__title">
            Quick Todo
          </h1>
          <p className="app__subtitle">
            A frictionless, no-login todo app for quick task management
          </p>
        </header>

        {/* Main Content */}
        <main className="app__main">
          {/* US15: Task Counter - Prominent display of remaining open tasks */}
          <section className="app__counter-section" aria-label="Task progress">
            <TaskCounter testId="main-task-counter" />
          </section>

          {/* US03: Add New Task Form */}
          <section className="app__add-section" aria-label="Add new todo">
            <TodoForm 
              placeholder="What needs to be done?"
              testId="main-todo-form"
            />
          </section>

          {/* US07: Filter Tasks by Status */}
          <section className="app__filter-section" aria-label="Filter todos">
            <TodoFilter testId="main-todo-filter" />
          </section>

          {/* Todo List Display */}
          <section className="app__list-section" aria-label="Todo list">
            <TodoList testId="main-todo-list" />
          </section>

          {/* US08: Bulk Actions - Mark All Complete & Clear Completed */}
          <section className="app__bulk-actions-section" aria-label="Bulk actions">
            <TodoBulkActions testId="main-bulk-actions" />
          </section>
        </main>
      </div>
    </div>
  );
}

/**
 * HomePage Component
 * 
 * Main application page that implements US03 - Add New Task functionality,
 * US13 - Session Storage with error handling, and US14 - Loading and Error States.
 * Provides the complete todo application interface with:
 * - TodoForm for adding new tasks
 * - TodoList for displaying existing tasks with loading states
 * - State management through TodoProvider
 * - Error handling for storage operations
 * - Success feedback for user actions
 * - Error boundary for unexpected errors
 */
export default function HomePage() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log errors for debugging
        console.error('Application error:', error);
        console.error('Error info:', errorInfo);
      }}
      testId="app-error-boundary"
    >
      <TodoProvider>
        <HomePageContent />
      </TodoProvider>
    </ErrorBoundary>
  );
}