import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../src/components/ui/Button';

// Mock icon component for tests
const MockIcon = () => <span data-testid="mock-icon">Icon</span>;

describe('Button Component', () => {
  test('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  test('applies correct variant classes', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--primary');
  });

  test('applies correct size classes', () => {
    render(<Button size="large">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--large');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--loading');
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('renders with icon', () => {
    render(
      <Button icon={<MockIcon />} iconPosition="left">
        With Icon
      </Button>
    );
    
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('With Icon');
  });

  test('applies full width class', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--full-width');
  });

  test('supports custom test id', () => {
    render(<Button testId="custom-button">Test</Button>);
    expect(screen.getByTestId('custom-button')).toBeInTheDocument();
  });

  test('supports different button types', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});