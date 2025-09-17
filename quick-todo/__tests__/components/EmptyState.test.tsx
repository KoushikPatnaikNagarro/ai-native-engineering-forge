/**
 * EmptyState Component Tests
 * 
 * US14 AC03: Tests empty states with helpful guidance
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../../src/components/ui/EmptyState';

describe('EmptyState', () => {
  it('renders no-tasks state', () => {
    render(<EmptyState type="no-tasks" />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('No todos yet')).toBeInTheDocument();
    expect(screen.getByText(/Start by adding your first todo item/)).toBeInTheDocument();
  });

  it('renders no-search-results state with search term', () => {
    render(<EmptyState type="no-search-results" searchTerm="meeting" />);
    
    expect(screen.getByText('No todos found')).toBeInTheDocument();
    expect(screen.getByText(/No todos match "meeting"/)).toBeInTheDocument();
  });

  it('renders no-open state', () => {
    render(<EmptyState type="no-open" />);
    
    expect(screen.getByText('All done!')).toBeInTheDocument();
    expect(screen.getByText(/Great job! You.*ve completed all your open todos/)).toBeInTheDocument();
  });

  it('renders no-completed state', () => {
    render(<EmptyState type="no-completed" />);
    
    expect(screen.getByText('No completed todos')).toBeInTheDocument();
    expect(screen.getByText(/Complete some todos to see them here/)).toBeInTheDocument();
  });

  it('renders custom content', () => {
    render(
      <EmptyState 
        type="no-tasks" 
        title="Custom Title"
        description="Custom description"
        icon="🎯"
      />
    );
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
    expect(screen.getByText('🎯')).toBeInTheDocument();
  });

  it('renders action button and handles click', () => {
    const mockAction = jest.fn();
    render(
      <EmptyState 
        type="no-tasks"
        action={{ label: 'Add Todo', onClick: mockAction }}
      />
    );
    
    const button = screen.getByRole('button', { name: 'Add Todo' });
    fireEvent.click(button);
    
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(<EmptyState type="no-tasks" />);
    
    const emptyState = screen.getByRole('status');
    expect(emptyState).toHaveAttribute('aria-label');
  });

  it('applies custom className', () => {
    render(<EmptyState type="no-tasks" className="custom-class" testId="empty-state" />);
    
    const emptyState = screen.getByTestId('empty-state');
    expect(emptyState).toHaveClass('empty-state', 'empty-state--no-tasks', 'custom-class');
  });
});