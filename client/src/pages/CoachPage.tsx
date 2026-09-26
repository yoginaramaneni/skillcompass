import React from 'react';
import { Card } from '../components/ui/Card';
import { Bot } from 'lucide-react';

export const CoachPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bot className="w-8 h-8 text-neutral-900" />
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">AI Career Coach</h1>
          <p className="text-sm text-neutral-600">Contextual guidance and personalized feedback</p>
        </div>
      </div>
      <Card className="border-dashed border-neutral-300 bg-white text-center py-12 text-neutral-600">
        <p className="text-base font-medium text-neutral-800">AI Career Coach Foundation Mounted</p>
        <p className="text-xs mt-1 text-neutral-500">Gemini-driven career coach interface will be activated in later steps.</p>
      </Card>
    </div>
  );
};

