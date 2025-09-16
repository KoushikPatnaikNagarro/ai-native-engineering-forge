## General Instructions for Copilot during development

##  Project structure -
Ensure that the frontend app follows a clean, modular architecture that makes it easy to maintain and extend:
 
```

src/

├── app/                 # Next.js App Router pages

├── components/          # React components organized by feature

│   ├── layout/          # Layout components (Header, Footer, etc.)

│   ├── transactions/    # Feature-specific components

│   └── ui/              # Reusable UI components

├── hooks/               # Custom React hooks

│   └── transactions/    # Feature-specific hooks

├── lib/                 # Utilities and services

│   ├── data/            # Mock data

│   ├── models/          # TypeScript interfaces and types

│   └── services/        # API services

└── __tests__/           # Tests mirroring the src structure
 
The starter app includes a collection of reusable UI components in the `src/components/ui` directory. These components follow best practices for accessibility, theming, and responsiveness.
 
### Extending UI Components
 
The UI components are designed to be extended for custom use cases. You can create feature-specific components that build upon these base components:
 
#### Test File Structure
 
Tests are stored in the `__tests__` directory, mirroring the structure of the `src` directory:
 
```

__tests__/

├── components/

│   ├── layout/

│   ├── transactions/

│   └── ui/

├── hooks/

└── lib/

    └── services/
 
## SOLID Principles in This App
 
This starter app follows SOLID principles to create maintainable and scalable code:
 
### Single Responsibility Principle (SRP)
 
Each component, hook, and service has a single responsibility:
 
- UI components handle rendering and user interaction

- Hooks manage state and side effects

- Services handle data fetching and API communication
  
### Open/Closed Principle (OCP)
 
Components are designed to be extended without modification:
 
- UI components accept props for customization

- Higher-order components and composition are used for extending functionality
 
### Liskov Substitution Principle (LSP)
 
Interface implementations can be substituted without affecting the behavior:
 
- Abstract interfaces for services allow swapping implementations

- Mock services can be substituted for real ones during testing
 
### Interface Segregation Principle (ISP)
 
Specific interfaces are better than general ones:
 
- Model interfaces are specific to their use cases (e.g., `Transaction`, `CreateTransactionDto`)

- Component props are defined only with the properties they need
 
Example from `transaction.ts`:

```typescript

// Base Transaction interface

export interface Transaction {

  id: string;

  date: string;

  description: string;

  type: TransactionType;

  status: TransactionStatus;

  amount: number;

}
 
// Separate interface for creation (without ID)

export interface CreateTransactionDto {

  date: string;

  description: string;

  type: TransactionType;

  status: TransactionStatus;

  amount: number;

}
 
// Separate interface for updates (all properties optional except ID)

export interface UpdateTransactionDto {

  id: string;

  date?: string;

  description?: string;

  type?: TransactionType;

  status?: TransactionStatus;

  amount?: number;

}

```
 
### Dependency Inversion Principle (DIP)
 
High-level modules don't depend on low-level modules directly:
 
- Dependency injection is used for services

- Context API provides dependencies to components

- Abstractions (interfaces) are used instead of concrete implementations
 
## Adding Features
 
When adding new features to the application:
 
1. **Plan your feature structure**:

   - Create new directories in `components/` for feature-specific components

   - Add related hooks in `hooks/`

   - Define models in `lib/models/`

   - Add API services in `lib/services/`
 
2. **Follow the established patterns**:

   - Use the existing UI components

   - Structure your code following SOLID principles

   - Write tests for new functionality
 
3. **Create the required pages**:

   - Add new pages in the `app/` directory following Next.js App Router patterns
 
## Best Practices
 
- **State Management**: Use React hooks for local state, and Context API for global state

- **API Calls**: Encapsulate API calls in service classes, use custom hooks to consume them

- **Styling**: Use Tailwind CSS for styling components

- **Error Handling**: Implement proper error boundaries and graceful fallbacks

- **Accessibility**: Ensure all components meet WCAG guidelines

- **Testing**: Write tests for all new components and features

- **Performance**: Use React.memo, useMemo, and useCallback for performance optimization when necessary

 