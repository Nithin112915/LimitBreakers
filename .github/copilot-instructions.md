<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Limit Breakers - AI-Driven Personal Growth Platform

## Project Overview
Limit Breakers is a comprehensive personal growth and productivity platform that combines AI-driven coaching, social accountability, and gamification to help users build lasting habits.

## Key Technologies
- **Frontend**: Next.js 14 with App Router, React 18, TypeScript, Tailwind CSS
- **Backend**: MongoDB with Mongoose, NextAuth.js
- **AI Integration**: OpenAI API for personalized coaching and recommendations
- **UI Components**: Heroicons, Framer Motion for animations
- **Styling**: Tailwind CSS with custom component classes

## Code Style Guidelines

### TypeScript
- Use strict TypeScript with proper type definitions
- Define interfaces for all data structures
- Use the custom types from `src/types/index.ts`
- Prefer type inference where possible but be explicit for complex types

### React Components
- Use functional components with hooks
- Implement proper error boundaries
- Use client components (`'use client'`) for interactive features
- Follow the component structure in `src/components/`

### Styling
- Use Tailwind CSS utility classes
- Custom component classes are defined in `globals.css`
- Use the predefined color palette (primary, secondary, success, warning, danger)
- Implement responsive design with mobile-first approach

### Database Models
- All models are in `src/models/` directory
- Use Mongoose schemas with proper validation
- Index frequently queried fields
- Include timestamps and proper relationships

### API Routes
- Follow RESTful conventions
- Use proper HTTP status codes
- Implement error handling and validation
- Use NextAuth.js for authentication

## Feature Implementation Notes

### Honor Points System
- Points are awarded/deducted based on habit completion
- Calculations should consider difficulty level and streak bonuses
- Update user's total honor points atomically

### Proof Submission
- Support multiple file types (images, videos, documents)
- Implement verification workflow (pending → approved/rejected)
- Store file URLs and metadata securely

### AI Recommendations
- Use OpenAI API for generating personalized insights
- Analyze user behavior patterns and habit history
- Provide actionable recommendations with impact estimates

### Social Features
- Implement following/followers relationships
- Create activity feeds with proper privacy controls
- Enable community challenges and group interactions

## Security Considerations
- Validate all user inputs
- Implement proper authentication and authorization
- Use environment variables for sensitive data
- Follow OWASP security guidelines

## Performance Optimization
- Use Next.js Image component for optimized images
- Implement proper caching strategies
- Use database indexes for frequently queried data
- Lazy load non-critical components

## Development Workflow
- Use TypeScript strict mode
- Follow the existing component structure
- Test components with realistic data
- Ensure mobile responsiveness
- Implement proper loading and error states
