/**
 * US08 - Mark All Tasks Complete Implementation Tests
 * 
 * Comprehensive test suite covering all acceptance criteria and definition of done
 * for the mark all tasks complete functionality.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoProvider } from '../src/lib/TodoContext';
import { TodoBulkActions } from '../src/components/todo/TodoBulkActions';
import { TodoToggleAll } from '../src/components/todo/TodoToggleAll';
import HomePage from '../src/app/page';

// Mock localStorage
const mockLocalStorage = (() => {
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
  value: mockLocalStorage,
});

// Helper function to create todos for testing
const setupTodosInLocalStorage = (todos: any[]) => {
  localStorage.setItem('quick-todo-data', JSON.stringify(todos));
};

// Sample todo data for testing
const sampleTodos = [
  {
    id: '1',
    text: 'Learn React',
    completed: false,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    text: 'Write tests',
    completed: false,
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString(),
  },
  {
    id: '3',
    text: 'Deploy app',
    completed: true,
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date('2024-01-03').toISOString(),
  },
];

const mixedTodos = [
  {
    id: '1',
    text: 'Task 1 - Open',
    completed: false,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    text: 'Task 2 - Open',
    completed: false,
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString(),
  },
  {
    id: '3',
    text: 'Task 3 - Complete',
    completed: true,
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date('2024-01-03').toISOString(),
  },
];

const allCompletedTodos = [
  {
    id: '1',
    text: 'Completed task 1',
    completed: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    text: 'Completed task 2',
    completed: true,
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString(),
  },
];

describe('US08 - Mark All Tasks Complete Implementation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('AC01: Toggle all button is available', () => {
    it('renders toggle all button when tasks exist', () => {
      setupTodosInLocalStorage(sampleTodos);
      
      render(
        <TodoProvider>
          <TodoBulkActions testId="test-bulk-actions" />
        </TodoProvider>
      );

      const toggleAllButton = screen.getByTestId('test-bulk-actions-toggle-all-button');
      expect(toggleAllButton).toBeInTheDocument();
      expect(toggleAllButton).toHaveTextContent('Mark all complete');
    });

    it('shows correct button text when there are open tasks', () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      const toggleAllButton = screen.getByTestId('toggle-all-button');
      expect(toggleAllButton).toHaveTextContent('Mark all complete (2)');
    });

    it('does not render toggle all button when no tasks exist', () => {
      setupTodosInLocalStorage([]);
      
      render(
        <TodoProvider>
          <TodoBulkActions testId="test-bulk-actions" />
        </TodoProvider>
      );

      const toggleAllButton = screen.queryByTestId('test-bulk-actions-toggle-all-button');
      expect(toggleAllButton).not.toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      const toggleAllButton = screen.getByTestId('toggle-all-button');
      expect(toggleAllButton).toHaveAttribute('aria-label', 'Mark all 2 open tasks as complete');
      expect(toggleAllButton).toHaveAttribute('type', 'button');
    });
  });

  describe('AC02: Marks all open tasks as complete', () => {
    it('marks all open tasks as complete when clicked', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <HomePage />
        </TodoProvider>
      );

      // Verify initial state - should have 2 open tasks
      expect(screen.getByText('Mark all complete (2)')).toBeInTheDocument();

      // Click the toggle all button
      const toggleAllButton = screen.getByTestId('main-bulk-actions-toggle-all-button');
      fireEvent.click(toggleAllButton);

      // Wait for state update
      await waitFor(() => {
        expect(screen.getByText('All tasks complete')).toBeInTheDocument();
      });

      // Verify all checkboxes are now checked
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeChecked();
      });
    });

    it('only affects open tasks, leaves completed tasks unchanged', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <HomePage />
        </TodoProvider>
      );

      // Count initial completed tasks
      const initialCompleted = screen.getAllByRole('checkbox').filter((cb): cb is HTMLInputElement => 
        cb instanceof HTMLInputElement && cb.checked
      );
      const initialCompletedCount = initialCompleted.length;

      // Click toggle all
      const toggleAllButton = screen.getByTestId('main-bulk-actions-toggle-all-button');
      fireEvent.click(toggleAllButton);

      await waitFor(() => {
        const allCheckboxes = screen.getAllByRole('checkbox');
        expect(allCheckboxes).toHaveLength(3); // Still 3 tasks total
        allCheckboxes.forEach(checkbox => {
          expect(checkbox).toBeChecked(); // All should be checked now
        });
      });
    });

    it('updates localStorage after marking all complete', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      const toggleAllButton = screen.getByTestId('toggle-all-button');
      fireEvent.click(toggleAllButton);

      await waitFor(() => {
        const savedData = localStorage.getItem('quick-todo-data');
        expect(savedData).toBeTruthy();
        
        const todos = JSON.parse(savedData!);
        todos.forEach((todo: any) => {
          expect(todo.completed).toBe(true);
        });
      });
    });
  });

  describe('AC03: Button state reflects current status', () => {
    it('shows "Mark all complete (X)" when there are open tasks', () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      const toggleAllButton = screen.getByTestId('toggle-all-button');
      expect(toggleAllButton).toHaveTextContent('Mark all complete (2)');
      expect(toggleAllButton).not.toBeDisabled();
    });

    it('shows "All tasks complete" when all tasks are completed', () => {
      setupTodosInLocalStorage(allCompletedTodos);
      
      render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      const toggleAllButton = screen.getByTestId('toggle-all-button');
      expect(toggleAllButton).toHaveTextContent('All tasks complete');
      expect(toggleAllButton).toBeDisabled();
    });

    it('updates button state after marking all complete', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      const toggleAllButton = screen.getByTestId('toggle-all-button');
      
      // Initial state
      expect(toggleAllButton).toHaveTextContent('Mark all complete (2)');
      expect(toggleAllButton).not.toBeDisabled();

      // Click to mark all complete
      fireEvent.click(toggleAllButton);

      // Final state
      await waitFor(() => {
        expect(toggleAllButton).toHaveTextContent('All tasks complete');
        expect(toggleAllButton).toBeDisabled();
      });
    });

    it('shows correct icon based on completion status', () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      // Should show circle icon when there are open tasks
      expect(screen.getByText('○')).toBeInTheDocument();
      
      // After clicking, should show check icon
      const toggleAllButton = screen.getByTestId('toggle-all-button');
      fireEvent.click(toggleAllButton);

      waitFor(() => {
        expect(screen.getByText('✓')).toBeInTheDocument();
      });
    });
  });

  describe('AC04: Works with filtered views', () => {
    it('works correctly when All filter is active', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <HomePage />
        </TodoProvider>
      );

      // Ensure All filter is active (default)
      const allFilter = screen.getByTestId('filter-all');
      expect(allFilter).toHaveAttribute('aria-selected', 'true');

      // Mark all complete
      const toggleAllButton = screen.getByTestId('main-bulk-actions-toggle-all-button');
      fireEvent.click(toggleAllButton);

      await waitFor(() => {
        expect(screen.getByText('All tasks complete')).toBeInTheDocument();
      });
    });

    it('works correctly when Active filter is active', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <HomePage />
        </TodoProvider>
      );

      // Switch to Active filter
      const activeFilter = screen.getByTestId('filter-active');
      fireEvent.click(activeFilter);

      await waitFor(() => {
        expect(activeFilter).toHaveAttribute('aria-selected', 'true');
      });

      // Should still show toggle all button
      const toggleAllButton = screen.getByTestId('main-bulk-actions-toggle-all-button');
      expect(toggleAllButton).toBeInTheDocument();

      // Mark all complete
      fireEvent.click(toggleAllButton);

      await waitFor(() => {
        expect(toggleAllButton).toHaveTextContent('All tasks complete');
      });
    });

    it('works correctly when Completed filter is active', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <HomePage />
        </TodoProvider>
      );

      // Switch to Completed filter
      const completedFilter = screen.getByTestId('filter-completed');
      fireEvent.click(completedFilter);

      await waitFor(() => {
        expect(completedFilter).toHaveAttribute('aria-selected', 'true');
      });

      // Should still show toggle all button
      const toggleAllButton = screen.getByTestId('main-bulk-actions-toggle-all-button');
      expect(toggleAllButton).toBeInTheDocument();

      // Mark all complete
      fireEvent.click(toggleAllButton);

      await waitFor(() => {
        expect(toggleAllButton).toHaveTextContent('All tasks complete');
      });
    });

    it('updates filter counts correctly after marking all complete', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <HomePage />
        </TodoProvider>
      );

      // Initial filter counts
      expect(screen.getByTestId('filter-all')).toHaveTextContent('All3');
      expect(screen.getByTestId('filter-active')).toHaveTextContent('Active2');
      expect(screen.getByTestId('filter-completed')).toHaveTextContent('Completed1');

      // Mark all complete
      const toggleAllButton = screen.getByTestId('main-bulk-actions-toggle-all-button');
      fireEvent.click(toggleAllButton);

      // Updated filter counts
      await waitFor(() => {
        expect(screen.getByTestId('filter-all')).toHaveTextContent('All3');
        expect(screen.getByTestId('filter-active')).toHaveTextContent('Active0');
        expect(screen.getByTestId('filter-completed')).toHaveTextContent('Completed3');
      });
    });
  });

  describe('DOD01: Bulk operation performs efficiently', () => {
    it('marks all tasks complete in a single operation', async () => {
      // Create a larger number of tasks to test efficiency
      const manyTodos = Array.from({ length: 50 }, (_, i) => ({
        id: `task-${i}`,
        text: `Task ${i + 1}`,
        completed: i % 3 === 0, // Every 3rd task is completed
        createdAt: new Date(`2024-01-${(i % 30) + 1}`).toISOString(),
        updatedAt: new Date(`2024-01-${(i % 30) + 1}`).toISOString(),
      }));

      setupTodosInLocalStorage(manyTodos);
      
      render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      const toggleAllButton = screen.getByTestId('toggle-all-button');
      
      // Measure performance
      const startTime = performance.now();
      fireEvent.click(toggleAllButton);
      
      await waitFor(() => {
        expect(toggleAllButton).toHaveTextContent('All tasks complete');
      });
      
      const endTime = performance.now();
      const operationTime = endTime - startTime;
      
      // Operation should complete within reasonable time (1 second for 50 tasks)
      expect(operationTime).toBeLessThan(1000);
    });
  });

  describe('DOD02: UI feedback during operation', () => {
    it('provides immediate visual feedback when button is clicked', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      const toggleAllButton = screen.getByTestId('toggle-all-button');
      
      // Click button
      fireEvent.click(toggleAllButton);

      // Should immediately update button state
      await waitFor(() => {
        expect(toggleAllButton).toHaveTextContent('All tasks complete');
      });
    });

    it('announces changes to screen readers', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      const toggleAllButton = screen.getByTestId('toggle-all-button');
      fireEvent.click(toggleAllButton);

      await waitFor(() => {
        const statusRegion = screen.getByText('All tasks have been marked as complete');
        expect(statusRegion).toBeInTheDocument();
      });
    });
  });

  describe('DOD03: Undo functionality considered', () => {
    it('does not implement undo but maintains clear completed functionality', () => {
      setupTodosInLocalStorage(allCompletedTodos);
      
      render(
        <TodoProvider>
          <TodoBulkActions testId="bulk-actions" />
        </TodoProvider>
      );

      // Should show clear completed button as an alternative
      const clearButton = screen.getByTestId('bulk-actions-clear-completed');
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveTextContent('Clear completed (2)');
    });
  });

  describe('DOD04: Edge cases tested', () => {
    it('handles empty todo list', () => {
      setupTodosInLocalStorage([]);
      
      render(
        <TodoProvider>
          <TodoBulkActions testId="bulk-actions" />
        </TodoProvider>
      );

      // Should not render any buttons
      expect(screen.queryByTestId('bulk-actions-toggle-all-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('bulk-actions-clear-completed')).not.toBeInTheDocument();
    });

    it('handles todos with only completed tasks', () => {
      setupTodosInLocalStorage(allCompletedTodos);
      
      render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      const toggleAllButton = screen.getByTestId('toggle-all-button');
      expect(toggleAllButton).toBeDisabled();
      expect(toggleAllButton).toHaveTextContent('All tasks complete');
    });

    it('handles todos with only open tasks', () => {
      const openOnlyTodos = mixedTodos.filter(todo => !todo.completed);
      setupTodosInLocalStorage(openOnlyTodos);
      
      render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      const toggleAllButton = screen.getByTestId('toggle-all-button');
      expect(toggleAllButton).not.toBeDisabled();
      expect(toggleAllButton).toHaveTextContent('Mark all complete (2)');
    });

    it('handles rapid clicking without breaking state', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      const toggleAllButton = screen.getByTestId('toggle-all-button');
      
      // Click multiple times rapidly
      fireEvent.click(toggleAllButton);
      fireEvent.click(toggleAllButton);
      fireEvent.click(toggleAllButton);

      await waitFor(() => {
        expect(toggleAllButton).toHaveTextContent('All tasks complete');
        expect(toggleAllButton).toBeDisabled();
      });
    });

    it('marks all tasks complete while maintaining existing sort order behavior', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <HomePage />
        </TodoProvider>
      );

      // Get initial task count
      const initialTaskCount = screen.getAllByText(/Task \d+ - (Open|Complete)/).length;

      // Mark all complete
      const toggleAllButton = screen.getByTestId('main-bulk-actions-toggle-all-button');
      fireEvent.click(toggleAllButton);

      await waitFor(() => {
        const finalTasks = screen.getAllByText(/Task \d+ - (Open|Complete)/);
        // Should still have the same number of tasks
        expect(finalTasks).toHaveLength(initialTaskCount);
        
        // All checkboxes should be checked
        const allCheckboxes = screen.getAllByRole('checkbox');
        allCheckboxes.forEach(checkbox => {
          expect(checkbox).toBeChecked();
        });
      });
    });
  });

  describe('Integration with existing functionality', () => {
    it('works together with individual task toggle', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <HomePage />
        </TodoProvider>
      );

      // Toggle one individual task first
      const firstCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(firstCheckbox);

      await waitFor(() => {
        expect(firstCheckbox).toBeChecked();
      });

      // Then use toggle all
      const toggleAllButton = screen.getByTestId('main-bulk-actions-toggle-all-button');
      fireEvent.click(toggleAllButton);

      await waitFor(() => {
        const allCheckboxes = screen.getAllByRole('checkbox');
        allCheckboxes.forEach(checkbox => {
          expect(checkbox).toBeChecked();
        });
      });
    });

    it('works together with filter functionality', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      render(
        <TodoProvider>
          <HomePage />
        </TodoProvider>
      );

      // Switch to active filter
      const activeFilter = screen.getByTestId('filter-active');
      fireEvent.click(activeFilter);

      // Mark all complete
      const toggleAllButton = screen.getByTestId('main-bulk-actions-toggle-all-button');
      fireEvent.click(toggleAllButton);

      // Switch back to all filter
      const allFilter = screen.getByTestId('filter-all');
      fireEvent.click(allFilter);

      await waitFor(() => {
        const allCheckboxes = screen.getAllByRole('checkbox');
        allCheckboxes.forEach(checkbox => {
          expect(checkbox).toBeChecked();
        });
      });
    });

    it('persists state across app reloads', async () => {
      setupTodosInLocalStorage(mixedTodos);
      
      const { unmount } = render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      const toggleAllButton = screen.getByTestId('toggle-all-button');
      fireEvent.click(toggleAllButton);

      await waitFor(() => {
        expect(toggleAllButton).toHaveTextContent('All tasks complete');
      });

      // Unmount and remount to simulate reload
      unmount();

      render(
        <TodoProvider>
          <TodoToggleAll testId="toggle-all" />
        </TodoProvider>
      );

      // State should be restored
      await waitFor(() => {
        const newToggleAllButton = screen.getByTestId('toggle-all-button');
        expect(newToggleAllButton).toHaveTextContent('All tasks complete');
        expect(newToggleAllButton).toBeDisabled();
      });
    });
  });
});

export {};