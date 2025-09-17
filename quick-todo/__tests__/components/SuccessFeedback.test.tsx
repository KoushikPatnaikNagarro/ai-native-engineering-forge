/**
 * SuccessFeedback Component Tests
 * 
 * US14 AC04: Tests success feedback for user actions
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SuccessFeedback } from '../../src/components/ui/SuccessFeedback';

describe('SuccessFeedback', () => {
  it('renders with message', () => {
    render(<SuccessFeedback message="Todo added successfully!" />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Todo added successfully!')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const mockDismiss = jest.fn();
    render(<SuccessFeedback message="Success!" onDismiss={mockDismiss} />);
    
    const dismissButton = screen.getByRole('button', { name: 'Dismiss success message' });
    fireEvent.click(dismissButton);
    
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('auto-dismisses after timeout', async () => {
    const mockDismiss = jest.fn();
    render(
      <SuccessFeedback 
        message="Success!" 
        onDismiss={mockDismiss} 
        timeout={100}
      />
    );
    
    await waitFor(() => {
      expect(mockDismiss).toHaveBeenCalledTimes(1);
    }, { timeout: 200 });
  });

  it('does not auto-dismiss when disabled', async () => {
    const mockDismiss = jest.fn();
    render(
      <SuccessFeedback 
        message="Success!" 
        onDismiss={mockDismiss} 
        autoDismiss={false}
        timeout={100}
      />
    );
    
    // Wait longer than timeout to ensure it doesn't dismiss
    await new Promise(resolve => setTimeout(resolve, 150));
    expect(mockDismiss).not.toHaveBeenCalled();
  });

  it('renders custom icon', () => {
    render(<SuccessFeedback message="Success!" icon="🎉" />);
    
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('handles keyboard dismissal with Escape key', () => {
    const mockDismiss = jest.fn();
    render(<SuccessFeedback message="Success!" onDismiss={mockDismiss} />);
    
    const feedback = screen.getByRole('status');
    fireEvent.keyDown(feedback, { key: 'Escape' });
    
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(<SuccessFeedback message="Operation completed" />);
    
    const feedback = screen.getByRole('status');
    expect(feedback).toHaveAttribute('aria-live', 'polite');
    expect(feedback).toHaveAttribute('aria-label', 'Operation completed');
  });
});