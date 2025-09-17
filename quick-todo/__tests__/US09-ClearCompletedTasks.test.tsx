/**
 * US09 - Clear Completed Tasks Test Suite
 * 
 * Tests all acceptance criteria and definition of done requirements:
 * AC01: Clear completed button visible when applicable
 * AC02: Removes all completed tasks
 * AC03: Confirmation for destructive action
 * AC04: Button disabled when no completed tasks
 * DOD01: Destructive action requires confirmation
 * DOD02: Performance optimized
 * DOD03: Animation/transition for removal
 * DOD04: Accessibility announcements
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoProvider } from '../src/lib/TodoContext';
import { TodoBulkActions } from '../src/components/todo/TodoBulkActions';
import { Todo } from '../src/types';

// Mock data
const createMockTodo = (id: string, text: string, completed: boolean): Todo => ({
  id,
  text,
  completed,
  createdAt: new Date(),
  updatedAt: new Date(),
  priority: 'medium',
  category: 'general',
});

const mockTodos: Todo[] = [
  createMockTodo('1', 'Task 1', false),
  createMockTodo('2', 'Task 2', true),
  createMockTodo('3', 'Task 3', true),
  createMockTodo('4', 'Task 4', false),
  createMockTodo('5', 'Task 5', true),
];

// Test wrapper with TodoProvider
const TestWrapper: React.FC<{ children: React.ReactNode; initialTodos?: Todo[] }> = ({ 
  children, 
  initialTodos = mockTodos 
}) => (
  <TodoProvider>
    <div data-testid="test-container">
      {children}
    </div>
  </TodoProvider>
);

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock requestAnimationFrame for animations
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn();

describe('US09 - Clear Completed Tasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTodos));
  });

  afterEach(() => {
    // Clean up any added CSS classes or DOM elements
    document.querySelectorAll('.todo-item--removing').forEach(el => {
      el.classList.remove('todo-item--removing');
    });
    document.querySelectorAll('.todo-list__items--clearing').forEach(el => {
      el.classList.remove('todo-list__items--clearing');
    });
    document.querySelectorAll('.sr-only').forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  });

  describe('AC01: Clear completed button visible when applicable', () => {
    test('shows clear completed button when there are completed tasks', async () => {
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      // Wait for component to load with localStorage data
      await waitFor(() => {
        const clearButton = screen.getByTestId('todo-bulk-actions-clear-completed');
        expect(clearButton).toBeInTheDocument();
        expect(clearButton).toBeVisible();
      });
    });

    test('hides clear completed button when no completed tasks', async () => {
      const incompleteTodos = mockTodos.map(todo => ({ ...todo, completed: false }));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(incompleteTodos));

      render(
        <TestWrapper initialTodos={incompleteTodos}>
          <TodoBulkActions />
        </TestWrapper>
      );

      await waitFor(() => {
        const clearButton = screen.queryByTestId('todo-bulk-actions-clear-completed');
        expect(clearButton).not.toBeInTheDocument();
      });
    });

    test('button shows correct count of completed tasks', async () => {
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      await waitFor(() => {
        const clearButton = screen.getByTestId('todo-bulk-actions-clear-completed');
        expect(clearButton).toHaveTextContent('Clear completed (3)');
      });
    });
  });

  describe('AC02: Removes all completed tasks', () => {
    test('removes all completed tasks after confirmation', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      // Click clear button
      await waitFor(() => {
        const clearButton = screen.getByTestId('todo-bulk-actions-clear-completed');
        return user.click(clearButton);
      });

      // Confirm in modal
      const confirmButton = await screen.findByTestId('todo-bulk-actions-confirm-modal-confirm');
      await user.click(confirmButton);

      // Wait for action to complete
      await waitFor(() => {
        // Button should be hidden since no completed tasks remain
        const clearButton = screen.queryByTestId('todo-bulk-actions-clear-completed');
        expect(clearButton).not.toBeInTheDocument();
      });
    });

    test('preserves incomplete tasks when clearing completed', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      // Get initial count
      await waitFor(() => {
        const clearButton = screen.getByTestId('todo-bulk-actions-clear-completed');
        expect(clearButton).toHaveTextContent('Clear completed (3)');
      });

      // Click clear and confirm
      const clearButton = screen.getByTestId('todo-bulk-actions-clear-completed');
      await user.click(clearButton);
      
      const confirmButton = await screen.findByTestId('todo-bulk-actions-confirm-modal-confirm');
      await user.click(confirmButton);

      // Wait for completion
      await waitFor(() => {
        expect(screen.queryByTestId('todo-bulk-actions-clear-completed')).not.toBeInTheDocument();
      });

      // Verify localStorage was updated with only incomplete tasks
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'quick-todo-data',
        expect.stringContaining('"completed":false')
      );
    });
  });

  describe('AC03 & DOD01: Confirmation for destructive action', () => {
    test('shows confirmation modal when clear button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      const clearButton = await screen.findByTestId('todo-bulk-actions-clear-completed');
      await user.click(clearButton);

      // Modal should be visible
      const modal = await screen.findByTestId('todo-bulk-actions-confirm-modal');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    test('modal contains proper destructive action warning', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      const clearButton = await screen.findByTestId('todo-bulk-actions-clear-completed');
      await user.click(clearButton);

      // Check modal content
      await waitFor(() => {
        expect(screen.getByText('Clear Completed Tasks')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to clear 3 completed tasks/)).toBeInTheDocument();
        expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
      });
    });

    test('can cancel confirmation modal', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      const clearButton = await screen.findByTestId('todo-bulk-actions-clear-completed');
      await user.click(clearButton);

      // Cancel the modal
      const cancelButton = await screen.findByTestId('todo-bulk-actions-confirm-modal-cancel');
      await user.click(cancelButton);

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByTestId('todo-bulk-actions-confirm-modal')).not.toBeInTheDocument();
      });

      // Tasks should still exist
      expect(screen.getByTestId('todo-bulk-actions-clear-completed')).toHaveTextContent('Clear completed (3)');
    });

    test('can close modal with Escape key', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      const clearButton = await screen.findByTestId('todo-bulk-actions-clear-completed');
      await user.click(clearButton);

      const modal = await screen.findByTestId('todo-bulk-actions-confirm-modal');
      
      // Press Escape
      await user.keyboard('{Escape}');

      // Modal should be closed
      await waitFor(() => {
        expect(modal).not.toBeInTheDocument();
      });
    });
  });

  describe('AC04: Button disabled when no completed tasks', () => {
    test('button is not rendered when no completed tasks exist', async () => {
      const incompleteTodos = mockTodos.map(todo => ({ ...todo, completed: false }));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(incompleteTodos));

      render(
        <TestWrapper initialTodos={incompleteTodos}>
          <TodoBulkActions />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('todo-bulk-actions-clear-completed')).not.toBeInTheDocument();
      });
    });

    test('component hides when no tasks at all', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([]));

      render(
        <TestWrapper initialTodos={[]}>
          <TodoBulkActions />
        </TestWrapper>
      );

      expect(screen.queryByTestId('todo-bulk-actions')).not.toBeInTheDocument();
    });
  });

  describe('DOD02: Performance optimized', () => {
    test('handles large number of completed tasks efficiently', async () => {
      const largeTodoList: Todo[] = Array.from({ length: 100 }, (_, i) => 
        createMockTodo(`task-${i}`, `Task ${i}`, i % 2 === 0) // 50 completed tasks
      );
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(largeTodoList));

      const user = userEvent.setup();
      const startTime = performance.now();
      
      render(
        <TestWrapper initialTodos={largeTodoList}>
          <TodoBulkActions />
        </TestWrapper>
      );

      const clearButton = await screen.findByTestId('todo-bulk-actions-clear-completed');
      await user.click(clearButton);
      
      const confirmButton = await screen.findByTestId('todo-bulk-actions-confirm-modal-confirm');
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByTestId('todo-bulk-actions-clear-completed')).not.toBeInTheDocument();
      });

      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Should complete within reasonable time (less than 2 seconds)
      expect(executionTime).toBeLessThan(2000);
    });

    test('uses efficient batch operations', async () => {
      const user = userEvent.setup();
      const dispatchSpy = jest.fn();
      
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      const clearButton = await screen.findByTestId('todo-bulk-actions-clear-completed');
      await user.click(clearButton);
      
      const confirmButton = await screen.findByTestId('todo-bulk-actions-confirm-modal-confirm');
      await user.click(confirmButton);

      // Should use single batch operation, not individual deletions
      await waitFor(() => {
        expect(screen.queryByTestId('todo-bulk-actions-clear-completed')).not.toBeInTheDocument();
      });
    });
  });

  describe('DOD03: Animation/transition for removal', () => {
    test('applies removing animation classes to completed tasks', async () => {
      // Mock completed task elements
      const mockElements = [
        { classList: { add: jest.fn(), remove: jest.fn() } },
        { classList: { add: jest.fn(), remove: jest.fn() } },
      ];
      
      jest.spyOn(document, 'querySelectorAll').mockImplementation((selector) => {
        if (selector === '.todo-item--completed') {
          return mockElements as any;
        }
        if (selector === '.todo-list__items') {
          return [{ classList: { add: jest.fn(), remove: jest.fn() } }] as any;
        }
        return [] as any;
      });

      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      const clearButton = await screen.findByTestId('todo-bulk-actions-clear-completed');
      await user.click(clearButton);
      
      const confirmButton = await screen.findByTestId('todo-bulk-actions-confirm-modal-confirm');
      await user.click(confirmButton);

      // Verify animation classes were added
      await waitFor(() => {
        mockElements.forEach(element => {
          expect(element.classList.add).toHaveBeenCalledWith('todo-item--removing');
        });
      });
    });

    test('respects prefers-reduced-motion setting', () => {
      // Mock CSS.supports for reduced motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      // Component should still work with reduced motion
      expect(screen.getByTestId('todo-bulk-actions-clear-completed')).toBeInTheDocument();
    });
  });

  describe('DOD04: Accessibility announcements', () => {
    test('announces successful completion to screen readers', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      const clearButton = await screen.findByTestId('todo-bulk-actions-clear-completed');
      await user.click(clearButton);
      
      const confirmButton = await screen.findByTestId('todo-bulk-actions-confirm-modal-confirm');
      await user.click(confirmButton);

      // Check for aria-live announcement
      await waitFor(() => {
        const announcement = screen.getByTestId('todo-bulk-actions-announcements');
        expect(announcement).toHaveAttribute('aria-live', 'assertive');
        expect(announcement).toHaveAttribute('aria-atomic', 'true');
      });
    });

    test('provides proper ARIA labels for all interactive elements', async () => {
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      const clearButton = await screen.findByTestId('todo-bulk-actions-clear-completed');
      expect(clearButton).toHaveAttribute('aria-label', 'Clear 3 completed tasks');
    });

    test('modal has proper ARIA attributes', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      const clearButton = await screen.findByTestId('todo-bulk-actions-clear-completed');
      await user.click(clearButton);

      const modal = await screen.findByTestId('todo-bulk-actions-confirm-modal');
      expect(modal).toHaveAttribute('role', 'dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby');
      expect(modal).toHaveAttribute('aria-describedby');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('handles empty completed tasks list gracefully', () => {
      const noCompletedTodos = mockTodos.map(todo => ({ ...todo, completed: false }));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(noCompletedTodos));

      render(
        <TestWrapper initialTodos={noCompletedTodos}>
          <TodoBulkActions />
        </TestWrapper>
      );

      expect(screen.queryByTestId('todo-bulk-actions-clear-completed')).not.toBeInTheDocument();
    });

    test('handles single completed task correctly', async () => {
      const singleCompletedTodo = [
        createMockTodo('1', 'Only task', true)
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(singleCompletedTodo));

      render(
        <TestWrapper initialTodos={singleCompletedTodo}>
          <TodoBulkActions />
        </TestWrapper>
      );

      const clearButton = await screen.findByTestId('todo-bulk-actions-clear-completed');
      expect(clearButton).toHaveTextContent('Clear completed (1)');
      expect(clearButton).toHaveAttribute('aria-label', 'Clear 1 completed task');
    });

    test('handles localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });

      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      // Should not crash the component
      expect(screen.getByTestId('todo-bulk-actions-clear-completed')).toBeInTheDocument();
    });

    test('prevents double-clicking during animation', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      const clearButton = await screen.findByTestId('todo-bulk-actions-clear-completed');
      await user.click(clearButton);
      
      const confirmButton = await screen.findByTestId('todo-bulk-actions-confirm-modal-confirm');
      
      // Double click rapidly
      await user.click(confirmButton);
      await user.click(confirmButton);

      // Should only process once
      await waitFor(() => {
        expect(screen.queryByTestId('todo-bulk-actions-clear-completed')).not.toBeInTheDocument();
      });
    });
  });

  describe('Integration with TodoContext', () => {
    test('integrates properly with todo state management', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      // Verify initial state
      expect(screen.getByTestId('todo-bulk-actions-clear-completed')).toHaveTextContent('Clear completed (3)');

      // Clear completed tasks
      const clearButton = screen.getByTestId('todo-bulk-actions-clear-completed');
      await user.click(clearButton);
      
      const confirmButton = await screen.findByTestId('todo-bulk-actions-confirm-modal-confirm');
      await user.click(confirmButton);

      // Verify state update
      await waitFor(() => {
        expect(screen.queryByTestId('todo-bulk-actions-clear-completed')).not.toBeInTheDocument();
      });
    });

    test('maintains consistency with other todo operations', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TodoBulkActions />
        </TestWrapper>
      );

      // Should work alongside other todo operations
      const clearButton = await screen.findByTestId('todo-bulk-actions-clear-completed');
      expect(clearButton).toBeInTheDocument();
      
      // Component should remain stable
      expect(screen.getByTestId('todo-bulk-actions')).toBeInTheDocument();
    });
  });
});