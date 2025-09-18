/**
 * TaskCounter Component Tests
 * 
 * US15 Task Counter Implementation Tests
 * Tests all acceptance criteria:
 * - AC01: Counter shows remaining open tasks
 * - AC02: Updates dynamically with changes  
 * - AC03: Proper pluralization (1 item vs 2 items)
 * - AC04: Counter visible and prominent
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { TaskCounter } from '../../src/components/ui/TaskCounter';
import { Todo } from '../../src/types';

// Mock data for testing
const mockTodos: Todo[] = [
  {
    id: '1',
    text: 'Active todo 1',
    completed: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    text: 'Active todo 2',
    completed: false,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    text: 'Completed todo',
    completed: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];

// Mock the useTodoContext hook directly
const mockUseTodoContext = jest.fn();

jest.mock('../../src/lib/TodoContext', () => ({
  useTodoContext: () => mockUseTodoContext(),
}));

// Helper function to setup mock context
const setupMockContext = (todos: Todo[] = []) => {
  mockUseTodoContext.mockReturnValue({
    state: {
      todos,
      filter: 'all' as const,
      sort: 'created' as const,
      loading: false,
      error: null,
      ui: {
        showAddForm: false,
        editingTodoId: null,
        searchText: '',
        sidebarOpen: false,
        theme: 'light' as const,
        compactView: false,
      },
    },
    dispatch: jest.fn(),
  });
};

describe('TaskCounter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // US15 AC01: Counter shows remaining open tasks
  describe('AC01: Shows remaining open tasks', () => {
    it('displays correct count for active todos', () => {
      setupMockContext(mockTodos);
      
      render(<TaskCounter testId="task-counter" />);

      // Should show 2 active todos (first two are not completed)
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('items left')).toBeInTheDocument();
    });

    it('shows zero when no active todos', () => {
      const completedTodos = mockTodos.map(todo => ({ ...todo, completed: true }));
      setupMockContext(completedTodos);
      
      render(<TaskCounter testId="task-counter" />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('items left')).toBeInTheDocument();
    });

    it('shows special message when no todos exist', () => {
      setupMockContext([]);
      
      render(<TaskCounter testId="task-counter" />);

      expect(screen.getByText('Ready to add your first todo!')).toBeInTheDocument();
    });
  });

  // US15 AC03: Proper pluralization (1 item vs 2 items)
  describe('AC03: Proper pluralization', () => {
    it('uses singular form for 1 item', () => {
      const singleTodo = [mockTodos[0]]; // One active todo
      setupMockContext(singleTodo);
      
      render(<TaskCounter testId="task-counter" />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('item left')).toBeInTheDocument();
    });

    it('uses plural form for 0 items', () => {
      setupMockContext([]);
      
      render(<TaskCounter testId="task-counter" />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('items left')).toBeInTheDocument();
    });

    it('uses plural form for multiple items', () => {
      const multipleTodos = mockTodos.slice(0, 2); // Two active todos
      setupMockContext(multipleTodos);
      
      render(<TaskCounter testId="task-counter" />);

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('items left')).toBeInTheDocument();
    });
  });

  // US15 AC04: Counter visible and prominent
  describe('AC04: Visible and prominent display', () => {
    it('renders with proper accessibility attributes', () => {
      setupMockContext(mockTodos);
      
      render(<TaskCounter testId="task-counter" />);

      const counter = screen.getByTestId('task-counter');
      expect(counter).toHaveAttribute('role', 'status');
      expect(counter).toHaveAttribute('aria-live', 'polite');
      expect(counter).toHaveAttribute('aria-label');
    });

    it('applies correct CSS classes for prominence', () => {
      setupMockContext(mockTodos);
      
      render(<TaskCounter testId="task-counter" />);

      const counter = screen.getByTestId('task-counter');
      expect(counter).toHaveClass('task-counter');
    });

    it('accepts custom className', () => {
      setupMockContext(mockTodos);
      
      render(<TaskCounter testId="task-counter" className="custom-class" />);

      const counter = screen.getByTestId('task-counter');
      expect(counter).toHaveClass('task-counter', 'custom-class');
    });
  });

  // Breakdown functionality
  describe('Breakdown display', () => {
    it('shows breakdown when showBreakdown is true', () => {
      setupMockContext(mockTodos);
      
      render(<TaskCounter testId="task-counter" showBreakdown />);

      // Should show completed count and total count
      expect(screen.getByText('completed')).toBeInTheDocument();
      expect(screen.getByText('total')).toBeInTheDocument();
    });

    it('hides breakdown when showBreakdown is false', () => {
      setupMockContext(mockTodos);
      
      render(<TaskCounter testId="task-counter" showBreakdown={false} />);

      // Should not show breakdown section
      expect(screen.queryByText('completed')).not.toBeInTheDocument();
      expect(screen.queryByText('total')).not.toBeInTheDocument();
    });

    it('applies detailed styling when showBreakdown is true', () => {
      setupMockContext(mockTodos);
      
      render(<TaskCounter testId="task-counter" showBreakdown />);

      const counter = screen.getByTestId('task-counter');
      expect(counter).toHaveClass('task-counter--detailed');
    });
  });

  // Edge cases
  describe('Edge cases', () => {
    it('handles empty todos array', () => {
      setupMockContext([]);
      
      render(<TaskCounter testId="task-counter" />);

      expect(screen.getByText('Ready to add your first todo!')).toBeInTheDocument();
    });

    it('handles all completed todos', () => {
      const allCompleted = mockTodos.map(todo => ({ ...todo, completed: true }));
      setupMockContext(allCompleted);
      
      render(<TaskCounter testId="task-counter" />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('items left')).toBeInTheDocument();
    });

    it('handles large numbers correctly', () => {
      const manyTodos = Array.from({ length: 100 }, (_, i) => ({
        id: `todo-${i}`,
        text: `Todo ${i}`,
        completed: i >= 50, // First 50 are active
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      setupMockContext(manyTodos);
      
      render(<TaskCounter testId="task-counter" />);

      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('items left')).toBeInTheDocument();
    });
  });

  // Accessibility
  describe('Accessibility', () => {
    it('has proper ARIA live region for screen readers', () => {
      setupMockContext(mockTodos);
      
      render(<TaskCounter testId="task-counter" />);

      const counter = screen.getByRole('status');
      expect(counter).toHaveAttribute('aria-live', 'polite');
    });

    it('provides descriptive aria-label', () => {
      setupMockContext(mockTodos);
      
      render(<TaskCounter testId="task-counter" />);

      const counter = screen.getByTestId('task-counter');
      const ariaLabel = counter.getAttribute('aria-label');
      expect(ariaLabel).toContain('Todo status:');
      expect(ariaLabel).toContain('items left');
    });
  });

  // US15 AC02: Updates dynamically with changes
  describe('AC02: Dynamic updates', () => {
    it('updates count when todos change', () => {
      // Start with initial todos
      setupMockContext(mockTodos);
      
      const { rerender } = render(<TaskCounter testId="task-counter" />);
      expect(screen.getByText('2')).toBeInTheDocument();

      // Update context with different todos
      const updatedTodos = [...mockTodos, {
        id: '4',
        text: 'New active todo',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }];
      setupMockContext(updatedTodos);
      
      rerender(<TaskCounter testId="task-counter" />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('updates count when todo completion status changes', () => {
      // Start with all active todos
      const activeTodos = mockTodos.map(todo => ({ ...todo, completed: false }));
      setupMockContext(activeTodos);
      
      const { rerender } = render(<TaskCounter testId="task-counter" />);
      expect(screen.getByText('3')).toBeInTheDocument();

      // Complete one todo
      const partiallyCompleted = activeTodos.map((todo, index) => 
        index === 0 ? { ...todo, completed: true } : todo
      );
      setupMockContext(partiallyCompleted);
      
      rerender(<TaskCounter testId="task-counter" />);
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
});