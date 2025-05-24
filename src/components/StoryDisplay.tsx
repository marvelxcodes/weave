'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { StorySegment } from '@/types/story';

interface StoryDisplayProps {
  segment: StorySegment | null;
  isGenerating: boolean;
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({
  segment,
  isGenerating
}) => {
  return (
    <div className="absolute top-8 left-8 right-8 z-10">
      <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-amber-600/30 p-6 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-150"></div>
              </div>
              <p className="text-amber-200 decorative-text text-lg">
                Weaving your tale...
              </p>
            </motion.div>
          ) : segment ? (
            <motion.div
              key={segment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.p
                className="text-amber-100 text-lg leading-relaxed antique-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {segment.text.split('').map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 0.3 + index * 0.02,
                      duration: 0.1
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold gold-text decorative-text mb-4">
                Welcome to Weave
              </h1>
              <p className="text-amber-200 text-lg antique-text">
                Click the mystical book to begin your interactive story journey
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 