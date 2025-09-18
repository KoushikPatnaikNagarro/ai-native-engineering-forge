'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  /**
   * Child components to render
   */
  children: ReactNode;
  
  /**
   * Optional fallback component to render when an error occurs
   */
  fallback?: ReactNode;
  
  /**
   * Called when an error is caught
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  
  /**
   * Test identifier for automated testing
   */
  testId?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 * 
 * US14 DOD02: Implements React Error Boundary for catching and displaying unexpected errors.
 * Provides graceful error handling with user-friendly fallback UI.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary onError={(error) => console.error('App error:', error)}>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Store error info for debugging
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  handleRetry = () => {
    // Reset the error state to trigger a re-render
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Render default error UI
      return (
        <div 
          className="error-boundary"
          role="alert"
          aria-live="assertive"
          data-testid={this.props.testId}
        >
          <div className="error-boundary__container">
            <div className="error-boundary__icon" aria-hidden="true">
              ⚠️
            </div>
            
            <h2 className="error-boundary__title">
              Something went wrong
            </h2>
            
            <p className="error-boundary__description">
              We&apos;re sorry, but something unexpected happened. You can try reloading the page or contact support if the problem persists.
            </p>
            
            <div className="error-boundary__actions">
              <button
                type="button"
                onClick={this.handleRetry}
                className="error-boundary__button error-boundary__button--primary"
              >
                Try Again
              </button>
              
              <button
                type="button"
                onClick={this.handleReload}
                className="error-boundary__button error-boundary__button--secondary"
              >
                Reload Page
              </button>
            </div>
            
            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary__details">
                <summary className="error-boundary__details-summary">
                  Error Details (Development Only)
                </summary>
                <div className="error-boundary__error-info">
                  <h4>Error:</h4>
                  <pre className="error-boundary__error-message">
                    {this.state.error.message}
                  </pre>
                  
                  {this.state.error.stack && (
                    <>
                      <h4>Stack Trace:</h4>
                      <pre className="error-boundary__error-stack">
                        {this.state.error.stack}
                      </pre>
                    </>
                  )}
                  
                  {this.state.errorInfo?.componentStack && (
                    <>
                      <h4>Component Stack:</h4>
                      <pre className="error-boundary__component-stack">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;