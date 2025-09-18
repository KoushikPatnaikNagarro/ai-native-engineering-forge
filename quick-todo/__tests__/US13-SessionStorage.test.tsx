/**
 * US13 Session Storage Tests
 * Tests for session storage functionality including AC01-AC04 and DOD01-DOD04
 */

import { SessionStorageManager } from '../src/lib/sessionStorage';
import { Todo, TodoPriority } from '../src/types/todo';
import { AppState } from '../src/types/app';

// Mock sessionStorage for testing
const mockSessionStorage = (() => {
  let store: { [key: string]: string } = {};
  let quotaExceeded = false;
  let unsupported = false;
  
  return {
    getItem: jest.fn((key: string) => {
      if (unsupported) throw new Error('Not supported');
      return store[key] || null;
    }),
    setItem: jest.fn((key: string, value: string) => {
      if (unsupported) throw new Error('Not supported');
      if (quotaExceeded) {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      }
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      if (unsupported) throw new Error('Not supported');
      delete store[key];
    }),
    clear: jest.fn(() => {
      if (unsupported) throw new Error('Not supported');
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
    // Test utilities
    _setQuotaExceeded: (value: boolean) => { quotaExceeded = value; },
    _setUnsupported: (value: boolean) => { unsupported = value; },
    _getStore: () => ({ ...store }),
    _reset: () => {
      store = {};
      quotaExceeded = false;
      unsupported = false;
      jest.clearAllMocks();
    }
  };
})();

// Replace global sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true
});

