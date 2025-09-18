import { useEffect, useRef, useCallback } from 'react';
import { 
  FocusManager, 
  ArrowNavigation, 
  KeyboardShortcuts, 
  ScreenReaderAnnouncer,
  KEYS 
} from './keyboardNavigation';

/**
 * Enhanced keyboard navigation hook
 * Provides keyboard navigation utilities for React components
 */
export function useKeyboardNavigation(options: {
  enabled?: boolean;
  vertical?: boolean;
  horizontal?: boolean;
  trapFocus?: boolean;
  announcements?: boolean;
} = {}) {
  const {
    enabled = true,
    vertical = false,
    horizontal = false,
    trapFocus = false,
    announcements = true,
  } = options;

  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (announcements) {
      ScreenReaderAnnouncer.init();
    }
  }, [announcements]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const activeElement = document.activeElement as HTMLElement;

    // Handle focus trapping
    if (trapFocus && FocusManager.trapFocus(container, event)) {
      return;
    }

    // Handle vertical navigation
    if (vertical && ArrowNavigation.handleVerticalList(event, activeElement, container)) {
      return;
    }

    // Handle horizontal navigation
    if (horizontal && ArrowNavigation.handleHorizontalGroup(event, activeElement, container)) {
      return;
    }

    // Handle global shortcuts
    KeyboardShortcuts.handleKeydown(event);
  }, [enabled, vertical, horizontal, trapFocus]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcements) {
      ScreenReaderAnnouncer.announce(message, priority);
    }
  }, [announcements]);

  const focusFirst = useCallback(() => {
    if (containerRef.current) {
      return FocusManager.focusFirst(containerRef.current);
    }
    return false;
  }, []);

  const focusLast = useCallback(() => {
    if (containerRef.current) {
      return FocusManager.focusLast(containerRef.current);
    }
    return false;
  }, []);

  return {
    containerRef,
    announce,
    focusFirst,
    focusLast,
  };
}

/**
 * Hook for managing todo list keyboard navigation
 */
export function useTodoListKeyboard() {
  const { containerRef, announce } = useKeyboardNavigation({
    vertical: true,
    announcements: true,
  });

  const announceTaskToggle = useCallback((taskText: string, completed: boolean) => {
    const status = completed ? 'completed' : 'uncompleted';
    announce(`Task "${taskText}" marked as ${status}`, 'polite');
  }, [announce]);

  const announceTaskAdded = useCallback((taskText: string) => {
    announce(`New task "${taskText}" added`, 'polite');
  }, [announce]);

  const announceTaskDeleted = useCallback((taskText: string) => {
    announce(`Task "${taskText}" deleted`, 'polite');
  }, [announce]);

  const announceTaskUpdated = useCallback((oldText: string, newText: string) => {
    announce(`Task updated from "${oldText}" to "${newText}"`, 'polite');
  }, [announce]);

  const announceFilterChange = useCallback((filter: string, count: number) => {
    announce(`Showing ${count} ${filter} tasks`, 'polite');
  }, [announce]);

  return {
    containerRef,
    announceTaskToggle,
    announceTaskAdded,
    announceTaskDeleted,
    announceTaskUpdated,
    announceFilterChange,
  };
}

/**
 * Hook for managing filter button keyboard navigation
 */
export function useFilterKeyboard() {
  return useKeyboardNavigation({
    horizontal: true,
    announcements: true,
  });
}

/**
 * Hook for managing modal/dialog keyboard navigation
 */
export function useModalKeyboard(onClose?: () => void) {
  const { containerRef, announce } = useKeyboardNavigation({
    trapFocus: true,
    announcements: true,
  });

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === KEYS.ESCAPE && onClose) {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return { containerRef, announce };
}

/**
 * Hook for registering global keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    // Register shortcuts
    Object.entries(shortcuts).forEach(([shortcut, callback]) => {
      const [key, ...modifiers] = shortcut.split('+').reverse();
      KeyboardShortcuts.register(key, modifiers, callback);
    });

    // Cleanup
    return () => {
      Object.entries(shortcuts).forEach(([shortcut]) => {
        const [key, ...modifiers] = shortcut.split('+').reverse();
        KeyboardShortcuts.unregister(key, modifiers);
      });
    };
  }, [shortcuts]);
}

/**
 * Hook for enhanced input field keyboard behavior
 */
export function useInputKeyboard(options: {
  onEnter?: () => void;
  onEscape?: () => void;
  preventEmptySubmit?: boolean;
} = {}) {
  const { onEnter, onEscape, preventEmptySubmit = true } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement;

    if (event.key === KEYS.ENTER && !event.shiftKey) {
      if (preventEmptySubmit && !target.value.trim()) {
        event.preventDefault();
        return;
      }
      
      if (onEnter) {
        event.preventDefault();
        onEnter();
      }
    } else if (event.key === KEYS.ESCAPE && onEscape) {
      event.preventDefault();
      onEscape();
    }
  }, [onEnter, onEscape, preventEmptySubmit]);

  return { handleKeyDown };
}