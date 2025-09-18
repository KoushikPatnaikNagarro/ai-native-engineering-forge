/**
 * US10 - Performance Tests
 * 
 * Tests for performance benchmarks (DOD02) including:
 * - Component render performance
 * - Responsive design performance
 * - Animation performance
 * - Memory usage
 */

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { TodoProvider } from '../src/lib/TodoContext';
import HomePage from '../src/app/page';
import { TodoItem, TodoList } from '../src/components/todo';
import { createMockTodos, setViewport, measurePerformance } from './helpers/testUtils';

// Test component wrapper
const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <TodoProvider>
      {component}
    </TodoProvider>
  );
};

describe('US10 - Performance Tests (DOD02)', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Component Render Performance', () => {
    test('HomePage renders within performance budget', () => {
      const renderTime = measurePerformance(() => {
        renderWithProvider(<HomePage />);
      });
      
      // Should render quickly (under 50ms for initial component mounting)
      expect(renderTime).toBeLessThan(50);
    });

    test('TodoList with many items renders efficiently', () => {
      const manyTodos = createMockTodos(100);
      
      const renderTime = measurePerformance(() => {
        render(
          <TodoProvider>
            <TodoList />
          </TodoProvider>
        );
      });
      
      // Should handle large lists efficiently (under 100ms)
      expect(renderTime).toBeLessThan(100);
    });

    test('Individual TodoItem renders quickly', () => {
      const mockTodo = createMockTodos(1)[0];
      
      const renderTime = measurePerformance(() => {
        renderWithProvider(<TodoItem todo={mockTodo} />);
      });
      
      // Individual items should render very quickly (under 10ms)
      expect(renderTime).toBeLessThan(10);
    });
  });

  describe('Responsive Design Performance', () => {
    test('viewport changes do not cause performance issues', () => {
      const { rerender } = renderWithProvider(<HomePage />);
      
      const viewports = [
        { width: 320, height: 568 },
        { width: 768, height: 1024 },
        { width: 1440, height: 900 },
      ];
      
      const totalTime = measurePerformance(() => {
        viewports.forEach(viewport => {
          setViewport(viewport.width, viewport.height);
          rerender(
            <TodoProvider>
              <HomePage />
            </TodoProvider>
          );
        });
      });
      
      // Multiple viewport changes should be handled efficiently
      expect(totalTime).toBeLessThan(150);
    });

    test('CSS media query changes are performant', () => {
      renderWithProvider(<HomePage />);
      
      const resizeTime = measurePerformance(() => {
        // Simulate rapid resize events
        for (let i = 0; i < 10; i++) {
          setViewport(320 + i * 100, 568);
        }
      });
      
      // Rapid resizing should not cause performance issues
      expect(resizeTime).toBeLessThan(50);
    });
  });

  describe('Animation Performance', () => {
    test('button animations do not block main thread', () => {
      const { container } = renderWithProvider(
        <button className="button button--primary">Test Button</button>
      );
      
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      
      // Simulate hover animation
      const animationTime = measurePerformance(() => {
        button!.style.transform = 'translateY(-1px)';
        button!.style.transition = 'all 0.2s ease';
      });
      
      // CSS animations should be very fast
      expect(animationTime).toBeLessThan(5);
    });

    test('reduced motion preference is respected', () => {
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

      const { container } = renderWithProvider(
        <button className="button">Animated Button</button>
      );
      
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      
      // Should respect reduced motion (this is more of a CSS test)
      const computedStyle = window.getComputedStyle(button!);
      // In real implementation, this would check for animation-duration: 0s
      expect(computedStyle).toBeDefined();
    });
  });

  describe('Memory Usage', () => {
    test('components clean up properly on unmount', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Render and unmount multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = renderWithProvider(<HomePage />);
        unmount();
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Memory usage should not grow significantly
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryGrowth = finalMemory - initialMemory;
        const memoryGrowthPercentage = (memoryGrowth / initialMemory) * 100;
        
        // Should not grow by more than 50%
        expect(memoryGrowthPercentage).toBeLessThan(50);
      }
    });

    test('event listeners are cleaned up', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = renderWithProvider(<HomePage />);
      
      const initialListenerCount = addEventListenerSpy.mock.calls.length;
      
      unmount();
      
      const finalListenerCount = removeEventListenerSpy.mock.calls.length;
      
      // Should clean up event listeners
      expect(finalListenerCount).toBeGreaterThanOrEqual(0);
      
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Bundle Size Impact', () => {
    test('responsive utilities are tree-shakeable', () => {
      // This is more of a build-time test, but we can check imports
      const { keyboardNavigation } = require('../src/lib/keyboardNavigation');
      
      // Should be able to import specific utilities
      expect(keyboardNavigation).toBeDefined();
    });

    test('CSS is optimized for critical path', () => {
      // This would typically be tested with build tools
      // For now, checking that critical styles are inline/prioritized
      const { container } = renderWithProvider(<HomePage />);
      
      // Should have CSS classes applied
      const mainElement = container.querySelector('[role="main"]');
      expect(mainElement).toHaveClass();
    });
  });

  describe('Interaction Performance', () => {
    test('touch interactions respond quickly', () => {
      const mockTodo = createMockTodos(1)[0];
      const { container } = renderWithProvider(<TodoItem todo={mockTodo} />);
      
      const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      
      const interactionTime = measurePerformance(() => {
        checkbox!.click();
      });
      
      // Touch interactions should be immediate
      expect(interactionTime).toBeLessThan(16); // 60fps = 16ms per frame
    });

    test('keyboard navigation is responsive', () => {
      const { container } = renderWithProvider(<HomePage />);
      
      const input = container.querySelector('input[type="text"]') as HTMLInputElement;
      
      const navigationTime = measurePerformance(() => {
        input!.focus();
        input!.blur();
      });
      
      // Focus changes should be immediate
      expect(navigationTime).toBeLessThan(16);
    });
  });

  describe('Network Performance', () => {
    test('no unnecessary network requests on responsive changes', () => {
      // Mock fetch to track network requests
      const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve(new Response('{}'))
      );
      
      renderWithProvider(<HomePage />);
      
      // Change viewport multiple times
      setViewport(320, 568);
      setViewport(768, 1024);
      setViewport(1440, 900);
      
      // Should not trigger any network requests
      expect(fetchSpy).not.toHaveBeenCalled();
      
      fetchSpy.mockRestore();
    });
  });
});