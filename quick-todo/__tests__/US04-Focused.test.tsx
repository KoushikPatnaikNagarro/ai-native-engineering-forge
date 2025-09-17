/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TodoList } from '../src/components/todo/TodoList';
import { TodoForm } from '../src/components/todo/TodoForm';
import { TodoProvider } from '../src/lib/TodoContext';

// Fresh integration test wrapper for each test
const createTestApp = () => (
  <TodoProvider>
    <div>
      <TodoForm testId="todo-form" />
      <TodoList testId="todo-list" />
    </div>
  </TodoProvider>
);

describe('US04 - Display Task List (Focused Tests)', () => {
  describe('AC01: Tasks display in order of creation', () => {
    test('shows tasks in chronological order (newest first)', async () => {
      const user = userEvent.setup();
      render(createTestApp());

      const input = screen.getByLabelText(/add new todo/i);

      // Add first task
      await user.type(input, 'First task');
      await user.keyboard('{Enter}');

      // Add second task
      await user.type(input, 'Second task');
      await user.keyboard('{Enter}');

      // Check that tasks appear in chronological order (newest first)
      await waitFor(() => {
        const todoItems = screen.getAllByText(/task$/);
        expect(todoItems[0]).toHaveTextContent('Second task');
        expect(todoItems[1]).toHaveTextContent('First task');
      });
    });
  });

  describe('AC02: Each task shows text and status', () => {
    test('displays task text and completion status', async () => {
      const user = userEvent.setup();
      render(createTestApp());

      const input = screen.getByLabelText(/add new todo/i);

      // Add a task
      await user.type(input, 'Test task with status');
      await user.keyboard('{Enter}');

      // Verify task text is displayed
      await waitFor(() => {
        expect(screen.getByText('Test task with status')).toBeInTheDocument();
      });

      // Verify completion status (checkbox) is displayed
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();

      // Complete the task
      await user.click(checkbox);

      // Verify status changed
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });
  });

  describe('AC03: List updates dynamically', () => {
    test('updates immediately when new tasks are added', async () => {
      const user = userEvent.setup();
      render(createTestApp());

      const input = screen.getByLabelText(/add new todo/i);

      // Initially empty
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();

      // Add task and verify it appears immediately
      await user.type(input, 'Dynamic update test');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Dynamic update test')).toBeInTheDocument();
        expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
      });
    });

    test('updates when task status changes', async () => {
      const user = userEvent.setup();
      render(createTestApp());

      const input = screen.getByLabelText(/add new todo/i);

      // Add task
      await user.type(input, 'Status update test');
      await user.keyboard('{Enter}');

      // Get checkbox and verify initial state
      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
      });

      // Toggle status
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      // Verify status updated
      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });
  });

  describe('AC04: Empty state handled gracefully', () => {
    test('shows helpful empty state message', () => {
      render(createTestApp());

      // Should show empty state with helpful message
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
      expect(screen.getByText(/start by adding your first todo item/i)).toBeInTheDocument();
      expect(screen.getByText(/click the.*add.*button/i)).toBeInTheDocument();

      // Should show empty state icon
      const todoList = screen.getByTestId('todo-list');
      const svgIcon = todoList.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
    });

    test('transitions smoothly from empty to populated state', async () => {
      const user = userEvent.setup();
      render(createTestApp());

      // Start with empty state
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();

      // Add a task
      const input = screen.getByLabelText(/add new todo/i);
      await user.type(input, 'First todo item');
      await user.keyboard('{Enter}');

      // Should transition to populated state
      await waitFor(() => {
        expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
        expect(screen.getByText('First todo item')).toBeInTheDocument();
      });
    });
  });

  describe('Integration Validation', () => {
    test('all acceptance criteria work together', async () => {
      const user = userEvent.setup();
      render(createTestApp());

      const input = screen.getByLabelText(/add new todo/i);

      // AC04: Start with empty state
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();

      // AC03: Dynamic updates - add first task
      await user.type(input, 'Integration test 1');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        // AC04: Empty state transitions to populated
        expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
        // AC02: Task text is displayed
        expect(screen.getByText('Integration test 1')).toBeInTheDocument();
      });

      // AC03: Dynamic updates - add second task
      await user.type(input, 'Integration test 2');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        // AC01: Tasks in chronological order (newest first)
        const todoItems = screen.getAllByText(/integration test/i);
        expect(todoItems[0]).toHaveTextContent('Integration test 2');
        expect(todoItems[1]).toHaveTextContent('Integration test 1');
      });

      // AC02: Status visibility and interaction
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2);
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();

      // AC03: Dynamic status updates
      await user.click(checkboxes[0]);
      await waitFor(() => {
        expect(checkboxes[0]).toBeChecked();
        expect(checkboxes[1]).not.toBeChecked();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles empty submissions gracefully', async () => {
      const user = userEvent.setup();
      render(createTestApp());

      const input = screen.getByLabelText(/add new todo/i);

      // Try to submit empty task
      await user.click(input);
      await user.keyboard('{Enter}');

      // Should show validation error and maintain empty state
      await waitFor(() => {
        expect(screen.getByText(/todo text cannot be empty/i)).toBeInTheDocument();
        expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
      });
    });

    test('handles special characters in task text', async () => {
      const user = userEvent.setup();
      render(createTestApp());

      const input = screen.getByLabelText(/add new todo/i);
      const specialText = 'Task with symbols: @#$%^&*()';

      await user.type(input, specialText);
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText(specialText)).toBeInTheDocument();
      });
    });
  });
});