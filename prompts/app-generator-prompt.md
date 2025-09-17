# App Generator Prompt

## Overview
Generate a complete frontend application based on project requirements and design specifications. This prompt will analyze the requirements, design, and create a suitable technology stack along with a working application and test suite.

## Inputs Required

1. **PROJECT_NAME**: todo
2. **REQUIREMENT_SPECS_PATH**: `specifications/{PROJECT_NAME}/requirements`
3. **STYLE_GUIDE_PATH**: `design-guidelines/design-tokens.tokens.json`

## Instructions

### Phase 1: Analysis and Planning

1. **Requirement Analysis**
   - Read and analyze all files in `REQUIREMENT_SPECS_PATH`
   - Extract functional requirements, user flows, and technical constraints
   - Identify core features and nice-to-have features
   - Document API requirements and data models

2. **Design Analysis**
   - Read and analyze the style guide from `STYLE_GUIDE_PATH`
   - Extract the design system (colors, typography, spacing, components)
   - Parse design tokens (colors, fonts, spacing, shadows, etc.)
   - Identify component specifications and design patterns
   - Note responsive design requirements and breakpoints

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

2. **Base Components**
   - Create reusable UI components (Button, Input, Card, etc.)
   - Implement responsive design patterns
   - Ensure accessibility compliance (ARIA labels, keyboard navigation)

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
   - Create pages and components following the style guide from `STYLE_GUIDE_PATH`
   - Implement navigation and routing
   - Add form handling and validation
   - Implement state management solutions
   - Add error handling and loading states

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
- UI following design specifications from `STYLE_GUIDE_PATH`
- Responsive design for mobile and desktop
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
- Accurate implementation of style guide specifications from `STYLE_GUIDE_PATH`
- Responsive design for all screen sizes
- Consistent spacing and typography as defined in the style guide
- Proper color usage and accessibility contrast following style guide standards

### Documentation Quality
- Clear setup instructions
- Comprehensive feature documentation
- Code examples and usage patterns
- Troubleshooting guides

## Example Usage

```bash
# Input example:
PROJECT_NAME="expense-tracker"
REQUIREMENT_SPECS_PATH="./specifications/expense-tracker/requirements/"
STYLE_GUIDE_PATH="./design-guidelines/design-tokens.tokens.json"

# Expected output:
expense-tracker/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── __tests__/
├── package.json
├── README.md
└── ... (complete project structure)
```

## Success Criteria

1. ✅ Application implements all functional requirements
2. ✅ UI follows style guide specifications from `STYLE_GUIDE_PATH`
3. ✅ Test suite covers critical functionality
4. ✅ Code follows best practices and is maintainable
5. ✅ Documentation is comprehensive and clear
6. ✅ Application is responsive and accessible
7. ✅ Build and deployment process is documented
8. ✅ Error handling and edge cases are covered

---

*This prompt ensures the generation of a production-ready frontend application that meets all specified requirements while maintaining high code quality and comprehensive testing.*