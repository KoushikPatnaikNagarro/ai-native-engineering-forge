import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskInput } from '@/components/features/TaskInput';

describe('TaskInput Component', () => {
  it('should render input and button', () => {
    const mockOnAddTask = vi.fn();
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('should allow submission when input is empty for error handling', () => {
    const mockOnAddTask = vi.fn();
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    const button = screen.getByRole('button', { name: /add task/i });
    expect(button).not.toBeDisabled();
  });

  it('should enable button when input has content', async () => {
    const mockOnAddTask = vi.fn();
    const user = userEvent.setup();
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, 'New task');
    
    const button = screen.getByRole('button', { name: /add task/i });
    expect(button).not.toBeDisabled();
  });

  it('should call onAddTask when form is submitted', async () => {
    const mockOnAddTask = vi.fn();
    const user = userEvent.setup();
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, 'New task');
    await user.click(screen.getByRole('button', { name: /add task/i }));
    
    expect(mockOnAddTask).toHaveBeenCalledWith({ content: 'New task' });
  });

  it('should submit form on Enter key press', async () => {
    const mockOnAddTask = vi.fn();
    const user = userEvent.setup();
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, 'New task{enter}');
    
    expect(mockOnAddTask).toHaveBeenCalledWith({ content: 'New task' });
  });

  it('should clear input after submission', async () => {
    const mockOnAddTask = vi.fn();
    const user = userEvent.setup();
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, 'New task');
    await user.click(screen.getByRole('button', { name: /add task/i }));
    
    expect(input).toHaveValue('');
  });

  it('should show error for empty submission', async () => {
    const mockOnAddTask = vi.fn();
    const user = userEvent.setup();
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    // Try to submit without content
    await user.click(screen.getByRole('button', { name: /add task/i }));
    
    expect(screen.getByText('Please enter a task')).toBeInTheDocument();
    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  it('should trim whitespace before submission', async () => {
    const mockOnAddTask = vi.fn();
    const user = userEvent.setup();
    render(<TaskInput onAddTask={mockOnAddTask} />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, '  Spaced task  ');
    await user.click(screen.getByRole('button', { name: /add task/i }));
    
    expect(mockOnAddTask).toHaveBeenCalledWith({ content: 'Spaced task' });
  });

  it('should be disabled when disabled prop is true', () => {
    const mockOnAddTask = vi.fn();
    render(<TaskInput onAddTask={mockOnAddTask} disabled />);
    
    const input = screen.getByPlaceholderText('Add a new task...');
    const button = screen.getByRole('button', { name: /add task/i });
    
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});