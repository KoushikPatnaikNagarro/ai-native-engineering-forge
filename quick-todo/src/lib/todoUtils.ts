import { Todo, TodoFilter, TodoSort, TodoStats } from '../types';

/**
 * Utility functions for working with todos
 * Provides pure functions for filtering, sorting, and analyzing todo data
 */

/**
 * Filter todos based on completion status and search text
 * 
 * @param todos - Array of todos to filter
 * @param filter - Filter type ('all', 'active', 'completed')
 * @param searchText - Optional search text to filter by
 * @returns Filtered array of todos
 */
export function filterTodos(
  todos: Todo[],
  filter: TodoFilter,
  searchText: string = ''
): Todo[] {
  let filtered = todos;

  // Filter by completion status
  switch (filter) {
    case 'active':
      filtered = todos.filter(todo => !todo.completed);
      break;
    case 'completed':
      filtered = todos.filter(todo => todo.completed);
      break;
    case 'all':
    default:
      // No filtering needed
      break;
  }

  // Filter by search text
  if (searchText.trim()) {
    const search = searchText.toLowerCase().trim();
    filtered = filtered.filter(todo =>
      todo.text.toLowerCase().includes(search) ||
      (todo.category && todo.category.toLowerCase().includes(search))
    );
  }

  return filtered;
}

/**
 * Sort todos based on the specified sort criteria
 * Completed tasks always appear at the bottom regardless of sort criteria (US06: AC04)
 * 
 * @param todos - Array of todos to sort
 * @param sort - Sort criteria
 * @returns Sorted array of todos
 */
export function sortTodos(todos: Todo[], sort: TodoSort): Todo[] {
  const sortedTodos = [...todos];

  // First, separate completed and incomplete todos
  const incompleteTodos = sortedTodos.filter(todo => !todo.completed);
  const completedTodos = sortedTodos.filter(todo => todo.completed);

  // Sort incomplete todos based on criteria
  let sortedIncomplete: Todo[];
  switch (sort) {
    case 'created':
      sortedIncomplete = incompleteTodos.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    
    case 'updated':
      sortedIncomplete = incompleteTodos.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      break;
    
    case 'priority':
      sortedIncomplete = incompleteTodos.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = a.priority ? priorityOrder[a.priority] : 0;
        const bPriority = b.priority ? priorityOrder[b.priority] : 0;
        
        // Sort by priority (high to low), then by creation date (newest first)
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      break;
    
    case 'alphabetical':
      sortedIncomplete = incompleteTodos.sort((a, b) => 
        a.text.toLowerCase().localeCompare(b.text.toLowerCase())
      );
      break;
    
    default:
      sortedIncomplete = incompleteTodos;
      break;
  }

  // Sort completed todos using the same criteria
  let sortedCompleted: Todo[];
  switch (sort) {
    case 'created':
      sortedCompleted = completedTodos.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    
    case 'updated':
      sortedCompleted = completedTodos.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      break;
    
    case 'priority':
      sortedCompleted = completedTodos.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = a.priority ? priorityOrder[a.priority] : 0;
        const bPriority = b.priority ? priorityOrder[b.priority] : 0;
        
        // Sort by priority (high to low), then by creation date (newest first)
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      break;
    
    case 'alphabetical':
      sortedCompleted = completedTodos.sort((a, b) => 
        a.text.toLowerCase().localeCompare(b.text.toLowerCase())
      );
      break;
    
    default:
      sortedCompleted = completedTodos;
      break;
  }

  // Return incomplete todos first, then completed todos (US06: AC04)
  return [...sortedIncomplete, ...sortedCompleted];
}

/**
 * Get filtered and sorted todos
 * 
 * @param todos - Array of todos
 * @param filter - Filter criteria
 * @param sort - Sort criteria
 * @param searchText - Search text
 * @returns Processed array of todos
 */
export function getProcessedTodos(
  todos: Todo[],
  filter: TodoFilter,
  sort: TodoSort,
  searchText: string = ''
): Todo[] {
  const filtered = filterTodos(todos, filter, searchText);
  return sortTodos(filtered, sort);
}

/**
 * Calculate statistics for the todo list
 * 
 * @param todos - Array of todos to analyze
 * @returns TodoStats object with various counts
 */
export function calculateTodoStats(todos: Todo[]): TodoStats {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const active = total - completed;

  const byPriority = todos.reduce(
    (acc, todo) => {
      if (todo.priority) {
        acc[todo.priority]++;
      }
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  return {
    total,
    completed,
    active,
    byPriority,
  };
}

/**
 * Get todos by category
 * 
 * @param todos - Array of todos
 * @returns Object with categories as keys and todo arrays as values
 */
export function getTodosByCategory(todos: Todo[]): Record<string, Todo[]> {
  return todos.reduce((acc, todo) => {
    const category = todo.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(todo);
    return acc;
  }, {} as Record<string, Todo[]>);
}

/**
 * Get unique categories from todos
 * 
 * @param todos - Array of todos
 * @returns Array of unique category names
 */
export function getUniqueCategories(todos: Todo[]): string[] {
  const categories = new Set<string>();
  
  todos.forEach(todo => {
    if (todo.category) {
      categories.add(todo.category);
    }
  });
  
  return Array.from(categories).sort();
}

/**
 * Validate todo text input
 * 
 * @param text - Todo text to validate
 * @returns Object with validation result and error message
 */
export function validateTodoText(text: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = text.trim();
  
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Todo text cannot be empty',
    };
  }
  
  if (trimmed.length > 500) {
    return {
      isValid: false,
      error: 'Todo text cannot exceed 500 characters',
    };
  }
  
  return { isValid: true };
}

/**
 * Generate a human-readable relative time string
 * 
 * @param date - Date to format
 * @returns Relative time string (e.g., "2 hours ago", "Yesterday")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }
  
  // For older dates, show the actual date
  return date.toLocaleDateString();
}