// User registration types
export interface RegisterRequest {
  user_id: string;
  preferred_authors: string[];
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    preferred_authors: string[];
  };
}

// Story generation types
export interface StoryGenerateRequest {
  user_id: string;
  genre: string;
  custom_prompt?: string;
}

export interface StoryGenerateResponse {
  story_id: string;
  chapter_x: number;
  choices_in_title_for_story: string[];
  content: string;
}

// Story continuation types
export interface StoryContinueRequest {
  user_id: string;
  story_id: string;
  choice: number; // 0 or 1 based on the schema
}

export interface StoryContinueResponse {
  story_id: string;
  chapter_x: number;
  choices_in_title: string[];
  content: string;
}

// Get all stories types
export interface GetStoriesRequest {
  user_id: string;
}

export interface StoryListItem {
  story_id: string;
  title: string;
  chapter_numbers: number[];
}

export interface GetStoriesResponse {
  stories: StoryListItem[];
}

// Get specific story types
export interface GetStoryRequest {
  user_id: string;
  chapter_num: number;
}

export interface GetStoryResponse {
  current_chapter_number: number;
  story_itself: string;
}

// Suggestions types
export interface SuggestionsRequest {
  genre: string;
}

export interface SuggestionsResponse {
  suggestions: string[]; // Five hardcoded prompt suggestions
}

// Common API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Genre options
export type Genre = 
  | 'fantasy'
  | 'sci-fi'
  | 'mystery'
  | 'romance'
  | 'horror'
  | 'adventure'
  | 'thriller'
  | 'historical'
  | 'comedy'
  | 'drama';

// Popular authors for preferences
export const POPULAR_AUTHORS = [
  'J.K. Rowling',
  'Stephen King',
  'George R.R. Martin',
  'Agatha Christie',
  'Isaac Asimov',
  'J.R.R. Tolkien',
  'Neil Gaiman',
  'Margaret Atwood',
  'Ray Bradbury',
  'Terry Pratchett',
  'Brandon Sanderson',
  'Ursula K. Le Guin',
  'Douglas Adams',
  'Frank Herbert',
  'Gillian Flynn'
] as const;

export type PreferredAuthor = typeof POPULAR_AUTHORS[number]; 