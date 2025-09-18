/**
 * Session Storage Utilities for US13 - Session Storage Implementation
 * 
 * Provides robust session storage functionality with:
 * - AC01: Tasks saved to sessionStorage
 * - AC02: Data restored on page refresh  
 * - AC03: Storage quota managed
 * - AC04: Graceful handling of storage errors
 */

import { Todo, AppState, UIState } from '../types';

// Storage keys
export const STORAGE_KEYS = {
  TODOS: 'quick-todo-session-data',
  PREFERENCES: 'quick-todo-session-preferences',
  STORAGE_TEST: 'quick-todo-session-test',
} as const;

// Storage error types
export type StorageError = 
  | 'QUOTA_EXCEEDED'
  | 'NOT_SUPPORTED'
  | 'SECURITY_ERROR'
  | 'UNKNOWN_ERROR';

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: StorageError | null;
  message?: string;
}

export interface StorageInfo {
  isSupported: boolean;
  quotaExceeded: boolean;
  estimatedQuota?: number;
  usage?: number;
}

/**
 * Session Storage Manager
 * Handles all sessionStorage operations with robust error handling
 */
export class SessionStorageManager {
  private static instance: SessionStorageManager;
  private isSupported: boolean = false;
  private maxRetries: number = 3;

  constructor() {
    this.isSupported = this.checkSupport();
  }

  static getInstance(): SessionStorageManager {
    if (!SessionStorageManager.instance) {
      SessionStorageManager.instance = new SessionStorageManager();
    }
    return SessionStorageManager.instance;
  }

  /**
   * AC04: Check if sessionStorage is supported
   */
  private checkSupport(): boolean {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) {
        return false;
      }

      // Test actual functionality
      const testKey = STORAGE_KEYS.STORAGE_TEST;
      const testValue = 'test';
      
      window.sessionStorage.setItem(testKey, testValue);
      const retrieved = window.sessionStorage.getItem(testKey);
      window.sessionStorage.removeItem(testKey);
      
