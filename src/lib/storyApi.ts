import api from './api';
import {
  RegisterRequest,
  RegisterResponse,
  StoryGenerateRequest,
  StoryGenerateResponse,
  StoryContinueRequest,
  StoryContinueResponse,
  GetStoriesRequest,
  GetStoriesResponse,
  GetStoryRequest,
  GetStoryResponse,
  SuggestionsRequest,
  SuggestionsResponse,
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
  const response = await api.post<StoryContinueResponse>('/story/continue', data);
  return response.data;
};

// Get all stories for a user
export const getUserStories = async (data: GetStoriesRequest): Promise<GetStoriesResponse> => {
  const response = await api.post<GetStoriesResponse>('/story', data);
  return response.data;
};

// Get specific story details
export const getStoryDetails = async (
  storyId: string, 
  data: GetStoryRequest
): Promise<GetStoryResponse> => {
  const response = await api.post<GetStoryResponse>(`/story/${storyId}`, data);
  return response.data;
};

// Get prompt suggestions for a genre
export const getPromptSuggestions = async (data: SuggestionsRequest): Promise<SuggestionsResponse> => {
  const response = await api.post<SuggestionsResponse>('/suggestions', data);
  return response.data;
};

// Wrapper functions with error handling
export const storyApiService = {
  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    try {
      const result = await registerUser(data);
      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Registration failed'
      };
    }
  },

  async generateStory(data: StoryGenerateRequest): Promise<ApiResponse<StoryGenerateResponse>> {
    try {
      const result = await generateStory(data);
      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Story generation failed'
      };
    }
  },

  async continueStory(data: StoryContinueRequest): Promise<ApiResponse<StoryContinueResponse>> {
    try {
      const result = await continueStory(data);
      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Story continuation failed'
      };
    }
  },

  async getUserStories(data: GetStoriesRequest): Promise<ApiResponse<GetStoriesResponse>> {
    try {
      const result = await getUserStories(data);
      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch stories'
      };
    }
  },

  async getStoryDetails(
    storyId: string, 
    data: GetStoryRequest
  ): Promise<ApiResponse<GetStoryResponse>> {
    try {
      const result = await getStoryDetails(storyId, data);
      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch story details'
      };
    }
  },

  async getPromptSuggestions(data: SuggestionsRequest): Promise<ApiResponse<SuggestionsResponse>> {
    try {
      const result = await getPromptSuggestions(data);
      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch suggestions'
      };
    }
  }
}; 