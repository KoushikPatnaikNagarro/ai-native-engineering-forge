/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TodoList } from '../src/components/todo/TodoList';
import { TodoForm } from '../src/components/todo/TodoForm';
import { TodoProvider } from '../src/lib/TodoContext';

// Integration test wrapper with both TodoForm and TodoList
const IntegrationTestApp = () => (
  <TodoProvider>
    <div>
      <TodoForm testId="todo-form" />
      <TodoList testId="todo-list" />
    </div>
  </TodoProvider>
);

// Clean up after each test to ensure fresh state
afterEach(() => {
  cleanup();
});

describe('US04 - TodoList Integration Tests', () => {
  describe('AC01 & AC02: Task Display and Ordering', () => {
    test('displays tasks in chronological order with text and status', async () => {
      const user = userEvent.setup();
      
      render(<IntegrationTestApp />);

      // Initially should show empty state
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();

      // Add first task
      const input = screen.getByLabelText(/add new todo/i);
      await user.type(input, 'First task');
      await user.keyboard('{Enter}');

      // Should show the first task
      await waitFor(() => {
        expect(screen.getByText('First task')).toBeInTheDocument();
      });

      // Add second task (should appear at top)
      await user.type(input, 'Second task');
      await user.keyboard('{Enter}');

      // Should show both tasks with second task first (newest at top)
      await waitFor(() => {
        expect(screen.getByText('Second task')).toBeInTheDocument();
        expect(screen.getByText('First task')).toBeInTheDocument();
      });

      // Verify order by checking the DOM structure
      const todoItems = screen.getAllByText(/task$/);
      expect(todoItems[0]).toHaveTextContent('Second task');
      expect(todoItems[1]).toHaveTextContent('First task');
    });

    test('shows task completion status visually', async () => {
      const user = userEvent.setup();
      
      render(<IntegrationTestApp />);

      // Add a task
      const input = screen.getByLabelText(/add new todo/i);
      await user.type(input, 'Task to complete');
      await user.keyboard('{Enter}');

      // Task should appear
      await waitFor(() => {
        expect(screen.getByText('Task to complete')).toBeInTheDocument();
      });

      // Check for completion checkbox
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();

      // Complete the task
      await user.click(checkbox);

      // Verify task is marked as completed
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });
  });

  describe('AC03: Dynamic Updates', () => {
    test('list updates when new tasks are added', async () => {
      const user = userEvent.setup();
      
      render(<IntegrationTestApp />);

      // Start with empty state
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();

      // Add first task
      const input = screen.getByLabelText(/add new todo/i);
      await user.type(input, 'Dynamic task 1');
      await user.keyboard('{Enter}');

      // List should update to show the task
      await waitFor(() => {
        expect(screen.getByText('Dynamic task 1')).toBeInTheDocument();
        expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
      });

      // Add second task
      await user.type(input, 'Dynamic task 2');
      await user.keyboard('{Enter}');

      // Both tasks should be visible
      await waitFor(() => {
        expect(screen.getByText('Dynamic task 1')).toBeInTheDocument();
        expect(screen.getByText('Dynamic task 2')).toBeInTheDocument();
      });
    });

    test('list updates when task status changes', async () => {
      const user = userEvent.setup();
      
      render(<IntegrationTestApp />);

      // Add a task
      const input = screen.getByLabelText(/add new todo/i);
      await user.type(input, 'Status change task');
      await user.keyboard('{Enter}');

      // Wait for task to appear
      await waitFor(() => {
        expect(screen.getByText('Status change task')).toBeInTheDocument();
      });

      // Find and toggle the checkbox
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);

      // Verify the status changed
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });

    test('input clears after adding task', async () => {
      const user = userEvent.setup();
      
      render(<IntegrationTestApp />);

      const input = screen.getByLabelText(/add new todo/i);
      
      // Add a task
      await user.type(input, 'Clear input test');
      expect(input).toHaveValue('Clear input test');
      
      await user.keyboard('{Enter}');

      // Input should be cleared
      await waitFor(() => {
        expect(input).toHaveValue('');
      });

      // Task should appear in list
      await waitFor(() => {
        expect(screen.getByText('Clear input test')).toBeInTheDocument();
      });
    });
  });

  describe('AC04: Empty State Handling', () => {
    test('gracefully handles empty state', () => {
      render(<IntegrationTestApp />);

      // Should show empty state with helpful message
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
      expect(screen.getByText(/start by adding your first todo item/i)).toBeInTheDocument();
      expect(screen.getByText(/click the.*add.*button/i)).toBeInTheDocument();

      // Should show empty state icon
      const todoList = screen.getByTestId('todo-list');
      const svgIcon = todoList.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
    });

    test('transitions from empty to populated state', async () => {
      const user = userEvent.setup();
      
      render(<IntegrationTestApp />);

      // Start with empty state
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();

      // Add a task
      const input = screen.getByLabelText(/add new todo/i);
      await user.type(input, 'Transition test todo');
      await user.keyboard('{Enter}');

      // Should transition to populated state
      await waitFor(() => {
        expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
        expect(screen.getByText('Transition test todo')).toBeInTheDocument();
      });
    });
  });

  describe('Performance and User Experience', () => {
    test('handles multiple rapid additions', async () => {
      const user = userEvent.setup();
      
      render(<IntegrationTestApp />);

      const input = screen.getByLabelText(/add new todo/i);

      // Add multiple tasks rapidly
      for (let i = 1; i <= 3; i++) {
        await user.type(input, `Rapid task ${i}`);
        await user.keyboard('{Enter}');
      }

      // All tasks should appear in correct order
      await waitFor(() => {
        for (let i = 1; i <= 3; i++) {
          expect(screen.getByText(`Rapid task ${i}`)).toBeInTheDocument();
        }
      });

      // Newest should be first (Rapid task 3)
      const todoItems = screen.getAllByText(/rapid task/i);
      expect(todoItems[0]).toHaveTextContent('Rapid task 3');
    });

    test('maintains performance with empty and populated states', async () => {
      const user = userEvent.setup();
      
      render(<IntegrationTestApp />);

      const input = screen.getByLabelText(/add new todo/i);

      // Empty state should render quickly
      expect(screen.getByTestId('todo-list')).toBeInTheDocument();

      // Add task
      await user.type(input, 'Performance test task');
      await user.keyboard('{Enter}');

      // Populated state should render quickly
      await waitFor(() => {
        expect(screen.getByText('Performance test task')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('handles empty task submission gracefully', async () => {
      const user = userEvent.setup();
      
      render(<IntegrationTestApp />);

      const input = screen.getByLabelText(/add new todo/i);

      // Start with empty state confirmation
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();

      // Focus input and try to submit empty task
      await user.click(input);
      await user.keyboard('{Enter}');

      // Should show validation error and not add empty task
      await waitFor(() => {
        expect(screen.getByText(/todo text cannot be empty/i)).toBeInTheDocument();
      });

      // Should still show empty state since no valid task was added
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    });

    test('handles whitespace-only submissions', async () => {
      const user = userEvent.setup();
      
      render(<IntegrationTestApp />);

      const input = screen.getByLabelText(/add new todo/i);

      // Try to submit whitespace-only task
      await user.type(input, '   ');
      await user.keyboard('{Enter}');

      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/todo text cannot be empty/i)).toBeInTheDocument();
      });
    });

    test('handles special characters in task text', async () => {
      const user = userEvent.setup();
      
      render(<IntegrationTestApp />);

      const input = screen.getByLabelText(/add new todo/i);
      const specialText = 'Buy milk & eggs @ store (2pm) - $5.99';

      await user.type(input, specialText);
      await user.keyboard('{Enter}');

      // Task with special characters should be added
      await waitFor(() => {
        expect(screen.getByText(specialText)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility and Usability', () => {
    test('provides proper ARIA labels and structure', () => {
      render(<IntegrationTestApp />);

      // TodoList should have proper test id
      expect(screen.getByTestId('todo-list')).toBeInTheDocument();
      
      // TodoForm should have proper accessibility
      expect(screen.getByLabelText(/add new todo/i)).toBeInTheDocument();
    });

    test('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(<IntegrationTestApp />);

      // Should be able to focus on input
      const input = screen.getByLabelText(/add new todo/i);
      await user.click(input);
      expect(input).toHaveFocus();

      // Should be able to submit with Enter
      await user.type(input, 'Keyboard test task');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Keyboard test task')).toBeInTheDocument();
      });
    });
  });
});