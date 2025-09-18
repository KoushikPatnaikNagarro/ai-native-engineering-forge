/**
 * LoadingSpinner Component Tests
 * 
 * US14 AC01: Tests loading indicators for async operations
 */

import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<LoadingSpinner message="Loading todos..." />);
    
    expect(screen.getByText('Loading todos...')).toBeInTheDocument();
  });

  it('renders different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="small" testId="spinner" />);
    expect(screen.getByTestId('spinner')).toHaveClass('loading-spinner-container');
    
    rerender(<LoadingSpinner size="large" testId="spinner" />);
    expect(screen.getByTestId('spinner')).toHaveClass('loading-spinner-container');
  });

  it('can hide text', () => {
    render(<LoadingSpinner showText={false} />);
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders inline variant', () => {
    render(<LoadingSpinner inline testId="inline-spinner" />);
    
    expect(screen.getByTestId('inline-spinner')).toHaveClass('loading-spinner-container--inline');
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner message="Loading data" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-live', 'polite');
    expect(spinner).toHaveAttribute('aria-label', 'Loading data');
  });
});