'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, Mail, Lock, Sparkles, Gift } from 'lucide-react';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/auth/signin?message=Account created successfully! Please sign in.');
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900/20 to-amber-800/10 
                    flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-amber-900/80 to-amber-800/60 backdrop-blur-md 
                 rounded-xl border border-amber-600/50 p-8 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mb-4"
          >
            <Sparkles className="text-amber-400 mr-2" size={32} />
            <h1 className="text-3xl font-bold gold-text decorative-text">
              WEAVE
            </h1>
            <Sparkles className="text-amber-400 ml-2" size={32} />
          </motion.div>
          <p className="text-amber-200 antique-text">
            Join the community of storytellers
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 p-3 bg-emerald-900/40 border border-emerald-600/40 rounded-lg"
          >
            <div className="flex items-center justify-center mb-2">
              <Gift className="text-emerald-400 mr-2" size={20} />
              <span className="text-emerald-300 decorative-text font-semibold">
                Welcome Bonus
              </span>
            </div>
            <p className="text-emerald-200 text-sm antique-text">
              Start with 10 free credits to create your first stories!
            </p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-amber-300 decorative-text mb-2">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 
                            text-amber-400" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-amber-600/40 
                         bg-black/30 backdrop-blur-sm text-amber-100 placeholder-amber-300/50
                         focus:border-amber-400/80 focus:outline-none transition-all duration-300
                         antique-text"
                placeholder="Enter your name"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-amber-300 decorative-text mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 
                            text-amber-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-amber-600/40 
                         bg-black/30 backdrop-blur-sm text-amber-100 placeholder-amber-300/50
                         focus:border-amber-400/80 focus:outline-none transition-all duration-300
                         antique-text"
                placeholder="Enter your email"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-amber-300 decorative-text mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 
                            text-amber-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-amber-600/40 
                         bg-black/30 backdrop-blur-sm text-amber-100 placeholder-amber-300/50
                         focus:border-amber-400/80 focus:outline-none transition-all duration-300
                         antique-text"
                placeholder="Enter your password"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-amber-300 decorative-text mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 
                            text-amber-400" size={20} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-amber-600/40 
                         bg-black/30 backdrop-blur-sm text-amber-100 placeholder-amber-300/50
                         focus:border-amber-400/80 focus:outline-none transition-all duration-300
                         antique-text"
                placeholder="Confirm your password"
                required
              />
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm antique-text text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 
                     text-white rounded-lg border-2 border-amber-500 
                     hover:shadow-lg hover:shadow-amber-500/30 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300 decorative-text font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white 
                              rounded-full animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-amber-300/80 antique-text">
            Already have an account?{' '}
            <Link 
              href="/auth/signin" 
              className="text-amber-200 hover:text-amber-100 transition-colors 
                       underline decoration-amber-400/50 hover:decoration-amber-400"
            >
              Sign in
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-4 text-center"
        >
          <Link 
            href="/" 
            className="text-amber-400 hover:text-amber-300 transition-colors 
                     antique-text text-sm"
          >
            ← Back to Stories
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
} 