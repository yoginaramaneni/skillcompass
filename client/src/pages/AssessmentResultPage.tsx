import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { getAssessmentDetails } from '../services/assessment.service';
import { AssessmentDetails } from '../types/assessment';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, XCircle, ArrowLeft, RefreshCw, Award, Info, Loader2 } from 'lucide-react';

export const AssessmentResultPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const [details, setDetails] = useState<AssessmentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!assessmentId) return;

    // Check if result data exists in sessionStorage
    const rawResult = sessionStorage.getItem(`res_${assessmentId}`);

    getAssessmentDetails(assessmentId)
      .then((data) => {
        setDetails(data);
      })
      .catch((err) => {
        console.error('Error fetching assessment details:', err);
        // Fallback to local session result
        if (rawResult) {
          try {
            const parsed = JSON.parse(rawResult);
            setDetails({
              assessmentId,
              skill: parsed.skill,
              status: 'completed',
              score: parsed.score,
              verifiedLevel: parsed.verifiedLevel,
              verifiedLevelName: parsed.verifiedLevelName,
              questions: [],
            });
          } catch {}
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-neutral-900 animate-spin mx-auto" />
        <p className="text-xs text-neutral-500">Loading assessment evaluation results...</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="max-w-md mx-auto py-12">
        <Card className="text-center p-8 border-neutral-200 bg-white">
          <h2 className="text-lg font-bold text-neutral-900">Assessment Result Not Found</h2>
          <p className="text-xs text-neutral-600 mt-1 mb-4">Could not locate the evaluation for this assessment.</p>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Assessments</span>
          </Link>
        </Card>
      </div>
    );
  }

  const getLevelBadge = (levelName: string) => {
    switch (levelName.toLowerCase()) {
      case 'expert':
        return <span className="text-white font-bold uppercase font-mono text-xs bg-neutral-900 px-2.5 py-1 rounded border border-neutral-900">Level 5 — Expert</span>;
      case 'advanced':
        return <span className="text-emerald-700 font-bold uppercase font-mono text-xs bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">Level 4 — Advanced</span>;
      case 'intermediate':
        return <span className="text-neutral-800 font-bold uppercase font-mono text-xs bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200">Level 3 — Intermediate</span>;
      case 'elementary':
        return <span className="text-amber-700 font-bold uppercase font-mono text-xs bg-amber-50 px-2.5 py-1 rounded border border-amber-200">Level 2 — Elementary</span>;
      case 'beginner':
      default:
        return <span className="text-neutral-600 font-bold uppercase font-mono text-xs bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200">Level 1 — Beginner</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Result Hero Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-neutral-900">{details.skill} Assessment Complete</h1>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                Your performance has been evaluated by the backend assessment scoring engine.
              </p>
            </div>
          </div>

          <Link
            to="/assessments"
            className="inline-flex items-center gap-1.5 text-xs bg-white hover:bg-neutral-50 border border-neutral-200 px-4 py-2.5 rounded-xl text-neutral-800 transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Assessments</span>
          </Link>
        </div>
      </div>

      {/* KPI Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score Card */}
        <Card className="flex items-center gap-4 bg-white border-neutral-200">
          <div className="p-3 bg-neutral-100 text-neutral-900 rounded-xl border border-neutral-200">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 font-mono uppercase">Assessment Score</p>
            <h3 className="text-3xl font-extrabold text-neutral-900 mt-0.5">{details.score}%</h3>
          </div>
        </Card>

        {/* Verified Level Card */}
        <Card className="flex items-center gap-4 bg-white border-neutral-200">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-500 font-mono uppercase">Verified Skill Level</p>
            <div className="mt-1">{getLevelBadge(details.verifiedLevelName)}</div>
          </div>
        </Card>

        {/* Dashboard Sync Note */}
        <Card className="flex items-center gap-3 bg-white border-neutral-200">
          <div className="p-3 bg-neutral-100 text-neutral-900 rounded-xl border border-neutral-200 shrink-0">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-neutral-900">Dashboard Synchronized</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              `verified_level` updated in your profile inventory.
            </p>
          </div>
        </Card>
      </div>

      {/* Self-Reported vs Verified Level Comparison Card */}
      <Card className="bg-white border-neutral-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-neutral-900" />
          <h2 className="text-base font-bold text-neutral-900">Level Comparison & Transparency</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl space-y-1">
            <span className="text-[10px] text-neutral-500 font-mono uppercase block">Self-Reported Level</span>
            <p className="text-base font-bold text-neutral-800 capitalize">
              {details.selfReportedLevel || 'Beginner'}
            </p>
            <p className="text-[11px] text-neutral-500">What you stated in your onboarding profile.</p>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-xl space-y-1">
            <span className="text-[10px] text-emerald-800 font-mono uppercase block">SkillCompass Verified Level</span>
            <p className="text-base font-bold text-emerald-900 capitalize">
              {details.verifiedLevelName} (Level {details.verifiedLevel})
            </p>
            <p className="text-[11px] text-neutral-600">Verified through SkillCompass assessment performance.</p>
          </div>
        </div>

        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Verified skill levels represent demonstrated performance within SkillCompass's assessment system. They serve as objective evidence alongside your self-reported background and are not a formal professional certification.
          </p>
        </div>
      </Card>

      {/* Question Breakdown & Review */}
      {details.questions && details.questions.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-neutral-900">Detailed Question Review</h2>
            <span className="text-xs text-neutral-500 font-mono">{details.questions.length} Questions Evaluated</span>
          </div>

          <div className="space-y-4">
            {details.questions.map((q, idx) => (
              <div
                key={idx}
                className={`bg-white border rounded-xl p-4 space-y-3 ${
                  q.isCorrect ? 'border-emerald-200 bg-emerald-50/10' : 'border-rose-200 bg-rose-50/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs font-mono font-bold text-neutral-400 pt-0.5">#{idx + 1}</span>
                    <h3 className="font-semibold text-neutral-900 text-xs sm:text-sm leading-relaxed">
                      {q.questionText}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] uppercase font-mono px-2.5 py-0.5 rounded border shrink-0 ${
                      q.isCorrect
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {q.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 font-mono uppercase block">Your Submitted Answer:</span>
                    <span className={q.isCorrect ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium'}>
                      {q.userAnswer || 'No answer submitted'}
                    </span>
                  </div>

                  <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 font-mono uppercase block">Correct Answer:</span>
                    <span className="text-neutral-900 font-medium">{q.correctAnswer}</span>
                  </div>
                </div>

                {q.explanation && (
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-xs text-neutral-700 space-y-0.5">
                    <span className="text-[10px] font-mono text-neutral-900 uppercase font-semibold">Explanation:</span>
                    <p className="leading-relaxed text-neutral-600">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Footer Navigation Button */}
      <div className="pt-2 flex justify-center">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-xs transition"
        >
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

