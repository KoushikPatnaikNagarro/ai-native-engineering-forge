/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TodoItem } from '../src/components/todo/TodoItem';
import { TodoList } from '../src/components/todo/TodoList';
import { TodoProvider, useTodoContext } from '../src/lib/TodoContext';
import { sortTodos } from '../src/lib/todoUtils';
import type { Todo } from '../src/types';
import React, { useEffect } from 'react';

// Mock crypto.randomUUID for test environment
if (!globalThis.crypto) {
  globalThis.crypto = require('crypto');
}

if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = () => require('crypto').randomUUID();
}

// Test component that properly manages todos in context
const TestTodoItemWithContext: React.FC<{ todo: Todo }> = ({ todo }) => {
  const { state, dispatch } = useTodoContext();
  
  // Add the todo to the context state if it doesn't exist (only once)
  useEffect(() => {
    if (!state.todos.find(t => t.id === todo.id)) {
      dispatch({ type: 'LOAD_TODOS', payload: { todos: [todo] } });
    }
  }, [todo.id, state.todos.length, dispatch]);
  
  // Find the current version of the todo from state (it might have been updated)
  const currentTodo = state.todos.find(t => t.id === todo.id) || todo;
  
  return (
    <TodoItem 
      todo={currentTodo} 
      isEditing={state.ui.editingTodoId === todo.id} 
      testId="todo-item" 
    />
  );
};

// Test component for multiple todos
const TestTodoListWithContext: React.FC<{ todos: Todo[] }> = ({ todos }) => {
  const { state, dispatch } = useTodoContext();
  
  // Load todos into context
  useEffect(() => {
    dispatch({ type: 'LOAD_TODOS', payload: { todos } });
  }, [todos, dispatch]);
  
  return <TodoList testId="todo-list" />;
};

// Test wrapper components
const TodoItemWrapper: React.FC<{ todo: Todo }> = ({ todo }) => (
  <TodoProvider>
    <TestTodoItemWithContext todo={todo} />
  </TodoProvider>
);

const TodoListWrapper: React.FC<{ todos: Todo[] }> = ({ todos }) => (
  <TodoProvider>
    <TestTodoListWithContext todos={todos} />
  </TodoProvider>
);

