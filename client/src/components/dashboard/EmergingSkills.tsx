import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { EmergingSkill } from '../../types/ai';
import { EmergingSkillCard } from './EmergingSkillCard';
import { Sparkles, TrendingUp } from 'lucide-react';

interface EmergingSkillsProps {
  skills: EmergingSkill[];
}

export const EmergingSkills: React.FC<EmergingSkillsProps> = ({ skills }) => {
  return (
    <Card className="bg-white border border-neutral-200">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-neutral-900" />
          <h3 className="text-base font-bold text-neutral-900">EMERGING SKILLS — Industry Focus</h3>
        </div>
        <Link
          to="/market-trends"
          className="flex items-center gap-1.5 text-xs text-neutral-900 hover:text-black font-semibold transition"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Market Signals →</span>
        </Link>
      </div>

      {skills.length === 0 ? (
        <p className="text-xs text-neutral-500 py-4 text-center">No specific emerging skills identified at this time.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((sk, idx) => (
            <EmergingSkillCard key={idx} skill={sk} />
          ))}
        </div>
      )}
    </Card>
  );
};
