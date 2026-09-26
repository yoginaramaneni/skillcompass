import React from 'react';
import { Card } from '../ui/Card';
import { SkillRecommendation } from '../../types/ai';
import { RecommendedSkillCard } from './RecommendedSkillCard';
import { TrendingUp } from 'lucide-react';

interface RecommendedSkillsProps {
  recommendations: SkillRecommendation[];
}

export const RecommendedSkills: React.FC<RecommendedSkillsProps> = ({ recommendations }) => {
  return (
    <Card className="bg-white border border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-neutral-900" />
          <h3 className="text-base font-bold text-neutral-900">LEARN NEXT — Recommended Skills</h3>
        </div>
        <span className="text-xs text-neutral-500 font-mono">{recommendations.length} Recommended</span>
      </div>

      {recommendations.length === 0 ? (
        <p className="text-xs text-neutral-500 py-4 text-center">No specific recommendations available at this time.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec, idx) => (
            <RecommendedSkillCard key={idx} index={idx} recommendation={rec} />
          ))}
        </div>
      )}
    </Card>
  );
};
