/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TodoItem } from '../src/components/todo/TodoItem';
import { TodoProvider, useTodoContext } from '../src/lib/TodoContext';
import type { Todo } from '../src/types';
import React, { useEffect } from 'react';

// Mock crypto.randomUUID for test environment
if (!globalThis.crypto) {
  globalThis.crypto = require('crypto');
}

if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = () => require('crypto').randomUUID();
}

// Component that properly manages editing state
const TestTodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
  const { state, dispatch } = useTodoContext();
  
  // Add the todo to the context state if it doesn't exist (only once)
  useEffect(() => {
    if (!state.todos.find(t => t.id === todo.id)) {
      dispatch({ type: 'LOAD_TODOS', payload: { todos: [todo] } });
    }
  }, [todo.id, state.todos.length, dispatch]); // Only depend on ID and todos length to avoid re-running on todo content changes
  
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

// Test component wrapper with TodoContext
const TodoItemWrapper: React.FC<{ todo: Todo; isEditing?: boolean }> = ({ todo, isEditing = false }) => (
  <TodoProvider>
    <TestTodoItem todo={todo} />
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

describe('US05 - Edit Task Text Implementation', () => {
  describe('AC01: Double-click enables edit mode', () => {
    test('double-clicking task text enters edit mode', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Double-click to edit this task' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      // Verify we start in display mode
      expect(screen.getByText('Double-click to edit this task')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Double-click to edit this task')).not.toBeInTheDocument();

      // Double-click the task text
      const taskText = screen.getByText('Double-click to edit this task');
      await user.dblClick(taskText);

      // Should enter edit mode
      await waitFor(() => {
        expect(screen.getByDisplayValue('Double-click to edit this task')).toBeInTheDocument();
      });
    });

    test('double-click event listener is properly attached', () => {
      const mockTodo = createMockTodo({ text: 'Clickable task text' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      const taskText = screen.getByText('Clickable task text');
      
      // Verify the element has appropriate classes for clickability
      expect(taskText).toHaveClass('todo-item__text');
      expect(taskText).toHaveAttribute('title', 'Double-click to edit');
    });

    test('double-click works with different task text lengths', async () => {
      const user = userEvent.setup();
      const longText = 'This is a very long task description that should still be editable by double-clicking anywhere on the text element';
      const mockTodo = createMockTodo({ text: longText });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      const taskText = screen.getByText(longText);
      await user.dblClick(taskText);

      await waitFor(() => {
        expect(screen.getByDisplayValue(longText)).toBeInTheDocument();
      });
    });

    test('double-click does not work on completed tasks', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ 
        text: 'Completed task',
        completed: true 
      });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      const taskText = screen.getByText('Completed task');
      await user.dblClick(taskText);

      // Should NOT enter edit mode for completed tasks
      await waitFor(() => {
        expect(screen.queryByDisplayValue('Completed task')).not.toBeInTheDocument();
      });
    });
  });

  describe('AC02: Text becomes editable input', () => {
    test('edit mode shows input field with current text', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Edit this text' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      // Enter edit mode via double-click
      const taskText = screen.getByText('Edit this text');
      await user.dblClick(taskText);

      // Should show input with current text
      await waitFor(() => {
        const input = screen.getByDisplayValue('Edit this text');
        expect(input).toBeInTheDocument();
        expect(input).toHaveFocus();
        expect(input.tagName).toBe('INPUT');
      });
    });

    test('input field allows text modification', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Original text' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      // Enter edit mode
      await user.dblClick(screen.getByText('Original text'));

      // Modify the text
      const input = await screen.findByDisplayValue('Original text');
      await user.clear(input);
      await user.type(input, 'Modified text');

      expect(input).toHaveValue('Modified text');
    });

    test('input field has proper accessibility attributes', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Accessible editing' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      await user.dblClick(screen.getByText('Accessible editing'));

      const input = await screen.findByDisplayValue('Accessible editing');
      expect(input).toHaveAttribute('placeholder', 'Enter todo text...');
      expect(input).toHaveFocus();
    });
  });

  describe('AC03: Enter saves changes', () => {
    test('pressing Enter saves the edited text', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Save with Enter' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      // Enter edit mode and modify text
      await user.dblClick(screen.getByText('Save with Enter'));
      
      const input = await screen.findByDisplayValue('Save with Enter');
      await user.clear(input);
      await user.type(input, 'Saved with Enter key');

      // Press Enter to save
      await user.keyboard('{Enter}');

      // Should exit edit mode and show updated text
      await waitFor(() => {
        expect(screen.getByText('Saved with Enter key')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      await waitFor(() => {
        expect(screen.queryByDisplayValue('Saved with Enter key')).not.toBeInTheDocument();
      }, { timeout: 2000 });
    });

    test('Shift+Enter does not save (allows multi-line input)', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Multi-line test' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      await user.dblClick(screen.getByText('Multi-line test'));
      
      const input = await screen.findByDisplayValue('Multi-line test');
      
      // Shift+Enter should not save
      await user.keyboard('{Shift>}{Enter}{/Shift}');

      // Should still be in edit mode
      expect(input).toBeInTheDocument();
      expect(input).toHaveFocus();
    });

    test('Enter saves even with only whitespace changes', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Trim whitespace' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      await user.dblClick(screen.getByText('Trim whitespace'));
      
      const input = await screen.findByDisplayValue('Trim whitespace');
      await user.clear(input);
      await user.type(input, '  Trimmed text  ');

      await user.keyboard('{Enter}');

      await waitFor(() => {
        // Text should be trimmed when saved
        expect(screen.getByText('Trimmed text')).toBeInTheDocument();
      });
    });
  });

  describe('AC04: Escape cancels editing', () => {
    test('pressing Escape cancels edit and reverts changes', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Cancel with Escape' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      // Enter edit mode and modify text
      await user.dblClick(screen.getByText('Cancel with Escape'));
      
      const input = await screen.findByDisplayValue('Cancel with Escape');
      await user.clear(input);
      await user.type(input, 'This should be cancelled');

      // Press Escape to cancel
      await user.keyboard('{Escape}');

      // Should exit edit mode and revert to original text
      await waitFor(() => {
        expect(screen.getByText('Cancel with Escape')).toBeInTheDocument();
        expect(screen.queryByDisplayValue('This should be cancelled')).not.toBeInTheDocument();
      });
    });

    test('Escape works when no changes were made', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'No changes made' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      await user.dblClick(screen.getByText('No changes made'));
      
      // Press Escape immediately without changes
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.getByText('No changes made')).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      });
    });

    test('Cancel button also cancels editing', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Cancel button test' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      await user.dblClick(screen.getByText('Cancel button test'));
      
      const input = await screen.findByDisplayValue('Cancel button test');
      await user.clear(input);
      await user.type(input, 'Modified text');

      // Click Cancel button
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.getByText('Cancel button test')).toBeInTheDocument();
        expect(screen.queryByDisplayValue('Modified text')).not.toBeInTheDocument();
      });
    });
  });

  describe('AC05: Visual indicator for edit mode', () => {
    test('edit mode has distinct visual styling', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Visual indicator test' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      // Check normal display mode styling
      const todoItem = screen.getByTestId('todo-item');
      expect(todoItem).not.toHaveClass('todo-item--editing');

      // Enter edit mode
      await user.dblClick(screen.getByText('Visual indicator test'));

      // Should have editing class
      await waitFor(() => {
        expect(todoItem).toHaveClass('todo-item--editing');
      });
    });

    test('edit form shows Save and Cancel buttons', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Button visibility test' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      await user.dblClick(screen.getByText('Button visibility test'));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      });
    });

    test('input field is auto-focused in edit mode', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Auto-focus test' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      await user.dblClick(screen.getByText('Auto-focus test'));

      const input = await screen.findByDisplayValue('Auto-focus test');
      expect(input).toHaveFocus();
    });
  });

  describe('DOD01: Edit functionality works smoothly', () => {
    test('rapid double-clicks do not cause issues', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Rapid click test' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      const taskText = screen.getByText('Rapid click test');
      
      // Multiple rapid double-clicks
      await user.dblClick(taskText);
      await user.dblClick(taskText);
      await user.dblClick(taskText);

      // Should still work correctly
      await waitFor(() => {
        expect(screen.getByDisplayValue('Rapid click test')).toBeInTheDocument();
      });
    });

    test('edit mode handles special characters correctly', async () => {
      const user = userEvent.setup();
      const specialText = 'Special chars: @#$%^&*()';
      const mockTodo = createMockTodo({ text: specialText });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      await user.dblClick(screen.getByText(specialText));

      const input = await screen.findByDisplayValue(specialText);
      expect(input).toBeInTheDocument();

      // Modify and save
      await user.clear(input);
      await user.type(input, 'Updated: @#$%^&*()');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Updated: @#$%^&*()')).toBeInTheDocument();
      });
    });
  });

  describe('DOD02: Keyboard navigation supported', () => {
    test('Tab navigation works correctly in edit mode', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Tab navigation test' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      await user.dblClick(screen.getByText('Tab navigation test'));

      await waitFor(() => {
        const input = screen.getByDisplayValue('Tab navigation test');
        expect(input).toHaveFocus();
      });

      // Tab to priority select
      await user.keyboard('{Tab}');
      expect(screen.getByRole('combobox')).toHaveFocus();

      // Tab to category input
      await user.keyboard('{Tab}');
      const categoryInput = screen.getByPlaceholderText('Category (optional)');
      expect(categoryInput).toHaveFocus();

      // Tab to Save button
      await user.keyboard('{Tab}');
      expect(screen.getByRole('button', { name: /save/i })).toHaveFocus();

      // Tab to Cancel button
      await user.keyboard('{Tab}');
      expect(screen.getByRole('button', { name: /cancel/i })).toHaveFocus();
    });

    test('keyboard shortcuts work in edit mode', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Keyboard shortcuts test' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      await user.dblClick(screen.getByText('Keyboard shortcuts test'));

      const input = await screen.findByDisplayValue('Keyboard shortcuts test');
      
      // Clear the input and type new text
      await user.clear(input);
      await user.type(input, 'Replaced text');
      
      expect(input).toHaveValue('Replaced text');
    });
  });

  describe('DOD03: Touch devices supported', () => {
    test('touch events trigger edit mode', () => {
      const mockTodo = createMockTodo({ text: 'Touch event test' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      const taskText = screen.getByText('Touch event test');
      
      // Simulate touch double-tap (using double-click event)
      fireEvent.doubleClick(taskText);

      expect(screen.getByDisplayValue('Touch event test')).toBeInTheDocument();
    });

    test('task text has appropriate touch target size', () => {
      const mockTodo = createMockTodo({ text: 'Touch target test' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      const taskText = screen.getByText('Touch target test');
      const styles = window.getComputedStyle(taskText);
      
      // Should have sufficient padding for touch targets
      expect(taskText).toHaveStyle({ padding: 'var(--spacing-1) var(--spacing-2)' });
    });
  });

  describe('DOD04: Data validation implemented', () => {
    test('empty text shows validation error', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Validation test' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      await user.dblClick(screen.getByText('Validation test'));

      const input = await screen.findByDisplayValue('Validation test');
      await user.clear(input);
      await user.keyboard('{Enter}');

      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/todo text cannot be empty/i)).toBeInTheDocument();
      });
      
      // Should stay in edit mode
      expect(input).toBeInTheDocument();
    });

    test('whitespace-only text shows validation error', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Whitespace test' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      await user.dblClick(screen.getByText('Whitespace test'));

      const input = await screen.findByDisplayValue('Whitespace test');
      await user.clear(input);
      await user.type(input, '   ');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText(/todo text cannot be empty/i)).toBeInTheDocument();
      });
    });

    test('Save button is disabled for invalid input', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Save button test' });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      await user.dblClick(screen.getByText('Save button test'));

      const input = await screen.findByDisplayValue('Save button test');
      await user.clear(input);

      // Save button should be disabled for empty input
      const saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Integration with existing functionality', () => {
    test('edit mode preserves task completion status', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ 
        text: 'Incomplete task edit',
        completed: false 
      });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      // Should show as incomplete
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      // Edit the task text
      await user.dblClick(screen.getByText('Incomplete task edit'));
      
      const input = await screen.findByDisplayValue('Incomplete task edit');
      await user.clear(input);
      await user.type(input, 'Updated incomplete task');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Updated incomplete task')).toBeInTheDocument();
        // Should still be incomplete
        expect(screen.getByRole('checkbox')).not.toBeChecked();
      });

      // Now mark it as complete
      await user.click(screen.getByRole('checkbox'));
      
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeChecked();
      });
    });

    test('edit mode works with different todo priorities', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ 
        text: 'Priority task',
        priority: 'high'
      });
      
      render(<TodoItemWrapper todo={mockTodo} />);

      await user.dblClick(screen.getByText('Priority task'));

      // Should show priority selector in edit mode
      await waitFor(() => {
        const prioritySelect = screen.getByRole('combobox');
        expect(prioritySelect).toHaveValue('high');
      });
    });
  });
});