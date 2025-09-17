export interface TodoItem {
  id: string;
  content: string;
  status: 'open' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoDto {
  content: string;
}

export interface UpdateTodoDto {
  id: string;
  content?: string;
  status?: 'open' | 'completed';
}

export type TodoFilter = 'all' | 'open' | 'completed';

export interface TodoStats {
  total: number;
  open: number;
  completed: number;
}