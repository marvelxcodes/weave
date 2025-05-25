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

// New types to match external API format
export interface ExternalChapter {
  chapter_num: number;
  content: string;
  choices: string[];
}

export interface ExternalStoryResponse {
  story_id: string;
  title: string;
  genre: string;
  chapters: ExternalChapter[];
  current_chapter: number;
}

export interface ExternalContinueResponse {
  chapter_num: number;
  content: string;
  choices: string[];
}

// Helper function to convert external API response to internal format
export const convertExternalToSegment = (chapter: ExternalChapter, storyId?: string | number): StorySegment => {
  return {
    id: `${storyId || 'story'}-chapter-${chapter.chapter_num}`,
    text: chapter.content,
    choices: chapter.choices.map((choice, index) => ({
      id: `choice-${index}`,
      text: choice
    })),
    isGenerated: true,
    timestamp: Date.now()
  };
};

// Helper function to convert external story response to segments
export const convertExternalStoryToSegments = (story: ExternalStoryResponse): StorySegment[] => {
  return story.chapters.map(chapter => convertExternalToSegment(chapter, story.story_id));
}; 