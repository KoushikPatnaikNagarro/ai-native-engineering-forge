/**
 * US06 - Toggle Task Status Test Suite (Fixed)
 * 
 * Tests the implementation of US06: Toggle Task Status functionality
 * Fixed version that works with the actual component structure
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoProvider } from '../src/lib/TodoContext';
import { TodoItem } from '../src/components/todo/TodoItem';
import { Todo } from '../src/types';
import { sortTodos } from '../src/lib/todoUtils';

// Mock crypto.randomUUID for tests
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => Math.random().toString(36).substring(2, 15),
  },
});

// Test wrapper component with TodoProvider
const TodoTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TodoProvider>
    {children}
  </TodoProvider>
);

// Helper to create mock todos
const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: Math.random().toString(36).substring(2, 15),
  text: 'Test todo item',
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  priority: 'medium',
  ...overrides,
});

// Individual TodoItem test wrapper
const renderTodoItem = (todo: Todo, isEditing: boolean = false) => {
  const user = userEvent.setup();
  render(
    <TodoTestWrapper>
      <TodoItem todo={todo} isEditing={isEditing} testId="todo-item" />
    </TodoTestWrapper>
  );
  return { user };
};

describe('US06 - Toggle Task Status Implementation (Fixed)', () => {
  
  describe('AC01: Checkbox toggles task status', () => {
    test('clicking checkbox toggles incomplete task to complete', async () => {
      const todo = createMockTodo({ completed: false });
      const { user } = renderTodoItem(todo);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      
      await user.click(checkbox);
      
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });

    test('clicking checkbox toggles complete task to incomplete', async () => {
      const todo = createMockTodo({ completed: true });
      const { user } = renderTodoItem(todo);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
      
      await user.click(checkbox);
      
      await waitFor(() => {
        expect(checkbox).not.toBeChecked();
      });
    });
  });

  describe('AC02: Completed tasks visually distinct', () => {
    test('completed task has distinct visual styling', () => {
      const completedTodo = createMockTodo({ completed: true });
      renderTodoItem(completedTodo);
      
      const todoElement = screen.getByTestId('todo-item');
      expect(todoElement).toHaveClass('todo-item--completed');
    });

    test('incomplete task does not have completed styling', () => {
      const incompleteTodo = createMockTodo({ completed: false });
      renderTodoItem(incompleteTodo);
      
      const todoElement = screen.getByTestId('todo-item');
      expect(todoElement).not.toHaveClass('todo-item--completed');
    });
  });

  describe('AC03: Status persists during session', () => {
    test('completed status persists after component re-render', async () => {
      const todo = createMockTodo({ completed: false });
      const user = userEvent.setup();
      const { rerender } = render(
        <TodoTestWrapper>
          <TodoItem todo={todo} testId="todo-item" />
        </TodoTestWrapper>
      );
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
      
      // Simulate re-render with updated todo
      const updatedTodo = { ...todo, completed: true };
      rerender(
        <TodoTestWrapper>
          <TodoItem todo={updatedTodo} testId="todo-item" />
        </TodoTestWrapper>
      );
      
      expect(screen.getByRole('checkbox')).toBeChecked();
      expect(screen.getByTestId('todo-item')).toHaveClass('todo-item--completed');
    });
  });

  describe('AC04: Completed tasks move to bottom', () => {
    test('sortTodos function puts completed tasks at bottom', () => {
      const todos: Todo[] = [
        createMockTodo({ id: '1', text: 'First task', completed: true }),
        createMockTodo({ id: '2', text: 'Second task', completed: false }),
        createMockTodo({ id: '3', text: 'Third task', completed: false }),
        createMockTodo({ id: '4', text: 'Fourth task', completed: true }),
      ];
      
      const sorted = sortTodos(todos, 'created');
      
      // Check that incomplete tasks come first
      expect(sorted[0].completed).toBe(false);
      expect(sorted[1].completed).toBe(false);
      expect(sorted[2].completed).toBe(true);
      expect(sorted[3].completed).toBe(true);
    });

    test('sorting by priority still keeps completed tasks at bottom', () => {
      const todos: Todo[] = [
        createMockTodo({ id: '1', text: 'High priority completed', completed: true, priority: 'high' }),
        createMockTodo({ id: '2', text: 'Low priority incomplete', completed: false, priority: 'low' }),
        createMockTodo({ id: '3', text: 'Medium priority incomplete', completed: false, priority: 'medium' }),
        createMockTodo({ id: '4', text: 'High priority incomplete', completed: false, priority: 'high' }),
      ];
      
      const sorted = sortTodos(todos, 'priority');
      
      // All incomplete tasks should come first, sorted by priority
      expect(sorted[0].completed).toBe(false);
      expect(sorted[0].priority).toBe('high');
      expect(sorted[1].completed).toBe(false);
      expect(sorted[2].completed).toBe(false);
      // Completed task should be last regardless of priority
      expect(sorted[3].completed).toBe(true);
      expect(sorted[3].priority).toBe('high');
    });
  });

  describe('DOD01: Status changes reflect immediately', () => {
    test('checkbox state updates without delay', async () => {
      const todo = createMockTodo({ completed: false });
      const { user } = renderTodoItem(todo);
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      // Should update immediately without waiting
      expect(checkbox).toBeChecked();
    });

    test('visual styling updates immediately', async () => {
      const todo = createMockTodo({ completed: false });
      const { user } = renderTodoItem(todo);
      
      const todoElement = screen.getByTestId('todo-item');
      const checkbox = screen.getByRole('checkbox');
      
      await user.click(checkbox);
      
      // Visual state should update immediately
      expect(todoElement).toHaveClass('todo-item--completed');
    });
  });

  describe('DOD02: Visual states clearly differentiated', () => {
    test('completed and incomplete tasks have clear visual differences', () => {
      const incompleteTodo = createMockTodo({ completed: false });
      const { rerender } = render(
        <TodoTestWrapper>
          <TodoItem todo={incompleteTodo} testId="incomplete-todo" />
        </TodoTestWrapper>
      );
      
      const incompleteElement = screen.getByTestId('incomplete-todo');
      expect(incompleteElement).not.toHaveClass('todo-item--completed');
      
      const completedTodo = createMockTodo({ completed: true });
      rerender(
        <TodoTestWrapper>
          <TodoItem todo={completedTodo} testId="completed-todo" />
        </TodoTestWrapper>
      );
      
      const completedElement = screen.getByTestId('completed-todo');
      expect(completedElement).toHaveClass('todo-item--completed');
    });
  });

  describe('DOD03: Sorting logic implemented correctly', () => {
    test('sorting maintains completed tasks at bottom across all sort types', () => {
      const todos: Todo[] = [
        createMockTodo({ id: '1', text: 'A completed', completed: true, priority: 'high' }),
        createMockTodo({ id: '2', text: 'B incomplete', completed: false, priority: 'low' }),
        createMockTodo({ id: '3', text: 'C completed', completed: true, priority: 'medium' }),
        createMockTodo({ id: '4', text: 'D incomplete', completed: false, priority: 'high' }),
      ];
      
      // Test all sort types
      const sortTypes = ['created', 'alphabetical', 'priority'] as const;
      
      sortTypes.forEach(sortType => {
        const sorted = sortTodos(todos, sortType);
        
        // Find the first completed task
        const firstCompletedIndex = sorted.findIndex(todo => todo.completed);
        
        // All tasks before first completed should be incomplete
        for (let i = 0; i < firstCompletedIndex; i++) {
          expect(sorted[i].completed).toBe(false);
        }
        
        // All tasks from first completed onward should be completed
        for (let i = firstCompletedIndex; i < sorted.length; i++) {
          expect(sorted[i].completed).toBe(true);
        }
      });
    });
  });

  describe('DOD04: State management tested', () => {
    test('context state updates correctly on toggle', async () => {
      const todo = createMockTodo({ completed: false });
      const { user } = renderTodoItem(todo);
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      await waitFor(() => {
        expect(checkbox).toBeChecked();
        expect(screen.getByTestId('todo-item')).toHaveClass('todo-item--completed');
      });
    });

    test('multiple todos in same context update independently', async () => {
      const user = userEvent.setup();
      const todo1 = createMockTodo({ id: '1', completed: false });
      const todo2 = createMockTodo({ id: '2', completed: false });
      
      render(
        <TodoTestWrapper>
          <TodoItem todo={todo1} testId="todo-item-1" />
          <TodoItem todo={todo2} testId="todo-item-2" />
        </TodoTestWrapper>
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      
      // Toggle first todo
      await user.click(checkboxes[0]);
      
      await waitFor(() => {
        expect(checkboxes[0]).toBeChecked();
        expect(checkboxes[1]).not.toBeChecked();
      });
    });
  });

  describe('Integration with existing functionality', () => {
    test('toggle status works alongside edit functionality', async () => {
      const todo = createMockTodo({ completed: false, text: 'Editable task' });
      const { user } = renderTodoItem(todo);
      
      // Toggle completion first
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      await waitFor(() => {
        expect(checkbox).toBeChecked();
        expect(screen.getByTestId('todo-item')).toHaveClass('todo-item--completed');
      });
      
      // Verify task is still there and editable via edit button
      expect(screen.getByText('Editable task')).toBeInTheDocument();
      expect(screen.getByLabelText(/edit.*editable task/i)).toBeInTheDocument();
    });

    test('completion status preserved during editing', async () => {
      const todo = createMockTodo({ completed: true, text: 'Task to edit' });
      renderTodoItem(todo, true); // Start in edit mode
      
      // Should be marked as completed even in edit mode
      const todoElement = screen.getByTestId('todo-item');
      expect(todoElement).toHaveClass('todo-item--completed');
    });
  });
});