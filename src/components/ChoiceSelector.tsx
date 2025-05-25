'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { StoryChoice } from '@/types/story';

interface ChoiceSelectorProps {
  choices: StoryChoice[];
  onChoiceSelect: (choice: StoryChoice) => void;
  isVisible: boolean;
}

export const ChoiceSelector: React.FC<ChoiceSelectorProps> = ({
  choices,
  onChoiceSelect,
  isVisible
}) => {
  return (
    <AnimatePresence>
      {isVisible && choices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute bottom-8 left-8 right-8 z-10"
        >
          <div className="max-w-4xl mx-auto">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-neon-cyan cyber-text text-xl mb-6 animate-neon-pulse font-rajdhani font-semibold"
            >
              SELECT NEURAL PATHWAY
            </motion.h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              {choices.map((choice, index) => (
                <motion.button
                  key={choice.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.6 + index * 0.1,
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 30px rgba(0, 255, 255, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onChoiceSelect(choice)}
                  className="group relative hologram neon-border rounded-lg p-6 
                           hover:border-neon-cyan/80 transition-all duration-300
                           text-left overflow-hidden hover:animate-hologram-flicker
                           data-stream circuit-pattern"
                >
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-cyber-gradient 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Choice number */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full 
                                glass-surface border-2 border-neon-cyan/50 
                                flex items-center justify-center
                                shadow-neon-cyan animate-circuit-pulse">
                    <span className="text-neon-cyan font-bold cyber-text font-orbitron">
                      {index + 1}
                    </span>
                  </div>
                  
                  {/* Choice text */}
                  <p className="text-cyan-100 cyber-text text-lg leading-relaxed pr-12 font-rajdhani relative z-10">
                    {choice.text}
                  </p>
                  
                  {/* Enhanced decorative corner elements */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 
                                border-neon-cyan/40 group-hover:border-neon-cyan/80 
                                transition-colors duration-300
                                shadow-neon-cyan animate-cyber-float" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 
                                border-neon-cyan/40 group-hover:border-neon-cyan/80 
                                transition-colors duration-300
                                shadow-neon-cyan animate-cyber-float" 
                                style={{ animationDelay: '0.5s' }} />
                  
                  {/* Enhanced hover effect particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300 pointer-events-none">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          left: `${15 + i * 20}%`,
                          top: `${20 + i * 15}%`,
                          					background: i % 3 === 0 ? 'var(--neon-cyan)' : i % 3 === 1 ? 'var(--neon-white)' : 'var(--neon-silver)',
					boxShadow: `0 0 10px ${i % 3 === 0 ? 'var(--neon-cyan)' : i % 3 === 1 ? 'var(--neon-white)' : 'var(--neon-silver)'}`,
                        }}
                        animate={{
                          y: [-2, -8, -2],
                          opacity: [0.3, 0.8, 0.3],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>

                  {/* Enhanced data stream effect */}
                  <div className="absolute left-0 top-0 w-full h-full opacity-0 group-hover:opacity-30 
                                transition-opacity duration-300 pointer-events-none overflow-hidden">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-px h-full bg-gradient-to-b from-transparent via-neon-cyan to-transparent"
                        style={{ left: `${i * 12.5}%` }}
                        animate={{
                          y: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "linear"
                        }}
                      />
                    ))}
                  </div>

                  {/* Scanline effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 
                                transition-opacity duration-300 pointer-events-none">
                    <div className="scanlines w-full h-full" />
                  </div>

                  {/* Glitch effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 
                                transition-opacity duration-300 pointer-events-none
                                				bg-white animate-glitch" 
                                style={{ animationDuration: '0.1s' }} />
                </motion.button>
              ))}
            </div>

            {/* Additional UI elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center space-x-2 glass-surface px-4 py-2 rounded-lg border border-neon-cyan/30">
                <div className="w-2 h-2 bg-matrix-green rounded-full animate-neon-pulse" />
                <span className="cyber-text text-sm text-neon-cyan/80">DECISION MATRIX ACTIVE</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 