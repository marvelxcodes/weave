import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'neon-cyan': '#00ffff',
        'neon-pink': '#ff0080',
        'neon-white': '#ffffff',
        'neon-silver': '#c0c0c0',
        'professional-white': '#f8f9fa',
        'soft-white': '#f1f3f4',
        'neon-purple': '#8000ff',
        'neon-blue': '#0080ff',
        'neon-green': '#00ff80',
        'matrix-green': '#00ff41',
        'cyber-orange': '#ff6600',
        'cyber-red': '#ff0040',
        'cyber-yellow': '#ffff00',
        'electric-blue': '#0066ff',
        'dark-surface': '#1a1a2e',
      },
      fontFamily: {
        'orbitron': ['var(--font-orbitron)', 'monospace'],
        'rajdhani': ['var(--font-rajdhani)', 'sans-serif'],
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'matrix-rain': 'matrix-rain 3s linear infinite',
        'hologram-flicker': 'hologram-flicker 0.15s ease-in-out infinite',
        'cyber-float': 'cyber-float 3s ease-in-out infinite',
        'circuit-pulse': 'circuit-pulse 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        'data-stream': 'data-stream 2s linear infinite',
        'hologram-sweep': 'hologram-sweep 3s linear infinite',
        'scanlines': 'scanlines 0.1s linear infinite',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': {
            textShadow: '0 0 5px var(--neon-cyan), 0 0 10px var(--neon-cyan), 0 0 15px var(--neon-cyan)'
          },
          '50%': {
            textShadow: '0 0 10px var(--neon-cyan), 0 0 20px var(--neon-cyan), 0 0 30px var(--neon-cyan), 0 0 40px var(--neon-cyan)'
          }
        },
        'matrix-rain': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' }
        },
        'hologram-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
          '75%': { opacity: '0.9' }
        },
        'cyber-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'circuit-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 5px var(--neon-cyan), inset 0 0 5px rgba(0, 255, 255, 0.1)'
          },
          '50%': {
            boxShadow: '0 0 20px var(--neon-cyan), 0 0 30px var(--neon-cyan), inset 0 0 15px rgba(0, 255, 255, 0.2)'
          }
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' }
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-in-right': {
          'from': { opacity: '0', transform: 'translateX(50px)' },
          'to': { opacity: '1', transform: 'translateX(0)' }
        },
        'scale-in': {
          'from': { opacity: '0', transform: 'scale(0.8)' },
          'to': { opacity: '1', transform: 'scale(1)' }
        },
        'data-stream': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' }
        },
        'hologram-sweep': {
          '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(45deg)' },
          '100%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' }
        },
        'scanlines': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 4px' }
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px var(--neon-cyan)',
        'neon-pink': '0 0 20px var(--neon-pink)',
        'neon-white': '0 0 20px var(--neon-white)',
        'neon-silver': '0 0 20px var(--neon-silver)',
        'neon-purple': '0 0 20px var(--neon-purple)',
        'cyber-glow': '0 0 30px var(--neon-cyan), 0 0 60px var(--neon-cyan)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(255, 255, 255, 0.1), rgba(192, 192, 192, 0.1))',
        'neon-gradient': 'linear-gradient(45deg, var(--neon-cyan), var(--neon-white))',
        'matrix-gradient': 'linear-gradient(180deg, transparent, var(--matrix-green))',
      }
    },
  },
  plugins: [],
} satisfies Config;
