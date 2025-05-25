'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { storyApiService } from '@/lib/storyApi';
import { Genre } from '@/types/api';

export default function StoryGenerator() {
  const { data: session } = useSession();
  const [genre, setGenre] = useState<Genre>('fantasy');
  const [customPrompt, setCustomPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<any>(null);
  const [error, setError] = useState('');

  const genres: Genre[] = [
    'fantasy', 'sci-fi', 'mystery', 'romance', 'horror',
    'adventure', 'thriller', 'historical', 'comedy', 'drama'
  ];

  const loadSuggestions = async (selectedGenre: Genre) => {
    setIsLoadingSuggestions(true);
    try {
      const response = await storyApiService.getPromptSuggestions(selectedGenre);
      if (response.success && response.data) {
        // Backend returns array of SuggestionResponse objects
        const genreSuggestions = response.data.find(s => s.genre === selectedGenre);
        if (genreSuggestions) {
          setSuggestions(genreSuggestions.prompts);
        }
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleGenreChange = (newGenre: Genre) => {
    setGenre(newGenre);
    loadSuggestions(newGenre);
  };

  const generateStory = async () => {
    if (!session?.user) {
      setError('Please sign in to generate stories');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await storyApiService.generateStory({
        user_id: '', // Not needed since we use session in the API route
        genre,
        custom_prompt: customPrompt || undefined,
      });

      if (response.success && response.data) {
        setGeneratedStory(response.data);
      } else {
        setError(response.error || 'Failed to generate story');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const continueStory = async (choice: string, choiceIndex: number) => {
    if (!generatedStory || !session?.user) {
      console.error('StoryGenerator continueStory: Missing requirements', {
        hasGeneratedStory: !!generatedStory,
        hasSession: !!session?.user,
        storyId: generatedStory?.story_id
      });
      return;
    }

    console.log('StoryGenerator continueStory called:', {
      choice,
      choiceIndex,
      storyId: generatedStory.story_id,
      storyIdType: typeof generatedStory.story_id
    });

    setIsLoading(true);
    setError('');

    try {
      // Map choice index to A/B format
      const choiceLabel = choiceIndex === 0 ? "A" : "B";
      
      console.log('StoryGenerator about to call storyApiService.continueStory with:', {
        user_id: '',
        story_id: generatedStory.story_id,
        choice: choiceLabel
      });
      
      const response = await storyApiService.continueStory({
        user_id: '', // Not needed since we use session in the API route
        story_id: generatedStory.story_id,
        choice: choiceLabel, // Send "A" or "B" instead of full text
      });

      if (response.success && response.data) {
        // Update the story with the new chapter
        const newChapter = {
          chapter_num: response.data.chapter_num,
          content: response.data.content,
          choices: response.data.choices
        };
        
        setGeneratedStory({
          ...generatedStory,
          chapters: [...generatedStory.chapters, newChapter],
          current_chapter: response.data.chapter_num
        });
      } else {
        setError(response.error || 'Failed to continue story');
      }
    } catch (error) {
      console.error('StoryGenerator continueStory error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Show sign-in prompt if not authenticated
  if (!session?.user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-surface neon-border rounded-xl p-8 text-center"
        >
          <BookOpen className="text-cyan-400 mx-auto mb-4 neon-glow" size={48} />
          <h2 className="text-2xl font-bold neon-text mb-4">Neural Interface Required</h2>
          <p className="text-cyan-300 cyber-text mb-6">
            Connect to the matrix to access the story generation system.
          </p>
          <a
            href="/auth/signin"
            className="inline-block py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600
                     text-white rounded-lg border-2 border-cyan-500
                     hover:shadow-[0_0_20px_rgba(0,255,255,0.4),0_0_40px_rgba(255,255,255,0.1)]
                     transition-all duration-300 cyber-text font-semibold
                     hover:from-cyan-500 hover:to-blue-500"
          >
            CONNECT TO MATRIX
          </a>
        </motion.div>
      </div>
    );
  }

  // Get the current chapter to display
  const currentChapter = generatedStory?.chapters?.[generatedStory.chapters.length - 1];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-surface neon-border rounded-xl p-6"
      >
        <div className="flex items-center mb-6">
          <BookOpen className="text-cyan-400 mr-3 neon-glow" size={28} />
          <h2 className="text-2xl font-bold neon-text">Story Generator</h2>
          <div className="ml-auto text-cyan-300 cyber-text">
            Connected: {session.user.name}
          </div>
        </div>

        {/* Genre Selection */}
        <div className="mb-6">
          <label className="block text-cyan-300 cyber-text mb-3 font-medium">
            Select Genre
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => handleGenreChange(g)}
                className={`p-3 rounded-lg border-2 transition-all duration-300 cyber-text ${
                  genre === g
                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-100'
                    : 'border-cyan-500/40 glass-surface text-cyan-300 hover:border-cyan-400/60'
                }`}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Prompt */}
        <div className="mb-6">
          <label className="block text-cyan-300 cyber-text mb-3 font-medium">
            Custom Prompt (Optional)
          </label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full p-4 rounded-lg border-2 border-cyan-500/40
                     glass-surface text-cyan-100 placeholder-cyan-300/50
                     focus:border-cyan-400 focus:outline-none transition-all duration-300
                     cyber-text focus:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
            placeholder="Describe your story idea..."
            rows={3}
          />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-6">
            <label className="block text-cyan-300 cyber-text mb-3 font-medium">
              Prompt Suggestions for {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </label>
            <div className="space-y-2">
              {isLoadingSuggestions ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="animate-spin text-cyan-400" size={20} />
                  <span className="ml-2 text-cyan-300 cyber-text">Loading suggestions...</span>
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setCustomPrompt(suggestion)}
                    className="w-full text-left p-3 rounded-lg border border-cyan-500/30
                             glass-surface text-cyan-200 hover:border-cyan-400/60
                             hover:bg-cyan-400/10 transition-all duration-300 cyber-text text-sm"
                  >
                    {suggestion}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generateStory}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600
                   text-white rounded-lg border-2 border-cyan-500
                   hover:shadow-[0_0_20px_rgba(0,255,255,0.4),0_0_40px_rgba(255,255,255,0.1)]
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-300 cyber-text font-semibold
                   hover:from-cyan-500 hover:to-blue-500 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Generating Story...
            </>
          ) : (
            <>
              <Sparkles className="mr-2" size={20} />
              Generate Story
            </>
          )}
        </button>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-red-400 text-sm cyber-text text-center p-3 
                      glass-surface border border-red-500/50 rounded-lg
                      shadow-[0_0_15px_rgba(255,0,0,0.2)]"
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Generated Story Display */}
      {generatedStory && currentChapter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-surface neon-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold neon-text">
              {generatedStory.title}
            </h3>
            <span className="text-cyan-400 cyber-text">
              Chapter {currentChapter.chapter_num}
            </span>
          </div>
          
          <div className="text-cyan-100 cyber-text mb-6 leading-relaxed">
            {currentChapter.content}
          </div>

          {/* Choices */}
          {currentChapter.choices && currentChapter.choices.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-cyan-300 cyber-text font-medium">Choose your path:</h4>
              {currentChapter.choices.map((choice: string, index: number) => (
                <button
                  key={index}
                  onClick={() => continueStory(choice, index)}
                  disabled={isLoading}
                  className="w-full text-left p-4 rounded-lg border-2 border-cyan-500/40
                           glass-surface text-cyan-200 hover:border-cyan-400
                           hover:bg-cyan-400/10 transition-all duration-300 cyber-text
                           disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <span className="bg-cyan-600/30 text-cyan-300 px-2 py-1 rounded text-xs mr-3 font-mono">
                    {index === 0 ? 'A' : 'B'}
                  </span>
                  <span>{choice}</span>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
} 