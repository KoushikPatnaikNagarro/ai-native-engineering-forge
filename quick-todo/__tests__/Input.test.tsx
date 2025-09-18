import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../src/components/ui/Input';

describe('Input Component', () => {
  test('renders with label', () => {
    render(<Input label="Test Input" />);
    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
  });

  test('renders with placeholder', () => {
    render(<Input placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });

  test('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input value="test" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test');
    
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('shows error state', () => {
    render(
      <Input 
        label="Test Input" 
        error={true} 
        errorMessage="This field is required" 
      />
    );
    
    expect(screen.getByRole('textbox')).toHaveClass('input--error');
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
  });

  test('shows help text', () => {
    render(
      <Input 
        label="Test Input" 
        helpText="This is helpful information" 
      />
    );
    
    expect(screen.getByText('This is helpful information')).toBeInTheDocument();
  });

  test('supports required attribute', () => {
    render(<Input label="Required Input" required />);
    
    expect(screen.getByRole('textbox')).toBeRequired();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('applies disabled state', () => {
    render(<Input label="Disabled Input" disabled />);
    
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('textbox')).toHaveClass('input--disabled');
  });

  test('applies readonly state', () => {
    render(<Input label="Readonly Input" readOnly />);
    
    expect(screen.getByRole('textbox')).toHaveClass('input--readonly');
  });

  test('supports different input types', () => {
    render(<Input type="email" label="Email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  test('supports different sizes', () => {
    render(<Input size="large" label="Large Input" />);
    expect(screen.getByRole('textbox')).toHaveClass('input--large');
  });

  test('handles focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    
    render(
      <Input 
        label="Test Input" 
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
    
    const input = screen.getByRole('textbox');
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('supports custom test id', () => {
    render(<Input testId="custom-input" label="Test" />);
    expect(screen.getByTestId('custom-input')).toBeInTheDocument();
  });

  test('associates help text with input via aria-describedby', () => {
    render(
      <Input 
        label="Test Input" 
        helpText="Help text"
      />
    );
    
    const input = screen.getByRole('textbox');
    const helpText = screen.getByText('Help text');
    
    expect(input).toHaveAttribute('aria-describedby', helpText.id);
  });
});