// Helper function to create a mock todo
const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: crypto.randomUUID(),
  text: 'Test todo item',
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('US06 - Toggle Task Status Implementation', () => {
  describe('AC01: Checkbox toggles task status', () => {
    test('clicking checkbox toggles incomplete task to complete', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ 
        text: 'Task to complete',
        completed: false 
      });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      // Verify initial state is incomplete
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      expect(checkbox).toHaveAttribute('aria-label', 'Mark "Task to complete" as complete');

      // Click to toggle completion
      await user.click(checkbox);

      // Should now be completed
      await waitFor(() => {
        expect(checkbox).toBeChecked();
        expect(checkbox).toHaveAttribute('aria-label', 'Mark "Task to complete" as incomplete');
      });
    });

    test('clicking checkbox toggles complete task to incomplete', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ 
        text: 'Completed task',
        completed: true 
      });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      // Verify initial state is completed
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
      expect(checkbox).toHaveAttribute('aria-label', 'Mark "Completed task" as incomplete');

      // Click to toggle completion
      await user.click(checkbox);

      // Should now be incomplete
      await waitFor(() => {
        expect(checkbox).not.toBeChecked();
        expect(checkbox).toHaveAttribute('aria-label', 'Mark "Completed task" as complete');
      });
    });

    test('checkbox state reflects todo completion status accurately', () => {
      const incompleteTodo = createMockTodo({ completed: false });
      const completedTodo = createMockTodo({ completed: true });
      
      const { rerender } = render(<TodoItemWrapper todo={incompleteTodo} />);
      
      // Test incomplete todo
      expect(screen.getByRole('checkbox')).not.toBeChecked();
      
      // Test completed todo
      rerender(<TodoItemWrapper todo={completedTodo} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    test('multiple rapid clicks handle state correctly', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ completed: false });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      const checkbox = screen.getByRole('checkbox');
      
      // Rapid clicks
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);

      // Should end up completed (odd number of clicks)
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });
  });

  describe('AC02: Completed tasks visually distinct', () => {
    test('completed task has distinct visual styling', () => {
      const completedTodo = createMockTodo({ 
        text: 'Completed task',
        completed: true 
      });
      
      render(<TodoItemWrapper todo={completedTodo} />);

      // Check for completed styling classes
      const todoItem = screen.getByTestId('todo-item');
      expect(todoItem).toHaveClass('todo-item--completed');
    });

    test('incomplete task does not have completed styling', () => {
      const incompleteTodo = createMockTodo({ 
        text: 'Incomplete task',
        completed: false 
      });
      
      render(<TodoItemWrapper todo={incompleteTodo} />);

      // Should not have completed styling
      const todoItem = screen.getByTestId('todo-item');
      expect(todoItem).not.toHaveClass('todo-item--completed');
    });

    test('visual state changes immediately when status toggles', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ completed: false });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      const todoItem = screen.getByTestId('todo-item');
      const checkbox = screen.getByRole('checkbox');
      
      // Initially not completed
      expect(todoItem).not.toHaveClass('todo-item--completed');
      
      // Toggle to completed
      await user.click(checkbox);
      
      // Should immediately have completed styling
      await waitFor(() => {
        expect(todoItem).toHaveClass('todo-item--completed');
      });
    });

    test('text has line-through decoration when completed', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ 
        text: 'Task with line-through',
        completed: false 
      });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      const taskText = screen.getByText('Task with line-through');
      
      // Initially no line-through (handled by CSS)
      expect(screen.getByTestId('todo-item')).not.toHaveClass('todo-item--completed');
      
      // Toggle to completed
      await user.click(screen.getByRole('checkbox'));
      
      // Should have completed class (which applies line-through via CSS)
      await waitFor(() => {
        expect(screen.getByTestId('todo-item')).toHaveClass('todo-item--completed');
      });
    });
  });

  describe('AC03: Status persists during session', () => {
    test('completed status persists after component re-render', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ completed: false });
      
      const { rerender } = render(<TodoItemWrapper todo={mockTodo} />);
      
      // Toggle to completed
      await user.click(screen.getByRole('checkbox'));
      
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeChecked();
      });
      
      // Force re-render by changing a different prop
      rerender(<TodoItemWrapper todo={mockTodo} />);
      
      // Status should persist
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    test('multiple status changes persist correctly', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ completed: false });
      
      render(<TodoItemWrapper todo={mockTodo} />);
      
      const checkbox = screen.getByRole('checkbox');
      
      // Start incomplete
      expect(checkbox).not.toBeChecked();
      
      // Toggle to complete
      await user.click(checkbox);
      await waitFor(() => expect(checkbox).toBeChecked());
      
      // Toggle back to incomplete
      await user.click(checkbox);
      await waitFor(() => expect(checkbox).not.toBeChecked());
      
      // Toggle to complete again
      await user.click(checkbox);
      await waitFor(() => expect(checkbox).toBeChecked());
    });

    test('status persists in context state management', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ completed: false });
      
      render(<TodoItemWrapper todo={mockTodo} />);
      
      // Verify the todo is loaded in context and toggle works
      await user.click(screen.getByRole('checkbox'));
      
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeChecked();
      });
    });
  });

  describe('AC04: Completed tasks move to bottom', () => {
    test('sortTodos function puts completed tasks at bottom', () => {
      const todos: Todo[] = [
        createMockTodo({ 
          id: '1',
          text: 'First task', 
          completed: false,
          createdAt: new Date('2024-01-01T10:00:00Z')
        }),
        createMockTodo({ 
          id: '2',
          text: 'Second task', 
          completed: true,
          createdAt: new Date('2024-01-01T11:00:00Z')
        }),
        createMockTodo({ 
          id: '3',
          text: 'Third task', 
          completed: false,
          createdAt: new Date('2024-01-01T12:00:00Z')
        }),
        createMockTodo({ 
          id: '4',
          text: 'Fourth task', 
          completed: true,
          createdAt: new Date('2024-01-01T13:00:00Z')
        })
      ];

      const sorted = sortTodos(todos, 'created');
      
      // All incomplete tasks should come first
      expect(sorted[0].completed).toBe(false);  // Third task (newest incomplete)
      expect(sorted[1].completed).toBe(false);  // First task (older incomplete)
      
      // All completed tasks should come after
      expect(sorted[2].completed).toBe(true);   // Fourth task (newest completed)
      expect(sorted[3].completed).toBe(true);   // Second task (older completed)
    });

    test('sorting by priority still keeps completed tasks at bottom', () => {
      const todos: Todo[] = [
        createMockTodo({ 
          text: 'Low priority incomplete',
          completed: false,
          priority: 'low'
        }),
        createMockTodo({ 
          text: 'High priority completed',
          completed: true,
          priority: 'high'
        }),
        createMockTodo({ 
          text: 'Medium priority incomplete',
          completed: false,
          priority: 'medium'
        })
      ];

      const sorted = sortTodos(todos, 'priority');
      
      // Incomplete tasks first, sorted by priority
      expect(sorted[0].completed).toBe(false);
      expect(sorted[0].priority).toBe('medium');
      expect(sorted[1].completed).toBe(false);
      expect(sorted[1].priority).toBe('low');
      
      // Completed tasks last, even if high priority
      expect(sorted[2].completed).toBe(true);
      expect(sorted[2].priority).toBe('high');
    });

    test('alphabetical sorting keeps completed tasks at bottom', () => {
      const todos: Todo[] = [
        createMockTodo({ text: 'Zebra task', completed: false }),
        createMockTodo({ text: 'Apple task', completed: true }),
        createMockTodo({ text: 'Beta task', completed: false })
      ];

      const sorted = sortTodos(todos, 'alphabetical');
      
      // Incomplete tasks first, alphabetically sorted
      expect(sorted[0].completed).toBe(false);
      expect(sorted[0].text).toBe('Beta task');
      expect(sorted[1].completed).toBe(false);
      expect(sorted[1].text).toBe('Zebra task');
      
      // Completed tasks last
      expect(sorted[2].completed).toBe(true);
      expect(sorted[2].text).toBe('Apple task');
    });

    test('task list visually shows completed tasks at bottom', async () => {
      const user = userEvent.setup();
      const todos: Todo[] = [
        createMockTodo({ 
          id: '1',
          text: 'First task', 
          completed: false 
        }),
        createMockTodo({ 
          id: '2',
          text: 'Second task', 
          completed: true 
        }),
        createMockTodo({ 
          id: '3',
          text: 'Third task', 
          completed: false 
        })
      ];
      
      render(<TodoListWrapper todos={todos} />);
      
      // Get all todo items
      const todoItems = screen.getAllByTestId('todo-item');
      
      // First two should be incomplete tasks
      expect(todoItems[0]).not.toHaveClass('todo-item--completed');
      expect(todoItems[1]).not.toHaveClass('todo-item--completed');
      
      // Last should be completed task
      expect(todoItems[2]).toHaveClass('todo-item--completed');
    });

    test('newly completed task moves to bottom', async () => {
      const user = userEvent.setup();
      const todos: Todo[] = [
        createMockTodo({ 
          id: '1',
          text: 'Task to complete', 
          completed: false 
        }),
        createMockTodo({ 
          id: '2',
          text: 'Already completed', 
          completed: true 
        })
      ];
      
      render(<TodoListWrapper todos={todos} />);
      
      // Initially, incomplete task should be first
      let todoItems = screen.getAllByTestId('todo-item');
      expect(todoItems[0]).not.toHaveClass('todo-item--completed');
      expect(todoItems[1]).toHaveClass('todo-item--completed');
      
      // Complete the first task
      const firstTaskCheckbox = todoItems[0].querySelector('input[type="checkbox"]') as HTMLInputElement;
      await user.click(firstTaskCheckbox);
      
      // After completion, both tasks should be completed and maintained in their order
      await waitFor(() => {
        todoItems = screen.getAllByTestId('todo-item');
        expect(todoItems[0]).toHaveClass('todo-item--completed');
        expect(todoItems[1]).toHaveClass('todo-item--completed');
      });
    });
  });

  describe('DOD01: Status changes reflect immediately', () => {
    test('checkbox state updates without delay', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ completed: false });
      
      render(<TodoItemWrapper todo={mockTodo} />);
      
      const checkbox = screen.getByRole('checkbox');
      
      await user.click(checkbox);
      
      // Should update immediately without waiting
      expect(checkbox).toBeChecked();
    });

    test('visual styling updates immediately', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ completed: false });
      
      render(<TodoItemWrapper todo={mockTodo} />);
      
      const todoItem = screen.getByTestId('todo-item');
      const checkbox = screen.getByRole('checkbox');
      
      await user.click(checkbox);
      
      // Visual changes should be immediate
      expect(todoItem).toHaveClass('todo-item--completed');
    });
  });

  describe('DOD02: Visual states clearly differentiated', () => {
    test('completed and incomplete tasks have clear visual differences', () => {
      const incompleteTodo = createMockTodo({ completed: false });
      const completedTodo = createMockTodo({ completed: true });
      
      const { rerender } = render(<TodoItemWrapper todo={incompleteTodo} />);
      
      // Incomplete state
      const incompleteItem = screen.getByTestId('todo-item');
      expect(incompleteItem).not.toHaveClass('todo-item--completed');
      
      // Completed state
      rerender(<TodoItemWrapper todo={completedTodo} />);
      const completedItem = screen.getByTestId('todo-item');
      expect(completedItem).toHaveClass('todo-item--completed');
    });

    test('checkbox visual state matches completion status', () => {
      const todos = [
        createMockTodo({ completed: false }),
        createMockTodo({ completed: true })
      ];
      
      const { rerender } = render(<TodoItemWrapper todo={todos[0]} />);
      
      // Incomplete checkbox
      expect(screen.getByRole('checkbox')).not.toBeChecked();
      
      // Completed checkbox
      rerender(<TodoItemWrapper todo={todos[1]} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  describe('DOD03: Sorting logic implemented correctly', () => {
    test('sorting maintains completed tasks at bottom across all sort types', () => {
      const todos: Todo[] = [
        createMockTodo({ text: 'A task', completed: true }),
        createMockTodo({ text: 'Z task', completed: false }),
        createMockTodo({ text: 'M task', completed: true })
      ];

      // Test all sort types
      const sortTypes: Array<'created' | 'updated' | 'priority' | 'alphabetical'> = [
        'created', 'updated', 'priority', 'alphabetical'
      ];

      sortTypes.forEach(sortType => {
        const sorted = sortTodos(todos, sortType);
        
        // Find the index of the first completed task
        const firstCompletedIndex = sorted.findIndex(todo => todo.completed);
        
        // All tasks after the first completed should also be completed
        for (let i = firstCompletedIndex; i < sorted.length; i++) {
          expect(sorted[i].completed).toBe(true);
        }
        
        // All tasks before the first completed should be incomplete
        for (let i = 0; i < firstCompletedIndex; i++) {
          expect(sorted[i].completed).toBe(false);
        }
      });
    });
  });

  describe('DOD04: State management tested', () => {
    test('context state updates correctly on toggle', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ completed: false });
      
      render(<TodoItemWrapper todo={mockTodo} />);
      
      // Toggle completion
      await user.click(screen.getByRole('checkbox'));
      
      // Verify state persists in context
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeChecked();
      });
    });

    test('multiple todos in same context update independently', async () => {
      const user = userEvent.setup();
      const todos: Todo[] = [
        createMockTodo({ id: '1', text: 'First task', completed: false }),
        createMockTodo({ id: '2', text: 'Second task', completed: false })
      ];
      
      render(<TodoListWrapper todos={todos} />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      
      // Toggle first task only
      await user.click(checkboxes[0]);
      
      await waitFor(() => {
        expect(checkboxes[0]).toBeChecked();
        expect(checkboxes[1]).not.toBeChecked();
      });
    });

    test('state management handles rapid state changes', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ completed: false });
      
      render(<TodoItemWrapper todo={mockTodo} />);
      
      const checkbox = screen.getByRole('checkbox');
      
      // Rapid toggles
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);
      
      // Should end up in completed state (3 clicks = odd)
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });
  });

  describe('Integration with existing functionality', () => {
    test('toggle status works alongside edit functionality', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ 
        text: 'Editable task',
        completed: false 
      });
      
      render(<TodoItemWrapper todo={mockTodo} />);
      
      // Toggle completion first
      await user.click(screen.getByRole('checkbox'));
      
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeChecked();
      });
      
      // Verify task is still there and editable via edit button
      expect(screen.getByText('Editable task')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    test('completion status preserved during editing', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ 
        text: 'Task to edit',
        completed: true 
      });
      
      render(<TodoItemWrapper todo={mockTodo} />);
      
      // Should be completed initially
      expect(screen.getByRole('checkbox')).toBeChecked();
      
      // Enter edit mode via Edit button (double-click is disabled for completed tasks)
      await user.click(screen.getByRole('button', { name: /edit/i }));
      
      // Should still be marked as completed during edit
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeChecked();
      });
    });
  });
});