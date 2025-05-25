# Backend Integration Guide

This document explains how the frontend has been integrated with the Python FastAPI backend.

## Backend Configuration

The frontend is now configured to connect to the Python backend at:
- **Production**: `http://ec2-54-252-168-199.ap-southeast-2.compute.amazonaws.com`
- **Local Development**: `http://localhost:8000` (when running backend locally)

## Environment Configuration

To configure the backend URL, create a `.env.local` file in the root directory:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://ec2-54-252-168-199.ap-southeast-2.compute.amazonaws.com

# For local development, uncomment the line below and comment the one above
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Integration Changes

### 1. Updated API Types (`src/types/api.ts`)
- Changed author preferences from string names to numeric IDs
- Updated response structures to match Python backend
- Added new types for genres and authors endpoints
- Removed password fields (backend doesn't use authentication)

### 2. Updated API Service (`src/lib/storyApi.ts`)
- Changed endpoint URLs to match FastAPI routes
- Updated HTTP methods (some endpoints now use GET instead of POST)
- Added new endpoints for genres and authors
- Updated error handling to use FastAPI's `detail` field

### 3. Updated API Client (`src/lib/api.ts`)
- Changed base URL to point to Python backend
- Removed `/api` prefix from URLs

### 4. Updated Components

#### Signup Page (`src/app/auth/signup/page.tsx`)
- Removed password fields
- Updated to use author IDs instead of names
- Generates unique user IDs automatically
- Stores user info in localStorage for session management

#### Story Generator (`src/components/StoryGenerator.tsx`)
- Updated suggestions API call to handle new response format
- Changed story continuation to use string choices instead of numbers
- Updated story display to handle new chapter structure

## API Endpoints

The frontend now integrates with these Python backend endpoints:

### User Management
- `POST /register` - Register a new user with preferences

### Story Operations
- `POST /story/generate` - Generate a new story
- `POST /story/continue` - Continue an existing story with a choice
- `GET /story?user_id={id}` - Get all stories for a user
- `GET /story/{story_id}?user_id={id}&chapter_num={num}` - Get story details

### Suggestions and Metadata
- `GET /suggestions?genre={genre}` - Get curated story prompts
- `GET /genres` - Get all available genres
- `GET /authors?genre_id={id}` - Get all authors (optionally filter by genre)

## Key Differences from Previous Implementation

1. **No Authentication**: The backend doesn't use JWT tokens or passwords
2. **User ID Management**: Frontend generates and manages user IDs locally
3. **Author Selection**: Uses numeric IDs instead of string names
4. **Story Structure**: Stories have chapters array instead of single content
5. **Choice Format**: Choices are strings instead of numeric indices

## Running the Integration

1. **Start the Python Backend**:
   ```bash
   cd weave-backend
   python main.py
   ```

2. **Start the Frontend**:
   ```bash
   npm run dev
   ```

3. **Test the Integration**:
   - Visit `/auth/signup` to register a user
   - Use the story generator to create and continue stories
   - Check browser console for any API errors

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the Python backend has CORS middleware configured for your frontend domain.

### API Connection Issues
1. Check that the backend is running on the correct port
2. Verify the `NEXT_PUBLIC_API_URL` environment variable
3. Check browser network tab for failed requests

### Data Format Issues
If you see data format errors, check that the frontend types match the backend Pydantic models in `weave-backend/pydantic_models.py`.

## Future Enhancements

1. **Authentication**: Add proper user authentication system
2. **Real-time Updates**: Implement WebSocket for real-time story updates
3. **Story Sharing**: Add endpoints for sharing stories between users
4. **User Preferences**: Enhance author preference system with more granular controls
5. **Story Export**: Add functionality to export stories in different formats 