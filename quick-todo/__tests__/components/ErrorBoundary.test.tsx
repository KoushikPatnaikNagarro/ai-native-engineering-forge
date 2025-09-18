/**
 * ErrorBoundary Component Tests
 * 
 * US14 DOD02: Tests React Error Boundary implementation
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../../src/components/ui/ErrorBoundary';

// Mock component that throws an error
const ErrorThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Mock console.error to avoid noise in tests
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  
  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ErrorThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const mockOnError = jest.fn();
    
    render(
      <ErrorBoundary onError={mockOnError}>
        <ErrorThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(mockOnError).toHaveBeenCalledTimes(1);
    expect(mockOnError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('try again button is functional', () => {
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    // Verify error is displayed
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    // Verify buttons exist and are clickable
    const tryAgainButton = screen.getByRole('button', { name: 'Try Again' });
    const reloadButton = screen.getByRole('button', { name: 'Reload Page' });
    
    expect(tryAgainButton).toBeEnabled();
    expect(reloadButton).toBeEnabled();
    
    // Buttons should not throw when clicked
    expect(() => fireEvent.click(tryAgainButton)).not.toThrow();
  });

  it('handles reload page button', () => {
    // Mock window.location.reload
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });
    
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    const reloadButton = screen.getByRole('button', { name: 'Reload Page' });
    fireEvent.click(reloadButton);
    
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(
      <ErrorBoundary testId="error-boundary">
        <ErrorThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    
    const errorBoundary = screen.getByTestId('error-boundary');
    expect(errorBoundary).toHaveAttribute('role', 'alert');
    expect(errorBoundary).toHaveAttribute('aria-live', 'assertive');
  });
});