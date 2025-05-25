'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Scene3D } from './Scene3D';
import { StoryDisplay } from './StoryDisplay';
import { ChoiceSelector } from './ChoiceSelector';
import { ControlPanel } from './ControlPanel';
import { StoryPrompt } from './StoryPrompt';
import { CyberBackground } from './CyberBackground';
import { useStory } from '@/hooks/useStory';
import { StoryChoice } from '@/types/story';

export const StoryGame: React.FC = () => {
	const { data: session } = useSession();
	const [showPrompt, setShowPrompt] = useState(false);
	const [bookOpen, setBookOpen] = useState(false);
	const [showHistory, setShowHistory] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	const { currentSegment, history, isGenerating, error, makeChoice, startNewStory, goBack, canGoBack } = useStory();

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	const handleBookClick = () => {
		if (!session) {
			// Redirect to sign in if not authenticated
			window.location.href = '/auth/signin';
			return;
		}

		if (!currentSegment && !isGenerating) {
			setShowPrompt(true);
		}
		setBookOpen(!bookOpen);
	};

	const handleStartNewStory = () => {
		setShowPrompt(true);
		setBookOpen(true);
	};

	const handlePromptSubmit = async (prompt: string, genre?: string) => {
		setShowPrompt(false);
		setBookOpen(true);
		await startNewStory(prompt, genre);
	};

	const handleChoiceSelect = async (choice: StoryChoice) => {
		await makeChoice(choice);
	};

	const handleGoBack = () => {
		goBack();
	};

	const handleShowHistory = () => {
		setShowHistory(!showHistory);
	};

	const handlePromptClose = () => {
		setShowPrompt(false);
		setBookOpen(false);
	};

	const showChoices = currentSegment && !isGenerating && currentSegment.choices.length > 0;

	return (
		<div className="relative w-full h-screen overflow-hidden scanlines">
			{/* Enhanced cyberpunk background */}
			<CyberBackground />

			{/* Animated background particles */}
			<div className="absolute inset-0 pointer-events-none z-1">
				{[...Array(20)].map((_, i) => {
					// Use deterministic values based on index to avoid hydration mismatch
					const leftPos = ((i * 43) % 100);
					const animationDelay = ((i * 17) % 30) / 10;
					const animationDuration = 3 + ((i * 13) % 20) / 10;
					
					return (
						<div
							key={i}
							className="absolute w-1 h-1 bg-neon-cyan rounded-full opacity-30 animate-matrix-rain"
							style={{
								left: `${leftPos}%`,
								animationDelay: `${animationDelay}s`,
								animationDuration: `${animationDuration}s`,
							}}
						/>
					);
				})}
			</div>

			{/* Circuit pattern overlay */}
			<div className="absolute inset-0 circuit-pattern opacity-10 pointer-events-none z-1" />

			{/* Navigation Header */}
			<div className={`absolute top-4 right-4 z-50 flex items-center space-x-4 ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`}>
				<Link
					href="/stories"
					className="cyber-button rounded-lg transition-all duration-300 hover:animate-cyber-float"
				>
					<span className="data-stream">DATA ARCHIVES</span>
				</Link>

				{session ? (
					<div className="flex items-center space-x-3 animate-fade-in-up">
						<div className="glass-surface px-4 py-2 rounded-lg border border-neon-cyan/30">
							<span className="cyber-text animate-neon-pulse">CONNECTED: {session.user?.name}</span>
						</div>
						<button
							onClick={() => (window.location.href = '/api/auth/signout')}
							className="px-4 py-2 glass-surface border-2 border-red-500/50
                       rounded-lg text-red-400 hover:text-red-300 hover:border-red-400
                       transition-all duration-300 cyber-text font-medium
                       hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:animate-glitch"
						>
							DISCONNECT
						</button>
					</div>
				) : (
					<div className="flex items-center space-x-2 animate-fade-in-up">
						<Link
							href="/auth/signin"
							className="cyber-button rounded-lg"
						>
							CONNECT
						</Link>
						<Link
							href="/auth/signup"
							className="px-4 py-2 bg-cyber-gradient glass-surface border-2 border-white/50 rounded-lg 
                       text-white hover:text-gray-100 hover:border-white
                       transition-all duration-300 cyber-text font-medium
                       hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:animate-cyber-float"
						>
							INITIALIZE
						</Link>
					</div>
				)}
			</div>

			{/* 3D Scene */}
			<div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
				<Scene3D bookOpen={bookOpen} onBookInteract={handleBookClick} />
			</div>

			{/* UI Overlays */}
			<div className={`transition-all duration-700 ${currentSegment ? 'animate-scale-in' : ''}`}>
				<StoryDisplay segment={currentSegment} isGenerating={isGenerating} />
			</div>

			<div className={`transition-all duration-500 ${showChoices ? 'animate-fade-in-up' : ''}`}>
				<ChoiceSelector
					choices={currentSegment?.choices || []}
					onChoiceSelect={handleChoiceSelect}
					isVisible={!!showChoices}
				/>
			</div>

			<div className={`${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`}>
				<ControlPanel
					onStartNewStory={handleStartNewStory}
					onGoBack={handleGoBack}
					onShowHistory={handleShowHistory}
					canGoBack={canGoBack}
					hasHistory={history.length > 0}
				/>
			</div>

			<StoryPrompt
				onSubmit={handlePromptSubmit}
				onClose={handlePromptClose}
				isVisible={showPrompt}
				isGenerating={isGenerating}
			/>

			{/* Enhanced Error Display */}
			{error && (
				<div className="absolute top-4 left-4 z-50 animate-scale-in">
					<div
						className="glass-surface border-2 border-red-500/50 rounded-lg p-4 max-w-sm
                        shadow-[0_0_20px_rgba(255,0,0,0.3)] hologram-flicker"
					>
						<div className="flex items-center space-x-2">
							<div className="w-3 h-3 bg-red-500 rounded-full animate-neon-pulse" />
							<p className="text-red-400 cyber-text font-semibold">SYSTEM ERROR</p>
						</div>
						<p className="text-red-300 cyber-text mt-2">{error}</p>
					</div>
				</div>
			)}

			{/* Enhanced History Modal */}
			{showHistory && history.length > 0 && (
				<div
					className="absolute inset-0 z-40 flex items-center justify-center
                      bg-black/80 backdrop-blur-sm animate-fade-in-up"
				>
					<div
						className="glass-surface neon-border rounded-xl p-6 max-w-4xl max-h-[80vh] 
                        overflow-y-auto m-4 shadow-cyber-glow animate-scale-in hologram"
					>
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold neon-text animate-neon-pulse">MEMORY BANKS</h2>
							<button
								onClick={() => setShowHistory(false)}
								className="text-neon-cyan hover:text-cyan-100 transition-colors text-2xl
                                hover:shadow-neon-cyan rounded-full w-8 h-8 
                                flex items-center justify-center hover:animate-glitch"
							>
								×
							</button>
						</div>

						<div className="space-y-4">
							{history.map((segment, index) => (
								<div 
									key={segment.id} 
									className="hologram rounded-lg p-4 border border-neon-cyan/30
                                    hover:border-neon-cyan/50 transition-all duration-300 
                                    hover:animate-cyber-float data-stream"
									style={{ animationDelay: `${index * 0.1}s` }}
								>
									<div className="flex items-center mb-2">
										<span className="matrix-text font-semibold animate-circuit-pulse">
											SEQUENCE {index + 1}
										</span>
										{segment.timestamp && (
											<span className="text-neon-cyan/60 text-sm ml-auto cyber-text">
												{new Date(segment.timestamp).toLocaleTimeString()}
											</span>
										)}
									</div>
									<p className="text-cyan-100 cyber-text leading-relaxed">{segment.text}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Enhanced Welcome overlay */}
			{!currentSegment && !showPrompt && !isGenerating && (
				<div
					className="absolute inset-0 z-5 flex items-center justify-center
                      bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-sm
                      pointer-events-none"
				>
					<div className={`text-center ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
						<h1 className="text-6xl font-bold neon-text animate-neon-pulse mb-4 font-orbitron">
							WEAVE
						</h1>
						<p className="text-neon-cyan text-xl cyber-text mb-8 animate-cyber-float">
							CYBERNETIC NARRATIVE MATRIX
						</p>
						<div className="text-neon-cyan/80 cyber-text text-lg space-y-2">
							<p className="mb-2 data-stream">► INITIALIZE NEURAL INTERFACE</p>
							<p className="data-stream" style={{ animationDelay: '0.5s' }}>
								► ACCESS DIGITAL CONSCIOUSNESS
							</p>
						</div>
						
						{/* Loading indicator when generating */}
						{isGenerating && (
							<div className="mt-8 flex items-center justify-center space-x-4">
								<div className="cyber-spinner" />
								<span className="cyber-text animate-neon-pulse">PROCESSING NEURAL DATA...</span>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Floating UI elements */}
			<div className="absolute bottom-4 left-4 z-30">
				<div className="glass-surface rounded-lg p-3 border border-neon-cyan/30 animate-cyber-float">
					<div className="flex items-center space-x-2">
						<div className="w-2 h-2 bg-matrix-green rounded-full animate-neon-pulse" />
						<span className="cyber-text text-sm">NEURAL LINK ACTIVE</span>
					</div>
				</div>
			</div>

			{/* Data streams */}
			<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50 animate-data-stream" />
			<div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-white to-transparent opacity-50 animate-data-stream" style={{ animationDelay: '1s' }} />
		</div>
	);
};
