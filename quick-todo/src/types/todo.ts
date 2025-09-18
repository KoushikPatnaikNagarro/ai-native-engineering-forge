/**
 * Core todo item interface
 * Represents a single todo task with all its properties
 */
export interface Todo {
  /** Unique identifier for the todo item */
  id: string;
  
  /** The main text content of the todo */
  text: string;
  
  /** Whether the todo is completed or not */
  completed: boolean;
  
  /** Timestamp when the todo was created */
  createdAt: Date;
  
  /** Timestamp when the todo was last updated */
  updatedAt: Date;
  
  /** Optional priority level for the todo */
  priority?: TodoPriority;
  
  /** Optional category/tag for organizing todos */
  category?: string;
}

/**
 * Priority levels for todo items
 */
export type TodoPriority = 'low' | 'medium' | 'high';

/**
 * Filter options for displaying todos
 */
export type TodoFilter = 'all' | 'active' | 'completed';

/**
 * Sort options for todo list
 */
export type TodoSort = 'created' | 'updated' | 'priority' | 'alphabetical';

/**
 * Input data for creating a new todo
 * Omits auto-generated fields like id and timestamps
 */
export interface CreateTodoInput {
  text: string;
  priority?: TodoPriority;
  category?: string;
}

/**
 * Input data for updating an existing todo
 * All fields except id are optional
 */
export interface UpdateTodoInput {
  id: string;
  text?: string;
  completed?: boolean;
  priority?: TodoPriority;
  category?: string;
}

/**
 * Statistics about the todo list
 */
export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
}