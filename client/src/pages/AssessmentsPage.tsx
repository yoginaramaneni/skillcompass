import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { getAssessmentSkills, getAssessmentHistory, startAssessment } from '../services/assessment.service';
import { profileService } from '../services/profile.service';
import { AssessmentSkill, AssessmentHistoryItem } from '../types/assessment';
import { StudentProfileData } from '../types';
import { Award, CheckSquare, Play, ShieldCheck, History, ArrowRight, Loader2, Code2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const AssessmentsPage: React.FC = () => {
  const [skills, setSkills] = useState<AssessmentSkill[]>([]);
  const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);
  const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [startingSkillId, setStartingSkillId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [skillsData, historyData, profileRes] = await Promise.all([
          getAssessmentSkills(),
          getAssessmentHistory(),
          profileService.getProfile(),
        ]);
        setSkills(skillsData);
        setHistory(historyData);
        if (profileRes.data) {
          setProfileData(profileRes.data);
        }
      } catch (err) {
        console.error('Failed to load assessment page data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStart = async (skillId: string) => {
    setStartingSkillId(skillId);
    try {
      const res = await startAssessment(skillId);
      // Save questions in sessionStorage for taking assessment
      sessionStorage.setItem(`asm_${res.assessmentId}`, JSON.stringify(res));
      navigate(`/assessments/${res.assessmentId}`);
    } catch (err: any) {
      console.error('Failed to start assessment:', err);
      alert(err.response?.data?.message || 'Failed to start assessment. Please try again.');
    } finally {
      setStartingSkillId(null);
    }
  };

  const getSelfReportedLevel = (skillSlug: string) => {
    const match = profileData?.skills?.find(
      (s) => s.skill_name?.toLowerCase() === skillSlug.toLowerCase() || s.skill_id === skillSlug
    );
    return match?.self_reported_level || null;
  };

  const getVerifiedLevel = (skillSlug: string) => {
    const match = profileData?.skills?.find(
      (s) => s.skill_name?.toLowerCase() === skillSlug.toLowerCase() || s.skill_id === skillSlug
    );
    if (match?.verified_level) return match.verified_level;
    const historyMatch = history.find((h) => h.skillName.toLowerCase() === skillSlug.toLowerCase());
    return historyMatch ? historyMatch.verifiedLevelName : null;
  };

  const getLevelBadge = (levelName?: string | null) => {
    if (!levelName) return <span className="text-neutral-500 font-mono">Not assessed</span>;
    switch (levelName.toLowerCase()) {
      case 'expert':
        return <span className="text-white font-semibold uppercase font-mono text-[10px] bg-neutral-900 px-2 py-0.5 rounded border border-neutral-900">Expert</span>;
      case 'advanced':
        return <span className="text-emerald-700 font-semibold uppercase font-mono text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Advanced</span>;
      case 'intermediate':
        return <span className="text-neutral-800 font-semibold uppercase font-mono text-[10px] bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">Intermediate</span>;
      case 'elementary':
        return <span className="text-amber-700 font-semibold uppercase font-mono text-[10px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Elementary</span>;
      case 'beginner':
      default:
        return <span className="text-neutral-600 font-semibold uppercase font-mono text-[10px] bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">Beginner</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-xl shrink-0">
            <CheckSquare className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Skill Assessment Center</h1>
              <span className="bg-neutral-100 text-neutral-700 border border-neutral-200 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold">
                SkillCompass Verified
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
              Demonstrate your knowledge through educational multiple-choice assessments. SkillCompass computes your <strong className="text-neutral-900">Verified Skill Level</strong> to differentiate between what you say you know and what you've proven.
            </p>
          </div>
        </div>
      </div>

      {/* Available Skills Grid */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-neutral-900" />
            <h2 className="text-base font-bold text-neutral-900">Available Skill Assessments</h2>
          </div>
          <span className="text-xs text-neutral-500 font-mono">{skills.length} Available Tests</span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-neutral-900 animate-spin" />
            <p className="text-xs text-neutral-500">Loading available skill assessments...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((sk) => {
              const selfLvl = getSelfReportedLevel(sk.slug);
              const verLvl = getVerifiedLevel(sk.slug);
              const isStarting = startingSkillId === sk.id;

              return (
                <div
                  key={sk.id}
                  className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col justify-between space-y-4 hover:border-neutral-300 transition shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 font-medium">
                        {sk.category || 'Software Engineering'}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {sk.questionCount} Questions
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Code2 className="w-4 h-4 text-neutral-900 shrink-0" />
                      <h3 className="font-bold text-neutral-900 text-sm">{sk.name}</h3>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                      {sk.description}
                    </p>
                  </div>

                  {/* Level Status Comparison */}
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 text-[11px]">Self-Reported:</span>
                      <span className="font-medium text-neutral-800 capitalize">
                        {selfLvl || 'Not set'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-200 pt-2">
                      <span className="text-neutral-500 text-[11px] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Level:</span>
                      </span>
                      <span>{getLevelBadge(verLvl)}</span>
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={() => handleStart(sk.id)}
                    disabled={isStarting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs py-2.5 rounded-lg transition disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isStarting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Starting Quiz...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Assessment</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Assessment History Section */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-neutral-900" />
          <h2 className="text-base font-bold text-neutral-900">Your Assessment History</h2>
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-neutral-500 py-6 text-center">
            You haven't completed any skill assessments yet. Select a skill above to verify your knowledge!
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-300 transition shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-sm">{item.skillName}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Completed: {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-500 font-mono uppercase block">Score</span>
                    <span className="text-base font-extrabold text-neutral-900">{item.score}%</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-500 font-mono uppercase block">Verified Level</span>
                    <span>{getLevelBadge(item.verifiedLevelName)}</span>
                  </div>

                  <Link
                    to={`/assessments/${item.assessmentId}/result`}
                    className="inline-flex items-center gap-1 text-xs text-neutral-900 hover:text-black font-medium bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200 transition hover:bg-neutral-200"
                  >
                    <span>Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