      return retrieved === testValue;
    } catch (error) {
      console.warn('SessionStorage not supported:', error);
      return false;
    }
  }

  /**
   * AC03: Get storage information and quota status
   */
  async getStorageInfo(): Promise<StorageInfo> {
    if (!this.isSupported) {
      return { isSupported: false, quotaExceeded: false };
    }

    try {
      let estimatedQuota: number | undefined;
      let usage: number | undefined;

      // Try to get storage estimate (modern browsers)
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        estimatedQuota = estimate.quota;
        usage = estimate.usage;
      }

      // Test for quota exceeded by attempting a small write
      const quotaExceeded = await this.testQuotaExceeded();

      return {
        isSupported: true,
        quotaExceeded,
        estimatedQuota,
        usage,
      };
    } catch (error) {
      return { isSupported: true, quotaExceeded: false };
    }
  }

  /**
   * AC03: Test if storage quota is exceeded
   */
  private async testQuotaExceeded(): Promise<boolean> {
    try {
      const testKey = `${STORAGE_KEYS.STORAGE_TEST}-quota`;
      const testData = 'quota-test';
      
      window.sessionStorage.setItem(testKey, testData);
      window.sessionStorage.removeItem(testKey);
      return false;
    } catch (error) {
      if (error instanceof Error) {
        return error.name === 'QuotaExceededError' || 
               error.message.includes('quota') ||
               error.message.includes('exceeded');
      }
      return false;
    }
  }

  /**
   * AC04: Map storage errors to user-friendly types
   */
  private mapError(error: unknown): { type: StorageError; message: string } {
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
        return {
          type: 'QUOTA_EXCEEDED',
          message: 'Storage quota exceeded. Please refresh to continue or clear browser data.',
        };
      }
      
      if (error.name === 'SecurityError') {
        return {
          type: 'SECURITY_ERROR',
          message: 'Storage access denied due to privacy settings.',
        };
      }
      
      if (error.message.includes('not supported')) {
        return {
          type: 'NOT_SUPPORTED',
          message: 'Session storage is not supported in your browser.',
        };
      }
    }
    
    return {
      type: 'UNKNOWN_ERROR',
      message: 'An unexpected storage error occurred.',
    };
  }

  /**
   * AC01: Save data to sessionStorage with error handling and retries
   */
  private async saveWithRetry<T>(key: string, data: T, attempt: number = 1): Promise<StorageResult<void>> {
    if (!this.isSupported) {
      return {
        success: false,
        error: 'NOT_SUPPORTED',
        message: 'Session storage is not supported',
      };
    }

    try {
      const serializedData = JSON.stringify(data);
      window.sessionStorage.setItem(key, serializedData);
      
      return { 
        success: true,
        error: null,
        message: undefined,
      };
    } catch (error) {
      const { type, message } = this.mapError(error);
      
      // Retry for transient errors (but not quota exceeded)
      if (attempt < this.maxRetries && type !== 'QUOTA_EXCEEDED') {
        await new Promise(resolve => setTimeout(resolve, 100 * attempt));
        return this.saveWithRetry(key, data, attempt + 1);
      }
      
      return {
        success: false,
        error: type,
        message,
      };
    }
  }

  /**
   * AC02: Load data from sessionStorage with error handling
   */
  private loadData<T>(key: string, defaultValue: T): StorageResult<T> {
    if (!this.isSupported) {
      return {
        success: false,
        data: defaultValue,
        error: 'NOT_SUPPORTED',
        message: 'Session storage is not supported',
      };
    }

    try {
      const item = window.sessionStorage.getItem(key);
      
      if (item === null) {
        return { 
          success: true, 
          data: defaultValue,
          error: null,
        };
      }
      
      const parsedData = JSON.parse(item);
      return { 
        success: true, 
        data: parsedData,
        error: null,
      };
    } catch (error) {
      const { type, message } = this.mapError(error);
      
      return {
        success: false,
        data: defaultValue,
        error: type,
        message,
      };
    }
  }

  /**
   * AC01: Save todos to sessionStorage
   */
  async saveTodos(todos: Todo[]): Promise<StorageResult<Todo[]>> {
    const result = await this.saveWithRetry(STORAGE_KEYS.TODOS, todos);
    return {
      ...result,
      data: result.success ? todos : undefined,
    };
  }

  /**
   * AC02: Load todos from sessionStorage
   */
  loadTodos(): StorageResult<Todo[]> {
    const result = this.loadData<Todo[]>(STORAGE_KEYS.TODOS, []);
    
    if (result.success && result.data) {
      // Parse dates that were serialized as strings
      result.data = result.data.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
      }));
    }
    
    return result;
  }

  /**
   * AC01: Save user preferences to sessionStorage
   */
  async savePreferences(preferences: Partial<AppState>): Promise<StorageResult<Partial<AppState>>> {
    const preferencesToSave: Partial<AppState> = {
      filter: preferences.filter,
      sort: preferences.sort,
      ui: preferences.ui ? {
        theme: preferences.ui.theme,
        compactView: preferences.ui.compactView,
        searchText: preferences.ui.searchText,
        showAddForm: false,
        editingTodoId: null,
        sidebarOpen: false,
      } : undefined,
    };

    const result = await this.saveWithRetry(STORAGE_KEYS.PREFERENCES, preferencesToSave);
    return {
      ...result,
      data: result.success ? preferencesToSave : undefined,
    };
  }

  /**
   * AC02: Load user preferences from sessionStorage
   */
  loadPreferences(): StorageResult<Partial<AppState> | null> {
    return this.loadData<Partial<AppState> | null>(STORAGE_KEYS.PREFERENCES, null);
  }

  /**
   * Clear all session storage data (for testing or cleanup)
   */
  clearAll(): StorageResult<void> {
    if (!this.isSupported) {
      return {
        success: false,
        error: 'NOT_SUPPORTED',
        message: 'Session storage is not supported',
      };
    }

    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        window.sessionStorage.removeItem(key);
      });
      
      return { 
        success: true,
        error: null,
      };
    } catch (error) {
      const { type, message } = this.mapError(error);
      return {
        success: false,
        error: type,
        message,
      };
    }
  }

  /**
   * Get storage support status
   */
  getSupport(): boolean {
    return this.isSupported;
  }
}

// Export singleton instance
export const sessionStorage = SessionStorageManager.getInstance();

// Export utility functions for direct use
export const sessionStorageUtils = {
  saveTodos: (todos: Todo[]) => sessionStorage.saveTodos(todos),
  loadTodos: () => sessionStorage.loadTodos(),
  savePreferences: (prefs: Partial<AppState>) => sessionStorage.savePreferences(prefs),
  loadPreferences: () => sessionStorage.loadPreferences(),
  getStorageInfo: () => sessionStorage.getStorageInfo(),
  clearAll: () => sessionStorage.clearAll(),
  isSupported: () => sessionStorage.getSupport(),
};