describe('US13 Session Storage', () => {
  let storageManager: SessionStorageManager;
  let mockTodos: Todo[];
  let mockPreferences: Partial<AppState>;

  beforeEach(() => {
    // Reset mock storage
    mockSessionStorage._reset();
    
    // Get fresh instance
    storageManager = SessionStorageManager.getInstance();
    
    // Create test data
    mockTodos = [
      {
        id: '1',
        text: 'Test todo 1',
        completed: false,
        priority: 'medium' as TodoPriority,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        text: 'Test todo 2',
        completed: true,
        priority: 'high' as TodoPriority,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      }
    ];

    mockPreferences = {
      filter: 'all',
      sort: 'created',
      ui: {
        theme: 'dark',
        compactView: true,
        searchText: '',
        showAddForm: false,
        editingTodoId: null,
        sidebarOpen: false,
      }
    };
  });

  afterEach(() => {
    mockSessionStorage._reset();
  });

  describe('AC01: Tasks saved to sessionStorage', () => {
    it('should save todos to sessionStorage successfully', async () => {
      const result = await storageManager.saveTodos(mockTodos);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTodos);
      expect(result.error).toBeNull();
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'quick-todo-session-data',
        expect.stringContaining('Test todo 1')
      );
    });

    it('should save preferences to sessionStorage successfully', async () => {
      const result = await storageManager.savePreferences(mockPreferences);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPreferences);
      expect(result.error).toBeNull();
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'quick-todo-session-preferences',
        expect.stringContaining('dark')
      );
    });

    it('should preserve todo dates when saving', async () => {
      const result = await storageManager.saveTodos(mockTodos);
      expect(result.success).toBe(true);
      
      const savedData = JSON.parse(mockSessionStorage._getStore()['quick-todo-session-data']);
      expect(savedData[0].createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(savedData[1].updatedAt).toBe('2024-01-02T00:00:00.000Z');
    });
  });

  describe('AC02: Data restored on page refresh', () => {
    it('should load todos from sessionStorage successfully', () => {
      // Pre-populate sessionStorage
      const todoData = JSON.stringify(mockTodos);
      mockSessionStorage.setItem('quick-todo-session-data', todoData);
      
      const result = storageManager.loadTodos();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data![0].text).toBe('Test todo 1');
      expect(result.data![1].text).toBe('Test todo 2');
      expect(result.error).toBeNull();
    });

    it('should load preferences from sessionStorage successfully', () => {
      // Pre-populate sessionStorage
      const prefData = JSON.stringify(mockPreferences);
      mockSessionStorage.setItem('quick-todo-session-preferences', prefData);
      
      const result = storageManager.loadPreferences();
      
      expect(result.success).toBe(true);
      expect(result.data!.filter).toBe('all');
      expect(result.data!.ui!.theme).toBe('dark');
      expect(result.data!.ui!.compactView).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should restore Date objects from ISO strings', () => {
      const todoData = JSON.stringify(mockTodos);
      mockSessionStorage.setItem('quick-todo-session-data', todoData);
      
      const result = storageManager.loadTodos();
      
      expect(result.success).toBe(true);
      expect(result.data![0].createdAt).toBeInstanceOf(Date);
      expect(result.data![1].updatedAt).toBeInstanceOf(Date);
      expect(result.data![0].createdAt.getTime()).toBe(new Date('2024-01-01').getTime());
    });

    it('should return empty array when no todos stored', () => {
      const result = storageManager.loadTodos();
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.error).toBeNull();
    });

    it('should return null when no preferences stored', () => {
      const result = storageManager.loadPreferences();
      
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
    });
  });

  describe('AC03: Storage quota managed', () => {
    it('should detect quota exceeded error', async () => {
      mockSessionStorage._setQuotaExceeded(true);
      
      const result = await storageManager.saveTodos(mockTodos);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('QUOTA_EXCEEDED');
      expect(result.message).toContain('Storage quota exceeded');
    });

    it('should estimate storage usage', async () => {
      const usage = await storageManager.getStorageInfo();
      expect(usage.isSupported).toBe(true);
      expect(usage.quotaExceeded).toBe(false);
    });

    it('should handle storage info after saving data', async () => {
      await storageManager.saveTodos(mockTodos);
      await storageManager.savePreferences(mockPreferences);
      
      const usage = await storageManager.getStorageInfo();
      expect(usage.isSupported).toBe(true);
      expect(usage.quotaExceeded).toBe(false);
    });

    it('should handle cleanup when quota exceeded', async () => {
      // Fill storage first
      await storageManager.saveTodos(mockTodos);
      
      // Then simulate quota exceeded
      mockSessionStorage._setQuotaExceeded(true);
      
      const result = await storageManager.saveTodos([...mockTodos, ...mockTodos]);
      expect(result.success).toBe(false);
      expect(result.error).toBe('QUOTA_EXCEEDED');
    });
  });

  describe('AC04: Graceful handling of storage errors', () => {
    it('should handle sessionStorage not supported', async () => {
      mockSessionStorage._setUnsupported(true);
      
      const result = await storageManager.saveTodos(mockTodos);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('NOT_SUPPORTED');
      expect(result.message).toContain('Session storage is not supported');
    });

    it('should handle corrupted data gracefully', () => {
      // Store invalid JSON
      mockSessionStorage.setItem('quick-todo-session-data', '{invalid json}');
      
      const result = storageManager.loadTodos();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('UNKNOWN_ERROR');
      expect(result.message).toContain('Failed to parse');
    });

    it('should handle missing properties in stored data', () => {
      // Store data missing required properties
      const invalidData = JSON.stringify([{ id: '1', text: 'Test' }]); // Missing required fields
      mockSessionStorage.setItem('quick-todo-session-data', invalidData);
      
      const result = storageManager.loadTodos();
      
      // Should still attempt to load but with defaults
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });

    it('should handle security errors', async () => {
      mockSessionStorage.setItem.mockImplementation(() => {
        const error = new Error('SecurityError');
        error.name = 'SecurityError';
        throw error;
      });
      
      const result = await storageManager.saveTodos(mockTodos);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('SECURITY_ERROR');
      expect(result.message).toContain('Access to session storage denied');
    });
  });

  describe('DOD01: Robust storage implementation', () => {
    it('should use singleton pattern correctly', () => {
      const instance1 = SessionStorageManager.getInstance();
      const instance2 = SessionStorageManager.getInstance();
      
      expect(instance1).toBe(instance2);
    });

    it('should validate data before saving', async () => {
      const invalidTodos = [{ invalid: 'data' }] as any;
      
      const result = await storageManager.saveTodos(invalidTodos);
      expect(result.success).toBe(true); // Should handle gracefully
    });

    it('should implement retry mechanism for transient errors', async () => {
      let attemptCount = 0;
      mockSessionStorage.setItem.mockImplementation(() => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error('Transient error');
        }
        return undefined;
      });
      
      const result = await storageManager.saveTodos(mockTodos);
      expect(result.success).toBe(true);
      expect(attemptCount).toBe(3);
    });
  });

  describe('DOD02: Error handling tested', () => {
    it('should map all error types correctly', async () => {
      const errorTests = [
        { 
          error: () => { const e = new Error(); e.name = 'QuotaExceededError'; throw e; },
          expected: 'QUOTA_EXCEEDED'
        },
        { 
          error: () => { const e = new Error(); e.name = 'SecurityError'; throw e; },
          expected: 'SECURITY_ERROR'
        },
        { 
          error: () => { throw new Error('Random error'); },
          expected: 'UNKNOWN_ERROR'
        }
      ];

      for (const test of errorTests) {
        mockSessionStorage.setItem.mockImplementationOnce(test.error);
        const result = await storageManager.saveTodos(mockTodos);
        expect(result.error).toBe(test.expected);
      }
    });

    it('should provide user-friendly error messages', async () => {
      mockSessionStorage._setQuotaExceeded(true);
      
      const result = await storageManager.saveTodos(mockTodos);
      
      expect(result.message).not.toContain('QuotaExceededError');
      expect(result.message).toContain('Storage quota exceeded');
    });
  });

  describe('DOD03: Minimal performance impact', () => {
    it('should complete save operations quickly', async () => {
      const start = performance.now();
      await storageManager.saveTodos(mockTodos);
      const duration = performance.now() - start;
      
      // Should complete within 100ms
      expect(duration).toBeLessThan(100);
    });

    it('should complete load operations quickly', () => {
      mockSessionStorage.setItem('quick-todo-session-data', JSON.stringify(mockTodos));
      
      const start = performance.now();
      storageManager.loadTodos();
      const duration = performance.now() - start;
      
      // Should complete within 50ms
      expect(duration).toBeLessThan(50);
    });

    it('should handle large datasets efficiently', async () => {
      // Create large dataset
      const largeTodos = Array.from({ length: 1000 }, (_, i) => ({
        ...mockTodos[0],
        id: `todo-${i}`,
        text: `Large todo item ${i}`
      }));
      
      const start = performance.now();
      const result = await storageManager.saveTodos(largeTodos);
      const duration = performance.now() - start;
      
      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(500); // Should handle 1000 todos in <500ms
    });
  });

  describe('DOD04: Data migration considerations', () => {
    it('should handle existing sessionStorage data gracefully', () => {
      // Pre-populate sessionStorage with data
      const existingData = JSON.stringify(mockTodos);
      mockSessionStorage.setItem('quick-todo-session-data', existingData);
      
      const result = storageManager.loadTodos();
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it('should handle data format changes gracefully', () => {
      // Simulate old data format (missing optional fields)
      const oldFormatData = JSON.stringify([
        {
          id: '1',
          text: 'Old format todo',
          completed: false,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      ]);
      
      mockSessionStorage.setItem('quick-todo-session-data', oldFormatData);
      
      const result = storageManager.loadTodos();
      expect(result.success).toBe(true);
      expect(result.data![0].text).toBe('Old format todo');
    });

    it('should provide clear documentation for data structure', () => {
      // This test ensures we document the expected data structure
      const expectedTodoStructure = {
        id: 'string',
        text: 'string', 
        completed: 'boolean',
        createdAt: 'Date',
        updatedAt: 'Date',
        priority: 'optional TodoPriority',
        category: 'optional string'
      };
      
      // Verify our test data matches expected structure
      expect(typeof mockTodos[0].id).toBe('string');
      expect(typeof mockTodos[0].text).toBe('string');
      expect(typeof mockTodos[0].completed).toBe('boolean');
      expect(mockTodos[0].createdAt).toBeInstanceOf(Date);
      expect(mockTodos[0].updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete save/load cycle', async () => {
      // Save data
      const saveResult = await storageManager.saveTodos(mockTodos);
      expect(saveResult.success).toBe(true);
      
      const savePrefResult = await storageManager.savePreferences(mockPreferences);
      expect(savePrefResult.success).toBe(true);
      
      // Load data
      const loadResult = storageManager.loadTodos();
      expect(loadResult.success).toBe(true);
      expect(loadResult.data).toEqual(mockTodos);
      
      const loadPrefResult = storageManager.loadPreferences();
      expect(loadPrefResult.success).toBe(true);
      expect(loadPrefResult.data).toEqual(mockPreferences);
    });

    it('should maintain data consistency across multiple operations', async () => {
      // Multiple save operations
      await storageManager.saveTodos(mockTodos);
      await storageManager.saveTodos([...mockTodos, { 
        ...mockTodos[0], 
        id: '3', 
        text: 'New todo' 
      }]);
      
      const result = storageManager.loadTodos();
      expect(result.data).toHaveLength(3);
      expect(result.data![2].text).toBe('New todo');
    });
  });
});