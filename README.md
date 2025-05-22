# NotesApp Architecture Guide

## Overview

This is a full-stack note-taking application built with a React frontend and Express backend. The application allows users to create accounts, manage notes, and organize them. It uses a modern tech stack with TypeScript, Drizzle ORM, SQLite (currently), React Query for data fetching, and shadcn/ui components for the UI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern client-server architecture:

1. **Frontend**: React SPA built with Vite, using TypeScript and shadcn/ui components
2. **Backend**: Express.js API server with REST endpoints
3. **Database**: Currently configured with SQLite (via Drizzle ORM) but prepared for Postgres
4. **Authentication**: Custom auth implementation with user sessions
5. **State Management**: TanStack Query (React Query) for server state management

The system is structured as a monorepo with the following main directories:
- `/client`: React frontend application
- `/server`: Express.js backend server
- `/shared`: Shared code between frontend and backend (schemas, types)

## Key Components

### Frontend

1. **UI Component Library**
   - Using shadcn/ui components (based on Radix UI primitives)
   - Tailwind CSS for styling with a configurable theme system
   - Custom light/dark mode implementation

2. **State Management**
   - TanStack Query for API data fetching, caching, and invalidation
   - React Hook Form for form state management and validation
   - Zod for schema validation

3. **Routing**
   - Uses Wouter for lightweight client-side routing

### Backend

1. **API Layer**
   - Express.js server with RESTful endpoints
   - JSON response format with appropriate status codes
   - Request logging middleware

2. **Database Layer**
   - Drizzle ORM for type-safe database operations
   - Schema definition in `/shared/schema.ts`
   - Currently using SQLite but designed to be compatible with Postgres

3. **Authentication**
   - Custom user authentication with session-based auth
   - Password hashing for secure storage

### Data Model

The database has two main tables:
1. **Users**: Stores user credentials and profile information
2. **Notes**: Stores notes with title, content, importance flag, and timestamps

The schema is defined using Drizzle ORM with zod validation:
```typescript
// Core tables
export const users = sqliteTable('users', {...});
export const notes = sqliteTable('notes', {...});

// Validation schemas
export const insertUserSchema = createInsertSchema(users);
export const insertNoteSchema = createInsertSchema(notes);
```

## Data Flow

1. **User Authentication**
   - User submits login credentials via React Hook Form
   - Data is validated using Zod schemas
   - Server authenticates and creates a session
   - UI updates to show authenticated state

2. **Note Management**
   - Notes are fetched using React Query hooks that call API endpoints
   - CRUD operations trigger optimistic UI updates
   - Server updates database and responds with success/failure
   - React Query handles cache invalidation based on responses

3. **Error Handling**
   - Frontend uses toast notifications for user feedback
   - API endpoints return appropriate HTTP status codes
   - Form validation provides immediate user feedback

## External Dependencies

### Frontend Dependencies
- React & React DOM
- TanStack Query for data fetching
- React Hook Form & Zod for form validation
- shadcn/ui & Radix UI for components
- Tailwind CSS for styling
- Wouter for routing

### Backend Dependencies
- Express.js for API server
- Drizzle ORM for database operations
- Better-SQLite3 for database connection (development)
- TypeScript for type safety

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Build Process**
   - Frontend: Vite for bundling and optimization
   - Backend: esbuild for transpiling TypeScript to JavaScript
   - Combined build script: `npm run build`

2. **Environment Configuration**
   - Development mode: `npm run dev` runs both client and server
   - Production mode: Serves static files and API from single Node.js process

3. **Database Strategy**
   - Development: In-memory SQLite
   - Production: Prepared for Postgres connection (requires configuration)

4. **Scaling Considerations**
   - Stateless API design allows for horizontal scaling
   - Database connections are pooled and managed efficiently

## Development Workflow

1. Run the application in development mode:
   ```
   npm run dev
   ```

2. Database schema changes:
   ```
   npm run db:push
   ```

3. Building for production:
   ```
   npm run build
   ```

4. Running in production:
   ```
   npm run start
   ```