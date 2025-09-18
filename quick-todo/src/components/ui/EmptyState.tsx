'use client';

import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  /**
   * The type of empty state to display
   */
  type: 'no-tasks' | 'no-open' | 'no-completed' | 'no-search-results';
  
  /**
   * Custom icon to display (overrides default type icon)
   */
  icon?: string;
  
  /**
   * Custom title (overrides default type title)
   */
  title?: string;
  
  /**
   * Custom description (overrides default type description)
   */
  description?: string;
  
  /**
   * Optional action button
   */
  action?: {
    label: string;
    onClick: () => void;
  };
  
  /**
   * Search term for no-search-results type
   */
  searchTerm?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Test identifier for automated testing
   */
  testId?: string;
}

/**
 * EmptyState Component
 * 
 * US14 AC03: Displays empty states with helpful guidance.
 * Provides contextual empty state messages for different scenarios.
 * 
 * @example
 * ```tsx
 * <EmptyState type="no-tasks" />
 * <EmptyState 
 *   type="no-search-results" 
 *   searchTerm="meeting"
 *   action={{ label: "Clear search", onClick: clearSearch }}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  icon,
  title,
  description,
  action,
  searchTerm,
  className = '',
  testId,
}) => {
  // Default content based on type
  const getDefaultContent = () => {
    switch (type) {
      case 'no-tasks':
        return {
          icon: '📋',
          title: 'No todos yet',
          description: 'Start by adding your first todo item. Click the "Add Todo" button to get started!',
        };
      case 'no-open':
        return {
          icon: '✅',
          title: 'All done!',
          description: 'Great job! You&apos;ve completed all your open todos. Take a well-deserved break or add new tasks.',
        };
      case 'no-completed':
        return {
          icon: '🎯',
          title: 'No completed todos',
          description: 'Complete some todos to see them here. Check off tasks as you finish them.',
        };
      case 'no-search-results':
        return {
          icon: '🔍',
          title: 'No todos found',
          description: searchTerm 
            ? `No todos match "${searchTerm}". Try a different search term or check your spelling.`
            : 'No todos found for your current search. Try adjusting your search criteria.',
        };
      default:
        return {
          icon: '📝',
          title: 'Nothing here',
          description: 'There&apos;s nothing to display right now.',
        };
    }
  };

  const defaultContent = getDefaultContent();
  const displayIcon = icon || defaultContent.icon;
  const displayTitle = title || defaultContent.title;
  const displayDescription = description || defaultContent.description;

  const classes = [
    'empty-state',
    `empty-state--${type}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      role="status"
      aria-label={`${displayTitle}: ${displayDescription}`}
      data-testid={testId}
    >
      <div className="empty-state__icon" aria-hidden="true">
        {displayIcon}
      </div>
      
      <h3 className="empty-state__title">
        {displayTitle}
      </h3>
      
      <p className="empty-state__description">
        {displayDescription}
      </p>
      
      {action && (
        <div className="empty-state__action">
          <button
            type="button"
            onClick={action.onClick}
            className="empty-state__button"
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';