import React from 'react';
import { SkillGap } from '../../types/ai';

interface SkillGapCardProps {
  gap: SkillGap;
}

export const SkillGapCard: React.FC<SkillGapCardProps> = ({ gap }) => {
  const getImportanceBadge = (importance: string) => {
    switch (importance.toLowerCase()) {
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

  const formatLevel = (lvl: number) => {
    switch (lvl) {
      case 0:
        return '0 — None';
      case 1:
        return '1 — Beginner';
      case 2:
        return '2 — Elementary';
      case 3:
        return '3 — Intermediate';
      case 4:
        return '4 — Advanced';
      case 5:
        return '5 — Expert';
      default:
        return `${lvl}`;
    }
  };

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-neutral-900 text-sm">{gap.skillName}</h4>
          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{gap.explanation}</p>
        </div>
        <span
          aria-label={`Importance: ${gap.importance}`}
          className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded border font-semibold capitalize shrink-0 ${getImportanceBadge(
            gap.importance
          )}`}
        >
          {gap.importance}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-neutral-200 text-center">
        <div className="bg-white p-1.5 rounded border border-neutral-200">
          <span className="text-[10px] text-neutral-400 block font-mono uppercase">Current</span>
          <span className="font-semibold text-neutral-800">{formatLevel(gap.currentLevel)}</span>
        </div>

        <div className="bg-white p-1.5 rounded border border-neutral-200">
          <span className="text-[10px] text-neutral-400 block font-mono uppercase">Required</span>
          <span className="font-semibold text-neutral-900">{formatLevel(gap.requiredLevel)}</span>
        </div>

        <div className="bg-red-50 p-1.5 rounded border border-red-200">
          <span className="text-[10px] text-red-800 block font-mono uppercase">Gap</span>
          <span className="font-extrabold text-red-700">-{gap.gap}</span>
        </div>
      </div>
    </div>
  );
};
