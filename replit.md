# ForestQuest - Gamified Productivity Web Application

## Overview

ForestQuest is a nature-themed gamified productivity web application that helps users build and maintain productive habits through engaging game mechanics. Users grow a virtual tree avatar by completing tasks, earning experience points and unlocking achievements along their productivity journey. The application combines task management with RPG-style progression systems to create an engaging and motivational experience.

The application features a clean, modern interface built with React and TypeScript, utilizing a forest-inspired color palette with greens and natural tones. The system tracks user progress through levels, experience points, hit points, and streak counters, while providing visual feedback through an evolving tree avatar that grows based on user activity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing with two main pages (Dashboard and Tasks)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Custom component library built on Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with custom forest-themed color variables and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database ORM**: Drizzle ORM with TypeScript-first schema definitions
- **API Design**: RESTful API with JSON responses and proper HTTP status codes
- **Game Mechanics**: Server-side calculation of experience points, levels, and achievement unlocks
- **Development Setup**: Hot module replacement in development with Vite integration

### Database Design
The application uses PostgreSQL with the following core entities:
- **Users**: Store user profiles, levels, experience, hit points, streaks, and tree growth stages
- **Tasks**: Manage user tasks with priority levels, categories, due dates, and experience rewards
- **Achievements**: Define unlockable achievements with icons, colors, and unlock conditions
- **UserAchievements**: Track which achievements each user has unlocked and when

The schema includes enums for task status (pending, completed, overdue) and priority levels (low, medium, high, critical) to ensure data consistency.

### Game Mechanics System
- **Experience Points**: Awarded based on task priority (10-100 XP) with automatic level progression
- **Tree Growth**: Visual avatar progresses through 10 stages based on accumulated experience
- **Health Points**: Maintained through consistent task completion and streak management
- **Achievement System**: Predefined achievements unlock based on user milestones and behaviors
- **Task Rewards**: Dynamic reward calculation based on task complexity and priority level

### Component Architecture
- **Page Components**: Dashboard and Tasks pages as main application views
- **Feature Components**: TreeAvatar, StatsCard, TaskForm, TaskItem for specific functionality
- **UI Components**: Reusable design system components (Button, Card, Input, etc.)
- **Layout Components**: Navigation and responsive container structures

The frontend follows a component composition pattern with clear separation between presentation and business logic.

## External Dependencies

### Database and Storage
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Drizzle Kit**: Database migration and schema management tools

### UI and Styling
- **Radix UI**: Unstyled, accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library providing consistent iconography
- **Class Variance Authority**: Component variant management for styled components

### Development and Build Tools
- **Vite**: Fast build tool and development server with HMR support
- **TypeScript**: Type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Data Management
- **TanStack Query**: Server state synchronization with caching and background updates
- **Wouter**: Minimal client-side routing library
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation for API requests and responses

### Production Utilities
- **Date-fns**: Date manipulation and formatting utilities
- **Nanoid**: Unique ID generation for database records
- **Connect-pg-simple**: PostgreSQL session store for Express sessions

The application is configured for deployment with both development and production build scripts, utilizing environment variables for database connections and feature flags.