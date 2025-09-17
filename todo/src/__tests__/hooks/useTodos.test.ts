import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodos } from '@/hooks/useTodos';
import { TodoService } from '@/services/todoService';

// Mock the TodoService
vi.mock('@/services/todoService', () => ({
  TodoService: {
    getTodos: vi.fn(),
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
    toggleTodoStatus: vi.fn(),
    markMultipleCompleted: vi.fn(),
    clearCompleted: vi.fn(),
    clearAll: vi.fn(),
  },
}));

describe('useTodos Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty todos and loading state', () => {
    (TodoService.getTodos as any).mockReturnValue([]);
    
    const { result } = renderHook(() => useTodos());
    
    expect(result.current.todos).toEqual([]);
    expect(result.current.stats).toEqual({ total: 0, open: 0, completed: 0 });
    expect(result.current.filter).toBe('all');
  });

  it('should load existing todos on mount', () => {
    const mockTodos = [
      {
        id: '1',
        content: 'Test task',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        content: 'Completed task',
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    (TodoService.getTodos as any).mockReturnValue(mockTodos);
    
    const { result } = renderHook(() => useTodos());
    
    expect(result.current.todos).toHaveLength(2);
    expect(result.current.stats).toEqual({ total: 2, open: 1, completed: 1 });
  });

  it('should create a new todo', () => {
    const newTodo = {
      id: '1',
      content: 'New task',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (TodoService.getTodos as any).mockReturnValue([]);
    (TodoService.createTodo as any).mockReturnValue(newTodo);
    
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.createTodo({ content: 'New task' });
    });
    
    expect(TodoService.createTodo).toHaveBeenCalledWith({ content: 'New task' });
  });

  it('should not create todo with empty content', () => {
    (TodoService.getTodos as any).mockReturnValue([]);
    
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      const newTodo = result.current.createTodo({ content: '   ' });
      expect(newTodo).toBeNull();
    });
    
    expect(TodoService.createTodo).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Todo content cannot be empty');
  });

  it('should toggle todo status', () => {
    const mockTodos = [
      {
        id: '1',
        content: 'Test task',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const updatedTodo = { ...mockTodos[0], status: 'completed' };
    
    (TodoService.getTodos as any).mockReturnValue(mockTodos);
    (TodoService.toggleTodoStatus as any).mockReturnValue(updatedTodo);
    
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.toggleTodoStatus('1');
    });
    
    expect(TodoService.toggleTodoStatus).toHaveBeenCalledWith('1');
  });

  it('should filter todos correctly', () => {
    const mockTodos = [
      {
        id: '1',
        content: 'Open task',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        content: 'Completed task',
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    (TodoService.getTodos as any).mockReturnValue(mockTodos);
    
    const { result } = renderHook(() => useTodos());
    
    // Test 'open' filter
    act(() => {
      result.current.setFilter('open');
    });
    
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].status).toBe('open');
    
    // Test 'completed' filter
    act(() => {
      result.current.setFilter('completed');
    });
    
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].status).toBe('completed');
    
    // Test 'all' filter
    act(() => {
      result.current.setFilter('all');
    });
    
    expect(result.current.todos).toHaveLength(2);
  });

  it('should mark multiple todos as completed', () => {
    const mockTodos = [
      {
        id: '1',
        content: 'Task 1',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        content: 'Task 2',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const updatedTodos = mockTodos.map(todo => ({ ...todo, status: 'completed' }));
    
    (TodoService.getTodos as any).mockReturnValue(mockTodos);
    (TodoService.markMultipleCompleted as any).mockReturnValue(updatedTodos);
    
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.markMultipleCompleted(['1', '2']);
    });
    
    expect(TodoService.markMultipleCompleted).toHaveBeenCalledWith(['1', '2']);
  });

  it('should clear completed todos', () => {
    const mockTodos = [
      {
        id: '1',
        content: 'Open task',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        content: 'Completed task',
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    (TodoService.getTodos as any).mockReturnValue(mockTodos);
    (TodoService.clearCompleted as any).mockReturnValue(1);
    
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      const deletedCount = result.current.clearCompleted();
      expect(deletedCount).toBe(1);
    });
    
    expect(TodoService.clearCompleted).toHaveBeenCalled();
  });

  it('should sort todos with open tasks first and newest first', () => {
    const now = new Date();
    const earlier = new Date(now.getTime() - 1000);
    
    const mockTodos = [
      {
        id: '1',
        content: 'Older open task',
        status: 'open',
        createdAt: earlier,
        updatedAt: earlier,
      },
      {
        id: '2',
        content: 'Completed task',
        status: 'completed',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '3',
        content: 'Newer open task',
        status: 'open',
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    (TodoService.getTodos as any).mockReturnValue(mockTodos);
    
    const { result } = renderHook(() => useTodos());
    
    const todos = result.current.todos;
    expect(todos[0].content).toBe('Newer open task'); // Open task, newer
    expect(todos[1].content).toBe('Older open task'); // Open task, older
    expect(todos[2].content).toBe('Completed task'); // Completed task
  });

  it('should handle errors gracefully', () => {
    (TodoService.getTodos as any).mockImplementation(() => {
      throw new Error('Storage error');
    });
    
    const { result } = renderHook(() => useTodos());
    
    expect(result.current.error).toBe('Failed to load todos');
  });

  it('should clear error when requested', () => {
    (TodoService.getTodos as any).mockReturnValue([]);
    
    const { result } = renderHook(() => useTodos());
    
    // Simulate an error
    act(() => {
      result.current.createTodo({ content: '' });
    });
    
    expect(result.current.error).toBeTruthy();
    
    // Clear the error
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });
});