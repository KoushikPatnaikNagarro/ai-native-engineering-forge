/**
 * Keyboard Navigation Utilities
 * 
 * Provides utilities for enhanced keyboard navigation throughout the application.
 * Supports US10 AC03: Full keyboard navigation support.
 */

/**
 * Key codes for common navigation keys
 */
export const KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
} as const;

/**
 * Focus management utilities
 */
export class FocusManager {
  /**
   * Focus the first focusable element within a container
   */
  static focusFirst(container: HTMLElement): boolean {
    const focusable = this.getFocusableElements(container);
    if (focusable.length > 0) {
      focusable[0].focus();
      return true;
    }
    return false;
  }

  /**
   * Focus the last focusable element within a container
   */
  static focusLast(container: HTMLElement): boolean {
    const focusable = this.getFocusableElements(container);
    if (focusable.length > 0) {
      focusable[focusable.length - 1].focus();
      return true;
    }
    return false;
  }

  /**
   * Focus the next focusable element
   */
  static focusNext(currentElement: HTMLElement, container?: HTMLElement): boolean {
    const root = container || document.body;
    const focusable = this.getFocusableElements(root);
    const currentIndex = focusable.indexOf(currentElement);
    
    if (currentIndex >= 0 && currentIndex < focusable.length - 1) {
      focusable[currentIndex + 1].focus();
      return true;
    }
    return false;
  }

  /**
   * Focus the previous focusable element
   */
  static focusPrevious(currentElement: HTMLElement, container?: HTMLElement): boolean {
    const root = container || document.body;
    const focusable = this.getFocusableElements(root);
    const currentIndex = focusable.indexOf(currentElement);
    
    if (currentIndex > 0) {
      focusable[currentIndex - 1].focus();
      return true;
    }
    return false;
  }

  /**
   * Get all focusable elements within a container
   */
  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="checkbox"]:not([disabled])',
      '[role="radio"]:not([disabled])',
    ].join(',');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter((element) => {
        const el = element as HTMLElement;
        return el.offsetWidth > 0 && 
               el.offsetHeight > 0 && 
               !el.hidden &&
               window.getComputedStyle(el).visibility !== 'hidden';
      }) as HTMLElement[];
  }

  /**
   * Trap focus within a container (useful for modals)
   */
  static trapFocus(container: HTMLElement, event: KeyboardEvent): boolean {
    if (event.key !== KEYS.TAB) return false;

    const focusable = this.getFocusableElements(container);
    if (focusable.length === 0) return false;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift+Tab: moving backwards
      if (activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
        return true;
      }
    } else {
      // Tab: moving forwards
      if (activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
        return true;
      }
    }

    return false;
  }
}

/**
 * Arrow key navigation for lists and grids
 */
export class ArrowNavigation {
  /**
   * Handle vertical arrow navigation in a list
   */
  static handleVerticalList(
    event: KeyboardEvent,
    currentElement: HTMLElement,
    container: HTMLElement
  ): boolean {
    if (![KEYS.ARROW_UP, KEYS.ARROW_DOWN, KEYS.HOME, KEYS.END].includes(event.key as any)) {
      return false;
    }

    event.preventDefault();
    const items = Array.from(container.querySelectorAll('[role="listitem"], .todo-item'))
      .filter(el => {
        const element = el as HTMLElement;
        return element.offsetWidth > 0 && element.offsetHeight > 0;
      }) as HTMLElement[];

    if (items.length === 0) return false;

    const currentIndex = items.findIndex(item => 
      item === currentElement || item.contains(currentElement)
    );

    let targetIndex: number;

    switch (event.key) {
      case KEYS.ARROW_UP:
        targetIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case KEYS.ARROW_DOWN:
        targetIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case KEYS.HOME:
        targetIndex = 0;
        break;
      case KEYS.END:
        targetIndex = items.length - 1;
        break;
      default:
        return false;
    }

    const targetItem = items[targetIndex];
    const focusableInTarget = FocusManager.getFocusableElements(targetItem);
    
    if (focusableInTarget.length > 0) {
      focusableInTarget[0].focus();
    } else {
      targetItem.focus();
    }

    return true;
  }

