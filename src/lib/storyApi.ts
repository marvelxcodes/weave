import api from './api';
import {
  RegisterRequest,
  RegisterResponse,
  StoryGenerateRequest,
  StoryGenerateResponse,
  StoryContinueRequest,
  StoryContinueResponse,
  GetStoriesResponse,
  StoryDetailResponse,
  SuggestionResponse,
  GenreResponse,
  AuthorResponse,
  ApiResponse
} from '@/types/api';

// User registration with preferences
export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/auth/register', data);
  return response.data;
};

// Generate a new story
export const generateStory = async (data: StoryGenerateRequest): Promise<StoryGenerateResponse> => {
  const response = await api.post<StoryGenerateResponse>('/story/generate', data);
  return response.data;
};

// Continue an existing story
export const continueStory = async (data: StoryContinueRequest): Promise<StoryContinueResponse> => {
  console.log('storyApi continueStory called with:', data);
  console.log('storyApi continueStory data validation:', {
    hasUserId: !!data.user_id,
    hasStoryId: !!data.story_id,
    storyIdType: typeof data.story_id,
    storyIdValue: data.story_id,
    hasChoice: !!data.choice,
    choiceValue: data.choice
  });
  
  if (!data.story_id) {
    console.error('storyApi continueStory: story_id is missing or null/undefined');
    throw new Error('Story ID is required');
  }
  
  const response = await api.post<StoryContinueResponse>('/story/continue', data);
  console.log('storyApi continueStory response:', response.data);
  return response.data;
};

// Get all stories for a user - now uses local API
export const getUserStories = async (userId: string): Promise<GetStoriesResponse> => {
  const response = await api.get<GetStoriesResponse>(`/story?user_id=${userId}`);
  return response.data;
};

// Get specific story details - now uses local API
export const getStoryDetails = async (
  storyId: number, 
  userId: string,
  chapterNum?: number
): Promise<StoryDetailResponse> => {
  const params = new URLSearchParams({ user_id: userId });
  if (chapterNum) {
    params.append('chapter_num', chapterNum.toString());
  }
  const response = await api.get<StoryDetailResponse>(`/story/${storyId}?${params}`);
  return response.data;
};

// Get prompt suggestions - now uses local API
export const getPromptSuggestions = async (genre?: string): Promise<SuggestionResponse[]> => {
  const params = genre ? `?genre=${genre}` : '';
  const response = await api.get<{ suggestions: any; source: string }>(`/suggestions${params}`);
  
  // Handle both old and new response formats
  if (Array.isArray(response.data.suggestions)) {
    // If it's an array of SuggestionResponse objects
    if (response.data.suggestions.length > 0 && typeof response.data.suggestions[0] === 'object' && 'genre' in response.data.suggestions[0]) {
      return response.data.suggestions;
    }
    // If it's an array of strings (local fallback)
    return genre ? [{ genre, prompts: response.data.suggestions }] : [];
  }
  
  return [];
};

// Get all genres - now uses local API
export const getGenres = async (): Promise<GenreResponse[]> => {
  const response = await api.get<{ genres: GenreResponse[]; source: string }>('/genres');
  return response.data.genres;
};

// Get all authors - now uses local API
export const getAuthors = async (genreId?: number): Promise<AuthorResponse[]> => {
  const params = genreId ? `?genre_id=${genreId}` : '';
  const response = await api.get<{ authors: AuthorResponse[]; source: string }>(`/authors${params}`);
  return response.data.authors;
};

// Wrapper functions with error handling
export const storyApiService = {
  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    try {
      const result = await registerUser(data);
      return { success: true, data: result };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } }; message?: string };
      return {
        success: false,
        error: axiosError.response?.data?.error || axiosError.message || 'Registration failed'
      };
    }
  },

  async generateStory(data: StoryGenerateRequest): Promise<ApiResponse<StoryGenerateResponse>> {
    try {
      const result = await generateStory(data);
      return { success: true, data: result };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } }; message?: string };
      return {
        success: false,
        error: axiosError.response?.data?.error || axiosError.message || 'Story generation failed'
      };
    }
  },

  async continueStory(data: StoryContinueRequest): Promise<ApiResponse<StoryContinueResponse>> {
    try {
      const result = await continueStory(data);
      return { success: true, data: result };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } }; message?: string };
      return {
        success: false,
        error: axiosError.response?.data?.error || axiosError.message || 'Story continuation failed'
      };
    }
  },

  async getUserStories(userId: string): Promise<ApiResponse<GetStoriesResponse>> {
    try {
      const result = await getUserStories(userId);
      return { success: true, data: result };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } }; message?: string };
      return {
        success: false,
        error: axiosError.response?.data?.error || axiosError.message || 'Failed to fetch stories'
      };
    }
  },

  async getStoryDetails(
    storyId: number, 
    userId: string,
    chapterNum?: number
  ): Promise<ApiResponse<StoryDetailResponse>> {
    try {
      const result = await getStoryDetails(storyId, userId, chapterNum);
      return { success: true, data: result };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } }; message?: string };
      return {
        success: false,
        error: axiosError.response?.data?.error || axiosError.message || 'Failed to fetch story details'
      };
    }
  },

  async getPromptSuggestions(genre?: string): Promise<ApiResponse<SuggestionResponse[]>> {
    try {
      const result = await getPromptSuggestions(genre);
      return { success: true, data: result };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } }; message?: string };
      return {
        success: false,
        error: axiosError.response?.data?.error || axiosError.message || 'Failed to fetch suggestions'
      };
    }
  },

  async getGenres(): Promise<ApiResponse<GenreResponse[]>> {
    try {
      const result = await getGenres();
      return { success: true, data: result };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } }; message?: string };
      return {
        success: false,
        error: axiosError.response?.data?.error || axiosError.message || 'Failed to fetch genres'
      };
    }
  },

  async getAuthors(genreId?: number): Promise<ApiResponse<AuthorResponse[]>> {
    try {
      const result = await getAuthors(genreId);
      return { success: true, data: result };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } }; message?: string };
      return {
        success: false,
        error: axiosError.response?.data?.error || axiosError.message || 'Failed to fetch authors'
      };
    }
  }
}; 