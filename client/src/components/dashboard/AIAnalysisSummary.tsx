import React from 'react';
import { Card } from '../ui/Card';
import { BrainCircuit, Sparkles } from 'lucide-react';

interface AIAnalysisSummaryProps {
  summary: string;
}

export const AIAnalysisSummary: React.FC<AIAnalysisSummaryProps> = ({ summary }) => {
  return (
    <Card className="bg-white border border-neutral-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit className="w-5 h-5 text-neutral-900" />
          <h3 className="text-base font-bold text-neutral-900">Why These Recommendations? — Diagnostic Summary</h3>
        </div>

        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-800 leading-relaxed italic">
              "{summary}"
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] text-neutral-500">
        Synthesized by Google Gemini 3.8 Flash intelligence engine using precomputed target role requirement benchmarks.
      </div>
    </Card>
  );
};
