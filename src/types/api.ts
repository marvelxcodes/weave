// User registration types
export interface RegisterRequest {
  user_id: string;
  email: string;
  name: string;
  password: string;
  profile_pic_url?: string;
  preferred_authors: number[]; // Changed to number[] to match backend
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

// Story generation types
export interface StoryGenerateRequest {
  user_id: string;
  genre: string;
  custom_prompt?: string;
}

export interface ChapterResponse {
  chapter_num: number;
  content: string;
  choices: string[];
}

export interface StoryGenerateResponse {
  story_id: number; // Changed to number
  title: string;
  genre: string;
  chapters: ChapterResponse[];
  current_chapter: number;
}

// Story continuation types
export interface StoryContinueRequest {
  user_id: string;
  story_id: number; // Changed to number
  choice: string; // "A" or "B" or full choice text
}

export interface StoryContinueResponse {
  chapter_num: number;
  content: string;
  choices: string[];
}

// Get all stories types - now uses GET with query params
export interface UserStoryResponse {
  story_id: number;
  title: string;
  genre: string;
  current_chapter: number;
  created_at: string; // ISO date string
}

export interface GetStoriesResponse {
  stories: UserStoryResponse[];
}

// Get specific story types - now uses GET with query params
export interface StoryDetailResponse {
  story_id: number;
  title: string;
  genre: string;
  created_at: string;
  current_chapter: number;
  story_content: string; // Full story as formatted text
}

// Suggestions types - now uses GET with query params
export interface SuggestionResponse {
  genre: string;
  prompts: string[];
}

// Genre and Author types for additional endpoints
export interface GenreResponse {
  genre_id: number;
  genre_name: string;
}

export interface AuthorResponse {
  author_id: number;
  author_name: string;
  genre_id?: number;
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

// Popular authors for preferences - updated to match backend database
export const POPULAR_AUTHORS = [
  { id: 1, name: 'J.R.R. Tolkien' },
  { id: 2, name: 'George R.R. Martin' },
  { id: 3, name: 'Ursula K. Le Guin' },
  { id: 4, name: 'Brandon Sanderson' },
  { id: 5, name: 'Robin Hobb' },
  { id: 6, name: 'Isaac Asimov' },
  { id: 7, name: 'Philip K. Dick' },
  { id: 8, name: 'Arthur C. Clarke' },
  { id: 10, name: 'Ray Bradbury' },
  { id: 11, name: 'Agatha Christie' },
  { id: 12, name: 'Arthur Conan Doyle' },
  { id: 13, name: 'Dorothy L. Sayers' },
  { id: 14, name: 'Raymond Chandler' },
  { id: 16, name: 'Stephen King' },
  { id: 17, name: 'H.P. Lovecraft' },
  { id: 18, name: 'Clive Barker' },
  { id: 19, name: 'Shirley Jackson' },
  { id: 20, name: 'Edgar Allan Poe' },
  { id: 21, name: 'Jane Austen' },
  { id: 22, name: 'Nicholas Sparks' },
  { id: 23, name: 'Nora Roberts' },
  { id: 24, name: 'Emily Brontë' },
  { id: 26, name: 'Jules Verne' },
  { id: 27, name: 'Robert Louis Stevenson' },
  { id: 28, name: 'Ernest Hemingway' }
] as const;

export type PreferredAuthor = typeof POPULAR_AUTHORS[number]; 