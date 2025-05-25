# API Integration Documentation

This document outlines the API integration implemented for the Weave story generation platform based on the provided schema.

## Overview

The API integration includes the following endpoints:

1. **User Registration** - `/api/auth/register`
2. **Story Generation** - `/api/story/generate`
3. **Story Continuation** - `/api/story/continue`
4. **Get All Stories** - `/api/story`
5. **Get Story Details** - `/api/story/{story_id}`
6. **Get Suggestions** - `/api/suggestions`

## API Configuration

### Axios Setup (`src/lib/api.ts`)

The API client is configured with:
- Base URL from environment variable or localhost fallback
- 30-second timeout
- JSON content type headers
- Request interceptor for authentication tokens
- Response interceptor for error handling (401 redirects)

### Type Definitions (`src/types/api.ts`)

Complete TypeScript interfaces for all API requests and responses, including:
- User registration with preferred authors
- Story generation and continuation
- Story listing and details
- Prompt suggestions
- Genre types and popular authors list

## API Endpoints

### 1. User Registration
**POST** `/api/auth/register`

```typescript
interface RegisterRequest {
  user_id: string;
  preferred_authors: string[];
  name: string;
  email: string;
  password: string;
}
```

**Features:**
- User creation with hashed passwords
- Preferred authors storage for personalization
- Duplicate email validation

### 2. Story Generation
**POST** `/api/story/generate`

```typescript
interface StoryGenerateRequest {
  user_id: string;
  genre: string;
  custom_prompt?: string;
}
```

**Features:**
- Creates new story and first chapter
- Supports custom prompts
- Returns story ID and initial choices

### 3. Story Continuation
**POST** `/api/story/continue`

```typescript
interface StoryContinueRequest {
  user_id: string;
  story_id: string;
  choice: number; // 0 or 1
}
```

**Features:**
- Continues existing stories based on user choices
- Creates new chapters with branching narratives
- Maintains story continuity

### 4. Get All Stories
**POST** `/api/story`

```typescript
interface GetStoriesRequest {
  user_id: string;
}
```

**Features:**
- Returns all stories for a user
- Includes chapter numbers for each story
- Ordered by creation date

### 5. Get Story Details
**POST** `/api/story/{story_id}`

```typescript
interface GetStoryRequest {
  user_id: string;
  chapter_num: number;
}
```

**Features:**
- Returns specific chapter content
- User access validation
- Chapter existence validation

### 6. Get Suggestions
**POST** `/api/suggestions`

```typescript
interface SuggestionsRequest {
  genre: string;
}
```

**Features:**
- Returns 5 hardcoded prompts per genre
- Supports 10 different genres
- No authentication required

## Database Schema Updates

### User Model Enhancement
Added `preferredAuthors` field to the User model:

```prisma
model User {
  // ... existing fields
  preferredAuthors String[]  @default([])
  // ... rest of model
}
```

## Frontend Integration

### API Service Layer (`src/lib/storyApi.ts`)

Provides wrapper functions with error handling:
- `storyApiService.register()`
- `storyApiService.generateStory()`
- `storyApiService.continueStory()`
- `storyApiService.getUserStories()`
- `storyApiService.getStoryDetails()`
- `storyApiService.getPromptSuggestions()`

### Updated Signup Form

Enhanced signup page with:
- Preferred authors selection (15 popular authors)
- Checkbox interface for author preferences
- Updated API call to include preferences

### Example Component (`src/components/StoryGenerator.tsx`)

Demonstrates complete API integration:
- Genre selection
- Prompt suggestions loading
- Story generation
- Story continuation with choices
- Error handling and loading states

## Usage Examples

### Registering a User with Preferences

```typescript
const response = await storyApiService.register({
  user_id: 'unique-user-id',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securepassword',
  preferred_authors: ['J.K. Rowling', 'Stephen King']
});
```

### Generating a Story

```typescript
const response = await storyApiService.generateStory({
  user_id: 'user-id',
  genre: 'fantasy',
  custom_prompt: 'A magical adventure in an enchanted forest'
});
```

### Continuing a Story

```typescript
const response = await storyApiService.continueStory({
  user_id: 'user-id',
  story_id: 'story-id',
  choice: 0 // First choice
});
```

## Error Handling

All API functions return a standardized response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## Security Features

- Password hashing with bcrypt
- User ownership validation for stories
- Input validation on all endpoints
- SQL injection protection via Prisma ORM

## Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database connection
- `NEXT_PUBLIC_API_URL` - API base URL (optional, defaults to localhost)

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables
3. Run database migration: `npx prisma db push`
4. Start development server: `npm run dev`

The API integration is now ready for use with the Weave story generation platform! 