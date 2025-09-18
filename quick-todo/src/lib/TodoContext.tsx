import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, AppAction, Todo, CreateTodoInput, UpdateTodoInput } from '../types';
import { sessionStorageUtils, StorageError } from './sessionStorage';

/**
 * Initial state for the todo application
 */
const initialState: AppState = {
  todos: [],
  filter: 'all',
  sort: 'created',
  loading: false,
  error: null,
  ui: {
    showAddForm: false,
    editingTodoId: null,
    searchText: '',
    sidebarOpen: false,
    theme: 'light',
    compactView: false,
  },
};

/**
 * Todo app reducer
 * Handles all state mutations in a predictable way
 */
function todoReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TODO': {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text: action.payload.text,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: action.payload.priority,
        category: action.payload.category,
      };
      
      return {
        ...state,
        todos: [...state.todos, newTodo],
        ui: {
          ...state.ui,
          showAddForm: false,
        },
      };
    }
    
    case 'UPDATE_TODO': {
      const updatedTodos = state.todos.map(todo =>
        todo.id === action.payload.id
          ? {
              ...todo,
              ...action.payload,
              updatedAt: new Date(),
            }
          : todo
      );
      
      return {
        ...state,
        todos: updatedTodos,
        ui: {
          ...state.ui,
          editingTodoId: null,
        },
      };
    }
    
    case 'DELETE_TODO': {
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id),
      };
    }
    
    case 'TOGGLE_TODO': {
      const updatedTodos = state.todos.map(todo =>
        todo.id === action.payload.id
          ? {
              ...todo,
              completed: !todo.completed,
              updatedAt: new Date(),
            }
          : todo
      );
      
      return {
        ...state,
        todos: updatedTodos,
      };
    }
    
    case 'MARK_ALL_COMPLETE': {
      const updatedTodos = state.todos.map(todo =>
        todo.completed
          ? todo
          : {
              ...todo,
              completed: true,
              updatedAt: new Date(),
            }
      );
      
      return {
        ...state,
        todos: updatedTodos,
      };
    }
    
    case 'SET_FILTER': {
      return {
        ...state,
        filter: action.payload.filter,
      };
    }
    
    case 'SET_SORT': {
      return {
        ...state,
        sort: action.payload.sort,
      };
    }
    
    case 'SET_SEARCH_TEXT': {
      return {
        ...state,
        ui: {
          ...state.ui,
          searchText: action.payload.searchText,
        },
      };
    }
    
    case 'SET_LOADING': {
      return {
        ...state,
        loading: action.payload.loading,
      };
    }
    
    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload.error,
      };
    }
    
    case 'TOGGLE_ADD_FORM': {
      return {
        ...state,
        ui: {
          ...state.ui,
          showAddForm: !state.ui.showAddForm,
        },
      };
    }
    
    case 'SET_EDITING_TODO': {
      return {
        ...state,
        ui: {
          ...state.ui,
          editingTodoId: action.payload.id,
        },
      };
    }
    
    case 'TOGGLE_SIDEBAR': {
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen,
        },
      };
    }
    
    case 'SET_THEME': {
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload.theme,
        },
      };
    }
    
    case 'TOGGLE_COMPACT_VIEW': {
      return {
        ...state,
        ui: {
          ...state.ui,
          compactView: !state.ui.compactView,
        },
      };
    }
    
    case 'CLEAR_ALL_COMPLETED': {
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };
    }
    
    case 'LOAD_TODOS': {
      return {
        ...state,
        todos: action.payload.todos,
        loading: false,
        error: null,
      };
    }
    
    default:
      return state;
  }
}

/**
 * Context for the todo app state
 */
export const TodoContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

/**
 * Todo Context Provider Component
 * 
 * Provides state management for the entire todo application.
 * US13: Handles session storage persistence and state initialization.
 * 
 * @example
 * ```tsx
 * <TodoProvider>
 *   <App />
 * </TodoProvider>
 * ```
 */
