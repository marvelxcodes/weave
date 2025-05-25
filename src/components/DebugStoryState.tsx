'use client';

import { useStory } from '@/hooks/useStory';
import { useState, useEffect } from 'react';

export const DebugStoryState: React.FC = () => {
  const storyState = useStory();
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    setLastUpdate(new Date().toLocaleTimeString());
  }, [storyState.currentSegment, storyState.isGenerating, storyState.error]);

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-green-400 p-4 rounded-lg border border-green-500 max-w-md text-xs font-mono z-50">
      <h3 className="text-green-300 font-bold mb-2">Debug: Story State</h3>
      <div className="space-y-1">
        <div>Last Update: {lastUpdate}</div>
        <div>Current Segment: {storyState.currentSegment ? 'Yes' : 'No'}</div>
        <div>Segment ID: {storyState.currentSegment?.id || 'None'}</div>
        <div>Choices Count: {storyState.currentSegment?.choices?.length || 0}</div>
        <div>Is Generating: {storyState.isGenerating ? 'Yes' : 'No'}</div>
        <div>Error: {storyState.error || 'None'}</div>
        <div>History Length: {storyState.history.length}</div>
        <div>Can Go Back: {storyState.canGoBack ? 'Yes' : 'No'}</div>
      </div>
      
      {storyState.currentSegment?.choices && (
        <div className="mt-2">
          <div className="text-green-300 font-bold">Choices:</div>
          {storyState.currentSegment.choices.map((choice, index) => (
            <div key={choice.id} className="ml-2">
              {index === 0 ? 'A' : 'B'}: {choice.text.substring(0, 30)}...
            </div>
          ))}
        </div>
      )}

      {storyState.currentSegment && (
        <div className="mt-2">
          <div className="text-green-300 font-bold">Segment Details:</div>
          <div className="ml-2 text-xs">
            <div>Full ID: {storyState.currentSegment.id}</div>
            <div>Generated: {storyState.currentSegment.isGenerated ? 'Yes' : 'No'}</div>
            <div>Timestamp: {storyState.currentSegment.timestamp ? new Date(storyState.currentSegment.timestamp).toLocaleTimeString() : 'None'}</div>
          </div>
        </div>
      )}
    </div>
  );
}; 