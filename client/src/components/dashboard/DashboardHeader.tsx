import React from 'react';
import { Target, Award, Calendar, Sparkles, User, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  userFirstName?: string;
  userLastName?: string | null;
  targetCareerName: string;
  skillsCount: number;
  profileCompletionPercent: number;
  lastAnalyzedAt?: string | null;
  isStaleAnalysis?: boolean;
  onAnalyze: () => void;
  loading: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userFirstName,
  userLastName,
  targetCareerName,
  skillsCount,
  profileCompletionPercent,
  lastAnalyzedAt,
  isStaleAnalysis,
  onAnalyze,
  loading,
}) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(d);
    } catch {
      return null;
    }
  };

  const formattedDate = formatDate(lastAnalyzedAt || undefined);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-900 font-bold text-lg shrink-0">
            {userFirstName?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
                Welcome, {userFirstName} {userLastName}!
              </h1>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Here is your current career intelligence summary.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 px-3.5 py-2.5 rounded-xl font-semibold text-neutral-900 transition"
          >
            <User className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>

          <button
            onClick={onAnalyze}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-4 py-2.5 rounded-xl transition disabled:opacity-50 shadow-xs cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{lastAnalyzedAt ? 'Refresh Analysis' : 'Analyze Skills'}</span>
          </button>
        </div>
      </div>

      {/* Profile & Analysis Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Target Career Badge */}
        <div className="bg-white border border-neutral-200 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 bg-neutral-100 text-neutral-800 rounded-lg border border-neutral-200">
            <Target className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider font-mono">Target Career</p>
            <p className="font-bold text-neutral-900 truncate">{targetCareerName}</p>
          </div>
        </div>

        {/* Demonstrated Skills Count */}
        <div className="bg-white border border-neutral-200 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 bg-neutral-100 text-neutral-800 rounded-lg border border-neutral-200">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider font-mono">Current Skills</p>
            <p className="font-bold text-neutral-900">{skillsCount} Demonstrated</p>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-white border border-neutral-200 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider font-mono">Profile Completion</p>
              <span className="font-bold text-emerald-700">{profileCompletionPercent}%</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-1 border border-neutral-200">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${profileCompletionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Last Analyzed Date */}
        <div className="bg-white border border-neutral-200 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 bg-neutral-100 text-neutral-600 rounded-lg border border-neutral-200">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider font-mono">Last Analyzed</p>
            <p className="font-bold text-neutral-900 truncate">{formattedDate || 'Not yet analyzed'}</p>
          </div>
        </div>
      </div>

      {/* Stale Analysis Alert Banner */}
      {isStaleAnalysis && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Your profile changed since your last analysis. Consider running a refresh.</span>
          </div>
          <button
            onClick={onAnalyze}
            disabled={loading}
            className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold px-3 py-1 rounded-lg border border-amber-300 transition shrink-0 ml-2 cursor-pointer"
          >
            Re-Analyze Now
          </button>
        </div>
      )}
    </div>
  );
};
