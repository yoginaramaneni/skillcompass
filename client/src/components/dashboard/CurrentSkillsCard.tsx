import React from 'react';
import { Card } from '../ui/Card';
import { UserSkillItem } from '../../types';
import { Award, Code2, ShieldCheck, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CurrentSkillsCardProps {
  skills: UserSkillItem[];
}

export const CurrentSkillsCard: React.FC<CurrentSkillsCardProps> = ({ skills }) => {
  const getLevelBadgeClass = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'expert':
        return 'bg-neutral-900 text-white border-neutral-900';
      case 'advanced':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      case 'intermediate':
        return 'bg-neutral-100 text-neutral-900 border-neutral-300';
      case 'beginner':
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <Card className="bg-white border border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-neutral-900" />
          <h3 className="text-base font-bold text-neutral-900">Current Skills Inventory</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500 font-mono">{skills.length} Demonstrated</span>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-1.5 text-xs bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-xl transition font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>Assessments</span>
          </Link>
        </div>
      </div>

      {skills.length === 0 ? (
        <p className="text-xs text-neutral-500 py-4 text-center">No demonstrated skills recorded in your profile yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((sk, idx) => (
            <div
              key={idx}
              className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 flex flex-col justify-between space-y-3 hover:border-neutral-300 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Code2 className="w-4 h-4 text-neutral-900 shrink-0" />
                  <span className="font-bold text-neutral-900 text-xs truncate">
                    {sk.skill_name || 'Skill'}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {sk.category || 'General'}
                </span>
              </div>

              {/* Levels comparison grid */}
              <div className="bg-white p-2.5 rounded-lg border border-neutral-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 text-[11px]">Self-reported:</span>
                  <span
                    className={`px-2 py-0.5 rounded border text-[10px] capitalize font-medium ${getLevelBadgeClass(
                      sk.self_reported_level
                    )}`}
                  >
                    {sk.self_reported_level || 'Beginner'}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-100 pt-1.5">
                  <span className="text-neutral-500 text-[11px] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    <span>Verified:</span>
                  </span>
                  {(sk as any).verified_level ? (
                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] capitalize font-semibold ${getLevelBadgeClass(
                        (sk as any).verified_level
                      )}`}
                    >
                      {(sk as any).verified_level}
                    </span>
                  ) : (
                    <span className="text-neutral-400 font-mono text-[10px]">Not assessed</span>
                  )}
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <Link
                  to="/assessments"
                  className="inline-flex items-center gap-1 text-[11px] text-neutral-900 hover:text-neutral-700 font-bold"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Test Skill</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
