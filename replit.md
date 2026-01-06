# Mines Predictor Bot

## Overview

A Mines game prediction bot application with a casino-themed UI. The app simulates a 5x5 grid Mines game where users select the number of mines, and the system generates "predicted" safe spots. The predictions are purely random simulations, not actual game predictions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state and API calls
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Animations**: Framer Motion for grid cell animations and transitions
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: REST API with Zod schema validation for type-safe request/response handling
- **Storage**: In-memory storage (MemStorage class) - currently not persisting to database despite Drizzle configuration
- **Shared Code**: `shared/` directory contains schemas and route definitions used by both frontend and backend

### Key Design Patterns
- **Type-Safe API Routes**: Routes defined in `shared/routes.ts` with Zod schemas for input validation and response types
- **Shared Schema**: Database schema and types defined in `shared/schema.ts` using Drizzle ORM
- **Component Architecture**: UI components in `client/src/components/ui/` following shadcn/ui patterns
- **Custom Hooks**: API interactions wrapped in custom hooks (`use-predictions.ts`)

### Directory Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   └── lib/             # Utilities
├── server/              # Express backend
├── shared/              # Shared types and schemas
└── migrations/          # Database migrations (Drizzle)
```

## External Dependencies

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema definitions and database operations
- **Note**: Database is configured but current implementation uses in-memory storage

### Third-Party Services
- **Google Fonts**: Inter and Outfit font families loaded via CDN

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animation library
- `zod`: Runtime type validation
- `drizzle-orm` / `drizzle-zod`: Database ORM and schema validation
- `express`: HTTP server framework
- Radix UI primitives: Accessible component primitives