/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../src/app/page';

describe('HomePage', () => {
  it('renders the Quick Todo title', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /quick todo/i })).toBeInTheDocument();
  });

  it('renders the todo application interface', () => {
    render(<HomePage />);
    
    // Should have the subtitle
    expect(screen.getByText(/a frictionless, no-login todo app/i)).toBeInTheDocument();
    
    // Should have the todo form for adding tasks
    expect(screen.getByTestId('main-todo-form')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /add new todo/i })).toBeInTheDocument();
    
    // Should have the todo list
    expect(screen.getByTestId('main-todo-list')).toBeInTheDocument();
    
    // Should show empty state initially
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });
});