import React, { useState } from 'react';
import { SkillRecommendation } from '../../types/ai';
import { ArrowUpRight, Info } from 'lucide-react';

interface RecommendedSkillCardProps {
  recommendation: SkillRecommendation;
  index: number;
}

export const RecommendedSkillCard: React.FC<RecommendedSkillCardProps> = ({
  recommendation,
  index,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'high':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'medium':
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      case 'low':
      default:
        return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex flex-col justify-between space-y-3 relative">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
              {index + 1}
            </span>
            <span className="text-[10px] text-neutral-700 bg-neutral-200/60 px-2 py-0.5 rounded border border-neutral-300 font-semibold font-mono">
              {recommendation.category}
            </span>
          </div>
          <span
            className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-semibold capitalize ${getPriorityBadge(
              recommendation.priority
            )}`}
          >
            {recommendation.priority} Priority
          </span>
        </div>

        <h4 className="font-bold text-neutral-900 text-sm pt-1">{recommendation.skillName}</h4>

        <div className="text-xs text-neutral-700 bg-white p-2.5 rounded-lg border border-neutral-200 space-y-1">
          <span className="text-[10px] text-neutral-400 font-mono block uppercase">Why Recommended:</span>
          <p className="leading-relaxed">{recommendation.reason}</p>
        </div>
      </div>

      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
        <span className="text-neutral-500">
          Target: <strong className="text-neutral-900">Level {recommendation.targetLevel}</strong>
        </span>

        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="inline-flex items-center gap-1 text-[11px] text-neutral-900 hover:text-black font-semibold bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-lg border border-neutral-200 transition cursor-pointer"
        >
          <span>View Skill</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>

        {showTooltip && (
          <div className="absolute bottom-12 right-4 bg-neutral-900 border border-neutral-800 text-white text-[11px] p-3 rounded-xl shadow-xl max-w-xs z-10 flex items-start gap-2">
            <Info className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Skill Deep-Dive</p>
              <p className="text-[10px] text-neutral-300 mt-0.5">
                Detailed skill breakdown & verified assessments for {recommendation.skillName}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
