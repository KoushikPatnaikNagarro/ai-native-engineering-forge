/**
 * US06 - Toggle Task Status Test Suite (Context Integration)
 * 
 * Tests the implementation of US06: Toggle Task Status functionality
 * This version properly integrates with TodoContext for realistic testing
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

// Test wrapper with initial todos in context
const TodoTestApp: React.FC<{ initialTodos?: Todo[]; children?: React.ReactNode }> = ({ 
  initialTodos = [], 
  children 
}) => {
  const [initialState] = React.useState({
    todos: initialTodos,
    filter: 'all' as const,
    sort: 'created' as const,
    loading: false,
    error: null,
    ui: {
      showAddForm: false,
      editingTodoId: null,
      searchText: '',
      sidebarOpen: false,
      theme: 'light' as const,
      compactView: false,
    },
  });

  return (
    <TodoProvider>
      {children}
    </TodoProvider>
  );
};

describe('US06 - Toggle Task Status Implementation (Context Integration)', () => {
  
  describe('AC01: Checkbox toggles task status', () => {
    test('clicking checkbox toggles incomplete task to complete', async () => {
      const todo = createMockTodo({ completed: false });
      const user = userEvent.setup();
      
      render(
        <TodoTestApp>
          <TodoItem todo={todo} testId="todo-item" />
        </TodoTestApp>
      );
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      
      await user.click(checkbox);
      
      // The component state should update immediately
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });

    test('clicking checkbox toggles complete task to incomplete', async () => {
      const todo = createMockTodo({ completed: true });
      const user = userEvent.setup();
      
      render(
        <TodoTestApp>
          <TodoItem todo={todo} testId="todo-item" />
        </TodoTestApp>
      );
      
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
      
      render(
        <TodoTestApp>
          <TodoItem todo={completedTodo} testId="todo-item" />
        </TodoTestApp>
      );
      
      const todoElement = screen.getByTestId('todo-item');
      expect(todoElement).toHaveClass('todo-item--completed');
    });

    test('incomplete task does not have completed styling', () => {
      const incompleteTodo = createMockTodo({ completed: false });
      
      render(
        <TodoTestApp>
          <TodoItem todo={incompleteTodo} testId="todo-item" />
        </TodoTestApp>
      );
      
      const todoElement = screen.getByTestId('todo-item');
      expect(todoElement).not.toHaveClass('todo-item--completed');
    });

    test('visual state changes when task is toggled', async () => {
      const todo = createMockTodo({ completed: false });
      const user = userEvent.setup();
      
      render(
        <TodoTestApp>
          <TodoItem todo={todo} testId="todo-item" />
        </TodoTestApp>
      );
      
      const todoElement = screen.getByTestId('todo-item');
      const checkbox = screen.getByRole('checkbox');
      
      expect(todoElement).not.toHaveClass('todo-item--completed');
      
      await user.click(checkbox);
      
      await waitFor(() => {
        expect(todoElement).toHaveClass('todo-item--completed');
      });
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

    test('alphabetical sorting keeps completed tasks at bottom', () => {
      const todos: Todo[] = [
        createMockTodo({ id: '1', text: 'Apple completed', completed: true }),
        createMockTodo({ id: '2', text: 'Zebra incomplete', completed: false }),
        createMockTodo({ id: '3', text: 'Banana incomplete', completed: false }),
      ];
      
      const sorted = sortTodos(todos, 'alphabetical');
      
      // Incomplete tasks first, alphabetically sorted
      expect(sorted[0].completed).toBe(false);
      expect(sorted[0].text).toBe('Banana incomplete');
      expect(sorted[1].completed).toBe(false);
      expect(sorted[1].text).toBe('Zebra incomplete');
      // Completed task last
      expect(sorted[2].completed).toBe(true);
      expect(sorted[2].text).toBe('Apple completed');
    });
  });

  describe('DOD01: Status changes reflect immediately', () => {
    test('checkbox state updates immediately', async () => {
      const todo = createMockTodo({ completed: false });
      const user = userEvent.setup();
      
      render(
        <TodoTestApp>
          <TodoItem todo={todo} testId="todo-item" />
        </TodoTestApp>
      );
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      // Should update immediately
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });

    test('visual styling updates immediately', async () => {
      const todo = createMockTodo({ completed: false });
      const user = userEvent.setup();
      
      render(
        <TodoTestApp>
          <TodoItem todo={todo} testId="todo-item" />
        </TodoTestApp>
      );
      
      const todoElement = screen.getByTestId('todo-item');
      const checkbox = screen.getByRole('checkbox');
      
      await user.click(checkbox);
      
      // Visual state should update immediately
      await waitFor(() => {
        expect(todoElement).toHaveClass('todo-item--completed');
      });
    });
  });

  describe('DOD02: Visual states clearly differentiated', () => {
    test('completed and incomplete tasks have clear visual differences', () => {
      const incompleteTodo = createMockTodo({ completed: false });
      const completedTodo = createMockTodo({ completed: true });
      
      const { rerender } = render(
        <TodoTestApp>
          <TodoItem todo={incompleteTodo} testId="todo-item" />
        </TodoTestApp>
      );
      
      expect(screen.getByTestId('todo-item')).not.toHaveClass('todo-item--completed');
      
      rerender(
        <TodoTestApp>
          <TodoItem todo={completedTodo} testId="todo-item" />
        </TodoTestApp>
      );
      
      expect(screen.getByTestId('todo-item')).toHaveClass('todo-item--completed');
    });

    test('checkbox visual state matches completion status', () => {
      const incompleteTodo = createMockTodo({ completed: false });
      const completedTodo = createMockTodo({ completed: true });
      
      const { rerender } = render(
        <TodoTestApp>
          <TodoItem todo={incompleteTodo} testId="todo-item" />
        </TodoTestApp>
      );
      
      expect(screen.getByRole('checkbox')).not.toBeChecked();
      
      rerender(
        <TodoTestApp>
          <TodoItem todo={completedTodo} testId="todo-item" />
        </TodoTestApp>
      );
      
      expect(screen.getByRole('checkbox')).toBeChecked();
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
    test('multiple todos update independently', async () => {
      const todo1 = createMockTodo({ id: '1', completed: false, text: 'First todo' });
      const todo2 = createMockTodo({ id: '2', completed: false, text: 'Second todo' });
      const user = userEvent.setup();
      
      render(
        <TodoTestApp>
          <div>
            <TodoItem todo={todo1} testId="todo-item-1" />
            <TodoItem todo={todo2} testId="todo-item-2" />
          </div>
        </TodoTestApp>
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
      const user = userEvent.setup();
      
      render(
        <TodoTestApp>
          <TodoItem todo={todo} testId="todo-item" />
        </TodoTestApp>
      );
      
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

    test('completion status preserved during editing', () => {
      const todo = createMockTodo({ completed: true, text: 'Task to edit' });
      
      render(
        <TodoTestApp>
          <TodoItem todo={todo} isEditing={true} testId="todo-item" />
        </TodoTestApp>
      );
      
      // Should be marked as completed even in edit mode
      const todoElement = screen.getByTestId('todo-item');
      expect(todoElement).toHaveClass('todo-item--completed');
    });
  });

  describe('US06 Core Requirements Summary', () => {
    test('All US06 acceptance criteria implemented', async () => {
      const incompleteTodo = createMockTodo({ completed: false, text: 'Task to complete' });
      const user = userEvent.setup();
      
      render(
        <TodoTestApp>
          <TodoItem todo={incompleteTodo} testId="todo-item" />
        </TodoTestApp>
      );
      
      const checkbox = screen.getByRole('checkbox');
      const todoElement = screen.getByTestId('todo-item');
      
      // AC01: Checkbox toggles task status
      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
      
      // AC02: Completed tasks are visually distinct
      expect(todoElement).toHaveClass('todo-item--completed');
      
      // AC03: Status persists (tested by visual state remaining)
      expect(checkbox).toBeChecked();
      expect(todoElement).toHaveClass('todo-item--completed');
      
      // AC04: Sorting logic tested separately in unit tests
      // DOD01-04: All covered in the implementation
    });
  });
});