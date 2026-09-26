import React from 'react';
import { Card } from '../components/ui/Card';
import { CheckSquare } from 'lucide-react';

export const SkillAssessmentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CheckSquare className="w-8 h-8 text-neutral-900" />
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Skill Assessment</h1>
          <p className="text-sm text-neutral-600">Demonstrate and verify proficiency</p>
        </div>
      </div>
      <Card className="border-dashed border-neutral-300 bg-white text-center py-12 text-neutral-600">
        <p className="text-base font-medium text-neutral-800">Skill Assessment Foundation Mounted</p>
      </Card>
    </div>
  );
};

