import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskItem } from '@/components/features/TaskItem';
import type { TodoItem } from '@/types/todo';

const mockTodo: TodoItem = {
  id: '1',
  content: 'Test task',
  status: 'open',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

const mockCompletedTodo: TodoItem = {
  ...mockTodo,
  id: '2',
  content: 'Completed task',
  status: 'completed',
};

describe('TaskItem Component', () => {
  const mockOnToggleStatus = vi.fn();
  const mockOnUpdateContent = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render task content and checkbox', () => {
    render(
      <TaskItem
        todo={mockTodo}
        onToggleStatus={mockOnToggleStatus}
        onUpdateContent={mockOnUpdateContent}
      />
    );
    
    expect(screen.getByText('Test task')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('1/1/2023')).toBeInTheDocument();
  });

  it('should show checkbox as unchecked for open task', () => {
    render(
      <TaskItem
        todo={mockTodo}
        onToggleStatus={mockOnToggleStatus}
        onUpdateContent={mockOnUpdateContent}
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should show checkbox as checked for completed task', () => {
    render(
      <TaskItem
        todo={mockCompletedTodo}
        onToggleStatus={mockOnToggleStatus}
        onUpdateContent={mockOnUpdateContent}
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should apply completed styling for completed tasks', () => {
    render(
      <TaskItem
        todo={mockCompletedTodo}
        onToggleStatus={mockOnToggleStatus}
        onUpdateContent={mockOnUpdateContent}
      />
    );
    
    const taskContent = screen.getByText('Completed task');
    expect(taskContent).toHaveClass('line-through');
  });

  it('should call onToggleStatus when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        todo={mockTodo}
        onToggleStatus={mockOnToggleStatus}
        onUpdateContent={mockOnUpdateContent}
      />
    );
    
    await user.click(screen.getByRole('checkbox'));
    expect(mockOnToggleStatus).toHaveBeenCalledWith('1');
  });

  it('should enter edit mode on double click', async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        todo={mockTodo}
        onToggleStatus={mockOnToggleStatus}
        onUpdateContent={mockOnUpdateContent}
      />
    );
    
    await user.dblClick(screen.getByText('Test task'));
    
    const input = screen.getByDisplayValue('Test task');
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('should save changes on Enter key', async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        todo={mockTodo}
        onToggleStatus={mockOnToggleStatus}
        onUpdateContent={mockOnUpdateContent}
      />
    );
    
    await user.dblClick(screen.getByText('Test task'));
    const input = screen.getByDisplayValue('Test task');
    
    await user.clear(input);
    await user.type(input, 'Updated task{enter}');
    
    expect(mockOnUpdateContent).toHaveBeenCalledWith('1', 'Updated task');
  });

  it('should cancel changes on Escape key', async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        todo={mockTodo}
        onToggleStatus={mockOnToggleStatus}
        onUpdateContent={mockOnUpdateContent}
      />
    );
    
    await user.dblClick(screen.getByText('Test task'));
    const input = screen.getByDisplayValue('Test task');
    
    await user.clear(input);
    await user.type(input, 'Updated task{escape}');
    
    expect(mockOnUpdateContent).not.toHaveBeenCalled();
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('should save changes on blur', async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        todo={mockTodo}
        onToggleStatus={mockOnToggleStatus}
        onUpdateContent={mockOnUpdateContent}
      />
    );
    
    await user.dblClick(screen.getByText('Test task'));
    const input = screen.getByDisplayValue('Test task');
    
    await user.clear(input);
    await user.type(input, 'Updated task');
    await user.tab(); // Triggers blur
    
    expect(mockOnUpdateContent).toHaveBeenCalledWith('1', 'Updated task');
  });

  it('should not save if content is unchanged', async () => {
    const user = userEvent.setup();
    render(
      <TaskItem
        todo={mockTodo}
        onToggleStatus={mockOnToggleStatus}
        onUpdateContent={mockOnUpdateContent}
      />
    );
    
    await user.dblClick(screen.getByText('Test task'));
    const input = screen.getByDisplayValue('Test task');
    await user.tab(); // Blur without changes
    
    expect(mockOnUpdateContent).not.toHaveBeenCalled();
  });
});