'use client';

import { motion } from 'framer-motion';
import { Lock, Mail, Zap, User, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { POPULAR_AUTHORS, PreferredAuthor } from '@/types/api';

export default function SignUpPage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [preferredAuthors, setPreferredAuthors] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		if (password !== confirmPassword) {
			setError('Neural patterns do not match');
			setIsLoading(false);
			return;
		}

		if (password.length < 6) {
			setError('Security protocol requires minimum 6 characters');
			setIsLoading(false);
			return;
		}

		try {
			const response = await axios.post('/api/auth/register', {
				name,
				email,
				password,
				preferred_authors: preferredAuthors,
			});

			if (response.status === 200) {
				router.push('/auth/signin?message=Neural interface initialized! Please connect.');
			}
		} catch (error) {
			const axiosError = error as AxiosError<{ error: string }>;
			setError(axiosError.response?.data?.error || 'System error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black
                    flex items-start sm:items-center justify-center p-4 py-8 sm:py-4 overflow-y-auto
                    relative"
		>
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
				className="glass-surface neon-border rounded-xl p-6 sm:p-8 w-full max-w-md 
                 shadow-[0_0_50px_rgba(0,255,255,0.3)] my-auto relative z-10"
			>
				<div className="text-center mb-8">
					<motion.div
						initial={{ scale: 0.5, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="flex items-center justify-center mb-4"
					>
						<Zap className="text-cyan-400 mr-2 neon-glow" size={32} />
						<h1 className="text-3xl font-bold neon-text">WEAVE</h1>
						<Zap className="text-cyan-400 ml-2 neon-glow" size={32} />
					</motion.div>
					<p className="cyber-text">Initialize Neural Interface</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
						<label className="block text-cyan-300 cyber-text mb-2 font-medium">Identity Code</label>
						<div className="relative">
							<User
								className="absolute left-3 top-1/2 transform -translate-y-1/2
                            text-cyan-400"
								size={20}
							/>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-cyan-500/40
                         glass-surface text-cyan-100 placeholder-cyan-300/50
                         focus:border-cyan-400 focus:outline-none transition-all duration-300
                         cyber-text focus:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
								placeholder="Enter your identity"
								required
							/>
						</div>
					</motion.div>

					<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
						<label className="block text-cyan-300 cyber-text mb-2 font-medium">Neural Address</label>
						<div className="relative">
							<Mail
								className="absolute left-3 top-1/2 transform -translate-y-1/2
                            text-cyan-400"
								size={20}
							/>
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

					<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
						<label className="block text-cyan-300 cyber-text mb-2 font-medium">Security Protocol</label>
						<div className="relative">
							<Lock
								className="absolute left-3 top-1/2 transform -translate-y-1/2
                            text-cyan-400"
								size={20}
							/>
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

					<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
						<label className="block text-cyan-300 cyber-text mb-2 font-medium">Confirm Protocol</label>
						<div className="relative">
							<Lock
								className="absolute left-3 top-1/2 transform -translate-y-1/2
                            text-cyan-400"
								size={20}
							/>
							<input
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-cyan-500/40
                         glass-surface text-cyan-100 placeholder-cyan-300/50
                         focus:border-cyan-400 focus:outline-none transition-all duration-300
                         cyber-text focus:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
								placeholder="Confirm security code"
								required
							/>
						</div>
					</motion.div>

					<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
						<label className="block text-cyan-300 cyber-text mb-3 font-medium">
							<BookOpen className="inline mr-2" size={16} />
							Preferred Authors (Optional)
						</label>
						<div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto glass-surface p-3 rounded-lg border border-cyan-500/40">
							{POPULAR_AUTHORS.map((author) => (
								<label key={author} className="flex items-center space-x-2 cursor-pointer">
									<input
										type="checkbox"
										checked={preferredAuthors.includes(author)}
										onChange={(e) => {
											if (e.target.checked) {
												setPreferredAuthors([...preferredAuthors, author]);
											} else {
												setPreferredAuthors(preferredAuthors.filter(a => a !== author));
											}
										}}
										className="w-4 h-4 text-cyan-400 bg-transparent border-2 border-cyan-500/40 
                                   rounded focus:ring-cyan-400 focus:ring-2"
									/>
									<span className="text-cyan-200 text-sm cyber-text">{author}</span>
								</label>
							))}
						</div>
						<p className="text-cyan-400/60 text-xs mt-2 cyber-text">
							Select authors whose writing style you enjoy. This helps personalize your story experience.
						</p>
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
						transition={{ delay: 0.8 }}
					>
						{isLoading ? (
							<div className="flex items-center justify-center space-x-2">
								<div
									className="w-4 h-4 border-2 border-white/30 border-t-white
                              rounded-full animate-spin"
								/>
								<span>INITIALIZING...</span>
							</div>
						) : (
							'INITIALIZE INTERFACE'
						)}
					</motion.button>
				</form>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.9 }}
					className="mt-6 text-center"
				>
					<p className="text-cyan-300/80 cyber-text">
						Already connected?{' '}
						<Link
							href="/auth/signin"
							className="text-cyan-200 hover:text-cyan-100 transition-colors
                       underline decoration-cyan-400/50 hover:decoration-cyan-400
                       hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
						>
							Access Matrix
						</Link>
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.0 }}
					className="mt-4 text-center"
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
