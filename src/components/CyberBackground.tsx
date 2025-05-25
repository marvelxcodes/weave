'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const CyberBackground: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="circuit-pattern w-full h-full animate-circuit-pulse" />
      </div>

      {/* Floating data fragments */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`fragment-${i}`}
            className="absolute text-neon-cyan/30 cyber-text text-xs font-orbitron"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {['0x', '1A', 'FF', 'C7', '3E', '9B', 'D4', '2F'][Math.floor(Math.random() * 8)]}
          </motion.div>
        ))}
      </div>

      {/* Matrix rain effect */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`rain-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-matrix-green/40 to-transparent"
            style={{
              left: `${10 + i * 12}%`,
              height: '100vh',
            }}
            animate={{
              y: ['-100vh', '100vh'],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Floating UI elements */}
      <motion.div
        className="absolute top-20 right-20 glass-surface rounded-lg p-3 border border-neon-cyan/30"
        animate={{
          y: [-5, 5, -5],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-neon-pulse" />
          <span className="cyber-text text-xs text-neon-cyan/80 font-rajdhani">
            NEURAL SYNC: 98.7%
          </span>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-16 glass-surface rounded-lg p-3 border border-neon-pink/30"
        animate={{
          y: [5, -5, 5],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          delay: 1,
        }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neon-pink rounded-full animate-neon-pulse" />
          <span className="cyber-text text-xs text-neon-pink/80 font-rajdhani">
            DATA FLOW: ACTIVE
          </span>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-8 glass-surface rounded-lg p-3 border border-neon-purple/30"
        animate={{
          y: [-3, 3, -3],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: 2,
        }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neon-purple rounded-full animate-neon-pulse" />
          <span className="cyber-text text-xs text-neon-purple/80 font-rajdhani">
            QUANTUM STATE
          </span>
        </div>
      </motion.div>

      {/* Scanning lines */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0 0', '0 100vh'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: 'linear-gradient(transparent 98%, rgba(0, 255, 255, 0.1) 100%)',
          backgroundSize: '100% 200px',
        }}
      />

      {/* Corner UI elements */}
      <div className="absolute top-4 left-4 glass-surface rounded-lg p-2 border border-neon-cyan/30 animate-cyber-float">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-matrix-green rounded-full animate-neon-pulse" />
          <span className="cyber-text text-xs text-neon-cyan/60 font-rajdhani">
            SYS.ONLINE
          </span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 glass-surface rounded-lg p-2 border border-neon-cyan/30 animate-cyber-float" style={{ animationDelay: '1s' }}>
        <div className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-neon-cyan rounded-full animate-neon-pulse" />
          <span className="cyber-text text-xs text-neon-cyan/60 font-rajdhani">
            v2.1.47
          </span>
        </div>
      </div>

      {/* Glitch overlay */}
      <motion.div
        className="absolute inset-0 bg-neon-pink/5"
        animate={{
          opacity: [0, 0.1, 0],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: 5 + Math.random() * 10,
        }}
      />

      {/* Energy streams */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-neon-cyan/20 via-transparent to-neon-cyan/20 animate-data-stream" />
      <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-neon-pink/20 via-transparent to-neon-pink/20 animate-data-stream" style={{ animationDelay: '2s' }} />
      <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-neon-purple/20 via-transparent to-neon-purple/20 animate-data-stream" style={{ animationDelay: '4s' }} />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['var(--neon-cyan)', 'var(--neon-pink)', 'var(--neon-purple)', 'var(--matrix-green)'][i % 4],
              boxShadow: `0 0 6px ${['var(--neon-cyan)', 'var(--neon-pink)', 'var(--neon-purple)', 'var(--matrix-green)'][i % 4]}`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* HUD elements */}
      <div className="absolute top-16 left-16">
        <div className="glass-surface rounded-lg p-4 border border-neon-cyan/30 data-stream">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-matrix-green rounded-full animate-neon-pulse" />
              <span className="cyber-text text-xs text-neon-cyan/80 font-rajdhani">
                NEURAL INTERFACE
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-circuit-pulse" />
              <span className="cyber-text text-xs text-neon-cyan/80 font-rajdhani">
                STORY ENGINE
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-pink rounded-full animate-neon-pulse" />
              <span className="cyber-text text-xs text-neon-cyan/80 font-rajdhani">
                REALITY MATRIX
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 