import React, { useState } from 'react';
import {
  Button,
  Input,
  Checkbox,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Container,
  AppTitle,
  TaskText,
  CounterText,
  ErrorText,
  EmptyStateTitle,
  EmptyStateSubtitle,
} from '@/components/ui';

/**
 * Design System Demo Component
 * 
 * This component demonstrates all the design system components in action.
 * It serves as both a showcase and a reference for developers.
 */
export default function DesignSystemDemo() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Learn about the design system', completed: false },
    { id: 2, text: 'Build amazing UI components', completed: true },
    { id: 3, text: 'Create a responsive layout', completed: false },
  ]);

  const activeCount = tasks.filter(task => !task.completed).length;

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (inputValue.trim()) {
      setTasks([
        ...tasks,
        { 
          id: Date.now(), 
          text: inputValue.trim(), 
          completed: false 
        }
      ]);
      setInputValue('');
    }
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
    setIsDialogOpen(false);
  };

  return (
    <Container>
      <div className="app-header">
        <AppTitle>Design System Demo</AppTitle>
      </div>

      <div className="space-y-6">
        {/* Typography Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Typography Components</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <AppTitle>App Title Component</AppTitle>
            </div>
            <div>
              <TaskText>Normal task text</TaskText>
            </div>
            <div>
              <TaskText completed>Completed task text</TaskText>
            </div>
            <div>
              <CounterText>{activeCount} items left</CounterText>
            </div>
            <div>
              <ErrorText>This is an error message</ErrorText>
            </div>
            <div className="empty-state">
              <EmptyStateTitle>No tasks yet</EmptyStateTitle>
              <EmptyStateSubtitle>Start by adding your first task</EmptyStateSubtitle>
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Input Components</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Normal Input</label>
              <Input 
                placeholder="What needs to be done?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Error Input</label>
              <Input 
                error
                placeholder="This field has an error"
              />
            </div>
          </CardContent>
        </Card>

        {/* Button Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Button Components</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="primary" size="small">Small</Button>
              <Button variant="secondary" size="small">Small</Button>
              <Button variant="ghost" size="small">Small</Button>
              <Button variant="danger" size="small">Small</Button>
            </div>
          </CardContent>
        </Card>

        {/* Task List Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Interactive Task List</h2>
          </CardHeader>
          <CardContent className="p-0">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <EmptyStateTitle>No tasks yet</EmptyStateTitle>
                <EmptyStateSubtitle>Start by adding your first task</EmptyStateSubtitle>
              </div>
            ) : (
              <div>
                {tasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />
                    <TaskText completed={task.completed}>
                      {task.text}
                    </TaskText>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="app-footer">
            <CounterText>{activeCount} item{activeCount !== 1 ? 's' : ''} left</CounterText>
            <Button 
              variant="danger" 
              size="small"
              onClick={() => setIsDialogOpen(true)}
              disabled={tasks.filter(task => task.completed).length === 0}
            >
              Clear completed
            </Button>
          </CardFooter>
        </Card>

        {/* Checkbox Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Checkbox Components</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Checkbox label="Unchecked checkbox" />
            <Checkbox checked label="Checked checkbox" />
            <Checkbox error label="Error checkbox" />
            <Checkbox>
              Custom checkbox content
            </Checkbox>
          </CardContent>
        </Card>
      </div>

      {/* Dialog Component */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear completed tasks</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove all completed tasks? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={clearCompleted}
            >
              Clear completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
