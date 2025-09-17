import type {
  Todo,
  TodoPriority,
  TodoFilter,
  TodoSort,
  CreateTodoInput,
  UpdateTodoInput,
  TodoStats,
} from './todo';

/**
 * Application-wide state interface
 * Defines the complete state structure for the todo app
 */
export interface AppState {
  /** Array of all todo items */
  todos: Todo[];
  
  /** Current filter applied to the todo list */
  filter: TodoFilter;
  
  /** Current sort method for the todo list */
  sort: TodoSort;
  
  /** Loading state for async operations */
  loading: boolean;
  
  /** Error state for displaying error messages */
  error: string | null;
  
  /** UI state for various interface elements */
  ui: UIState;
}

/**
 * UI-specific state interface
 * Manages various UI states and preferences
 */
export interface UIState {
  /** Whether the add todo form is visible/expanded */
  showAddForm: boolean;
  
  /** ID of todo being edited, null if none */
  editingTodoId: string | null;
  
  /** Search/filter text input */
  searchText: string;
  
  /** Whether sidebar/filters panel is open (mobile) */
  sidebarOpen: boolean;
  
  /** Current theme preference */
  theme: Theme;
  
  /** Whether compact view is enabled */
  compactView: boolean;
}

/**
 * Theme options for the application
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Action types for state management
 * Defines all possible state mutations
 */
export type AppAction =
  | { type: 'ADD_TODO'; payload: CreateTodoInput }
  | { type: 'UPDATE_TODO'; payload: UpdateTodoInput }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'MARK_ALL_COMPLETE' }
  | { type: 'SET_FILTER'; payload: { filter: TodoFilter } }
  | { type: 'SET_SORT'; payload: { sort: TodoSort } }
  | { type: 'SET_SEARCH_TEXT'; payload: { searchText: string } }
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } }
  | { type: 'TOGGLE_ADD_FORM' }
  | { type: 'SET_EDITING_TODO'; payload: { id: string | null } }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_THEME'; payload: { theme: Theme } }
  | { type: 'TOGGLE_COMPACT_VIEW' }
  | { type: 'CLEAR_ALL_COMPLETED' }
  | { type: 'LOAD_TODOS'; payload: { todos: Todo[] } };

// Re-export todo types for convenience
export type {
  Todo,
  TodoPriority,
  TodoFilter,
  TodoSort,
  CreateTodoInput,
  UpdateTodoInput,
  TodoStats,
} from './todo';