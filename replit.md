# Wesal - Spiritual Awareness Platform

## Overview

Wesal is a spiritual growth and awareness platform designed for Arabic-speaking users. The application provides a comprehensive digital space for spiritual development, community interaction, and personalized learning experiences. It features an awareness mapping system, community forums, digital library, and user profiles to support individuals on their spiritual journey.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Static HTML/CSS/JavaScript application
- **UI Framework**: Tailwind CSS for responsive design
- **Typography**: Cairo font family for Arabic text support
- **Hosting**: Python HTTP server for development (port 5000)
- **Language Support**: Right-to-left (RTL) Arabic interface

### Backend Architecture
- **Current State**: Client-side only application with localStorage for data persistence
- **Authentication**: Browser-based session management
- **Data Storage**: localStorage for user preferences, progress, and content
- **Server**: Simple Python HTTP server for static file serving

### Key Design Decisions
- **Static Site Approach**: Chosen for simplicity and fast deployment, suitable for MVP stage
- **Arabic-First Design**: RTL layout and Arabic typography prioritized throughout
- **Modular JavaScript**: Separate JS files for each major feature area
- **Responsive Design**: Mobile-first approach using Tailwind CSS utilities

## Key Components

### 1. Authentication System (`js/auth.js`)
- Login/signup functionality with tab-based interface
- Session management through localStorage
- Floating particle animations for visual appeal
- Form validation and user feedback

### 2. Awareness Map (`awareness-map.html`, `js/awareness-map.js`)
- Interactive spiritual progression tracking
- Level-based advancement system
- Progress visualization and requirements
- Personalized content recommendations based on current level

### 3. Community Platform (`community.html`, `js/community.js`)
- Social interaction features for spiritual community
- Post creation and sharing capabilities
- User engagement tracking
- Community statistics and insights

### 4. Digital Library (`library.html`, `js/library.js`)
- Curated spiritual content collection
- Content filtering and categorization
- Saved content functionality
- Personalized recommendations

### 5. User Profiles (`profile.html`, `js/profile.js`)
- Personal progress tracking
- Achievement system
- User activity history
- Profile customization options

### 6. Contact Support (`contact.html`, `js/contact.js`)
- User support interface
- Chat functionality
- FAQ system
- Help documentation

## Data Flow

### User Authentication Flow
1. User visits landing page (`index.html`)
2. Clicks login/register (`login.html`)
3. Credentials stored in localStorage
4. Session established for protected pages
5. Automatic logout functionality on all pages

### Content Interaction Flow
1. User authentication verified
2. Content loaded from predefined JavaScript arrays
3. User interactions stored in localStorage
4. Progress tracked and displayed across sessions
5. Personalized recommendations generated

### Community Interaction Flow
1. Authenticated users can create posts
2. Posts stored locally with timestamps
3. Community stats calculated from user data
4. Social features tracked per user

## External Dependencies

### CDN Resources
- **Tailwind CSS**: `https://cdn.tailwindcss.com` - UI framework
- **Google Fonts**: Cairo font family for Arabic typography

### Third-Party Integrations
- No external APIs currently integrated
- All functionality implemented client-side
- Ready for future backend integration

## Deployment Strategy

### Current Deployment
- **Development Server**: Python HTTP server on port 5000
- **Static Files**: All assets served directly
- **Configuration**: `.replit` file configures Node.js and Python modules

### Production Considerations
- Static site hosting (Netlify, Vercel, GitHub Pages)
- CDN integration for improved performance
- Future database integration for user persistence
- API backend for enhanced functionality

### Scaling Approach
- Backend API development with Node.js/Express or Python/FastAPI
- Database integration (PostgreSQL recommended)
- User authentication service
- Content management system
- Real-time community features

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 20, 2025. Initial setup