/**
 * US06 - Toggle Task Status Test Suite (Final)
 * 
 * Tests the implementation of US06: Toggle Task Status functionality
 * Uses proper TodoContext integration pattern from US05
 * 
 * Acceptance Criteria:
 * - AC01: User can click checkbox to toggle task status between complete/incomplete
 * - AC02: Completed tasks are visually distinct (different background/text style)
 * - AC03: Status changes persist during the session
 * - AC04: Completed tasks appear at the bottom of the list
 * 
 * Definition of Done:
 * - DOD01: Status changes are reflected immediately in the UI
 * - DOD02: Visual states are clearly differentiated
 * - DOD03: Sorting logic ensures completed tasks stay at bottom
 * - DOD04: Proper state management and testing
 */

import React, { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoProvider, useTodoContext } from '../src/lib/TodoContext';
import { TodoItem } from '../src/components/todo/TodoItem';
import { Todo } from '../src/types';
import { sortTodos } from '../src/lib/todoUtils';

// Mock crypto.randomUUID for tests
if (!globalThis.crypto) {
  globalThis.crypto = require('crypto');
}

if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = () => require('crypto').randomUUID();
}

// Test component that properly integrates with TodoContext
const TestTodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
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

// Test wrapper component with TodoProvider
const TodoItemWrapper: React.FC<{ todo: Todo }> = ({ todo }) => (
  <TodoProvider>
    <TestTodoItem todo={todo} />
  </TodoProvider>
);

// Helper to create mock todos
const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: crypto.randomUUID(),
  text: 'Test todo item',
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  priority: 'medium',
  ...overrides,
});

