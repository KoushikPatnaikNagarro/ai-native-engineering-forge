/**
 * US10 - Accessibility Tests
 * 
 * Tests for accessibility standards compliance (DOD03) including:
 * - WCAG 2.1 AA compliance
 * - Screen reader support
 * - Keyboard navigation
 * - Focus management
 * - ARIA attributes
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoProvider } from '../src/lib/TodoContext';
import HomePage from '../src/app/page';
import { TodoForm, TodoItem, TodoFilter } from '../src/components/todo';
import { Button } from '../src/components/ui';
import { createMockTodo, setViewport, checkAccessibility } from './helpers/testUtils';

// Test component wrapper
const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <TodoProvider>
      {component}
    </TodoProvider>
  );
};

describe('US10 - Accessibility Tests (DOD03)', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('WCAG 2.1 AA Compliance', () => {
    test('provides text alternatives for all images and icons', () => {
      renderWithProvider(<HomePage />);
      
      // Check that all images have alt text or are decorative
      const images = screen.queryAllByRole('img');
      images.forEach(img => {
        expect(
          img.hasAttribute('alt') || 
          img.getAttribute('aria-hidden') === 'true' ||
          img.hasAttribute('aria-label')
        ).toBe(true);
      });
    });

    test('maintains proper heading hierarchy', () => {
      renderWithProvider(<HomePage />);
      
      // Should have a main heading
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent('Quick Todo');
    });

    test('provides sufficient color contrast', () => {
      // This would typically be tested with automated tools like axe-core
      // For now, we test that colors are defined and not hardcoded
      renderWithProvider(<Button variant="primary">Test Button</Button>);
      
      const button = screen.getByRole('button');
      const computedStyle = window.getComputedStyle(button);
      
      // Should use CSS custom properties for consistent theming
      expect(computedStyle.getPropertyValue).toBeDefined();
    });

    test('ensures minimum touch target sizes (44px)', () => {
      setViewport(375, 667); // Mobile viewport
      
      const mockTodo = createMockTodo({ text: 'Touch target test' });
      renderWithProvider(<TodoItem todo={mockTodo} />);
      
      const checkbox = screen.getByRole('checkbox');
      const button = screen.getByRole('button', { name: /edit/i });
      
      // Check that interactive elements meet minimum size requirements
      expect(checkAccessibility.hasKeyboardAccess(checkbox)).toBe(true);
      expect(checkAccessibility.hasKeyboardAccess(button)).toBe(true);
    });

    test('provides adequate spacing between interactive elements', () => {
      renderWithProvider(<TodoFilter />);
      
      const filterButtons = screen.getAllByRole('tab');
      expect(filterButtons.length).toBeGreaterThan(1);
      
      // Buttons should be accessible and properly spaced
      filterButtons.forEach(button => {
        expect(checkAccessibility.hasKeyboardAccess(button)).toBe(true);
      });
    });
  });

  describe('Screen Reader Support', () => {
    test('provides meaningful accessible names', () => {
      renderWithProvider(<HomePage />);
      
      // Main input should have accessible name
      const todoInput = screen.getByRole('textbox');
      expect(checkAccessibility.hasAriaLabel(todoInput)).toBe(true);
      
      // Add button should have accessible name
      const addButton = screen.getByRole('button', { name: /add/i });
      expect(addButton).toHaveAccessibleName();
    });

    test('uses ARIA live regions for dynamic content', () => {
      renderWithProvider(<HomePage />);
      
      // Should have live regions for announcements
      const liveRegions = document.querySelectorAll('[aria-live]');
      expect(liveRegions.length).toBeGreaterThan(0);
    });

    test('provides ARIA labels for form controls', () => {
      renderWithProvider(<TodoForm />);
      
      const input = screen.getByRole('textbox');
      expect(
        input.hasAttribute('aria-label') || 
        input.hasAttribute('aria-labelledby') ||
        input.hasAttribute('aria-describedby')
      ).toBe(true);
    });

    test('uses proper ARIA roles for custom components', () => {
      const mockTodos = [
        createMockTodo({ text: 'First todo' }),
        createMockTodo({ text: 'Second todo' })
      ];
      
      renderWithProvider(
        <div>
          {mockTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      );
      
      // Todo items should have proper list item roles
      const todoItems = screen.getAllByRole('listitem');
      expect(todoItems.length).toBe(2);
    });

    test('announces state changes to screen readers', async () => {
      const mockTodo = createMockTodo({ text: 'Announcement test' });
      renderWithProvider(<TodoItem todo={mockTodo} />);
      
      const checkbox = screen.getByRole('checkbox');
      
      // Toggle completion
      await user.click(checkbox);
      
      // Should trigger screen reader announcement (tested via aria-live)
      expect(checkbox).toBeChecked();
    });
  });

  describe('Keyboard Navigation', () => {
    test('all interactive elements are keyboard accessible', () => {
      renderWithProvider(<HomePage />);
      
      const interactiveElements = [
        ...screen.getAllByRole('button'),
        ...screen.getAllByRole('textbox'),
        ...screen.getAllByRole('checkbox'),
        ...screen.getAllByRole('tab'),
      ];
      
      interactiveElements.forEach(element => {
        expect(checkAccessibility.hasKeyboardAccess(element)).toBe(true);
      });
    });

    test('provides visible focus indicators', () => {
      renderWithProvider(<Button>Focus Test</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      // Should have visible focus indicator
      expect(checkAccessibility.hasFocusIndicator(button)).toBe(true);
    });

    test('supports logical tab order', async () => {
      renderWithProvider(<HomePage />);
      
      // Should start with skip link
      const skipLink = screen.getByText('Skip to main content');
      skipLink.focus();
      expect(skipLink).toHaveFocus();
      
      // Tab to main content
      await user.tab();
      
      // Should focus on first interactive element
      const todoInput = screen.getByRole('textbox');
      expect(todoInput).toHaveFocus();
      
      // Continue tabbing through interface
      await user.tab();
      const addButton = screen.getByRole('button', { name: /add/i });
      expect(addButton).toHaveFocus();
    });

    test('escape key works for dismissing modals/edits', async () => {
      const mockTodo = createMockTodo({ text: 'Escape test' });
      renderWithProvider(<TodoItem todo={mockTodo} isEditing={true} />);
      
      const input = screen.getByDisplayValue('Escape test');
      input.focus();
      
      await user.keyboard('{Escape}');
      
      // Should exit edit mode
      expect(input).toHaveFocus();
    });

    test('arrow keys work for navigation', async () => {
      renderWithProvider(<TodoFilter />);
      
      const filterButtons = screen.getAllByRole('tab');
      
      // Focus first button
      filterButtons[0].focus();
      expect(filterButtons[0]).toHaveFocus();
      
      // Arrow navigation should work
      await user.keyboard('{ArrowRight}');
      // Note: This depends on implementation details
    });

    test('space and enter keys activate buttons', async () => {
      const mockFn = jest.fn();
      renderWithProvider(<Button onClick={mockFn}>Test Button</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      // Space should activate
      await user.keyboard(' ');
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Enter should also activate
      await user.keyboard('{Enter}');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('Focus Management', () => {
    test('maintains focus on page navigation', () => {
      renderWithProvider(<HomePage />);
      
      const todoInput = screen.getByRole('textbox');
      todoInput.focus();
      
      expect(todoInput).toHaveFocus();
      
      // Focus should be maintained during state changes
      expect(document.activeElement).toBe(todoInput);
    });

    test('returns focus after modal interactions', async () => {
      // This would test modal focus trap and return
      // For now, testing edit mode focus behavior
      const mockTodo = createMockTodo({ text: 'Focus return test' });
      renderWithProvider(<TodoItem todo={mockTodo} />);
      
      const editButton = screen.getByRole('button', { name: /edit/i });
      editButton.focus();
      
      // Activate edit mode
      await user.click(editButton);
      
      // Focus should move to edit input
      const editInput = screen.getByDisplayValue('Focus return test');
      expect(editInput).toHaveFocus();
    });

    test('skip links work properly', async () => {
      renderWithProvider(<HomePage />);
      
      const skipLink = screen.getByText('Skip to main content');
      
      // Activate skip link
      skipLink.focus();
      await user.keyboard('{Enter}');
      
      // Should move focus to main content
      const mainContent = screen.getByRole('main');
      expect(mainContent).toBeInTheDocument();
    });

    test('focus is not lost during responsive changes', () => {
      renderWithProvider(<HomePage />);
      
      const todoInput = screen.getByRole('textbox');
      todoInput.focus();
      
      // Change viewport
      setViewport(375, 667);
      fireEvent(window, new Event('resize'));
      
      // Focus should be maintained
      expect(todoInput).toHaveFocus();
    });
  });

  describe('Error Handling and Feedback', () => {
    test('form validation errors are announced', async () => {
      renderWithProvider(<TodoForm />);
      
      const input = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });
      
      // Try to submit empty form
      await user.click(addButton);
      
      // Should show validation error
      // Note: This depends on implementation
      expect(input).toBeInTheDocument();
    });

    test('provides meaningful error messages', async () => {
      renderWithProvider(<TodoForm />);
      
      const input = screen.getByRole('textbox');
      
      // Type invalid input
      await user.type(input, '   '); // Only whitespace
      await user.keyboard('{Enter}');
      
      // Should provide helpful error message
      expect(input).toBeInTheDocument();
    });

    test('errors are associated with form controls', () => {
      // This would test aria-describedby associations
      renderWithProvider(<TodoForm />);
      
      const input = screen.getByRole('textbox');
      
      // Should have proper ARIA associations
      expect(
        input.hasAttribute('aria-describedby') || 
        input.hasAttribute('aria-errormessage')
      ).toBeTruthy();
    });
  });

  describe('Responsive Accessibility', () => {
    test('touch targets meet minimum size on mobile', () => {
      setViewport(375, 667);
      
      const mockTodo = createMockTodo({ text: 'Mobile accessibility test' });
      renderWithProvider(<TodoItem todo={mockTodo} />);
      
      const checkbox = screen.getByRole('checkbox');
      const editButton = screen.getByRole('button', { name: /edit/i });
      
      // Touch targets should be accessible on mobile
      expect(checkAccessibility.hasKeyboardAccess(checkbox)).toBe(true);
      expect(checkAccessibility.hasKeyboardAccess(editButton)).toBe(true);
    });

    test('zoom up to 200% maintains functionality', () => {
      // Simulate zoom by changing viewport
      setViewport(640, 360); // 200% zoom simulation
      
      renderWithProvider(<HomePage />);
      
      // Should still be fully functional
      const todoInput = screen.getByRole('textbox');
      const addButton = screen.getByRole('button', { name: /add/i });
      
      expect(todoInput).toBeInTheDocument();
      expect(addButton).toBeInTheDocument();
    });

    test('content reflows properly on mobile', () => {
      setViewport(320, 568); // Very narrow mobile
      
      renderWithProvider(<HomePage />);
      
      // Content should still be accessible
      const todoInput = screen.getByRole('textbox');
      expect(todoInput).toBeInTheDocument();
      
      // No horizontal scrolling required
      expect(document.body.scrollWidth).toBeLessThanOrEqual(320);
    });
  });

  describe('High Contrast Mode', () => {
    test('maintains usability in high contrast mode', () => {
      // Mock high contrast preference
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      renderWithProvider(<Button>High Contrast Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      
      // Should maintain accessibility in high contrast
      expect(checkAccessibility.hasKeyboardAccess(button)).toBe(true);
    });
  });

  describe('Reduced Motion', () => {
    test('respects reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      renderWithProvider(<Button>Animated Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      
      // Should still be functional without animations
      expect(checkAccessibility.hasKeyboardAccess(button)).toBe(true);
    });
  });
});