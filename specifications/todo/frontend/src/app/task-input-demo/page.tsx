import React, { useState } from 'react';
import { TaskInput } from '@/components/todos';
import { Container, AppTitle } from '@/components/ui';

/**
 * Task Input Demo Page
 * 
 * Demonstrates the TaskInput component functionality for S05 implementation.
 * This page allows testing all acceptance criteria:
 * - AC01: Text input field at top of app
 * - AC02: Enter key adds task  
 * - AC03: Input clears after adding
 * - AC04: Focus returns to input
 */
export default function TaskInputDemo() {
  const [addedTasks, setAddedTasks] = useState<string[]>([]);

  const handleAddTask = (taskText: string) => {
    setAddedTasks(prev => [...prev, taskText]);
    console.log('Task added:', taskText);
  };

  return (
    <Container>
      <div className="app-header">
        <AppTitle>Task Input Demo - S05</AppTitle>
        <p className="text-center text-text-secondary mb-6">
          Test the task input component functionality
        </p>
      </div>

      {/* AC01: Text input field at top of app */}
      <div className="max-w-md mx-auto">
        <TaskInput onAdd={handleAddTask} />
        
        {/* Display added tasks for testing purposes */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">
            Added Tasks ({addedTasks.length})
          </h3>
          
          {addedTasks.length === 0 ? (
            <p className="text-text-muted italic">
              No tasks added yet. Try typing a task and pressing Enter!
            </p>
          ) : (
            <ul className="space-y-2">
              {addedTasks.map((task, index) => (
                <li 
                  key={index}
                  className="p-3 bg-background-content border border-border-light rounded-md"
                >
                  <span className="text-task-text">{task}</span>
                  <span className="text-xs text-text-muted ml-2">
                    (#{index + 1})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Testing instructions */}
        <div className="mt-8 p-4 bg-background-hover rounded-lg">
          <h4 className="font-semibold mb-2 text-text-primary">
            Test Acceptance Criteria:
          </h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>✓ <strong>AC01:</strong> Input field is positioned at the top</li>
            <li>✓ <strong>AC02:</strong> Press Enter to add a task</li>
            <li>✓ <strong>AC03:</strong> Input clears after adding</li>
            <li>✓ <strong>AC04:</strong> Focus stays on input for next task</li>
          </ul>
        </div>

        {/* Clear tasks button for testing */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setAddedTasks([])}
            className="text-sm text-text-muted hover:text-text-secondary transition-colors"
            disabled={addedTasks.length === 0}
          >
            Clear all tasks
          </button>
        </div>
      </div>
    </Container>
  );
}
