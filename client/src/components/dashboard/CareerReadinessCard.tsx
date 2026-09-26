import React from 'react';
import { Card } from '../ui/Card';
import { Target, Zap } from 'lucide-react';

interface CareerReadinessCardProps {
  score: number;
  targetCareerName: string;
}

export const CareerReadinessCard: React.FC<CareerReadinessCardProps> = ({
  score,
  targetCareerName,
}) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="bg-white border border-neutral-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider font-mono">
            Career Readiness
          </span>
          <Zap className="w-4 h-4 text-neutral-900" />
        </div>

        <div className="mt-4 flex items-center gap-6">
          {/* Circular SVG Gauge */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
              <circle
                cx="45"
                cy="45"
                r={radius}
                className="text-neutral-100 stroke-current"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="45"
                cy="45"
                r={radius}
                stroke="#111111"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-neutral-900">{score}</span>
              <span className="text-[9px] text-neutral-400 uppercase font-mono">/ 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-neutral-500 font-medium">Readiness Index</p>
            <div className="flex items-center gap-1.5 text-xs text-neutral-900">
              <Target className="w-3.5 h-3.5 text-neutral-700" />
              <span className="font-bold text-neutral-900">{targetCareerName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-neutral-100">
        <p className="text-[11px] text-neutral-500 leading-normal">
          Calculated based on demonstrated skills vs required benchmark levels for {targetCareerName}.
        </p>
      </div>
    </Card>
  );
};
