'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { storyApiService } from '@/lib/storyApi';

export const ChoiceTest: React.FC = () => {
  const { data: session } = useSession();
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testChoiceA = async () => {
    if (!session?.user) {
      setTestResult('Please sign in to test');
      return;
    }

    setIsLoading(true);
    setTestResult('Testing choice A...');

    try {
      // First generate a story
      const storyResponse = await storyApiService.generateStory({
        user_id: '',
        genre: 'sci-fi',
        custom_prompt: 'A test story for choice validation'
      });

      if (storyResponse.success && storyResponse.data) {
        // Then continue with choice A
        const continueResponse = await storyApiService.continueStory({
          user_id: '',
          story_id: storyResponse.data.story_id,
          choice: 'A'
        });

        if (continueResponse.success && continueResponse.data) {
          setTestResult(`✅ Choice A test successful!\nNew chapter: ${continueResponse.data.content.substring(0, 100)}...`);
        } else {
          setTestResult(`❌ Choice A test failed: ${continueResponse.error}`);
        }
      } else {
        setTestResult(`❌ Story generation failed: ${storyResponse.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Test error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testChoiceB = async () => {
    if (!session?.user) {
      setTestResult('Please sign in to test');
      return;
    }

    setIsLoading(true);
    setTestResult('Testing choice B...');

    try {
      // First generate a story
      const storyResponse = await storyApiService.generateStory({
        user_id: '',
        genre: 'fantasy',
        custom_prompt: 'A test story for choice validation'
      });

      if (storyResponse.success && storyResponse.data) {
        // Then continue with choice B
        const continueResponse = await storyApiService.continueStory({
          user_id: '',
          story_id: storyResponse.data.story_id,
          choice: 'B'
        });

        if (continueResponse.success && continueResponse.data) {
          setTestResult(`✅ Choice B test successful!\nNew chapter: ${continueResponse.data.content.substring(0, 100)}...`);
        } else {
          setTestResult(`❌ Choice B test failed: ${continueResponse.error}`);
        }
      } else {
        setTestResult(`❌ Story generation failed: ${storyResponse.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Test error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-surface neon-border rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold neon-text mb-6 text-center">
          A/B Choice Test
        </h2>
        
        <div className="space-y-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={testChoiceA}
            disabled={isLoading}
            className="w-full p-4 bg-gradient-to-r from-cyan-600 to-blue-600
                     text-white rounded-lg border-2 border-cyan-500
                     hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300 cyber-text font-semibold
                     flex items-center justify-center"
          >
            <span className="bg-cyan-800 px-3 py-1 rounded mr-3 font-mono">A</span>
            Test Choice A (Sci-Fi)
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={testChoiceB}
            disabled={isLoading}
            className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600
                     text-white rounded-lg border-2 border-purple-500
                     hover:shadow-[0_0_20px_rgba(128,0,255,0.4)]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300 cyber-text font-semibold
                     flex items-center justify-center"
          >
            <span className="bg-purple-800 px-3 py-1 rounded mr-3 font-mono">B</span>
            Test Choice B (Fantasy)
          </motion.button>
        </div>

        {testResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800/50 border border-cyan-600/30 rounded-lg p-4"
          >
            <h3 className="text-cyan-300 font-semibold mb-2">Test Result:</h3>
            <pre className="text-cyan-100 text-sm whitespace-pre-wrap cyber-text">
              {testResult}
            </pre>
          </motion.div>
        )}

        {!session?.user && (
          <div className="text-center text-yellow-400 cyber-text">
            Please sign in to test the A/B choice functionality
          </div>
        )}
      </motion.div>
    </div>
  );
}; 