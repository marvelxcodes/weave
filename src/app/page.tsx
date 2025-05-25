import { StoryGame } from '@/components/StoryGame';
import { DebugStoryState } from '@/components/DebugStoryState';

export default function Home() {
  return (
    <>
      <StoryGame />
      <DebugStoryState />
    </>
  );
}
