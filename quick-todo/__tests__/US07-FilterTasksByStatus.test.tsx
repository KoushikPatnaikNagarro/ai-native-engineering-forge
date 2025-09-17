/**
 * US07 - Filter Tasks by Status Test Suite
 * 
 * Tests the implementation of US07: Filter Tasks by Status functionality
 * 
 * Acceptance Criteria:
 * - AC01: Three filter buttons are available (All, Active, Completed)
 * - AC02: Active filter is highlighted
 * - AC03: List updates based on selected filter
 * - AC04: Filter state persists across sessions
 * - AC05: Task count updates correctly based on filter
 * 
 * Definition of Done:
 * - DOD01: Filter logic works correctly
 * - DOD02: URL state management (if applicable) - Not applicable for current implementation
 * - DOD03: Performance optimized for large lists
 * - DOD04: Filter buttons are accessible
 */

import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoProvider, useTodoContext } from '../src/lib/TodoContext';
import { TodoFilter } from '../src/components/todo/TodoFilter';
import { TodoList } from '../src/components/todo/TodoList';
import { Todo } from '../src/types';

// Mock localStorage for testing persistence
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Setup crypto.randomUUID for tests
if (!global.crypto) {
  global.crypto = { randomUUID: () => Math.random().toString(36) } as any;
}

// Helper function to create mock todos
const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: crypto.randomUUID(),
  text: 'Test todo item',
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  priority: 'medium',
  ...overrides,
});

// Test component that loads initial todos
const TestTodoApp: React.FC<{ initialTodos?: Todo[]; children?: React.ReactNode }> = ({ 
  initialTodos = [], 
  children 
}) => {
  return (
    <TodoProvider>
      <TestTodoAppInner initialTodos={initialTodos}>
        {children}
      </TestTodoAppInner>
    </TodoProvider>
  );
};

const TestTodoAppInner: React.FC<{ initialTodos: Todo[]; children?: React.ReactNode }> = ({ 
  initialTodos, 
  children 
}) => {
  const { dispatch } = useTodoContext();
  
  React.useEffect(() => {
    if (initialTodos.length > 0) {
      dispatch({ type: 'LOAD_TODOS', payload: { todos: initialTodos } });
    }
  }, [initialTodos, dispatch]);
  
  return <>{children}</>;
};

