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
              className="text-center text-amber-300 decorative-text text-xl mb-6"
            >
              Choose Your Path
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
                    boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onChoiceSelect(choice)}
                  className="group relative bg-gradient-to-br from-amber-900/40 to-amber-800/20 
                           backdrop-blur-sm border border-amber-600/40 rounded-lg p-6 
                           hover:border-amber-500/60 transition-all duration-300
                           text-left overflow-hidden"
                >
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Choice number */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full 
                                bg-amber-600/30 border border-amber-500/50 
                                flex items-center justify-center">
                    <span className="text-amber-300 font-bold decorative-text">
                      {index + 1}
                    </span>
                  </div>
                  
                  {/* Choice text */}
                  <p className="text-amber-100 antique-text text-lg leading-relaxed pr-12">
                    {choice.text}
                  </p>
                  
                  {/* Decorative corner elements */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 
                                border-amber-500/40 group-hover:border-amber-400/60 
                                transition-colors duration-300" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 
                                border-amber-500/40 group-hover:border-amber-400/60 
                                transition-colors duration-300" />
                  
                  {/* Hover effect particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300 pointer-events-none">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-amber-400 rounded-full"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${30 + i * 20}%`,
                        }}
                        animate={{
                          y: [-2, -8, -2],
                          opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 