describe('US06 - Toggle Task Status Implementation (Final)', () => {
  
  describe('AC01: Checkbox toggles task status', () => {
    test('clicking checkbox toggles incomplete task to complete', async () => {
      const todo = createMockTodo({ completed: false });
      const user = userEvent.setup();
      
      render(<TodoItemWrapper todo={todo} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      
      await user.click(checkbox);
      
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });

    test('clicking checkbox toggles complete task to incomplete', async () => {
      const todo = createMockTodo({ completed: true });
      const user = userEvent.setup();
      
      render(<TodoItemWrapper todo={todo} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
      
      await user.click(checkbox);
      
      await waitFor(() => {
        expect(checkbox).not.toBeChecked();
      });
    });

    test('checkbox state reflects todo completion status accurately', () => {
      const incompleteTodo = createMockTodo({ completed: false });
      const { rerender } = render(<TodoItemWrapper todo={incompleteTodo} />);
      
      expect(screen.getByRole('checkbox')).not.toBeChecked();
      
      const completedTodo = createMockTodo({ completed: true });
      rerender(<TodoItemWrapper todo={completedTodo} />);
      
      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  describe('AC02: Completed tasks visually distinct', () => {
    test('completed task has distinct visual styling', () => {
      const completedTodo = createMockTodo({ completed: true });
      
      render(<TodoItemWrapper todo={completedTodo} />);
      
      const todoElement = screen.getByTestId('todo-item');
      expect(todoElement).toHaveClass('todo-item--completed');
    });

    test('incomplete task does not have completed styling', () => {
      const incompleteTodo = createMockTodo({ completed: false });
      
      render(<TodoItemWrapper todo={incompleteTodo} />);
      
      const todoElement = screen.getByTestId('todo-item');
      expect(todoElement).not.toHaveClass('todo-item--completed');
    });

    test('visual state changes immediately when status toggles', async () => {
      const todo = createMockTodo({ completed: false });
      const user = userEvent.setup();
      
      render(<TodoItemWrapper todo={todo} />);
      
      const todoElement = screen.getByTestId('todo-item');
      const checkbox = screen.getByRole('checkbox');
      
      expect(todoElement).not.toHaveClass('todo-item--completed');
      
      await user.click(checkbox);
      
      await waitFor(() => {
        expect(todoElement).toHaveClass('todo-item--completed');
      });
    });
  });

  describe('AC03: Status persists during session', () => {
    test('completed status persists after component re-render', async () => {
      const todo = createMockTodo({ completed: false });
      const user = userEvent.setup();
      
      const { rerender } = render(<TodoItemWrapper todo={todo} />);
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
      
      // Simulate re-render by remounting the component 
      rerender(<TodoItemWrapper todo={todo} />);
      
      // The TodoContext should maintain the updated state
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeChecked();
        expect(screen.getByTestId('todo-item')).toHaveClass('todo-item--completed');
      });
    });

    test('multiple status changes persist correctly', async () => {
      const todo = createMockTodo({ completed: false });
      const user = userEvent.setup();
      
      render(<TodoItemWrapper todo={todo} />);
      
      const checkbox = screen.getByRole('checkbox');
      
      // Toggle multiple times
      await user.click(checkbox);
      await waitFor(() => expect(checkbox).toBeChecked());
      
      await user.click(checkbox);
      await waitFor(() => expect(checkbox).not.toBeChecked());
      
      await user.click(checkbox);
      await waitFor(() => expect(checkbox).toBeChecked());
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
    test('checkbox state updates without delay', async () => {
      const todo = createMockTodo({ completed: false });
      const user = userEvent.setup();
      
      render(<TodoItemWrapper todo={todo} />);
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      // Should update immediately without waiting
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });

    test('visual styling updates immediately', async () => {
      const todo = createMockTodo({ completed: false });
      const user = userEvent.setup();
      
      render(<TodoItemWrapper todo={todo} />);
      
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
      const { rerender } = render(<TodoItemWrapper todo={incompleteTodo} />);
      
      expect(screen.getByTestId('todo-item')).not.toHaveClass('todo-item--completed');
      
      const completedTodo = createMockTodo({ completed: true });
      rerender(<TodoItemWrapper todo={completedTodo} />);
      
      expect(screen.getByTestId('todo-item')).toHaveClass('todo-item--completed');
    });

    test('checkbox visual state matches completion status', () => {
      const incompleteTodo = createMockTodo({ completed: false });
      const { rerender } = render(<TodoItemWrapper todo={incompleteTodo} />);
      
      expect(screen.getByRole('checkbox')).not.toBeChecked();
      
      const completedTodo = createMockTodo({ completed: true });
      rerender(<TodoItemWrapper todo={completedTodo} />);
      
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
    test('context state updates correctly on toggle', async () => {
      const todo = createMockTodo({ completed: false });
      const user = userEvent.setup();
      
      render(<TodoItemWrapper todo={todo} />);
      
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);
      
      await waitFor(() => {
        expect(checkbox).toBeChecked();
        expect(screen.getByTestId('todo-item')).toHaveClass('todo-item--completed');
      });
    });

    test('state management handles rapid state changes', async () => {
      const todo = createMockTodo({ completed: false });
      const user = userEvent.setup();
      
      render(<TodoItemWrapper todo={todo} />);
      
      const checkbox = screen.getByRole('checkbox');
      
      // Rapid state changes
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);
      
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });
  });

  describe('Integration with existing functionality', () => {
    test('toggle status works alongside edit functionality', async () => {
      const todo = createMockTodo({ completed: false, text: 'Editable task' });
      const user = userEvent.setup();
      
      render(<TodoItemWrapper todo={todo} />);
      
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
      
      render(<TodoItemWrapper todo={todo} />);
      
      // Should be marked as completed
      const todoElement = screen.getByTestId('todo-item');
      expect(todoElement).toHaveClass('todo-item--completed');
      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  describe('US06 Comprehensive Test', () => {
    test('All US06 acceptance criteria implemented correctly', async () => {
      const incompleteTodo = createMockTodo({ completed: false, text: 'Task to complete' });
      const user = userEvent.setup();
      
      render(<TodoItemWrapper todo={incompleteTodo} />);
      
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
      
      // AC03: Status persists (toggle back and forth)
      await user.click(checkbox);
      await waitFor(() => {
        expect(checkbox).not.toBeChecked();
        expect(todoElement).not.toHaveClass('todo-item--completed');
      });
      
      await user.click(checkbox);
      await waitFor(() => {
        expect(checkbox).toBeChecked();
        expect(todoElement).toHaveClass('todo-item--completed');
      });
      
      // AC04: Sorting logic tested in unit tests above
      // All DOD requirements: Immediate updates, visual differentiation, sorting logic, state management
      
      // Final verification - task can still be toggled
      await user.click(checkbox);
      await waitFor(() => {
        expect(checkbox).not.toBeChecked();
        expect(todoElement).not.toHaveClass('todo-item--completed');
      });
    });
  });
});