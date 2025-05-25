'use client';

import { useState, useEffect } from 'react';

interface StoryIdTrackerProps {
  componentName: string;
  storyId?: string | number | null;
  onStoryIdChange?: (storyId: string | number | null) => void;
}

export const StoryIdTracker: React.FC<StoryIdTrackerProps> = ({ 
  componentName, 
  storyId, 
  onStoryIdChange 
}) => {
  const [lastStoryId, setLastStoryId] = useState<string | number | null>(null);
  const [changeCount, setChangeCount] = useState(0);

  useEffect(() => {
    if (storyId !== lastStoryId) {
      console.log(`StoryIdTracker [${componentName}]: Story ID changed from ${lastStoryId} to ${storyId}`);
      setLastStoryId(storyId);
      setChangeCount(prev => prev + 1);
      onStoryIdChange?.(storyId);
    }
  }, [storyId, lastStoryId, componentName, onStoryIdChange]);

  return (
    <div className="fixed top-4 right-4 bg-blue-900/90 text-blue-200 p-3 rounded-lg border border-blue-500 text-xs font-mono z-50">
      <h4 className="text-blue-100 font-bold mb-1">Story ID Tracker</h4>
      <div className="space-y-1">
        <div>Component: {componentName}</div>
        <div>Current ID: {storyId?.toString() || 'null'}</div>
        <div>Type: {typeof storyId}</div>
        <div>Changes: {changeCount}</div>
        <div>Last ID: {lastStoryId?.toString() || 'null'}</div>
      </div>
    </div>
  );
}; 