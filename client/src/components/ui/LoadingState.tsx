import React from 'react';
import { Compass } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading Career Intelligence...',
  subtext = 'Fetching benchmark data & user parameters',
}) => {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center bg-white border border-neutral-200 rounded-2xl space-y-3">
      <div className="p-3 bg-neutral-100 rounded-2xl border border-neutral-200 text-neutral-900 animate-pulse">
        <Compass className="w-8 h-8 animate-spin" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-neutral-900">{message}</h3>
        {subtext && <p className="text-xs text-neutral-500 mt-1">{subtext}</p>}
      </div>
    </div>
  );
};
