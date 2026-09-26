import React from 'react';
import { Card } from '../ui/Card';
import { BrainCircuit, Sparkles, User, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyAnalysisStateProps {
  isProfileComplete: boolean;
  onAnalyze: () => void;
  loading: boolean;
}

export const EmptyAnalysisState: React.FC<EmptyAnalysisStateProps> = ({
  isProfileComplete,
  onAnalyze,
  loading,
}) => {
  if (!isProfileComplete) {
    return (
      <Card className="border-dashed border-neutral-300 bg-neutral-50/50 p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
            <User className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900">Complete your profile first</h3>
          <p className="text-xs text-neutral-600 max-w-md leading-relaxed">
            SkillCompass needs your target career role and at least 1 demonstrated skill before running Gemini AI skill intelligence.
          </p>
          <div className="pt-2">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition shadow-xs"
            >
              <span>Complete Profile in Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-dashed border-neutral-300 bg-neutral-50/50 p-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="p-3 bg-neutral-100 text-neutral-900 rounded-full border border-neutral-200">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">Your Skill Intelligence report isn't ready yet</h3>
        <p className="text-xs text-neutral-600 max-w-md leading-relaxed">
          Run your first AI analysis to compare your current demonstrated skills against target career role benchmarks using Gemini AI.
        </p>
        <div className="pt-2">
          <button
            onClick={onAnalyze}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing your profile...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze My Skills</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Card>
  );
};

