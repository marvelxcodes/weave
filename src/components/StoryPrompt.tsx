'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X } from 'lucide-react';

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
		'A mysterious door appears in an ancient library...',
		'You wake up in a world where magic has just returned...',
		'A letter arrives that changes everything...',
		'The last dragon has been spotted in the mountains...',
		'You inherit a peculiar antique shop...',
	];

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					transition={{ duration: 0.5 }}
					className="absolute inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer"
					onClick={handleBackgroundClick}
				>
					<motion.div
						initial={{ y: 50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="bg-gradient-to-br from-amber-900/80 to-amber-800/60 backdrop-blur-md
                     rounded-xl border border-amber-600/50 p-8 max-w-2xl w-full mx-4
                     shadow-2xl relative cursor-default"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Close button */}
						<motion.button
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
							onClick={onClose}
							className="absolute top-4 right-4 p-2 rounded-lg border border-amber-600/40
                         bg-black/20 backdrop-blur-sm text-amber-300 hover:text-amber-100
                         hover:border-amber-500/60 hover:bg-black/40 transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
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
							className="text-center mb-6"
						>
							<div className="flex items-center justify-center mb-4">
								<Sparkles className="text-amber-400 mr-2" size={24} />
								<h2 className="text-2xl font-bold gold-text decorative-text">Begin Your Tale</h2>
								<Sparkles className="text-amber-400 ml-2" size={24} />
							</div>
							<p className="text-amber-200 antique-text">
								Describe the beginning of your story, and watch it come to life
							</p>
						</motion.div>

						<form onSubmit={handleSubmit} className="space-y-6">
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
									placeholder="Once upon a time..."
									className={`
                    w-full h-32 px-4 py-3 rounded-lg border-2 transition-all duration-300
                    bg-black/30 backdrop-blur-sm text-amber-100 placeholder-amber-300/50
                    resize-none antique-text text-lg leading-relaxed
                    ${isFocused ? 'border-amber-400/80 shadow-lg shadow-amber-500/20' : 'border-amber-600/40'}
                  `}
									disabled={isGenerating}
								/>

								{/* Decorative corners */}
								<div
									className="absolute top-1 left-1 w-4 h-4 border-l-2 border-t-2
                              border-amber-500/60 pointer-events-none border-sm"
								/>
								<div
									className="absolute -bottom-0 -right-2 w-4 h-4 border-r-2 border-b-2
                              border-amber-500/60 pointer-events-none rounded-sm"
								/>
							</motion.div>

							{/* Suggestions */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.8 }}
								className="space-y-2"
							>
								<p className="text-amber-300 text-sm decorative-text">Need inspiration? Try one of these:</p>
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
											className="px-3 py-1 text-xs bg-amber-800/40 border border-amber-600/40
                               rounded-full text-amber-200 hover:bg-amber-700/40
                               hover:border-amber-500/60 transition-all duration-200"
											disabled={isGenerating}
										>
											{suggestion}
										</motion.button>
									))}
								</div>
							</motion.div>

							{/* Submit button */}
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
                    flex items-center space-x-2 px-8 py-3 rounded-lg border-2
                    transition-all duration-300 decorative-text font-semibold
                    ${
											prompt.trim() && !isGenerating
												? 'bg-gradient-to-r from-amber-600 to-amber-700 border-amber-500 text-white hover:shadow-lg hover:shadow-amber-500/30'
												: 'bg-gray-700/50 border-gray-600/50 text-gray-400 cursor-not-allowed'
										}
                  `}
								>
									{isGenerating ? (
										<>
											<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											<span>Weaving...</span>
										</>
									) : (
										<>
											<Send size={18} />
											<span>Begin Story</span>
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
