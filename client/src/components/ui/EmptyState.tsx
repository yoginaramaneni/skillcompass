import React from 'react';
import { Card } from './Card';
import { LucideIcon, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionLink?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <Card className="border-dashed border-neutral-300 bg-white p-8 text-center flex flex-col items-center justify-center space-y-3">
      <div className="p-3 bg-neutral-100 rounded-2xl border border-neutral-200 text-neutral-700">
        <Icon className="w-6 h-6" />
      </div>
      <div className="max-w-md">
        <h3 className="text-base font-bold text-neutral-900">{title}</h3>
        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </Card>
  );
};
