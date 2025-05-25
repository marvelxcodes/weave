import axios from 'axios';

const externalApi = axios.create({
  baseURL: process.env.EXTERNAL_API_URL || 'http://ec2-54-252-168-199.ap-southeast-2.compute.amazonaws.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for external API
export interface ExternalUserRegistration {
  user_id: string;
  email: string;
  name: string;
  profile_pic_url: string;
  preferred_authors: number[];
}

export interface ExternalStoryGeneration {
  user_id: string;
  genre: string;
  custom_prompt?: string;
}

export interface ExternalStoryContinuation {
  user_id: string;
  story_id: number;
  choice: string;
}

// External API service functions
export const externalApiService = {
  // Register user preferences with external API
  async registerUserPreferences(data: ExternalUserRegistration): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await externalApi.post('/register', {
        data
      });
      return { success: true };
    } catch (error: any) {
      console.error('External API registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to sync user preferences' 
      };
    }
  },

  // Generate story using external API
  async generateStory(data: ExternalStoryGeneration) {
    try {
      const response = await externalApi.post('/story/generate', data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('External API story generation error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to generate story' 
      };
    }
  },

  // Continue story using external API
  async continueStory(data: ExternalStoryContinuation) {
    try {
      const response = await externalApi.post('/story/continue', data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('External API story continuation error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to continue story' 
      };
    }
  },

  // Get suggestions from external API
  async getSuggestions(genre?: string) {
    try {
      const params = genre ? `?genre=${genre}` : '';
      const response = await externalApi.get(`/suggestions${params}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('External API suggestions error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to get suggestions' 
      };
    }
  },

  // Get genres from external API
  async getGenres() {
    try {
      const response = await externalApi.get('/genres');
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('External API genres error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to get genres' 
      };
    }
  },

  // Get authors from external API
  async getAuthors(genreId?: number) {
    try {
      const params = genreId ? `?genre_id=${genreId}` : '';
      const response = await externalApi.get(`/authors${params}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('External API authors error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to get authors' 
      };
    }
  }
}; 