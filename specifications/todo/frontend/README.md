# Quick Todo Application

A frictionless, no-login todo app that allows users to quickly note tasks and manage them with minimal effort. Built with Next.js, TypeScript, and Tailwind CSS.

## Project Overview

This project implements a simple yet powerful todo application that prioritizes speed and simplicity. Users can add tasks instantly, mark them as complete, filter views, and edit tasks with minimal friction.

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks with local storage persistence
- **Development Tools**: ESLint, Prettier, TypeScript

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx       # Root layout component
│   ├── page.tsx         # Home page component
│   └── globals.css      # Global styles with Tailwind
├── components/          # React components organized by feature
│   ├── layout/          # Layout components (Header, Footer, etc.)
│   ├── todos/           # Todo-specific components
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and services
├── types/               # TypeScript interfaces and types
│   └── index.ts         # Core type definitions
└── __tests__/           # Tests mirroring the src structure
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Design System

The application uses a custom design system built with Tailwind CSS that implements the design specifications:

### Colors

- **Primary**: Blue (#3B82F6)
- **Text**: Gray scale from #111827 to #9CA3AF
- **Background**: Light grays (#F9FAFB, #FFFFFF)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)

### Typography

- **Font**: System font stack for optimal performance
- **Scales**: Responsive typography from 14px to 48px
- **Weights**: Regular (400) and Medium (500)

### Spacing

- **Container**: Max-width 800px, responsive padding
- **Components**: Consistent 4px base grid system

## Features

### Current Implementation (S01 - Project Setup)

- ✅ Next.js project with TypeScript
- ✅ Tailwind CSS configuration with design system
- ✅ ESLint and Prettier setup
- ✅ Basic folder structure
- ✅ Development environment ready

### Planned Features

- [ ] Task input and creation (S05)
- [ ] Task list display (S06)
- [ ] Task status management (S08)
- [ ] Task filtering (S11)
- [ ] Task editing (S13)
- [ ] Bulk operations (S09)
- [ ] Local storage persistence (S02)

## Development Guidelines

### Code Quality

- TypeScript strict mode enabled
- ESLint with Next.js and TypeScript rules
- Prettier for consistent formatting
- Component-based architecture

### Accessibility

- WCAG 2.1 AA compliance target
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Touch-friendly interactions (44px minimum)

### Performance

- Mobile-first responsive design
- Optimized animations (60fps target)
- Bundle size optimization
- Local storage for data persistence

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari 14+ (iOS 14+)
- Chrome Mobile 90+

## Contributing

This project follows the user story-driven development approach. Each feature is implemented as a separate user story with specific acceptance criteria.

### Story Implementation Process

1. Analyze user story requirements
2. Design component architecture
3. Implement minimal viable solution
4. Test against acceptance criteria
5. Document implementation

## License

This project is part of the CodeStorm AI Native Engineering Forge hackathon.

---

**Note**: This README documents the current state after completing User Story S01 (Project Setup). Features and documentation will be updated as additional user stories are implemented.
