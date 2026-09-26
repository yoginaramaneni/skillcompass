import React from 'react';
import { Card } from './Card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'An Error Occurred',
  message,
  onRetry,
}) => {
  return (
    <Card className="border-red-200 bg-red-50/50 p-6 text-center flex flex-col items-center justify-center space-y-3">
      <div className="p-3 bg-red-100 rounded-2xl border border-red-200 text-red-700">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="max-w-md">
        <h3 className="text-base font-bold text-red-950">{title}</h3>
        <p className="text-xs text-red-800 mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </Card>
  );
};
