import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { StoryState, StorySegment, StoryChoice, GenerateStoryRequest } from '@/types/story';

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

  const generateStory = useCallback(async (request: GenerateStoryRequest) => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Use request parameter for actual API call
      console.log('Story request:', request);
      
      // Mock story generation
      const mockStories = [
        {
          story: "You find yourself standing at the edge of an ancient forest. The trees whisper secrets of old, their gnarled branches reaching toward a sky painted with the colors of twilight. A mysterious path winds deeper into the woods, while another leads to a distant castle perched on a hill.",
          choices: [
            { id: "forest", text: "Venture into the mysterious forest" },
            { id: "castle", text: "Head toward the distant castle" }
          ]
        },
        {
          story: "The cobblestone path beneath your feet tells tales of countless travelers who have walked this way before. As you approach the imposing castle gates, you notice they stand slightly ajar. A warm light flickers from within, but you also hear the distant sound of approaching hoofbeats.",
          choices: [
            { id: "enter", text: "Enter the castle through the open gates" },
            { id: "hide", text: "Hide and observe the approaching riders" }
          ]
        },
        {
          story: "Deep within the forest, ancient magic stirs. Luminescent mushrooms light your way as you discover a clearing where a crystal-clear spring bubbles up from the earth. An old hermit sits beside it, his eyes twinkling with wisdom. He gestures for you to approach.",
          choices: [
            { id: "approach", text: "Approach the wise hermit" },
            { id: "drink", text: "Drink from the magical spring first" }
          ]
        }
      ];

      const randomStory = mockStories[Math.floor(Math.random() * mockStories.length)];
      
      const newSegment: StorySegment = {
        id: Date.now().toString(),
        text: randomStory.story,
        choices: randomStory.choices,
        isGenerated: true,
        timestamp: Date.now(),
      };

      setState(prev => ({
        ...prev,
        currentSegment: newSegment,
        history: prev.currentSegment ? [...prev.history, prev.currentSegment] : prev.history,
        isGenerating: false,
      }));

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
    if (!state.currentSegment || !currentStoryId) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const response = await fetch(`/api/stories/${currentStoryId}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ choice }),
      });

      const data = await response.json();

      if (response.ok) {
        const newSegment: StorySegment = {
          id: data.id,
          text: data.content,
          choices: data.choices || [],
          isGenerated: true,
          timestamp: Date.now(),
        };

        setState(prev => ({
          ...prev,
          currentSegment: newSegment,
          history: prev.currentSegment ? [...prev.history, prev.currentSegment] : prev.history,
          isGenerating: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isGenerating: false,
          error: data.error || 'Failed to generate chapter'
        }));
      }
    } catch (error) {
      console.error('Chapter generation error:', error);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: 'Failed to generate chapter. Please try again.',
      }));
    }
  }, [state.currentSegment, currentStoryId]);

  const startNewStory = useCallback(async (initialPrompt: string) => {
    if (!session?.user || !('id' in session.user)) {
      setState(prev => ({
        ...prev,
        error: 'Please sign in to create stories'
      }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Story: ${initialPrompt.substring(0, 50)}...`,
          description: initialPrompt,
          isPublic: false,
          initialPrompt
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStoryId(data.story.id);
        const newSegment: StorySegment = {
          id: data.chapter.id,
          text: data.chapter.content,
          choices: data.chapter.choices || [],
          isGenerated: true,
          timestamp: Date.now(),
        };

        setState(prev => ({
          ...prev,
          currentSegment: newSegment,
          history: [],
          isGenerating: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isGenerating: false,
          error: data.error || 'Failed to create story'
        }));
      }
    } catch (error) {
      console.error('Story creation error:', error);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: 'Failed to create story. Please try again.',
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