import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoService } from '@/services/todoService';

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Store original sessionStorage to restore later
const originalSessionStorage = window.sessionStorage;

describe('TodoService', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    mockSessionStorage.getItem.mockClear();
    mockSessionStorage.setItem.mockClear();
    mockSessionStorage.removeItem.mockClear();
    mockSessionStorage.clear.mockClear();
    
    // Set up fresh mock for each test
    Object.defineProperty(global, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true,
    });
  });

  describe('getTodos', () => {
    it('should return empty array when no todos in storage', () => {
      mockSessionStorage.getItem.mockReturnValue(null);
      
      const todos = TodoService.getTodos();
      
      expect(todos).toEqual([]);
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('todo-app-tasks');
    });

    it('should return parsed todos from storage', () => {
      const storedTodos = [
        {
          id: '1',
          content: 'Test todo',
          status: 'open',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ];
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(storedTodos));
      
      const todos = TodoService.getTodos();
      
      expect(todos).toHaveLength(1);
      expect(todos[0].content).toBe('Test todo');
      expect(todos[0].createdAt).toBeInstanceOf(Date);
    });

    it('should handle JSON parse errors gracefully', () => {
      mockSessionStorage.getItem.mockReturnValue('invalid json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const todos = TodoService.getTodos();
      
      expect(todos).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading todos from session storage:',
        expect.any(Error)
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('createTodo', () => {
    it('should create a new todo with correct properties', () => {
      mockSessionStorage.getItem.mockReturnValue('[]');
      
      const newTodo = TodoService.createTodo({ content: 'New task' });
      
      expect(newTodo).toMatchObject({
        content: 'New task',
        status: 'open',
      });
      expect(newTodo.id).toBeTruthy();
      expect(newTodo.createdAt).toBeInstanceOf(Date);
      expect(newTodo.updatedAt).toBeInstanceOf(Date);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'todo-app-tasks',
        expect.stringContaining('New task')
      );
    });

    it('should trim whitespace from todo content', () => {
      mockSessionStorage.getItem.mockReturnValue('[]');
      
      const newTodo = TodoService.createTodo({ content: '  Spaced task  ' });
      
      expect(newTodo.content).toBe('Spaced task');
    });
  });

  describe('updateTodo', () => {
    it('should update existing todo', () => {
      const existingTodos = [
        {
          id: '1',
          content: 'Original task',
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(existingTodos));
      
      const updatedTodo = TodoService.updateTodo({
        id: '1',
        content: 'Updated task',
      });
      
      expect(updatedTodo?.content).toBe('Updated task');
      expect(mockSessionStorage.setItem).toHaveBeenCalled();
    });

    it('should return null for non-existent todo', () => {
      mockSessionStorage.getItem.mockReturnValue('[]');
      
      const result = TodoService.updateTodo({
        id: 'non-existent',
        content: 'Updated task',
      });
      
      expect(result).toBeNull();
    });
  });

  describe('toggleTodoStatus', () => {
    it('should toggle status from open to completed', () => {
      const existingTodos = [
        {
          id: '1',
          content: 'Test task',
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(existingTodos));
      
      const updatedTodo = TodoService.toggleTodoStatus('1');
      
      expect(updatedTodo?.status).toBe('completed');
    });

    it('should toggle status from completed to open', () => {
      const existingTodos = [
        {
          id: '1',
          content: 'Test task',
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(existingTodos));
      
      const updatedTodo = TodoService.toggleTodoStatus('1');
      
      expect(updatedTodo?.status).toBe('open');
    });
  });

  describe('markMultipleCompleted', () => {
    it('should mark multiple open todos as completed', () => {
      const existingTodos = [
        {
          id: '1',
          content: 'Task 1',
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          content: 'Task 2',
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          content: 'Task 3',
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(existingTodos));
      
      const updatedTodos = TodoService.markMultipleCompleted(['1', '2']);
      
      expect(updatedTodos).toHaveLength(2);
      expect(updatedTodos.every(todo => todo.status === 'completed')).toBe(true);
    });
  });

  describe('clearCompleted', () => {
    it('should remove all completed todos and return count', () => {
      const existingTodos = [
        {
          id: '1',
          content: 'Open task',
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          content: 'Completed task 1',
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          content: 'Completed task 2',
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(existingTodos));
      
      const deletedCount = TodoService.clearCompleted();
      
      expect(deletedCount).toBe(2);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'todo-app-tasks',
        expect.stringContaining('Open task')
      );
    });
  });

  describe('deleteTodo', () => {
    it('should delete existing todo and return true', () => {
      const existingTodos = [
        {
          id: '1',
          content: 'Task to delete',
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(existingTodos));
      
      const result = TodoService.deleteTodo('1');
      
      expect(result).toBe(true);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('todo-app-tasks', '[]');
    });

    it('should return false for non-existent todo', () => {
      mockSessionStorage.getItem.mockReturnValue('[]');
      
      const result = TodoService.deleteTodo('non-existent');
      
      expect(result).toBe(false);
    });
  });

  describe('clearAll', () => {
    it('should remove all todos from storage', () => {
      TodoService.clearAll();
      
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('todo-app-tasks');
    });
  });
});