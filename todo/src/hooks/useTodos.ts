import { useState, useEffect, useCallback } from 'react';
import { TodoItem, CreateTodoDto, UpdateTodoDto, TodoFilter, TodoStats } from '@/types/todo';
import { TodoService } from '@/services/todoService';

export function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos on mount
  useEffect(() => {
    try {
      const loadedTodos = TodoService.getTodos();
      setTodos(loadedTodos);
    } catch (err) {
      setError('Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new todo
  const createTodo = useCallback((dto: CreateTodoDto) => {
    try {
      if (!dto.content.trim()) {
        setError('Todo content cannot be empty');
        return null;
      }

      const newTodo = TodoService.createTodo(dto);
      setTodos(prev => [...prev, newTodo]);
      setError(null);
      return newTodo;
    } catch (err) {
      setError('Failed to create todo');
      return null;
    }
  }, []);

  // Update an existing todo
  const updateTodo = useCallback((dto: UpdateTodoDto) => {
    try {
      const updatedTodo = TodoService.updateTodo(dto);
      if (updatedTodo) {
        setTodos(prev => prev.map(todo => 
          todo.id === dto.id ? updatedTodo : todo
        ));
        setError(null);
        return updatedTodo;
      }
      return null;
    } catch (err) {
      setError('Failed to update todo');
      return null;
    }
  }, []);

  // Delete a todo
  const deleteTodo = useCallback((id: string) => {
    try {
      const success = TodoService.deleteTodo(id);
      if (success) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        setError(null);
      }
      return success;
    } catch (err) {
      setError('Failed to delete todo');
      return false;
    }
  }, []);

  // Toggle todo status
  const toggleTodoStatus = useCallback((id: string) => {
    try {
      const updatedTodo = TodoService.toggleTodoStatus(id);
      if (updatedTodo) {
        setTodos(prev => prev.map(todo => 
          todo.id === id ? updatedTodo : todo
        ));
        setError(null);
        return updatedTodo;
      }
      return null;
    } catch (err) {
      setError('Failed to toggle todo status');
      return null;
    }
  }, []);

  // Mark multiple todos as completed
  const markMultipleCompleted = useCallback((ids: string[]) => {
    try {
      const updatedTodos = TodoService.markMultipleCompleted(ids);
      if (updatedTodos.length > 0) {
        setTodos(prev => prev.map(todo => {
          const updated = updatedTodos.find(u => u.id === todo.id);
          return updated || todo;
        }));
        setError(null);
      }
      return updatedTodos;
    } catch (err) {
      setError('Failed to mark todos as completed');
      return [];
    }
  }, []);

  // Clear all completed todos
  const clearCompleted = useCallback(() => {
    try {
      const deletedCount = TodoService.clearCompleted();
      setTodos(prev => prev.filter(todo => todo.status === 'open'));
      setError(null);
      return deletedCount;
    } catch (err) {
      setError('Failed to clear completed todos');
      return 0;
    }
  }, []);

  // Get filtered todos based on current filter
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'open':
        return todo.status === 'open';
      case 'completed':
        return todo.status === 'completed';
      default:
        return true;
    }
  }).sort((a, b) => {
    // Sort by status (open first), then by creation date (newest first)
    if (a.status !== b.status) {
      return a.status === 'open' ? -1 : 1;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  // Calculate statistics
  const stats: TodoStats = {
    total: todos.length,
    open: todos.filter(todo => todo.status === 'open').length,
    completed: todos.filter(todo => todo.status === 'completed').length,
  };

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    todos: filteredTodos,
    allTodos: todos,
    filter,
    isLoading,
    error,
    stats,

    // Actions
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoStatus,
    markMultipleCompleted,
    clearCompleted,
    setFilter,
    clearError,
  };
}