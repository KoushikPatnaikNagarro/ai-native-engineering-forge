/**
 * Todo application type definitions
 * Foundation types for the Quick Todo application
 */

// Task status enumeration
export type TaskStatus = 'open' | 'completed';

// Core task interface
export interface Task {
  id: string;
  text: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Filter options for task display
export type FilterType = 'all' | 'open' | 'completed';

// Task creation interface (without ID and timestamps)
export interface CreateTaskInput {
  text: string;
}

// Task update interface
export interface UpdateTaskInput {
  id: string;
  text?: string;
  status?: TaskStatus;
}

// Application state interface
export interface AppState {
  tasks: Task[];
  filter: FilterType;
  isLoading: boolean;
  error: string | null;
}

// Component prop types
export interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete?: (id: string) => void;
}

export interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete?: (id: string) => void;
}

export interface TaskInputProps {
  onAdd: (text: string) => void;
  placeholder?: string;
}

export interface FilterControlsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    open: number;
    completed: number;
  };
}

// Hook return types
export interface UseTasks {
  tasks: Task[];
  filteredTasks: Task[];
  filter: FilterType;
  addTask: (text: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setFilter: (filter: FilterType) => void;
  clearCompleted: () => void;
  markAllCompleted: () => void;
  getTaskCounts: () => { all: number; open: number; completed: number };
}