export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // US13 AC02: Load data from sessionStorage on mount
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: { loading: true } });
    
    try {
      // Load todos from session storage
      const todosResult = sessionStorageUtils.loadTodos();
      if (todosResult.success && todosResult.data && todosResult.data.length > 0) {
        dispatch({ type: 'LOAD_TODOS', payload: { todos: todosResult.data } });
      } else if (!todosResult.success && todosResult.error) {
        console.warn('Failed to load todos from session storage:', todosResult.message);
        dispatch({ 
          type: 'SET_ERROR', 
          payload: { error: `Storage Error: ${todosResult.message}` } 
        });
      }
      
      // Load preferences from session storage
      const preferencesResult = sessionStorageUtils.loadPreferences();
      if (preferencesResult.success && preferencesResult.data) {
        const preferences = preferencesResult.data;
        
        // Restore UI preferences
        if (preferences.ui?.theme) {
          dispatch({ type: 'SET_THEME', payload: { theme: preferences.ui.theme } });
        }
        if (preferences.ui?.compactView !== undefined && preferences.ui.compactView) {
          dispatch({ type: 'TOGGLE_COMPACT_VIEW' });
        }
        
        // US07: Restore filter and sort state
        if (preferences.filter) {
          dispatch({ type: 'SET_FILTER', payload: { filter: preferences.filter } });
        }
        if (preferences.sort) {
          dispatch({ type: 'SET_SORT', payload: { sort: preferences.sort } });
        }
      } else if (!preferencesResult.success && preferencesResult.error) {
        console.warn('Failed to load preferences from session storage:', preferencesResult.message);
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { error: 'Failed to load saved data from session storage' } 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  }, []);

  // US13 AC01: Save todos to sessionStorage whenever they change
  useEffect(() => {
    // Don't save if we're still loading initial data
    if (state.loading) return;
    
    const saveTodos = async () => {
      try {
        const result = await sessionStorageUtils.saveTodos(state.todos);
        if (!result.success && result.error) {
          console.error('Failed to save todos to session storage:', result.message);
          
          // US13 AC04: Handle storage errors gracefully
          if (result.error === 'QUOTA_EXCEEDED') {
            dispatch({ 
              type: 'SET_ERROR', 
              payload: { error: 'Storage full. Some changes may not be saved.' } 
            });
          } else if (result.error === 'NOT_SUPPORTED') {
            dispatch({ 
              type: 'SET_ERROR', 
              payload: { error: 'Session storage not supported. Changes will not persist.' } 
            });
          }
        }
      } catch (error) {
        console.error('Failed to save todos:', error);
      }
    };

    saveTodos();
  }, [state.todos, state.loading]);

  // US13 AC01: Save UI preferences to sessionStorage
  useEffect(() => {
    // Don't save if we're still loading initial data
    if (state.loading) return;
    
    const savePreferences = async () => {
      try {
        const preferences: Partial<AppState> = {
          filter: state.filter,
          sort: state.sort,
          ui: {
            theme: state.ui.theme,
            compactView: state.ui.compactView,
            searchText: state.ui.searchText,
            showAddForm: false, // Don't persist form state
            editingTodoId: null, // Don't persist editing state
            sidebarOpen: false, // Don't persist sidebar state
          },
        };
        
        const result = await sessionStorageUtils.savePreferences(preferences);
        if (!result.success && result.error) {
          console.warn('Failed to save preferences to session storage:', result.message);
        }
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    };

    savePreferences();
  }, [
    state.filter, 
    state.sort, 
    state.ui.theme, 
    state.ui.compactView, 
    state.ui.searchText,
    state.loading
  ]);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

/**
 * Hook to use the todo context
 * 
 * @throws {Error} If used outside of TodoProvider
 * @returns The todo context value with state and dispatch
 * 
 * @example
 * ```tsx
 * const { state, dispatch } = useTodoContext();
 * 
 * const addTodo = (text: string) => {
 *   dispatch({ type: 'ADD_TODO', payload: { text } });
 * };
 * ```
 */
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};