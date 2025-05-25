import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { StoryState, StorySegment, StoryChoice, GenerateStoryRequest, convertExternalToSegment } from '@/types/story';
import { storyApiService } from '@/lib/storyApi';

const initialState: StoryState = {
  currentSegment: null,
  history: [],
  isGenerating: false,
  error: null,
};

export const useStory = () => {
  const { data: session } = useSession();
  const [state, setState] = useState<StoryState>(initialState);
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);

  // Debug logging for story ID changes
  useEffect(() => {
    console.log('useStory: currentStoryId changed to:', currentStoryId);
  }, [currentStoryId]);

  const generateStory = useCallback(async (request: GenerateStoryRequest) => {
    console.log('useStory: generateStory called with:', request);
    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      // Use the external API through storyApiService
      const response = await storyApiService.generateStory({
        user_id: '', // Will be handled by the API route using session
        genre: 'sci-fi', // Default genre, can be made configurable
        custom_prompt: request.prompt
      });

      if (response.success && response.data) {
        // Convert the first chapter to a story segment
        const firstChapter = response.data.chapters[0];
        if (firstChapter) {
          console.log('Generated story response (generateStory):', response.data);
          console.log('Setting currentStoryId to:', response.data.story_id);
          
          const newSegment = convertExternalToSegment(firstChapter, response.data.story_id);
          
          // Store the story ID for future continuations
          setCurrentStoryId(response.data.story_id);
          
          setState(prev => ({
            ...prev,
            currentSegment: newSegment,
            history: [],
            isGenerating: false,
          }));
        }
      } else {
        throw new Error(response.error || 'Failed to generate story');
      }

    } catch (error) {
      console.error('Story generation error:', error);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: 'Failed to generate story. Please try again.',
      }));
    }
  }, []);

  const makeChoice = useCallback(async (choice: StoryChoice) => {
    console.log('useStory: makeChoice called with:', { choice, currentStoryId, hasCurrentSegment: !!state.currentSegment });
    
    if (!state.currentSegment || !currentStoryId) {
      console.error('makeChoice called but missing requirements:', {
        hasCurrentSegment: !!state.currentSegment,
        currentStoryId,
        choice
      });
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      // Find the choice index to determine if it's "A" or "B"
      const choiceIndex = state.currentSegment.choices.findIndex(c => c.id === choice.id);
      const choiceLabel = choiceIndex === 0 ? "A" : "B"; // Map to A/B format
      
      console.log('useStory makeChoice:', { 
        currentStoryId, 
        choiceIndex, 
        choiceLabel, 
        choice
      });
      
      // Use the external API through storyApiService
      const response = await storyApiService.continueStory({
        user_id: '', // Will be handled by the API route using session
        story_id: currentStoryId,
        choice: choiceLabel // Send "A" or "B" instead of full text
      });

      if (response.success && response.data) {
        const newSegment = convertExternalToSegment(response.data, currentStoryId);

        setState(prev => ({
          ...prev,
          currentSegment: newSegment,
          history: prev.currentSegment ? [...prev.history, prev.currentSegment] : prev.history,
          isGenerating: false,
        }));
      } else {
        throw new Error(response.error || 'Failed to continue story');
      }
    } catch (error) {
      console.error('Chapter generation error:', error);
      const axiosError = error as AxiosError<{ error: string }>;
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: axiosError.response?.data?.error || 'Failed to generate chapter. Please try again.',
      }));
    }
  }, [state.currentSegment, currentStoryId]);

  const startNewStory = useCallback(async (initialPrompt: string, genre?: string) => {
    console.log('useStory: startNewStory called with:', { initialPrompt, genre });
    
    if (!session?.user || !('id' in session.user)) {
      setState(prev => ({
        ...prev,
        error: 'Please sign in to create stories'
      }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      // Use the external API through storyApiService
      const response = await storyApiService.generateStory({
        user_id: '', // Will be handled by the API route using session
        genre: genre || 'fantasy',
        custom_prompt: initialPrompt
      });

      if (response.success && response.data) {
        // Convert the first chapter to a story segment
        const firstChapter = response.data.chapters[0];
        if (firstChapter) {
          console.log('Generated story response (startNewStory):', response.data);
          console.log('Setting currentStoryId to:', response.data.story_id);
          
          const newSegment = convertExternalToSegment(firstChapter, response.data.story_id);
          
          // Store the story ID for future continuations
          setCurrentStoryId(response.data.story_id);
          
          setState(prev => ({
            ...prev,
            currentSegment: newSegment,
            history: [],
            isGenerating: false,
          }));
        }
      } else {
        throw new Error(response.error || 'Failed to generate story');
      }
    } catch (error) {
      console.error('Story creation error:', error);
      const axiosError = error as AxiosError<{ error: string }>;
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: axiosError.response?.data?.error || 'Failed to create story. Please try again.',
      }));
    }
  }, [session]);

  const goBack = useCallback(() => {
    if (state.history.length > 0) {
      const previousSegment = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);
      
      setState(prev => ({
        ...prev,
        currentSegment: previousSegment,
        history: newHistory,
      }));
    }
  }, [state.history]);

  return {
    ...state,
    generateStory,
    makeChoice,
    startNewStory,
    goBack,
    canGoBack: state.history.length > 0,
  };
};