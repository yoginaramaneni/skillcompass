import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2 } from 'lucide-react';

interface NextStepsProps {
  steps: string[];
}

export const NextSteps: React.FC<NextStepsProps> = ({ steps }) => {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        <h3 className="text-base font-bold text-neutral-900">Actionable Next Steps</h3>
      </div>

      {steps.length === 0 ? (
        <p className="text-xs text-neutral-500 py-4 text-center">No immediate next steps returned.</p>
      ) : (
        <ul className="space-y-3">
          {steps.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-xs text-neutral-800 bg-neutral-50 border border-neutral-200 p-3.5 rounded-xl hover:border-neutral-300 transition"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

