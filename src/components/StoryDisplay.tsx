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
      <div className="glass-surface neon-border rounded-lg p-6 max-w-4xl mx-auto my-10
                    shadow-cyber-glow hologram data-stream circuit-pattern relative overflow-hidden">
        
        {/* Background scanlines */}
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
        
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-neon-cyan/60 animate-cyber-float" />
        <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-neon-cyan/60 animate-cyber-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-neon-cyan/60 animate-cyber-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-neon-cyan/60 animate-cyber-float" style={{ animationDelay: '1.5s' }} />

        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center relative z-10"
            >
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-4 h-4 bg-neon-cyan rounded-full animate-neon-pulse shadow-neon-cyan"></div>
                <div className="w-4 h-4 bg-neon-pink rounded-full animate-neon-pulse shadow-neon-pink" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-4 h-4 bg-neon-purple rounded-full animate-neon-pulse shadow-neon-purple" style={{ animationDelay: '0.4s' }}></div>
              </div>
              
              <motion.p 
                className="text-neon-cyan cyber-text text-xl font-rajdhani font-semibold mb-4"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Processing neural patterns...
              </motion.p>
              
              <div className="space-y-2 text-neon-cyan/80 cyber-text text-sm font-rajdhani">
                <motion.div 
                  className="data-stream"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                >
                  ► Analyzing narrative vectors
                </motion.div>
                <motion.div 
                  className="data-stream"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                >
                  ► Calibrating story matrix
                </motion.div>
                <motion.div 
                  className="data-stream"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                >
                  ► Synchronizing consciousness
                </motion.div>
              </div>

              {/* Loading spinner */}
              <div className="mt-6 flex justify-center">
                <div className="cyber-spinner" />
              </div>
            </motion.div>
          ) : segment ? (
            <motion.div
              key={segment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative z-10"
            >
              {/* Story header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3 mb-4 pb-3 border-b border-neon-cyan/30"
              >
                <div className="w-3 h-3 bg-matrix-green rounded-full animate-neon-pulse" />
                <span className="cyber-text text-sm text-neon-cyan/80 font-rajdhani font-medium">
                  NARRATIVE STREAM ACTIVE
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-neon-cyan/50 to-transparent" />
              </motion.div>

              <motion.p
                className="text-cyan-100 text-lg leading-relaxed cyber-text font-rajdhani relative"
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
                      delay: 0.3 + index * 0.015,
                      duration: 0.1
                    }}
                    className="hover:text-neon-cyan transition-colors duration-200 hover:animate-neon-pulse"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.p>

              {/* Story footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 pt-3 border-t border-neon-cyan/30 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-pink rounded-full animate-circuit-pulse" />
                  <span className="cyber-text text-xs text-neon-cyan/60 font-rajdhani">
                    SEGMENT ID: {segment.id.slice(0, 8)}
                  </span>
                </div>
                {segment.timestamp && (
                  <span className="cyber-text text-xs text-neon-cyan/60 font-rajdhani">
                    {new Date(segment.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center relative z-10"
            >
              <motion.h1 
                className="text-4xl font-bold neon-text animate-neon-pulse mb-6 font-orbitron"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                NEURAL INTERFACE ACTIVE
              </motion.h1>
              
              <motion.p 
                className="text-neon-cyan text-xl cyber-text mb-6 font-rajdhani animate-cyber-float"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Access the cybernetic narrative matrix
              </motion.p>
              
              <motion.div 
                className="text-neon-cyan/80 cyber-text text-sm space-y-2 font-rajdhani"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.p 
                  className="data-stream"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                >
                  ► Initialize story protocol
                </motion.p>
                <motion.p 
                  className="data-stream"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                >
                  ► Connect to digital consciousness
                </motion.p>
                <motion.p 
                  className="data-stream"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                >
                  ► Awaiting neural input
                </motion.p>
              </motion.div>

              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 40}%`,
                      background: i % 3 === 0 ? 'var(--neon-cyan)' : i % 3 === 1 ? 'var(--neon-pink)' : 'var(--matrix-green)',
                      boxShadow: `0 0 8px ${i % 3 === 0 ? 'var(--neon-cyan)' : i % 3 === 1 ? 'var(--neon-pink)' : 'var(--matrix-green)'}`,
                    }}
                    animate={{
                      y: [-5, 5, -5],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};