# Todo Application

A modern, responsive todo application built with Next.js 14, React 18, TypeScript, and Tailwind CSS. This application provides a complete task management experience with session-based storage, intuitive user interface, and comprehensive testing.

![Todo App Demo](https://via.placeholder.com/800x400/0904a3/ffffff?text=Todo+App+Demo)

## ✨ Features

### Core Functionality
- ✅ **Task Management**: Create, edit, delete, and toggle todo items
- ✅ **Status Tracking**: Mark tasks as open or completed
- ✅ **Filtering**: View all tasks, only open tasks, or only completed tasks
- ✅ **Bulk Operations**: Mark multiple tasks as completed or clear all completed tasks
- ✅ **In-line Editing**: Edit task content directly in the list
- ✅ **Statistics**: Real-time display of total and completed task counts
- ✅ **Session Persistence**: Tasks are saved in browser session storage

### User Experience
- 🎨 **Modern Design**: Clean, intuitive interface following design system principles
- 📱 **Responsive Layout**: Optimized for desktop and mobile devices
- ♿ **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- 🎭 **Error Handling**: Graceful error states and user feedback
- ⚡ **Fast Performance**: Optimized with React best practices and Next.js features

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm package manager

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd todo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage report
npm run test:ui      # Open Vitest UI
```

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx       # Root layout with global styles
│   └── page.tsx         # Main todo application page
├── components/          # React components organized by feature
│   ├── features/        # Feature-specific components
│   │   ├── BulkActions.tsx    # Bulk operation controls
│   │   ├── FilterBar.tsx      # Task filtering and statistics
│   │   ├── TaskInput.tsx      # New task creation form
│   │   ├── TaskItem.tsx       # Individual task item
│   │   └── TaskList.tsx       # Task list container
│   └── ui/              # Reusable UI components
│       ├── Button.tsx         # Button component with variants
│       ├── Card.tsx           # Card container component
│       ├── Checkbox.tsx       # Checkbox with custom styling
│       ├── Input.tsx          # Input field with validation
│       └── index.ts           # UI components barrel export
├── hooks/               # Custom React hooks
│   └── useTodos.ts      # Todo state management hook
├── services/            # Data services and API layer
│   └── todoService.ts   # Session storage operations
├── styles/              # Design tokens and global styles
│   ├── globals.css      # Global CSS and Tailwind imports
│   └── tokens.ts        # Design system tokens
├── types/               # TypeScript type definitions
│   └── todo.ts          # Todo-related interfaces
└── utils/               # Utility functions
    └── cn.ts            # Class name utility
```

### Technology Stack

#### Frontend Framework
- **Next.js 14**: React framework with App Router for modern web applications
- **React 18**: UI library with latest features like Suspense and Concurrent Rendering
- **TypeScript**: Type-safe JavaScript for better development experience

#### Styling & Design
- **Tailwind CSS 4**: Utility-first CSS framework for rapid styling
- **Custom Design System**: Extracted from Figma design tokens
- **Responsive Design**: Mobile-first approach with flexible layouts

#### State Management
- **React Hooks**: useState and useEffect for local state management
- **Custom Hooks**: useTodos for centralized todo operations
- **Session Storage**: Browser-based persistence without backend dependency

#### Testing Framework
- **Vitest**: Fast unit testing framework with ESM support
- **React Testing Library**: Component testing utilities
- **User Events**: Realistic user interaction testing
- **Coverage Reports**: Code coverage with v8 provider

#### Development Tools
- **ESLint**: Code linting with Next.js configuration
- **Turbopack**: Fast bundler for development builds
- **TypeScript Strict Mode**: Enhanced type checking

### Design System

The application implements a comprehensive design system extracted from Figma design tokens:

#### Typography
- **Font Family**: Mulish (Primary), System fallbacks
- **Font Weights**: 400 (Regular), 700 (Bold)
- **Font Sizes**: Responsive scale from 12px to 48px

#### Color Palette
- **Primary**: `#0904a3` (Brand blue)
- **Text**: `#06041f` (Near black)
- **Background**: `#ffffff` (Pure white)
- **Gray Scale**: `#bfbfbf` (Borders), `#f5f5f5` (Light backgrounds)
- **Success**: `#16a34a` (Completed states)
- **Error**: `#dc2626` (Error states)

#### Spacing System
- **Base Unit**: 4px
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px, 160px, 192px

#### Component Variants
- **Buttons**: Primary, Secondary, Destructive, Ghost with size variants
- **Inputs**: Default, Error, Disabled states with proper focus management
- **Cards**: Subtle shadows and rounded corners for content grouping

## 🧪 Testing

### Test Coverage
The application maintains high test coverage across all critical components:

- **Services**: 95.83% coverage (TodoService)
- **Hooks**: 72.91% coverage (useTodos)
- **UI Components**: 80%+ average coverage
- **Feature Components**: 100% coverage for tested components

### Test Categories

#### Unit Tests
- **Service Layer**: CRUD operations, error handling, data validation
- **Custom Hooks**: State management, side effects, error states
- **UI Components**: Rendering, user interactions, accessibility
- **Feature Components**: Form validation, event handling, prop passing

#### Integration Tests
- **User Workflows**: Complete task creation and management flows
- **State Persistence**: Session storage integration
- **Error Scenarios**: Network failures and invalid input handling

### Running Tests

```bash
# Run all tests
npm run test:run

# Watch mode for development
npm run test

# Generate coverage report
npm run test:coverage

# Interactive test UI
npm run test:ui

# Run specific test file
npm run test:run src/__tests__/services/todoService.test.ts
```

## 🏛️ Code Architecture Principles

### SOLID Principles Implementation

#### Single Responsibility Principle (SRP)
- Each component has a single, well-defined purpose
- Services handle only data operations
- Hooks manage only state and side effects
- UI components focus solely on presentation

#### Open/Closed Principle (OCP)
- Components are designed for extension through props and composition
- UI components accept variant props for customization
- Higher-order patterns enable feature enhancement

#### Liskov Substitution Principle (LSP)
- Interface implementations are interchangeable
- Mock services can replace real services in tests
- Component props follow consistent contracts

#### Interface Segregation Principle (ISP)
- Specific interfaces for different use cases (CreateTodoDto, UpdateTodoDto)
- Component props include only necessary properties
- Service methods have focused responsibilities

#### Dependency Inversion Principle (DIP)
- Components depend on abstractions (interfaces) not implementations
- Dependency injection through props and context
- Service layer abstracts storage implementation details

### Best Practices

#### Component Design
- **Composition over Inheritance**: Flexible component relationships
- **Props Validation**: TypeScript interfaces for type safety
- **Error Boundaries**: Graceful error handling
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML

#### State Management
- **Local State**: Component-specific state with useState
- **Shared State**: Cross-component state with custom hooks
- **Side Effects**: Proper cleanup with useEffect
- **Performance**: Optimized re-renders with useMemo and useCallback

#### Code Quality
- **Type Safety**: Strict TypeScript configuration
- **Linting**: ESLint with Next.js recommended rules
- **Testing**: Comprehensive test coverage
- **Documentation**: Clear comments and README

## 🚀 Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

### Deployment Options

#### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure build settings (auto-detected for Next.js)
3. Deploy with automatic CI/CD

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Static Export
```bash
# Add to next.config.js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

# Build static files
npm run build
```

### Environment Variables
The application runs entirely client-side with session storage, requiring no environment configuration for basic functionality.

## 🔧 Customization

### Extending the Application

#### Adding New Features
1. Create new components in `src/components/features/`
2. Define TypeScript interfaces in `src/types/`
3. Add service methods in `src/services/todoService.ts`
4. Update the main application page to include new features

#### Customizing Design
1. Modify design tokens in `src/styles/tokens.ts`
2. Update Tailwind configuration if needed
3. Customize component variants in UI components

#### Adding Backend Integration
1. Replace TodoService with API calls
2. Add authentication and user management
3. Implement server-side data persistence

### Configuration Files

#### Next.js Configuration (`next.config.ts`)
```typescript
const nextConfig = {
  experimental: {
    // Future Next.js features
  },
  images: {
    // Image optimization settings
  }
}
```

#### Tailwind Configuration (`tailwind.config.ts`)
```typescript
import { tokens } from './src/styles/tokens'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      fontFamily: tokens.fontFamily,
    },
  },
}
```

#### Testing Configuration (`vitest.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and add tests
4. Run tests: `npm run test:run`
5. Commit changes: `git commit -m "Add new feature"`
6. Push to branch: `git push origin feature/new-feature`
7. Create a Pull Request

### Code Standards
- Follow TypeScript strict mode requirements
- Maintain test coverage above 70%
- Use meaningful commit messages
- Update documentation for new features

## 📄 License

This project is part of a hackathon submission and is available for educational and demonstration purposes.

## 🙏 Acknowledgments

- Design tokens extracted from provided Figma design system
- Built following modern React and Next.js best practices
- Implements accessibility guidelines for inclusive design
- Uses session storage for offline-capable functionality

---

**Built with ❤️ for the CodeStorm AI Native Engineering Forge Hackathon**
