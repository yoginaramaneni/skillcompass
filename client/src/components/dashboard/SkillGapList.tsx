import React from 'react';
import { Card } from '../ui/Card';
import { SkillGap } from '../../types/ai';
import { SkillGapCard } from './SkillGapCard';
import { Target } from 'lucide-react';

interface SkillGapListProps {
  gaps: SkillGap[];
}

export const SkillGapList: React.FC<SkillGapListProps> = ({ gaps }) => {
  return (
    <Card className="bg-white border border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-neutral-900" />
          <h3 className="text-base font-bold text-neutral-900">Target Career Skill Gaps</h3>
        </div>
        <span className="text-xs text-neutral-500 font-mono">{gaps.length} Skill Gaps Identified</span>
      </div>

      {gaps.length === 0 ? (
        <p className="text-xs text-neutral-500 py-4 text-center">
          Great job! No major skill gaps identified between your demonstrated skills and target role requirements.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gaps.map((gap, idx) => (
            <SkillGapCard key={idx} gap={gap} />
          ))}
        </div>
      )}
    </Card>
  );
};
