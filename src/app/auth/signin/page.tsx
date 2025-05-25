'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, Lock, Zap } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Neural access denied - invalid credentials');
      } else {
        const session = await getSession();
        if (session) {
          router.push('/');
        }
      }
    } catch {
      setError('System error occurred - retry connection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black 
                    flex items-center justify-center p-4 relative">
      {/* Cyberpunk background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-surface neon-border rounded-xl p-8 w-full max-w-md 
                 shadow-[0_0_50px_rgba(0,255,255,0.3)] relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mb-4"
          >
            <Zap className="text-cyan-400 mr-2 neon-glow" size={32} />
            <h1 className="text-3xl font-bold neon-text">
              WEAVE
            </h1>
            <Zap className="text-cyan-400 ml-2 neon-glow" size={32} />
          </motion.div>
          <p className="text-cyan-200 cyber-text">
            Access Neural Interface
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-cyan-300 cyber-text mb-2 font-medium">
              Neural Address
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 
                            text-cyan-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-cyan-500/40 
                         glass-surface text-cyan-100 placeholder-cyan-300/50
                         focus:border-cyan-400 focus:outline-none transition-all duration-300
                         cyber-text focus:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                placeholder="Enter neural address"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-cyan-300 cyber-text mb-2 font-medium">
              Security Protocol
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 
                            text-cyan-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-cyan-500/40 
                         glass-surface text-cyan-100 placeholder-cyan-300/50
                         focus:border-cyan-400 focus:outline-none transition-all duration-300
                         cyber-text focus:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                placeholder="Enter security code"
                required
              />
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm cyber-text text-center p-3 
                        glass-surface border border-red-500/50 rounded-lg
                        shadow-[0_0_20px_rgba(255,0,0,0.3)]"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 
                     text-white rounded-lg border-2 border-cyan-500 
                     hover:shadow-[0_0_30px_rgba(0,255,255,0.5)]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300 cyber-text font-semibold
                     hover:from-cyan-500 hover:to-blue-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white 
                              rounded-full animate-spin" />
                <span>CONNECTING...</span>
              </div>
            ) : (
              'CONNECT TO MATRIX'
            )}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-cyan-300/80 cyber-text">
            Need neural interface?{' '}
            <Link 
              href="/auth/signup" 
              className="text-cyan-200 hover:text-cyan-100 transition-colors 
                       underline decoration-cyan-400/50 hover:decoration-cyan-400
                       hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
            >
              Initialize System
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center"
        >
          <Link 
            href="/" 
            className="text-cyan-400 hover:text-cyan-300 transition-colors 
                     cyber-text text-sm hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
          >
            ← Return to Matrix
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
} 