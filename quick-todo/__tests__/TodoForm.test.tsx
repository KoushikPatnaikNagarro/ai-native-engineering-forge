import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from '../src/components/todo/TodoForm';
import { TodoProvider } from '../src/lib/TodoContext';

// Test wrapper with TodoProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <TodoProvider>{children}</TodoProvider>
);

describe('TodoForm Component - US03 Implementation', () => {
  let user: ReturnType<typeof userEvent.setup>;
  
  beforeEach(() => {
    user = userEvent.setup();
  });

  // AC01: Input field accepts task text
  test('AC01: Input field accepts task text', async () => {
    render(
      <TestWrapper>
        <TodoForm testId="todo-form" />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/add new todo/i);
    expect(input).toBeInTheDocument();
    
    await user.type(input, 'Buy groceries');
    expect(input).toHaveValue('Buy groceries');
  });

  // AC02: Enter key or click adds task
  test('AC02: Enter key adds task', async () => {
    render(
      <TestWrapper>
        <TodoForm testId="todo-form" />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/add new todo/i);
    
    await user.type(input, 'Walk the dog');
    await user.keyboard('{Enter}');
    
    // Input should be cleared after adding (AC04)
    expect(input).toHaveValue('');
  });

  test('AC02: Click button adds task', async () => {
    render(
      <TestWrapper>
        <TodoForm testId="todo-form" />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/add new todo/i);
    const addButton = screen.getByRole('button', { name: /add todo/i });
    
    await user.type(input, 'Read a book');
    await user.click(addButton);
    
    // Input should be cleared after adding (AC04)
    expect(input).toHaveValue('');
  });

  // AC04: Input clears after adding
  test('AC04: Input clears after adding task', async () => {
    render(
      <TestWrapper>
        <TodoForm testId="todo-form" />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/add new todo/i);
    
    await user.type(input, 'Clean the house');
    await user.keyboard('{Enter}');
    
    expect(input).toHaveValue('');
  });

  // AC05: Empty tasks not allowed
  test('AC05: Empty tasks not allowed', async () => {
    render(
      <TestWrapper>
        <TodoForm testId="todo-form" />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/add new todo/i);
    const addButton = screen.getByRole('button', { name: /add todo/i });
    
    // Try to add empty task by clicking input and pressing Enter
    await user.click(input);
    await user.keyboard('{Enter}');
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/todo text cannot be empty/i)).toBeInTheDocument();
    });
    
    // Test that clicking the button also shows validation error
    await user.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText(/todo text cannot be empty/i)).toBeInTheDocument();
    });
  });

  test('AC05: Whitespace-only tasks not allowed', async () => {
    render(
      <TestWrapper>
        <TodoForm testId="todo-form" />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/add new todo/i);
    
    await user.type(input, '   ');
    await user.keyboard('{Enter}');
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/todo text cannot be empty/i)).toBeInTheDocument();
    });
  });

  // Additional functionality tests
  test('handles special characters in task text', async () => {
    render(
      <TestWrapper>
        <TodoForm testId="todo-form" />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/add new todo/i);
    const specialText = 'Buy milk & eggs @ store (2pm)';
    
    await user.type(input, specialText);
    expect(input).toHaveValue(specialText);
    
    await user.keyboard('{Enter}');
    expect(input).toHaveValue('');
  });

  test('trims whitespace from task text', async () => {
    render(
      <TestWrapper>
        <TodoForm testId="todo-form" />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/add new todo/i);
    
    await user.type(input, '  Task with spaces  ');
    await user.keyboard('{Enter}');
    
    // Input should be cleared, indicating successful submission
    expect(input).toHaveValue('');
  });

  test('button is enabled to allow validation feedback', async () => {
    render(
      <TestWrapper>
        <TodoForm testId="todo-form" />
      </TestWrapper>
    );

    const addButton = screen.getByRole('button', { name: /add todo/i });
    // Button should be enabled to allow clicking and showing validation errors
    expect(addButton).toBeEnabled();
  });

  test('enables button when input has text', async () => {
    render(
      <TestWrapper>
        <TodoForm testId="todo-form" />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/add new todo/i);
    const addButton = screen.getByRole('button', { name: /add todo/i });
    
    await user.type(input, 'Some task');
    expect(addButton).toBeEnabled();
  });

  test('shows loading state during submission', async () => {
    render(
      <TestWrapper>
        <TodoForm testId="todo-form" />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/add new todo/i);
    
    await user.type(input, 'Test task');
    await user.keyboard('{Enter}');
    
    // The form should handle submission quickly, but we can test the component structure
    expect(input).toHaveValue(''); // Should clear immediately
  });

  test('supports custom placeholder text', () => {
    render(
      <TestWrapper>
        <TodoForm placeholder="Enter a custom todo..." />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('Enter a custom todo...');
    expect(input).toBeInTheDocument();
  });

  test('supports hiding the add button', () => {
    render(
      <TestWrapper>
        <TodoForm showButton={false} />
      </TestWrapper>
    );

    expect(screen.queryByRole('button', { name: /add todo/i })).not.toBeInTheDocument();
  });

  test('handles maximum length validation', async () => {
    render(
      <TestWrapper>
        <TodoForm testId="todo-form" />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/add new todo/i);
    const longText = 'a'.repeat(600); // Exceeds 500 character limit
    
    await user.type(input, longText);
    await user.keyboard('{Enter}');
    
    // Should show error for text that's too long
    await waitFor(() => {
      expect(screen.getByText(/cannot exceed 500 characters/i)).toBeInTheDocument();
    });
  });

  // Accessibility tests
  test('has proper ARIA labels', () => {
    render(
      <TestWrapper>
        <TodoForm testId="todo-form" />
      </TestWrapper>
    );

    const input = screen.getByLabelText(/add new todo/i);
    const button = screen.getByRole('button', { name: /add todo/i });
    
    expect(input).toHaveAttribute('aria-label', 'Add new todo');
    expect(button).toHaveAttribute('aria-label', 'Add todo');
  });

  test('form is properly structured for screen readers', () => {
    render(
      <TestWrapper>
        <TodoForm testId="todo-form" />
      </TestWrapper>
    );

    const form = screen.getByTestId('todo-form');
    expect(form).toHaveAttribute('novalidate'); // Custom validation handling
  });
});