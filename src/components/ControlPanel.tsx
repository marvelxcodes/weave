'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Database } from 'lucide-react';

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
      icon: Zap,
      label: 'Initialize Protocol',
      onClick: onStartNewStory,
      enabled: true,
      color: 'neon-cyan',
      glowColor: 'var(--neon-cyan)',
      description: 'Start new narrative'
    },
    {
      icon: ArrowLeft,
      label: 'Revert State',
      onClick: onGoBack,
      enabled: canGoBack,
      color: 'neon-purple',
      glowColor: 'var(--neon-purple)',
      description: 'Previous segment'
    },
    {
      icon: Database,
      label: 'Memory Banks',
      onClick: onShowHistory,
      enabled: hasHistory,
      color: 'matrix-green',
      glowColor: 'var(--matrix-green)',
      description: 'View story history'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20"
    >
      {/* Panel header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mb-4 glass-surface rounded-lg p-3 border border-neon-cyan/30 data-stream"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-neon-pulse" />
          <span className="cyber-text text-xs text-neon-cyan/80 font-rajdhani font-medium">
            CONTROL MATRIX
          </span>
        </div>
      </motion.div>

      <div className="flex flex-col space-y-4">
        {controls.map((control, index) => {
          const Icon = control.icon;
          return (
            <motion.div
              key={control.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="relative group"
            >
              <motion.button
                whileHover={{ 
                  scale: control.enabled ? 1.1 : 1,
                  boxShadow: control.enabled ? `0 0 25px ${control.glowColor}` : "none"
                }}
                whileTap={{ scale: control.enabled ? 0.95 : 1 }}
                onClick={control.enabled ? control.onClick : undefined}
                disabled={!control.enabled}
                className={`
                  relative w-16 h-16 rounded-lg border-2 
                  glass-surface transition-all duration-300 overflow-hidden
                  ${control.enabled 
                    ? `border-${control.color}/60 hover:border-${control.color}/80 cursor-pointer neon-border animate-circuit-pulse` 
                    : 'border-gray-600/40 cursor-not-allowed opacity-30'
                  }
                `}
                title={control.label}
              >
                {/* Background effects */}
                <div className="absolute inset-0 circuit-pattern opacity-20" />
                <div className="absolute inset-0 scanlines opacity-10" />
                
                {/* Hologram effect */}
                <div className={`
                  absolute inset-0 rounded-lg transition-opacity duration-300
                  ${control.enabled 
                    ? 'hologram opacity-0 group-hover:opacity-100' 
                    : ''
                  }
                `} />
                
                {/* Corner decorations */}
                {control.enabled && (
                  <>
                    <div className="absolute top-1 left-1 w-3 h-3 border-l border-t border-current opacity-60 animate-cyber-float" />
                    <div className="absolute top-1 right-1 w-3 h-3 border-r border-t border-current opacity-60 animate-cyber-float" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute bottom-1 left-1 w-3 h-3 border-l border-b border-current opacity-60 animate-cyber-float" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-1 right-1 w-3 h-3 border-r border-b border-current opacity-60 animate-cyber-float" style={{ animationDelay: '1.5s' }} />
                  </>
                )}
                
                {/* Icon */}
                <Icon 
                  size={24} 
                  className={`
                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    transition-all duration-300 z-10
                    ${control.enabled 
                      ? `text-${control.color} group-hover:text-white group-hover:animate-neon-pulse` 
                      : 'text-gray-600'
                    }
                  `} 
                  style={{
                    filter: control.enabled ? `drop-shadow(0 0 8px ${control.glowColor})` : 'none'
                  }}
                />
                
                {/* Enhanced data stream effect */}
                {control.enabled && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-40 
                                transition-opacity duration-300 pointer-events-none overflow-hidden rounded-lg">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-px h-full bg-gradient-to-b from-transparent via-${control.color} to-transparent`}
                        style={{ left: `${20 + i * 20}%` }}
                        animate={{
                          y: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "linear"
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Glitch effect */}
                {control.enabled && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 
                                transition-opacity duration-300 pointer-events-none
                                bg-white animate-glitch rounded-lg" 
                                style={{ animationDuration: '0.1s' }} />
                )}
              </motion.button>
              
              {/* Enhanced tooltip */}
              <div className="absolute left-full ml-6 top-1/2 transform -translate-y-1/2 
                            opacity-0 group-hover:opacity-100 transition-all duration-300
                            pointer-events-none z-50 scale-95 group-hover:scale-100">
                <div className="glass-surface neon-border rounded-lg p-4 
                              shadow-cyber-glow whitespace-nowrap hologram data-stream">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-2 h-2 bg-${control.color} rounded-full animate-neon-pulse`} />
                    <span className="text-neon-cyan text-sm cyber-text font-rajdhani font-semibold">
                      {control.label}
                    </span>
                  </div>
                  <p className="text-neon-cyan/70 text-xs cyber-text font-rajdhani">
                    {control.description}
                  </p>
                  {!control.enabled && (
                    <p className="text-red-400/80 text-xs cyber-text font-rajdhani mt-1">
                      ► FUNCTION DISABLED
                    </p>
                  )}
                </div>
              </div>

              {/* Status indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-current">
                <div className={`
                  w-full h-full rounded-full transition-all duration-300
                  ${control.enabled 
                    ? `bg-${control.color} animate-neon-pulse shadow-[0_0_8px_currentColor]` 
                    : 'bg-gray-600'
                  }
                `} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Panel footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-4 glass-surface rounded-lg p-2 border border-neon-cyan/30"
      >
        <div className="text-center">
          <div className="w-1 h-1 bg-matrix-green rounded-full mx-auto animate-neon-pulse" />
          <span className="cyber-text text-xs text-neon-cyan/60 font-rajdhani block mt-1">
            SYSTEM READY
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}; 