/**
 * Test Utilities
 * 
 * Shared utilities for testing components across the application.
 */

import React from 'react';
import { Todo, TodoPriority } from '../src/types';

/**
 * Creates a mock todo with default values that can be overridden
 */
export const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: Math.random().toString(36).substr(2, 9),
  text: 'Default todo text',
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  priority: 'medium' as TodoPriority,
  category: undefined,
  ...overrides,
});

/**
 * Creates multiple mock todos
 */
export const createMockTodos = (count: number, overrides: Partial<Todo> = {}): Todo[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockTodo({
      id: `mock-todo-${index + 1}`,
      text: `Todo ${index + 1}`,
      ...overrides,
    })
  );
};

/**
 * Mock window.matchMedia for testing responsive design
 */
export const mockMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

/**
 * Setup viewport for responsive testing
 */
export const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

/**
 * Mock touch device capabilities
 */
export const mockTouchDevice = () => {
  Object.defineProperty(window, 'ontouchstart', {
    value: () => {},
    writable: true,
  });
  
  // Mock touch events
  const createTouchEvent = (type: string, touches: Array<{ clientX: number; clientY: number }>) => {
    const event = new Event(type) as any;
    event.touches = touches;
    event.changedTouches = touches;
    return event;
  };
  
  return { createTouchEvent };
};

/**
 * Mock reduced motion preference
 */
export const mockReducedMotion = (enabled: boolean = true) => {
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation((query) => ({
      ...mockMatchMedia(query),
      matches: enabled && query === '(prefers-reduced-motion: reduce)',
    })),
  });
};

/**
 * Mock high contrast preference
 */
export const mockHighContrast = (enabled: boolean = true) => {
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation((query) => ({
      ...mockMatchMedia(query),
      matches: enabled && query === '(prefers-contrast: high)',
    })),
  });
};

/**
 * Mock CSS custom properties for testing
 */
export const mockCSSCustomProperties = () => {
  const mockGetComputedStyle = () => ({
    getPropertyValue: (property: string) => {
      const customProperties: Record<string, string> = {
        '--color-primary-base': '#205463',
        '--color-primary-light': '#c2f0e3',
        '--color-surface-base': '#ffffff',
        '--font-size-body': '16px',
        '--spacing-4': '16px',
        '--touch-target-min': '44px',
        '--touch-target-comfortable': '48px',
      };
      return customProperties[property] || '';
    },
    fontSize: '16px',
    minHeight: '48px',
    minWidth: '48px',
    borderWidth: '1px',
    display: 'flex',
  });

  Object.defineProperty(window, 'getComputedStyle', {
    value: mockGetComputedStyle,
    writable: true,
  });
};

/**
 * Performance measurement utilities
 */
export const measurePerformance = (fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  return end - start;
};

/**
 * Accessibility testing utilities
 */
export const checkAccessibility = {
  hasAriaLabel: (element: HTMLElement) => {
    return element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
  },
  
  hasKeyboardAccess: (element: HTMLElement) => {
    const tabIndex = element.getAttribute('tabindex');
    return element.tagName.toLowerCase() === 'button' || 
           element.tagName.toLowerCase() === 'input' ||
           element.tagName.toLowerCase() === 'a' ||
           (tabIndex !== null && parseInt(tabIndex) >= 0);
  },
  
  hasFocusIndicator: (element: HTMLElement) => {
    const computedStyle = window.getComputedStyle(element, ':focus');
    return computedStyle.outline !== 'none' && computedStyle.outline !== '';
  },
};

/**
 * Custom render function that includes common providers
 */
export const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  // This would typically include providers like TodoProvider, theme providers, etc.
  // For now, keeping it simple since TodoProvider is imported directly in tests
  return ui;
};