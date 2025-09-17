import { TodoItem, CreateTodoDto, UpdateTodoDto } from '@/types/todo';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'todo-app-tasks';

export class TodoService {
  /**
   * Get all todos from session storage
   */
  static getTodos(): TodoItem[] {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const todos = JSON.parse(stored);
      // Convert date strings back to Date objects
      return todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading todos from session storage:', error);
      return [];
    }
  }

  /**
   * Save todos to session storage
   */
  static saveTodos(todos: TodoItem[]): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to session storage:', error);
    }
  }

  /**
   * Create a new todo
   */
  static createTodo(dto: CreateTodoDto): TodoItem {
    const newTodo: TodoItem = {
      id: uuidv4(),
      content: dto.content.trim(),
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const todos = this.getTodos();
    todos.push(newTodo);
    this.saveTodos(todos);

    return newTodo;
  }

  /**
   * Update an existing todo
   */
  static updateTodo(dto: UpdateTodoDto): TodoItem | null {
    const todos = this.getTodos();
    const todoIndex = todos.findIndex(todo => todo.id === dto.id);

    if (todoIndex === -1) {
      return null;
    }

    const updatedTodo: TodoItem = {
      ...todos[todoIndex],
      ...dto,
      updatedAt: new Date(),
    };

    todos[todoIndex] = updatedTodo;
    this.saveTodos(todos);

    return updatedTodo;
  }

  /**
   * Delete a todo by ID
   */
  static deleteTodo(id: string): boolean {
    const todos = this.getTodos();
    const filteredTodos = todos.filter(todo => todo.id !== id);

    if (filteredTodos.length === todos.length) {
      return false; // Todo not found
    }

    this.saveTodos(filteredTodos);
    return true;
  }

  /**
   * Toggle todo status between open and completed
   */
  static toggleTodoStatus(id: string): TodoItem | null {
    const todos = this.getTodos();
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return null;
    }

    const newStatus = todo.status === 'open' ? 'completed' : 'open';
    return this.updateTodo({ id, status: newStatus });
  }

  /**
   * Mark multiple todos as completed
   */
  static markMultipleCompleted(ids: string[]): TodoItem[] {
    const todos = this.getTodos();
    const updatedTodos: TodoItem[] = [];

    const newTodos = todos.map(todo => {
      if (ids.includes(todo.id) && todo.status === 'open') {
        const updated = { ...todo, status: 'completed' as const, updatedAt: new Date() };
        updatedTodos.push(updated);
        return updated;
      }
      return todo;
    });

    this.saveTodos(newTodos);
    return updatedTodos;
  }

  /**
   * Delete all completed todos
   */
  static clearCompleted(): number {
    const todos = this.getTodos();
    const completedCount = todos.filter(todo => todo.status === 'completed').length;
    const openTodos = todos.filter(todo => todo.status === 'open');
    
    this.saveTodos(openTodos);
    return completedCount;
  }

  /**
   * Clear all todos (for testing or reset)
   */
  static clearAll(): void {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}