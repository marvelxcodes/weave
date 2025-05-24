export interface StoryChoice {
  id: string;
  text: string;
  consequence?: string;
}

export interface StorySegment {
  id: string;
  text: string;
  choices: StoryChoice[];
  isGenerated?: boolean;
  timestamp?: number;
}

export interface StoryState {
  currentSegment: StorySegment | null;
  history: StorySegment[];
  isGenerating: boolean;
  error: string | null;
}

export interface GameState {
  story: StoryState;
  ui: {
    showChoices: boolean;
    showHistory: boolean;
    isAnimating: boolean;
  };
  camera: {
    position: [number, number, number];
    target: [number, number, number];
  };
}

export interface GenerateStoryRequest {
  prompt: string;
  previousContext?: string;
  choiceMade?: string;
}

export interface GenerateStoryResponse {
  story: string;
  choices: StoryChoice[];
} 