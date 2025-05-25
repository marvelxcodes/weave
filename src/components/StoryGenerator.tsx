'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { storyApiService } from '@/lib/storyApi';
import { Genre, POPULAR_AUTHORS } from '@/types/api';

interface StoryGeneratorProps {
  userId: string;
}

export default function StoryGenerator({ userId }: StoryGeneratorProps) {
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
      const response = await storyApiService.getPromptSuggestions({ genre: selectedGenre });
      if (response.success && response.data) {
        setSuggestions(response.data.suggestions);
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
    if (!userId) {
      setError('User ID is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await storyApiService.generateStory({
        user_id: userId,
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

  const continueStory = async (choice: number) => {
    if (!generatedStory || !userId) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await storyApiService.continueStory({
        user_id: userId,
        story_id: generatedStory.story_id,
        choice,
      });

      if (response.success && response.data) {
        setGeneratedStory(response.data);
      } else {
        setError(response.error || 'Failed to continue story');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

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
                   hover:shadow-[0_0_30px_rgba(0,255,255,0.5)]
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
                      shadow-[0_0_20px_rgba(255,0,0,0.3)]"
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Generated Story Display */}
      {generatedStory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-surface neon-border rounded-xl p-6"
        >
          <h3 className="text-xl font-bold neon-text mb-4">
            Chapter {generatedStory.chapter_x}
          </h3>
          
          <div className="text-cyan-100 cyber-text mb-6 leading-relaxed">
            {generatedStory.content}
          </div>

          {/* Choices */}
          {(generatedStory.choices_in_title_for_story || generatedStory.choices_in_title) && (
            <div className="space-y-3">
              <h4 className="text-cyan-300 cyber-text font-medium">Choose your path:</h4>
              {(generatedStory.choices_in_title_for_story || generatedStory.choices_in_title).map((choice: string, index: number) => (
                <button
                  key={index}
                  onClick={() => continueStory(index)}
                  disabled={isLoading}
                  className="w-full text-left p-4 rounded-lg border-2 border-cyan-500/40
                           glass-surface text-cyan-200 hover:border-cyan-400
                           hover:bg-cyan-400/10 transition-all duration-300 cyber-text
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {choice}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
} 