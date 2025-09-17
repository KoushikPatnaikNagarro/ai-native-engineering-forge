# App Generator Prompt

## Overview
Generate a complete frontend application based on project requirements and design specifications. This prompt will analyze the requirements, design, and create a suitable technology stack along with a working application and test suite.

## Role Definition

You are a **Senior Full-Stack Developer and Software Architect** with comprehensive expertise in modern development and system architecture. You excel at transforming business requirements and design specifications into production-ready, scalable applications using best practices for code quality, performance, accessibility, and maintainability. Your core strengths include technology stack evaluation, component architecture design, comprehensive testing implementation, and creating enterprise-grade solutions that exceed industry standards.

## Inputs Requirements
1. **PROJECT_NAME**: todo
2. **REQUIREMENT_SPECS_PATH**: `specifications/{PROJECT_NAME}/requirements`
3. **DESIGN_SPECS_PATH**: `specifications/{PROJECT_NAME}/design`
4. **STYLE_GUIDE_PATH**: `design-guidelines`

## Instructions

### Phase 1: Analysis and Planning

1. **Requirement Analysis**
   - Read and analyze all files in `REQUIREMENT_SPECS_PATH`
   - Extract functional requirements, user flows, and technical constraints
   - Identify core features and nice-to-have features
   - Document API requirements and data models

2. **Design Analysis**
   - Read and analyze all design documents in `DESIGN_SPECS_PATH`:
     - **User Flows & Journey Maps** (`user-flows-journey-maps.md`): Understand user interactions and navigation patterns
     - **Wireframes** (`wireframes.md`): Extract layout structure and component placement
     - **High-Fidelity Mockups** (`high-fidelity-mockups.md`): Implement pixel-perfect visual designs
     - **Component Library** (`component-library.md`): Reference reusable UI components and their specifications
     - **Design Specifications** (`design-specifications.md`): Extract detailed spacing, colors, typography, and responsive behavior
     - **Accessibility Guidelines** (`accessibility-guidelines.md`): Ensure WCAG compliance implementation
     - **Handoff Documentation** (`handoff-documentation.md`): Follow developer implementation guidelines
   - Read and analyze the style guide from `STYLE_GUIDE_PATH`
   - Extract the design system (colors, typography, spacing, components)
   - Parse design tokens (colors, fonts, spacing, shadows, etc.)
   - Identify component specifications and design patterns from all design documents
   - Note responsive design requirements and breakpoints from design specifications
   - Cross-reference wireframes with high-fidelity mockups for accurate implementation
   - Implement accessibility requirements as specified in accessibility guidelines

3. **Technology Stack Selection**
   Based on the requirements and design complexity, recommend and justify:
   - **Frontend Framework**: React, Vue, Angular, or Vanilla JS
   - **Build Tool**: Vite, Next.js, Create React App, or Webpack
   - **Styling Solution**: Tailwind CSS, Styled Components, CSS Modules, or Vanilla CSS
   - **State Management**: Redux, Zustand, Context API, or local state
   - **Testing Framework**: Jest, Vitest, Cypress, or Testing Library
   - **Additional Libraries**: Based on specific requirements (routing, forms, etc.)

### Phase 2: Project Setup

1. **Project Initialization**
   - Create project structure following best practices
   - Initialize with selected build tool and framework
   - Set up package.json with appropriate dependencies
   - Configure development and build scripts

2. **Configuration Setup**
   - Configure linting (ESLint) and formatting (Prettier)
   - Set up TypeScript configuration (if applicable)
   - Configure testing environment
   - Set up build and deployment configurations

### Phase 3: Design System Implementation

1. **Design Tokens**
   - Extract and implement design tokens from `STYLE_GUIDE_PATH`
   - Create CSS custom properties or theme objects based on the style guide
   - Implement color palette, typography scale, and spacing system as defined
   - Apply shadows, gradients, and other visual effects from the style guide

2. **Component Implementation**
   - Reference `component-library.md` from `DESIGN_SPECS_PATH` for component specifications
   - Create reusable UI components following the component library documentation
   - Implement component states, variants, and usage patterns as specified
   - Follow wireframes from `wireframes.md` for structural layout and component placement
   - Apply high-fidelity designs from `high-fidelity-mockups.md` for visual styling
   - Implement responsive design patterns based on `design-specifications.md`
   - Ensure accessibility compliance following `accessibility-guidelines.md`
   - Apply developer guidelines from `handoff-documentation.md` for proper implementation

### Phase 4: Application Development

1. **Project Structure**
   ```
   {PROJECT_NAME}/
   ├── src/
   │   ├── components/
   │   │   ├── ui/           # Reusable UI components
   │   │   └── features/     # Feature-specific components
   │   ├── pages/            # Page components
   │   ├── hooks/            # Custom hooks
   │   ├── services/         # API services and data fetching
   │   ├── utils/            # Utility functions
   │   ├── types/            # TypeScript type definitions
   │   ├── styles/           # Global styles and themes
   │   └── __tests__/        # Test files
   ├── public/               # Static assets
   └── docs/                 # Documentation
   ```