  /**
   * Handle horizontal arrow navigation (like filter buttons)
   */
  static handleHorizontalGroup(
    event: KeyboardEvent,
    currentElement: HTMLElement,
    container: HTMLElement
  ): boolean {
    if (![KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT, KEYS.HOME, KEYS.END].includes(event.key as any)) {
      return false;
    }

    event.preventDefault();
    const items = FocusManager.getFocusableElements(container);
    const currentIndex = items.indexOf(currentElement);

    if (currentIndex === -1) return false;

    let targetIndex: number;

    switch (event.key) {
      case KEYS.ARROW_LEFT:
        targetIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case KEYS.ARROW_RIGHT:
        targetIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case KEYS.HOME:
        targetIndex = 0;
        break;
      case KEYS.END:
        targetIndex = items.length - 1;
        break;
      default:
        return false;
    }

    items[targetIndex].focus();
    return true;
  }
}

/**
 * Keyboard shortcuts manager
 */
export class KeyboardShortcuts {
  private static shortcuts: Map<string, () => void> = new Map();

  /**
   * Register a keyboard shortcut
   */
  static register(key: string, modifiers: string[], callback: () => void): void {
    const shortcutKey = this.createShortcutKey(key, modifiers);
    this.shortcuts.set(shortcutKey, callback);
  }

  /**
   * Unregister a keyboard shortcut
   */
  static unregister(key: string, modifiers: string[]): void {
    const shortcutKey = this.createShortcutKey(key, modifiers);
    this.shortcuts.delete(shortcutKey);
  }

  /**
   * Handle keyboard events and execute shortcuts
   */
  static handleKeydown(event: KeyboardEvent): boolean {
    const modifiers: string[] = [];
    if (event.ctrlKey) modifiers.push('ctrl');
    if (event.altKey) modifiers.push('alt');
    if (event.shiftKey) modifiers.push('shift');
    if (event.metaKey) modifiers.push('meta');

    const shortcutKey = this.createShortcutKey(event.key.toLowerCase(), modifiers);
    const callback = this.shortcuts.get(shortcutKey);

    if (callback) {
      event.preventDefault();
      callback();
      return true;
    }

    return false;
  }

  /**
   * Create a unique key for shortcuts
   */
  private static createShortcutKey(key: string, modifiers: string[]): string {
    return [...modifiers.sort(), key].join('+');
  }

  /**
   * Clear all shortcuts
   */
  static clear(): void {
    this.shortcuts.clear();
  }
}

/**
 * Accessibility announcements
 */
export class ScreenReaderAnnouncer {
  private static liveRegion: HTMLElement | null = null;

  /**
   * Initialize the screen reader announcer
   */
  static init(): void {
    if (this.liveRegion) return;

    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    this.liveRegion.id = 'screen-reader-announcements';
    
    document.body.appendChild(this.liveRegion);
  }

  /**
   * Announce a message to screen readers
   */
  static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.liveRegion) this.init();

    this.liveRegion!.setAttribute('aria-live', priority);
    this.liveRegion!.textContent = message;

    // Clear the message after a delay to allow re-announcing the same message
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = '';
      }
    }, 1000);
  }
}

/**
 * Touch gesture detection for enhanced mobile experience
 */
export class TouchGestureHandler {
  private startX: number = 0;
  private startY: number = 0;
  private startTime: number = 0;
  private element: HTMLElement | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.bindEvents();
  }

  private bindEvents(): void {
    if (!this.element) return;

    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }

  private handleTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();
  }

  private handleTouchEnd(event: TouchEvent): void {
    const touch = event.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();

    const deltaX = endX - this.startX;
    const deltaY = endY - this.startY;
    const deltaTime = endTime - this.startTime;

    // Detect swipe gestures
    const minSwipeDistance = 100;
    const maxSwipeTime = 300;

    if (deltaTime < maxSwipeTime) {
      if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < 50) {
        // Horizontal swipe
        if (deltaX > 0) {
          this.onSwipeRight();
        } else {
          this.onSwipeLeft();
        }
      } else if (Math.abs(deltaY) > minSwipeDistance && Math.abs(deltaX) < 50) {
        // Vertical swipe
        if (deltaY > 0) {
          this.onSwipeDown();
        } else {
          this.onSwipeUp();
        }
      }
    }
  }

  // Override these methods in subclasses
  protected onSwipeLeft(): void {}
  protected onSwipeRight(): void {}
  protected onSwipeUp(): void {}
  protected onSwipeDown(): void {}

  public destroy(): void {
    if (this.element) {
      this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
      this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    }
  }
}