'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Scene3D } from './Scene3D';
import { StoryDisplay } from './StoryDisplay';
import { ChoiceSelector } from './ChoiceSelector';
import { ControlPanel } from './ControlPanel';
import { StoryPrompt } from './StoryPrompt';
import { useStory } from '@/hooks/useStory';
import { StoryChoice } from '@/types/story';

export const StoryGame: React.FC = () => {
  const { data: session } = useSession();
  const [showPrompt, setShowPrompt] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const {
    currentSegment,
    history,
    isGenerating,
    error,
    makeChoice,
    startNewStory,
    goBack,
    canGoBack
  } = useStory();

  const handleBookClick = () => {
    if (!session) {
      // Redirect to sign in if not authenticated
      window.location.href = '/auth/signin';
      return;
    }
    
    if (!currentSegment && !isGenerating) {
      setShowPrompt(true);
    }
    setBookOpen(!bookOpen);
  };

  const handleStartNewStory = () => {
    setShowPrompt(true);
    setBookOpen(true);
  };

  const handlePromptSubmit = async (prompt: string) => {
    setShowPrompt(false);
    setBookOpen(true);
    await startNewStory(prompt);
  };

  const handleChoiceSelect = async (choice: StoryChoice) => {
    await makeChoice(choice);
  };

  const handleGoBack = () => {
    goBack();
  };

  const handleShowHistory = () => {
    setShowHistory(!showHistory);
  };

  const showChoices = currentSegment && !isGenerating && currentSegment.choices.length > 0;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Navigation Header */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-4">
        <Link 
          href="/stories"
          className="px-4 py-2 bg-amber-900/80 backdrop-blur-sm border border-amber-600/50 
                   rounded-lg text-amber-200 hover:text-amber-100 hover:border-amber-500/60 
                   transition-all duration-300 antique-text"
        >
          Browse Stories
        </Link>
        
        {session ? (
          <div className="flex items-center space-x-3">
            <span className="text-amber-200 antique-text">
              Welcome, {session.user?.name}
            </span>
            <button
              onClick={() => window.location.href = '/api/auth/signout'}
              className="px-4 py-2 bg-red-900/80 backdrop-blur-sm border border-red-600/50 
                       rounded-lg text-red-200 hover:text-red-100 hover:border-red-500/60 
                       transition-all duration-300 antique-text"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link 
              href="/auth/signin"
              className="px-4 py-2 bg-amber-900/80 backdrop-blur-sm border border-amber-600/50 
                       rounded-lg text-amber-200 hover:text-amber-100 hover:border-amber-500/60 
                       transition-all duration-300 antique-text"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup"
              className="px-4 py-2 bg-emerald-900/80 backdrop-blur-sm border border-emerald-600/50 
                       rounded-lg text-emerald-200 hover:text-emerald-100 hover:border-emerald-500/60 
                       transition-all duration-300 antique-text"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* 3D Scene */}
      <Scene3D 
        bookOpen={bookOpen}
        onBookInteract={handleBookClick}
      />

      {/* UI Overlays */}
      <StoryDisplay 
        segment={currentSegment}
        isGenerating={isGenerating}
      />

      <ChoiceSelector
        choices={currentSegment?.choices || []}
        onChoiceSelect={handleChoiceSelect}
        isVisible={!!showChoices}
      />

      <ControlPanel
        onStartNewStory={handleStartNewStory}
        onGoBack={handleGoBack}
        onShowHistory={handleShowHistory}
        canGoBack={canGoBack}
        hasHistory={history.length > 0}
      />

      <StoryPrompt
        onSubmit={handlePromptSubmit}
        isVisible={showPrompt}
        isGenerating={isGenerating}
      />

      {/* Error Display */}
      {error && (
        <div className="absolute top-4 right-4 z-50">
          <div className="bg-red-900/80 backdrop-blur-sm border border-red-600/50 
                        rounded-lg p-4 max-w-sm">
            <p className="text-red-200 antique-text">{error}</p>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && history.length > 0 && (
        <div className="absolute inset-0 z-40 flex items-center justify-center 
                      bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-amber-900/90 to-amber-800/70 
                        backdrop-blur-md rounded-xl border border-amber-600/50 
                        p-6 max-w-4xl max-h-[80vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold gold-text decorative-text">
                Story History
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-amber-300 hover:text-amber-200 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {history.map((segment, index) => (
                <div key={segment.id} 
                     className="bg-black/20 rounded-lg p-4 border border-amber-600/30">
                  <div className="flex items-center mb-2">
                    <span className="text-amber-400 decorative-text font-semibold">
                      Chapter {index + 1}
                    </span>
                    {segment.timestamp && (
                      <span className="text-amber-300/60 text-sm ml-auto">
                        {new Date(segment.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  <p className="text-amber-100 antique-text leading-relaxed">
                    {segment.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Welcome overlay for initial load */}
      {!currentSegment && !showPrompt && !isGenerating && (
        <div className="absolute inset-0 z-5 flex items-center justify-center 
                      bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm
                      pointer-events-none">
          <div className="text-center">
            <h1 className="text-6xl font-bold gold-text decorative-text mb-4">
              WEAVE
            </h1>
            <p className="text-amber-200 text-xl antique-text mb-8">
              Interactive Tales of Choice
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce delay-200"></div>
            </div>
            <p className="text-amber-300/80 text-sm mt-4 antique-text">
              Click the mystical book to begin your journey
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 