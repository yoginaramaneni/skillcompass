import React from 'react';
import { EmergingSkill } from '../../types/ai';
import { Sparkles } from 'lucide-react';

interface EmergingSkillCardProps {
  skill: EmergingSkill;
}

export const EmergingSkillCard: React.FC<EmergingSkillCardProps> = ({ skill }) => {
  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-2 hover:border-neutral-300 transition">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-neutral-900 text-xs">{skill.skillName}</h4>
        <span className="text-[10px] text-neutral-700 bg-neutral-200/60 px-2 py-0.5 rounded border border-neutral-300 font-semibold font-mono">
          {skill.category}
        </span>
      </div>

      <p className="text-xs text-neutral-600 leading-relaxed">{skill.reason}</p>

      {skill.relevance && (
        <div className="pt-2 border-t border-neutral-200 flex items-center gap-1.5 text-[11px] text-neutral-900 font-semibold">
          <Sparkles className="w-3 h-3 shrink-0 text-neutral-700" />
          <span className="truncate">{skill.relevance}</span>
        </div>
      )}
    </div>
  );
};
