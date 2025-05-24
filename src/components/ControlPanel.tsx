'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, History } from 'lucide-react';

interface ControlPanelProps {
  onStartNewStory: () => void;
  onGoBack: () => void;
  onShowHistory: () => void;
  canGoBack: boolean;
  hasHistory: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onStartNewStory,
  onGoBack,
  onShowHistory,
  canGoBack,
  hasHistory
}) => {
  const controls = [
    {
      icon: BookOpen,
      label: 'New Story',
      onClick: onStartNewStory,
      enabled: true,
      color: 'from-emerald-600 to-emerald-700'
    },
    {
      icon: ArrowLeft,
      label: 'Go Back',
      onClick: onGoBack,
      enabled: canGoBack,
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: History,
      label: 'History',
      onClick: onShowHistory,
      enabled: hasHistory,
      color: 'from-purple-600 to-purple-700'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20"
    >
      <div className="flex flex-col space-y-3">
        {controls.map((control, index) => {
          const Icon = control.icon;
          return (
            <motion.button
              key={control.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              whileHover={{ 
                scale: control.enabled ? 1.1 : 1,
                boxShadow: control.enabled ? "0 0 15px rgba(212, 175, 55, 0.4)" : "none"
              }}
              whileTap={{ scale: control.enabled ? 0.95 : 1 }}
              onClick={control.enabled ? control.onClick : undefined}
              disabled={!control.enabled}
              className={`
                group relative w-12 h-12 rounded-full border-2 
                backdrop-blur-sm transition-all duration-300
                ${control.enabled 
                  ? 'border-amber-500/60 bg-amber-900/40 hover:border-amber-400/80 cursor-pointer' 
                  : 'border-gray-600/40 bg-gray-800/20 cursor-not-allowed opacity-50'
                }
              `}
              title={control.label}
            >
              {/* Background glow */}
              <div className={`
                absolute inset-0 rounded-full transition-opacity duration-300
                ${control.enabled 
                  ? 'bg-gradient-to-br from-amber-500/10 to-amber-600/5 opacity-0 group-hover:opacity-100' 
                  : ''
                }
              `} />
              
              {/* Icon */}
              <Icon 
                size={20} 
                className={`
                  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                  transition-colors duration-300
                  ${control.enabled 
                    ? 'text-amber-300 group-hover:text-amber-200' 
                    : 'text-gray-500'
                  }
                `} 
              />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            pointer-events-none">
                <div className="bg-black/80 backdrop-blur-sm rounded px-2 py-1 
                              border border-amber-600/30 whitespace-nowrap">
                  <span className="text-amber-200 text-sm antique-text">
                    {control.label}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}; 