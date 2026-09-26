import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profile.service';
import { generateSkillIntelligence, getLatestSkillIntelligence } from '../services/ai.service';
import { getLatestRoadmap } from '../services/roadmap.service';
import { getAssessmentSkills } from '../services/assessment.service';
import { StudentProfileData } from '../types';
import { SkillIntelligenceResponse } from '../types/ai';
import { LearningRoadmap } from '../types/roadmap';

import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { CareerReadinessCard } from '../components/dashboard/CareerReadinessCard';
import { CurrentSkillsCard } from '../components/dashboard/CurrentSkillsCard';
import { SkillGapList } from '../components/dashboard/SkillGapList';
import { RecommendedSkills } from '../components/dashboard/RecommendedSkills';
import { EmergingSkills } from '../components/dashboard/EmergingSkills';
import { NextSteps } from '../components/dashboard/NextSteps';
import { AIAnalysisSummary } from '../components/dashboard/AIAnalysisSummary';
import { EmptyAnalysisState } from '../components/dashboard/EmptyAnalysisState';
import { AlertTriangle, Map, CheckSquare, TrendingUp, UserCheck, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<SkillIntelligenceResponse | null>(null);
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [assessmentSkills, setAssessmentSkills] = useState<any[]>([]);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoadingInitial(true);
      setError(null);

      try {
        const [profileRes, aiData, roadmapData, skillsRes] = await Promise.all([
          profileService.getProfile(),
          getLatestSkillIntelligence().catch(() => null),
          getLatestRoadmap().catch(() => null),
          getAssessmentSkills().catch(() => []),
        ]);

        if (isMounted) {
          if (profileRes.data) setProfileData(profileRes.data);
          if (aiData) setAiAnalysis(aiData);
          if (roadmapData) setRoadmap(roadmapData);
          if (skillsRes) setAssessmentSkills(skillsRes);
        }
      } catch (err: any) {
        console.error('Error initializing dashboard data:', err);
      } finally {
        if (isMounted) {
          setLoadingInitial(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRunAiAnalysis = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const data = await generateSkillIntelligence();
      setAiAnalysis(data);
    } catch (err: any) {
      console.error('AI Analysis failed:', err);
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to generate AI Skill Intelligence. Please ensure your profile is complete.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  if (loadingInitial) {
    return <DashboardSkeleton />;
  }

  const targetRoleName = profileData?.targetCareer?.name || 'Target Role Not Selected';
  const skillsList = profileData?.skills || [];
  const skillsCount = skillsList.length;
  const isProfileComplete =
    skillsCount > 0 &&
    profileData?.targetCareer !== null &&
    profileData?.targetCareer !== undefined;

  // Deterministic Profile Completion Calculation
  const computeProfileCompletion = () => {
    const missing: string[] = [];
    let score = 0;

    if (profileData?.targetCareer) score += 25;
    else missing.push('Target Career Role');

    if (skillsCount > 0) score += 25;
    else missing.push('Demonstrated Skills');

    if (profileData?.profile?.headline) score += 15;
    else missing.push('Headline');

    if (profileData?.profile?.bio) score += 15;
    else missing.push('Bio Statement');

    if (profileData?.profile?.location) score += 10;
    else missing.push('Location');

    if (profileData?.profile?.education_level) score += 10;
    else missing.push('Education Level');

    return {
      percentage: Math.min(100, score),
      missing,
    };
  };

  const { percentage: profileCompletionPercent, missing: missingProfileItems } =
    computeProfileCompletion();

  const completedRoadmapModules =
    roadmap?.items?.filter((i) => i.status === 'completed').length || 0;
  const totalRoadmapModules = roadmap?.items?.length || 0;
  const roadmapProgressPercent =
    totalRoadmapModules > 0
      ? Math.round((completedRoadmapModules / totalRoadmapModules) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner & Status Bar */}
      <DashboardHeader
        userFirstName={user?.firstName}
        userLastName={user?.lastName}
        targetCareerName={targetRoleName}
        skillsCount={skillsCount}
        profileCompletionPercent={profileCompletionPercent}
        lastAnalyzedAt={aiAnalysis?.createdAt || undefined}
        onAnalyze={handleRunAiAnalysis}
        loading={analyzing}
      />

      {/* Incomplete Profile Call To Action Banner */}
      {profileCompletionPercent < 100 && (
        <Card className="border-emerald-200 bg-emerald-50/60 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">
                  Profile Completion: {profileCompletionPercent}%
                </h4>
                <p className="text-xs text-neutral-700 mt-0.5">
                  Missing:{' '}
                  <span className="text-emerald-900 font-medium">
                    {missingProfileItems.join(', ')}
                  </span>
                </p>
              </div>
            </div>
            <Link
              to="/onboarding"
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
            >
              <span>Complete Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      )}

      {/* Error Alert Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-rose-800 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleRunAiAnalysis}
            disabled={analyzing}
            className="bg-white text-rose-800 border border-rose-200 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs transition shrink-0 font-medium cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Current Demonstrated Skills Inventory */}
      <CurrentSkillsCard skills={skillsList} />

      {/* Quick Access Overview Row: Learning Roadmap, Assessments & Market Signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Roadmap Progress */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs">
              <Map className="w-4 h-4 text-neutral-700" />
              <span>LEARNING ROADMAP</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">
              {roadmap ? `${roadmapProgressPercent}% Done` : 'Not Generated'}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mb-4">
            {roadmap
              ? `${roadmap.title} — ${completedRoadmapModules}/${totalRoadmapModules} modules finished.`
              : 'Generate an AI curriculum tailored to your skill gaps.'}
          </p>
          <Link
            to="/roadmap"
            className="text-xs text-neutral-900 hover:text-black font-semibold inline-flex items-center gap-1 hover:underline"
          >
            <span>{roadmap ? 'View Active Roadmap →' : 'Create Roadmap →'}</span>
          </Link>
        </Card>

        {/* Skill Assessments */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs">
              <CheckSquare className="w-4 h-4 text-emerald-700" />
              <span>SKILL ASSESSMENTS</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">
              {assessmentSkills.length} Available
            </span>
          </div>
          <p className="text-xs text-neutral-600 mb-4">
            Verify self-reported knowledge with multiple-choice skill evaluations.
          </p>
          <Link
            to="/assessments"
            className="text-xs text-neutral-900 hover:text-black font-semibold inline-flex items-center gap-1 hover:underline"
          >
            <span>Take Skill Assessment →</span>
          </Link>
        </Card>

        {/* Market Intelligence */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs">
              <TrendingUp className="w-4 h-4 text-neutral-700" />
              <span>MARKET SIGNALS</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">2026-Q3 Data</span>
          </div>
          <p className="text-xs text-neutral-600 mb-4">
            Empirical demand mention frequencies and trends across target career roles.
          </p>
          <Link
            to="/market-trends"
            className="text-xs text-neutral-900 hover:text-black font-semibold inline-flex items-center gap-1 hover:underline"
          >
            <span>Explore Industry Trends →</span>
          </Link>
        </Card>
      </div>

      {/* Active AI Analysis Loading Panel */}
      {analyzing && (
        <Card className="border-neutral-200 bg-white p-8 text-center shadow-xs">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-neutral-900 border-t-transparent animate-spin flex items-center justify-center" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Analyzing Your Skills with Gemini AI</h3>
              <p className="text-xs text-neutral-600 mt-1 max-w-md">
                Comparing demonstrated skills against benchmark requirements for{' '}
                <span className="text-neutral-900 font-semibold">{targetRoleName}</span>...
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State when no analysis present */}
      {!aiAnalysis && !analyzing && (
        <EmptyAnalysisState
          isProfileComplete={isProfileComplete}
          onAnalyze={handleRunAiAnalysis}
          loading={analyzing}
        />
      )}

      {/* Validated AI Intelligence Results */}
      {aiAnalysis && !analyzing && (
        <div className="space-y-6">
          {/* Top Row: Readiness Gauge & Diagnostic Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CareerReadinessCard
              score={aiAnalysis.careerReadiness}
              targetCareerName={targetRoleName}
            />
            <div className="lg:col-span-2">
              <AIAnalysisSummary summary={aiAnalysis.summary} />
            </div>
          </div>

          {/* Skill Gaps Breakdown */}
          <SkillGapList gaps={aiAnalysis.skillGaps} />

          {/* Recommended Next Skills */}
          <RecommendedSkills recommendations={aiAnalysis.recommendedSkills} />

          {/* Bottom Grid: Emerging Skills & Next Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmergingSkills skills={aiAnalysis.emergingSkills} />
            <NextSteps steps={aiAnalysis.nextSteps} />
          </div>
        </div>
      )}
    </div>
  );
};
