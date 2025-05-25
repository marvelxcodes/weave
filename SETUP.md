# WEAVE Setup Guide

## Overview

WEAVE now uses a hybrid architecture:
- **Frontend & Authentication**: Next.js with NextAuth for user management
- **Story Generation**: External Python FastAPI for AI-powered story creation
- **Database**: PostgreSQL for user data and story storage

## Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/weave"
DIRECT_URL="postgresql://username:password@localhost:5432/weave"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# External Python API Configuration
EXTERNAL_API_URL="http://ec2-54-252-168-199.ap-southeast-2.compute.amazonaws.com"

# For local development with Python backend, use:
# EXTERNAL_API_URL="http://localhost:8000"
```

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

### 3. Start the Application
```bash
npm run dev
```

## Authentication Flow

1. **User Registration**: 
   - Users register through Next.js API (`/api/auth/register`)
   - User data is stored in PostgreSQL
   - User preferences are synced with external Python API

2. **User Login**:
   - Users sign in through NextAuth (`/api/auth/signin`)
   - Session is managed by NextAuth with JWT tokens

3. **Story Generation**:
   - Authenticated users can generate stories
   - Next.js API routes proxy requests to Python backend
   - Story data is stored locally and linked to external API

## API Architecture

### Next.js API Routes
- `/api/auth/register` - User registration
- `/api/auth/signin` - User authentication (NextAuth)
- `/api/story/generate` - Story generation (proxies to Python API)
- `/api/story/continue` - Story continuation (proxies to Python API)
- `/api/suggestions` - Story prompts (proxies to Python API)
- `/api/genres` - Available genres (proxies to Python API)
- `/api/authors` - Author list (proxies to Python API)

### External Python API
- `POST /register` - Sync user preferences
- `POST /story/generate` - Generate new stories
- `POST /story/continue` - Continue existing stories
- `GET /suggestions` - Get story prompts
- `GET /genres` - Get available genres
- `GET /authors` - Get author list

## Key Features

### 1. Secure Authentication
- Password-based authentication with bcrypt hashing
- Session management with NextAuth
- Protected API routes

### 2. Hybrid Story Generation
- Primary: External Python API with AI story generation
- Fallback: Local story generation if external API fails
- Story data stored locally for persistence

### 3. User Preferences
- Author preferences stored locally and synced with external API
- Personalized story generation based on preferences

### 4. Error Handling
- Graceful fallbacks when external API is unavailable
- Comprehensive error messages for users
- Logging for debugging

## Development

### Running with Local Python Backend

1. Start the Python backend:
```bash
cd weave-backend
python main.py
```

2. Update `.env.local`:
```env
EXTERNAL_API_URL="http://localhost:8000"
```

3. Start the Next.js frontend:
```bash
npm run dev
```

### Database Management

```bash
# Reset database
npm run db:push

# Create new migration
npm run db:migrate

# View database
npm run db:studio
```

## Troubleshooting

### External API Connection Issues
- Check that `EXTERNAL_API_URL` is correctly set
- Verify the Python backend is running and accessible
- Check browser network tab for failed requests

### Authentication Issues
- Ensure `NEXTAUTH_SECRET` is set
- Check database connection
- Verify user exists in database

### Story Generation Issues
- Check external API connectivity
- Review server logs for error details
- Verify user is authenticated

## Production Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy Next.js application
5. Ensure external Python API is accessible

The application will automatically fall back to local story generation if the external API is unavailable. 