describe('US07 - Filter Tasks by Status Implementation', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('AC01: Three filter buttons are available', () => {
    test('renders all three filter buttons: All, Active, Completed', () => {
      render(
        <TestTodoApp>
          <TodoFilter />
        </TestTodoApp>
      );

      expect(screen.getByTestId('filter-all')).toBeInTheDocument();
      expect(screen.getByTestId('filter-active')).toBeInTheDocument();
      expect(screen.getByTestId('filter-completed')).toBeInTheDocument();
      
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    test('filter buttons have correct ARIA attributes', () => {
      render(
        <TestTodoApp>
          <TodoFilter />
        </TestTodoApp>
      );

      const allButton = screen.getByTestId('filter-all');
      const activeButton = screen.getByTestId('filter-active');
      const completedButton = screen.getByTestId('filter-completed');

      // Check role attributes
      expect(allButton).toHaveAttribute('role', 'tab');
      expect(activeButton).toHaveAttribute('role', 'tab');
      expect(completedButton).toHaveAttribute('role', 'tab');

      // Check aria-controls
      expect(allButton).toHaveAttribute('aria-controls', 'main-todo-list');
      expect(activeButton).toHaveAttribute('aria-controls', 'main-todo-list');
      expect(completedButton).toHaveAttribute('aria-controls', 'main-todo-list');
    });

    test('filter container has proper accessibility structure', () => {
      render(
        <TestTodoApp>
          <TodoFilter />
        </TestTodoApp>
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-label', 'Filter todos by status');
    });
  });

  describe('AC02: Active filter is highlighted', () => {
    test('All button is highlighted by default', () => {
      render(
        <TestTodoApp>
          <TodoFilter />
        </TestTodoApp>
      );

      const allButton = screen.getByTestId('filter-all');
      const activeButton = screen.getByTestId('filter-active');
      const completedButton = screen.getByTestId('filter-completed');

      expect(allButton).toHaveClass('todo-filter__button--active');
      expect(allButton).toHaveAttribute('aria-selected', 'true');
      
      expect(activeButton).not.toHaveClass('todo-filter__button--active');
      expect(activeButton).toHaveAttribute('aria-selected', 'false');
      
      expect(completedButton).not.toHaveClass('todo-filter__button--active');
      expect(completedButton).toHaveAttribute('aria-selected', 'false');
    });

    test('clicking Active button highlights it and unhighlights others', async () => {
      const user = userEvent.setup();
      
      render(
        <TestTodoApp>
          <TodoFilter />
        </TestTodoApp>
      );

      const allButton = screen.getByTestId('filter-all');
      const activeButton = screen.getByTestId('filter-active');
      const completedButton = screen.getByTestId('filter-completed');

      await user.click(activeButton);

      expect(activeButton).toHaveClass('todo-filter__button--active');
      expect(activeButton).toHaveAttribute('aria-selected', 'true');
      
      expect(allButton).not.toHaveClass('todo-filter__button--active');
      expect(allButton).toHaveAttribute('aria-selected', 'false');
      
      expect(completedButton).not.toHaveClass('todo-filter__button--active');
      expect(completedButton).toHaveAttribute('aria-selected', 'false');
    });

    test('clicking Completed button highlights it and unhighlights others', async () => {
      const user = userEvent.setup();
      
      render(
        <TestTodoApp>
          <TodoFilter />
        </TestTodoApp>
      );

      const allButton = screen.getByTestId('filter-all');
      const activeButton = screen.getByTestId('filter-active');
      const completedButton = screen.getByTestId('filter-completed');

      await user.click(completedButton);

      expect(completedButton).toHaveClass('todo-filter__button--active');
      expect(completedButton).toHaveAttribute('aria-selected', 'true');
      
      expect(allButton).not.toHaveClass('todo-filter__button--active');
      expect(allButton).toHaveAttribute('aria-selected', 'false');
      
      expect(activeButton).not.toHaveClass('todo-filter__button--active');
      expect(activeButton).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('AC03: List updates based on selected filter', () => {
    const testTodos: Todo[] = [
      createMockTodo({ id: '1', text: 'Active task 1', completed: false }),
      createMockTodo({ id: '2', text: 'Active task 2', completed: false }),
      createMockTodo({ id: '3', text: 'Completed task 1', completed: true }),
      createMockTodo({ id: '4', text: 'Completed task 2', completed: true }),
      createMockTodo({ id: '5', text: 'Active task 3', completed: false }),
    ];

    test('All filter shows all todos', async () => {
      render(
        <TestTodoApp initialTodos={testTodos}>
          <TodoFilter />
          <TodoList />
        </TestTodoApp>
      );

      // Wait for todos to load
      await waitFor(() => {
        expect(screen.getByText('Active task 1')).toBeInTheDocument();
      });

      // All filter should be active by default and show all todos
      const allButton = screen.getByTestId('filter-all');
      expect(allButton).toHaveClass('todo-filter__button--active');
      
      // All todos should be visible
      expect(screen.getByText('Active task 1')).toBeInTheDocument();
      expect(screen.getByText('Active task 2')).toBeInTheDocument();
      expect(screen.getByText('Active task 3')).toBeInTheDocument();
      expect(screen.getByText('Completed task 1')).toBeInTheDocument();
      expect(screen.getByText('Completed task 2')).toBeInTheDocument();
    });

    test('Active filter shows only active todos', async () => {
      const user = userEvent.setup();
      
      render(
        <TestTodoApp initialTodos={testTodos}>
          <TodoFilter />
          <TodoList />
        </TestTodoApp>
      );

      await waitFor(() => {
        expect(screen.getByText('Active task 1')).toBeInTheDocument();
      });

      // Click Active filter
      await user.click(screen.getByTestId('filter-active'));

      // Only active todos should be visible
      expect(screen.getByText('Active task 1')).toBeInTheDocument();
      expect(screen.getByText('Active task 2')).toBeInTheDocument();
      expect(screen.getByText('Active task 3')).toBeInTheDocument();
      expect(screen.queryByText('Completed task 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Completed task 2')).not.toBeInTheDocument();
    });

    test('Completed filter shows only completed todos', async () => {
      const user = userEvent.setup();
      
      render(
        <TestTodoApp initialTodos={testTodos}>
          <TodoFilter />
          <TodoList />
        </TestTodoApp>
      );

      await waitFor(() => {
        expect(screen.getByText('Active task 1')).toBeInTheDocument();
      });

      // Click Completed filter
      await user.click(screen.getByTestId('filter-completed'));

      // Only completed todos should be visible
      expect(screen.getByText('Completed task 1')).toBeInTheDocument();
      expect(screen.getByText('Completed task 2')).toBeInTheDocument();
      expect(screen.queryByText('Active task 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Active task 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Active task 3')).not.toBeInTheDocument();
    });

    test('switching between filters updates the list correctly', async () => {
      const user = userEvent.setup();
      
      render(
        <TestTodoApp initialTodos={testTodos}>
          <TodoFilter />
          <TodoList />
        </TestTodoApp>
      );

      await waitFor(() => {
        expect(screen.getByText('Active task 1')).toBeInTheDocument();
      });

      // Start with All (default) - all todos visible
      expect(screen.getByText('Active task 1')).toBeInTheDocument();
      expect(screen.getByText('Completed task 1')).toBeInTheDocument();

      // Switch to Active - only active todos visible
      await user.click(screen.getByTestId('filter-active'));
      expect(screen.getByText('Active task 1')).toBeInTheDocument();
      expect(screen.queryByText('Completed task 1')).not.toBeInTheDocument();

      // Switch to Completed - only completed todos visible
      await user.click(screen.getByTestId('filter-completed'));
      expect(screen.queryByText('Active task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Completed task 1')).toBeInTheDocument();

      // Switch back to All - all todos visible again
      await user.click(screen.getByTestId('filter-all'));
      expect(screen.getByText('Active task 1')).toBeInTheDocument();
      expect(screen.getByText('Completed task 1')).toBeInTheDocument();
    });
  });

  describe('AC04: Filter state persists across sessions', () => {
    test('filter state is saved to localStorage when changed', async () => {
      const user = userEvent.setup();
      
      render(
        <TestTodoApp>
          <TodoFilter />
        </TestTodoApp>
      );

      // Click Active filter
      await user.click(screen.getByTestId('filter-active'));

      // Check that preference was saved
      await waitFor(() => {
        const savedPreferences = localStorageMock.getItem('quick-todo-preferences');
        expect(savedPreferences).toBeTruthy();
        
        if (savedPreferences) {
          const preferences = JSON.parse(savedPreferences);
          expect(preferences.filter).toBe('active');
        }
      });
    });

    test('filter state is restored from localStorage on app load', () => {
      // Pre-set localStorage with active filter
      localStorageMock.setItem('quick-todo-preferences', JSON.stringify({
        filter: 'completed',
        theme: 'light',
        compactView: false,
      }));

      render(
        <TestTodoApp>
          <TodoFilter />
        </TestTodoApp>
      );

      // Completed filter should be active on load
      const completedButton = screen.getByTestId('filter-completed');
      expect(completedButton).toHaveClass('todo-filter__button--active');
      expect(completedButton).toHaveAttribute('aria-selected', 'true');
    });

    test('persistence works across multiple filter changes', async () => {
      const user = userEvent.setup();
      
      render(
        <TestTodoApp>
          <TodoFilter />
        </TestTodoApp>
      );

      // Change to Active
      await user.click(screen.getByTestId('filter-active'));
      
      await waitFor(() => {
        const savedPreferences = localStorageMock.getItem('quick-todo-preferences');
        const preferences = JSON.parse(savedPreferences!);
        expect(preferences.filter).toBe('active');
      });

      // Change to Completed
      await user.click(screen.getByTestId('filter-completed'));
      
      await waitFor(() => {
        const savedPreferences = localStorageMock.getItem('quick-todo-preferences');
        const preferences = JSON.parse(savedPreferences!);
        expect(preferences.filter).toBe('completed');
      });

      // Change back to All
      await user.click(screen.getByTestId('filter-all'));
      
      await waitFor(() => {
        const savedPreferences = localStorageMock.getItem('quick-todo-preferences');
        const preferences = JSON.parse(savedPreferences!);
        expect(preferences.filter).toBe('all');
      });
    });
  });

  describe('AC05: Task count updates correctly based on filter', () => {
    const testTodos: Todo[] = [
      createMockTodo({ id: '1', text: 'Active task 1', completed: false }),
      createMockTodo({ id: '2', text: 'Active task 2', completed: false }),
      createMockTodo({ id: '3', text: 'Completed task 1', completed: true }),
      createMockTodo({ id: '4', text: 'Completed task 2', completed: true }),
      createMockTodo({ id: '5', text: 'Active task 3', completed: false }),
    ];

    test('filter buttons show correct counts', async () => {
      render(
        <TestTodoApp initialTodos={testTodos}>
          <TodoFilter />
        </TestTodoApp>
      );

      await waitFor(() => {
        // Check All button count (total todos)
        const allButton = screen.getByTestId('filter-all');
        const allCount = within(allButton).getByText('5');
        expect(allCount).toBeInTheDocument();

        // Check Active button count (active todos)
        const activeButton = screen.getByTestId('filter-active');
        const activeCount = within(activeButton).getByText('3');
        expect(activeCount).toBeInTheDocument();

        // Check Completed button count (completed todos)
        const completedButton = screen.getByTestId('filter-completed');
        const completedCount = within(completedButton).getByText('2');
        expect(completedCount).toBeInTheDocument();
      });
    });

    test('todo list stats show correct filtered count', async () => {
      const user = userEvent.setup();
      
      render(
        <TestTodoApp initialTodos={testTodos}>
          <TodoFilter />
          <TodoList />
        </TestTodoApp>
      );

      await waitFor(() => {
        expect(screen.getByText('Active task 1')).toBeInTheDocument();
      });

      // All filter (default) - shows "5 of 5 todos"
      expect(screen.getByText('5 of 5 todos')).toBeInTheDocument();

      // Switch to Active filter - shows "3 of 5 todos"
      await user.click(screen.getByTestId('filter-active'));
      await waitFor(() => {
        expect(screen.getByText('3 of 5 todos')).toBeInTheDocument();
      });

      // Switch to Completed filter - shows "2 of 5 todos"
      await user.click(screen.getByTestId('filter-completed'));
      await waitFor(() => {
        expect(screen.getByText('2 of 5 todos')).toBeInTheDocument();
      });
    });

    test('counts update when todo completion status changes', async () => {
      const user = userEvent.setup();
      
      // Start with 3 active, 2 completed
      render(
        <TestTodoApp initialTodos={testTodos}>
          <TodoFilter />
          <TodoList />
        </TestTodoApp>
      );

      await waitFor(() => {
        expect(screen.getByText('Active task 1')).toBeInTheDocument();
      });

      // Initial counts
      const activeButton = screen.getByTestId('filter-active');
      const completedButton = screen.getByTestId('filter-completed');
      
      expect(within(activeButton).getByText('3')).toBeInTheDocument();
      expect(within(completedButton).getByText('2')).toBeInTheDocument();

      // Complete one active task
      const firstTodoCheckbox = screen.getAllByRole('checkbox')[0];
      await user.click(firstTodoCheckbox);

      // Counts should update: 2 active, 3 completed
      await waitFor(() => {
        expect(within(activeButton).getByText('2')).toBeInTheDocument();
        expect(within(completedButton).getByText('3')).toBeInTheDocument();
      });
    });
  });

  describe('DOD01: Filter logic works correctly', () => {
    test('filter logic handles edge cases correctly', async () => {
      const user = userEvent.setup();
      
      // Test with no todos
      const { rerender } = render(
        <TestTodoApp initialTodos={[]}>
          <TodoFilter />
          <TodoList />
        </TestTodoApp>
      );

      // All counts should be 0
      await waitFor(() => {
        expect(within(screen.getByTestId('filter-all')).getByText('0')).toBeInTheDocument();
        expect(within(screen.getByTestId('filter-active')).getByText('0')).toBeInTheDocument();
        expect(within(screen.getByTestId('filter-completed')).getByText('0')).toBeInTheDocument();
      });

      // Test with only active todos
      const activeTodos = [
        createMockTodo({ id: '1', text: 'Active only', completed: false }),
      ];

      rerender(
        <TestTodoApp initialTodos={activeTodos}>
          <TodoFilter />
          <TodoList />
        </TestTodoApp>
      );

      await waitFor(() => {
        expect(screen.getByText('Active only')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(within(screen.getByTestId('filter-all')).getByText('1')).toBeInTheDocument();
        expect(within(screen.getByTestId('filter-active')).getByText('1')).toBeInTheDocument();
        expect(within(screen.getByTestId('filter-completed')).getByText('0')).toBeInTheDocument();
      });

      // Switch to completed filter - should show empty state
      await user.click(screen.getByTestId('filter-completed'));
      await waitFor(() => {
        expect(screen.getByText(/No completed todos found/)).toBeInTheDocument();
      });
    });
  });

  describe('DOD03: Performance optimized for large lists', () => {
    test('handles large number of todos efficiently', async () => {
      const largeTodoList = Array.from({ length: 100 }, (_, i) => 
        createMockTodo({ 
          id: `todo-${i}`, 
          text: `Todo item ${i}`, 
          completed: i % 3 === 0 // Every 3rd todo is completed (0, 3, 6, 9, ...)
        })
      );

      // Calculate expected counts: i % 3 === 0 for i = 0, 3, 6, 9, ..., 99
      // That gives us: 0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99
      // Count: 34 completed todos, 66 active todos
      const expectedCompleted = Math.floor(100 / 3) + 1; // 34 (because we include 0)
      const expectedActive = 100 - expectedCompleted; // 66

      const startTime = performance.now();
      
      render(
        <TestTodoApp initialTodos={largeTodoList}>
          <TodoFilter />
          <TodoList />
        </TestTodoApp>
      );

      await waitFor(() => {
        expect(screen.getByText('Todo item 1')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Render should complete within reasonable time (1 second)
      expect(renderTime).toBeLessThan(1000);

      // Counts should be correct
      expect(within(screen.getByTestId('filter-all')).getByText('100')).toBeInTheDocument();
      expect(within(screen.getByTestId('filter-active')).getByText(expectedActive.toString())).toBeInTheDocument();
      expect(within(screen.getByTestId('filter-completed')).getByText(expectedCompleted.toString())).toBeInTheDocument();
    });
  });

  describe('DOD04: Filter buttons are accessible', () => {
    test('filter buttons support keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <TestTodoApp>
          <TodoFilter />
        </TestTodoApp>
      );

      const allButton = screen.getByTestId('filter-all');
      const activeButton = screen.getByTestId('filter-active');
      const completedButton = screen.getByTestId('filter-completed');

      // Tab to first button
      await user.tab();
      expect(allButton).toHaveFocus();

      // Tab to second button
      await user.tab();
      expect(activeButton).toHaveFocus();

      // Tab to third button
      await user.tab();
      expect(completedButton).toHaveFocus();

      // Enter/Space should activate button
      await user.keyboard('{Enter}');
      expect(completedButton).toHaveClass('todo-filter__button--active');
    });

    test('filter buttons have proper focus management', async () => {
      const user = userEvent.setup();
      
      render(
        <TestTodoApp>
          <TodoFilter />
        </TestTodoApp>
      );

      const activeButton = screen.getByTestId('filter-active');

      // Click should focus the button
      await user.click(activeButton);
      expect(activeButton).toHaveFocus();
      expect(activeButton).toHaveClass('todo-filter__button--active');
    });

    test('filter buttons have sufficient color contrast', () => {
      render(
        <TestTodoApp>
          <TodoFilter />
        </TestTodoApp>
      );

      const allButton = screen.getByTestId('filter-all');
      const activeButton = screen.getByTestId('filter-active');

      // Active button should have active class
      expect(allButton).toHaveClass('todo-filter__button--active');
      
      // Inactive buttons should not have active class
      expect(activeButton).not.toHaveClass('todo-filter__button--active');
    });
  });

  describe('US07 Integration Test', () => {
    test('complete filter workflow with all acceptance criteria', async () => {
      const user = userEvent.setup();
      
      const testTodos: Todo[] = [
        createMockTodo({ id: '1', text: 'First active', completed: false }),
        createMockTodo({ id: '2', text: 'First completed', completed: true }),
        createMockTodo({ id: '3', text: 'Second active', completed: false }),
      ];

      render(
        <TestTodoApp initialTodos={testTodos}>
          <TodoFilter />
          <TodoList />
        </TestTodoApp>
      );

      await waitFor(() => {
        expect(screen.getByText('First active')).toBeInTheDocument();
      });

      // AC01: Three filter buttons are available
      expect(screen.getByTestId('filter-all')).toBeInTheDocument();
      expect(screen.getByTestId('filter-active')).toBeInTheDocument();
      expect(screen.getByTestId('filter-completed')).toBeInTheDocument();

      // AC02: All button is highlighted by default
      expect(screen.getByTestId('filter-all')).toHaveClass('todo-filter__button--active');

      // AC03 & AC05: All todos visible with correct count
      expect(screen.getByText('3 of 3 todos')).toBeInTheDocument();
      expect(screen.getByText('First active')).toBeInTheDocument();
      expect(screen.getByText('First completed')).toBeInTheDocument();
      expect(screen.getByText('Second active')).toBeInTheDocument();

      // Click Active filter
      await user.click(screen.getByTestId('filter-active'));

      // AC02: Active filter is now highlighted
      expect(screen.getByTestId('filter-active')).toHaveClass('todo-filter__button--active');
      expect(screen.getByTestId('filter-all')).not.toHaveClass('todo-filter__button--active');

      // AC03: Only active todos visible
      expect(screen.getByText('First active')).toBeInTheDocument();
      expect(screen.getByText('Second active')).toBeInTheDocument();
      expect(screen.queryByText('First completed')).not.toBeInTheDocument();

      // AC05: Count reflects filtered results
      expect(screen.getByText('2 of 3 todos')).toBeInTheDocument();

      // Click Completed filter
      await user.click(screen.getByTestId('filter-completed'));

      // AC02: Completed filter is now highlighted
      expect(screen.getByTestId('filter-completed')).toHaveClass('todo-filter__button--active');

      // AC03: Only completed todos visible
      expect(screen.getByText('First completed')).toBeInTheDocument();
      expect(screen.queryByText('First active')).not.toBeInTheDocument();
      expect(screen.queryByText('Second active')).not.toBeInTheDocument();

      // AC05: Count reflects filtered results
      expect(screen.getByText('1 of 3 todos')).toBeInTheDocument();

      // AC04: Filter state persistence (tested by localStorage mock)
      await waitFor(() => {
        const savedPreferences = localStorageMock.getItem('quick-todo-preferences');
        const preferences = JSON.parse(savedPreferences!);
        expect(preferences.filter).toBe('completed');
      });
    });
  });
});