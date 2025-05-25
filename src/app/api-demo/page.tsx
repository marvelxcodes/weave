import { ExternalApiDemo } from '@/components/ExternalApiDemo';
import { DebugStoryState } from '@/components/DebugStoryState';

export default function ApiDemoPage() {
  return (
    <>
      <ExternalApiDemo />
      <DebugStoryState />
    </>
  );
}

export const metadata = {
  title: 'External API Demo - Weave',
  description: 'Demonstration of external API integration for story generation',
}; 