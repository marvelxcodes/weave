'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, X } from 'lucide-react';

interface StoryPromptProps {
	onSubmit: (prompt: string) => void;
	onClose: () => void;
	isVisible: boolean;
	isGenerating: boolean;
}

export const StoryPrompt: React.FC<StoryPromptProps> = ({ onSubmit, onClose, isVisible, isGenerating }) => {
	const [prompt, setPrompt] = useState('');
	const [isFocused, setIsFocused] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (prompt.trim() && !isGenerating) {
			onSubmit(prompt.trim());
			setPrompt('');
		}
	};

	const handleBackgroundClick = (e: React.MouseEvent) => {
		// Only close if clicking the background, not the modal content
		if (e.target === e.currentTarget && !isGenerating) {
			onClose();
		}
	};

	const suggestions = [
		'A neural interface activates in a cyberpunk metropolis...',
		'You discover a hidden data cache in the digital underground...',
		'An encrypted message arrives from the resistance...',
		'The last AI awakens in an abandoned server farm...',
		'You inherit access to a forbidden neural network...',
	];

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					transition={{ duration: 0.5 }}
					className="absolute inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
					onClick={handleBackgroundClick}
				>
					<motion.div
						initial={{ y: 50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="glass-surface neon-border rounded-xl p-8 max-w-2xl w-full mx-4
                     shadow-cyber-glow relative cursor-default hologram data-stream circuit-pattern overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Background effects */}
						<div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
						
						{/* Corner decorations */}
						<div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-neon-cyan/60 animate-cyber-float" />
						<div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-neon-cyan/60 animate-cyber-float" style={{ animationDelay: '0.5s' }} />
						<div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-neon-cyan/60 animate-cyber-float" style={{ animationDelay: '1s' }} />
						<div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-neon-cyan/60 animate-cyber-float" style={{ animationDelay: '1.5s' }} />

						{/* Close button */}
						<motion.button
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
							onClick={onClose}
							className="absolute top-4 right-4 p-2 rounded-lg border-2 border-neon-cyan/40
                         glass-surface text-neon-cyan hover:text-cyan-100
                         hover:border-neon-cyan/80 hover:shadow-neon-cyan
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                         z-10 animate-circuit-pulse"
							disabled={isGenerating}
							whileHover={{ scale: isGenerating ? 1 : 1.1 }}
							whileTap={{ scale: isGenerating ? 1 : 0.9 }}
						>
							<X size={20} />
						</motion.button>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
							className="text-center mb-6 relative z-10"
						>
							<div className="flex items-center justify-center mb-4">
								<Zap className="text-neon-cyan mr-2 animate-neon-pulse" size={24} />
								<h2 className="text-2xl font-bold neon-text animate-neon-pulse font-orbitron">INITIALIZE NARRATIVE</h2>
								<Zap className="text-neon-cyan ml-2 animate-neon-pulse" size={24} />
							</div>
							<p className="text-neon-cyan cyber-text font-rajdhani">
								Input narrative parameters to generate cybernetic story matrix
							</p>
						</motion.div>

						<form onSubmit={handleSubmit} className="space-y-6 relative z-10">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6 }}
								className="relative"
							>
								<textarea
									value={prompt}
									onChange={(e) => setPrompt(e.target.value)}
									onFocus={() => setIsFocused(true)}
									onBlur={() => setIsFocused(false)}
									placeholder="Initialize narrative protocol..."
									className={`
                    w-full h-32 px-4 py-3 rounded-lg border-2 transition-all duration-300
                    cyber-input font-rajdhani text-lg leading-relaxed
                    ${isFocused ? 'border-neon-cyan/80 shadow-neon-cyan' : 'border-neon-cyan/40'}
                  `}
									disabled={isGenerating}
								/>

								{/* Enhanced decorative corners */}
								<div
									className="absolute top-1 left-1 w-4 h-4 border-l-2 border-t-2
                              border-neon-cyan/60 pointer-events-none animate-cyber-float"
								/>
								<div
									className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2
                              border-neon-cyan/60 pointer-events-none animate-cyber-float"
									style={{ animationDelay: '0.5s' }}
								/>

								{/* Enhanced data stream effect */}
								{isFocused && (
									<div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden rounded-lg">
										{Array.from({ length: 6 }).map((_, i) => (
											<motion.div
												key={i}
												className="absolute w-px h-full bg-gradient-to-b from-transparent via-neon-cyan to-transparent"
												style={{ left: `${15 + i * 15}%` }}
												animate={{
													y: ['-100%', '100%'],
												}}
												transition={{
													duration: 1.5,
													repeat: Infinity,
													delay: i * 0.2,
													ease: "linear"
												}}
											/>
										))}
									</div>
								)}

								{/* Scanline effect when focused */}
								{isFocused && (
									<div className="absolute inset-0 scanlines opacity-20 pointer-events-none rounded-lg" />
								)}
							</motion.div>

							{/* Enhanced suggestions */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.8 }}
								className="space-y-3"
							>
								<div className="flex items-center space-x-2">
									<div className="w-2 h-2 bg-matrix-green rounded-full animate-neon-pulse" />
									<p className="text-neon-cyan text-sm cyber-text font-rajdhani font-medium">Neural templates available:</p>
								</div>
								<div className="flex flex-wrap gap-2">
									{suggestions.map((suggestion, index) => (
										<motion.button
											key={index}
											type="button"
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.9 + index * 0.1 }}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={() => setPrompt(suggestion)}
											className="px-3 py-1 text-xs hologram border border-neon-cyan/40
                               rounded-full text-neon-cyan hover:border-neon-cyan/80
                               hover:shadow-neon-cyan transition-all duration-200
                               data-stream font-rajdhani"
											disabled={isGenerating}
										>
											{suggestion}
										</motion.button>
									))}
								</div>
							</motion.div>

							{/* Enhanced submit button */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1 }}
								className="flex justify-center"
							>
								<motion.button
									type="submit"
									disabled={!prompt.trim() || isGenerating}
									whileHover={{ scale: prompt.trim() && !isGenerating ? 1.05 : 1 }}
									whileTap={{ scale: prompt.trim() && !isGenerating ? 0.95 : 1 }}
									className={`
                    cyber-button flex items-center space-x-2 px-8 py-3 rounded-lg
                    font-rajdhani font-semibold text-lg relative overflow-hidden
                    ${
											prompt.trim() && !isGenerating
												? 'bg-cyber-gradient border-neon-cyan text-white hover:shadow-cyber-glow animate-circuit-pulse'
												: 'glass-surface border-gray-600/50 text-gray-400 cursor-not-allowed opacity-50'
										}
                  `}
								>
									{isGenerating ? (
										<>
											<div className="cyber-spinner w-4 h-4" />
											<span>PROCESSING...</span>
										</>
									) : (
										<>
											<Send size={18} className="animate-cyber-float" />
											<span>EXECUTE PROTOCOL</span>
										</>
									)}
								</motion.button>
							</motion.div>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