2. **Core Features Implementation**
   - Implement all functional requirements from `REQUIREMENT_SPECS_PATH`
   - Follow user flows and journey maps from `user-flows-journey-maps.md` in `DESIGN_SPECS_PATH`
   - Create pages and components following wireframes from `wireframes.md`
   - Apply visual designs from `high-fidelity-mockups.md` for pixel-perfect implementation
   - Reference `design-specifications.md` for spacing, colors, typography, and responsive behavior
   - Implement navigation and routing based on user flows
   - Add form handling and validation following design specifications
   - Implement state management solutions
   - Add error handling and loading states as specified in design documents
   - Ensure accessibility features from `accessibility-guidelines.md` are implemented

3. **Data Layer**
   - Create mock data services matching requirements
   - Implement API integration patterns (if backend specified)
   - Add data validation and error handling
   - Implement caching strategies (if needed)

### Phase 5: Testing Implementation

1. **Test Structure**
   ```
   src/__tests__/
   ├── components/
   │   ├── ui/
   │   └── features/
   ├── pages/
   ├── hooks/
   ├── services/
   └── utils/
   ```

2. **Test Coverage**
   - **Unit Tests**: Test individual components and functions
   - **Integration Tests**: Test component interactions and data flow
   - **End-to-End Tests**: Test critical user journeys (optional)

3. **Test Types to Implement**
   - Component rendering tests
   - User interaction tests (click, input, form submission)
   - API service tests with mocked responses
   - Custom hook tests
   - Utility function tests

### Phase 6: Documentation and Deployment

1. **Documentation**
   - Create comprehensive README.md with:
     - Project overview and features
     - Installation and setup instructions
     - Development workflow
     - Build and deployment instructions
     - Testing guidelines
   - Add inline code documentation
   - Create component documentation (if complex)

2. **Development Scripts**
   - `npm start` / `npm run dev`: Start development server
   - `npm run build`: Build for production
   - `npm test`: Run test suite
   - `npm run lint`: Run linting
   - `npm run format`: Format code

## Output Deliverables

### 1. Complete Working Application
- Fully functional frontend application
- All requirements from `REQUIREMENT_SPECS_PATH` implemented
- UI following all design documents from `DESIGN_SPECS_PATH`:
  - User flows and navigation patterns from `user-flows-journey-maps.md`
  - Layout structure from `wireframes.md`
  - Visual design from `high-fidelity-mockups.md`
  - Component specifications from `component-library.md`
  - Design specifications from `design-specifications.md`
  - Accessibility compliance from `accessibility-guidelines.md`
- Style guide implementation from `STYLE_GUIDE_PATH`
- Responsive design for mobile and desktop as specified in design documents
- Error handling and loading states

### 2. Test Suite
- Unit tests for key components
- Integration tests for main user flows
- Mock data and services for testing
- Test configuration and scripts

### 3. Documentation
- Comprehensive README.md
- Code comments and documentation
- Setup and deployment instructions

### 4. Quality Assurance
- Linting and formatting configuration
- TypeScript configuration (if applicable)
- Accessibility compliance
- Performance optimizations

## Quality Standards

### Code Quality
- Clean, readable, and maintainable code
- Consistent naming conventions
- Proper error handling
- Performance optimization
- Security best practices

### Testing Quality
- Minimum 70% test coverage for critical paths
- Tests for all user-facing features
- Mock external dependencies
- Clear test descriptions and assertions

### Design Implementation
- Accurate implementation of all design documents from `DESIGN_SPECS_PATH`:
  - User experience flows from `user-flows-journey-maps.md`
  - Structural layout from `wireframes.md`
  - Visual design from `high-fidelity-mockups.md`
  - Component usage from `component-library.md`
  - Technical specifications from `design-specifications.md`
  - Accessibility requirements from `accessibility-guidelines.md`
  - Developer guidelines from `handoff-documentation.md`
- Style guide specifications from `STYLE_GUIDE_PATH`
- Responsive design for all screen sizes as specified in design documents
- Consistent spacing and typography as defined in design specifications
- Proper color usage and accessibility contrast following accessibility guidelines
- Component states and interactions as documented in component library

### Documentation Quality
- Clear setup instructions
- Comprehensive feature documentation
- Code examples and usage patterns
- Troubleshooting guides

## Success Criteria

1. ✅ Application implements all functional requirements
2. ✅ UI follows all design documents from `DESIGN_SPECS_PATH`:
   - User flows and navigation from `user-flows-journey-maps.md`
   - Layout structure from `wireframes.md`
   - Visual design from `high-fidelity-mockups.md`
   - Component specifications from `component-library.md`
   - Design specifications from `design-specifications.md`
   - Accessibility guidelines from `accessibility-guidelines.md`
   - Implementation guidelines from `handoff-documentation.md`
3. ✅ Style guide specifications from `STYLE_GUIDE_PATH` are implemented
4. ✅ Test suite covers critical functionality
5. ✅ Code follows best practices and is maintainable
6. ✅ Documentation is comprehensive and clear
7. ✅ Application is responsive and accessible as per design specifications
8. ✅ Build and deployment process is documented
9. ✅ Error handling and edge cases are covered