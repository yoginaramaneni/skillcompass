import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { submitAssessment } from '../services/assessment.service';
import { AssessmentStartResponse, AssessmentAnswer } from '../types/assessment';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Loader2, HelpCircle } from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();

  const [assessmentData, setAssessmentData] = useState<AssessmentStartResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assessmentId) {
      navigate('/assessments');
      return;
    }

    // Try loading session data stored on start
    const raw = sessionStorage.getItem(`asm_${assessmentId}`);
    if (raw) {
      try {
        const parsed: AssessmentStartResponse = JSON.parse(raw);
        setAssessmentData(parsed);
      } catch (e) {
        console.error('Error parsing assessment session:', e);
      }
    } else {
      setError('Assessment session not found. Please start a new assessment.');
    }
  }, [assessmentId, navigate]);

  if (error || !assessmentData) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <Card className="text-center p-8 border-rose-200 bg-white shadow-xs">
          <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-neutral-900">Assessment Session Missing</h2>
          <p className="text-xs text-neutral-600 mt-1 mb-4">{error || 'Unable to retrieve quiz questions.'}</p>
          <button
            onClick={() => navigate('/assessments')}
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition shadow-xs cursor-pointer"
          >
            Back to Assessments List
          </button>
        </Card>
      </div>
    );
  }

  const questions = assessmentData.questions;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!assessmentId) return;
    setSubmitting(true);
    setError(null);

    const answersPayload: AssessmentAnswer[] = Object.entries(selectedAnswers).map(
      ([qId, ans]) => ({
        questionId: qId,
        selectedAnswer: ans,
      })
    );

    try {
      const result = await submitAssessment(assessmentId, answersPayload);
      // Store result data in sessionStorage for result view
      sessionStorage.setItem(`res_${assessmentId}`, JSON.stringify(result));
      navigate(`/assessments/${assessmentId}/result`);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setError(err.response?.data?.message || 'Failed to submit assessment answers. Please try again.');
      setShowConfirmModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Info Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-100 text-neutral-900 rounded-lg border border-neutral-200">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-neutral-900 text-base">
              {assessmentData.skill.name} Assessment
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-neutral-500 font-mono uppercase block">Answered</span>
          <span className="text-xs font-bold text-neutral-900">
            {answeredCount} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-100 rounded-full h-2.5 p-0.5 border border-neutral-200">
        <div
          className="bg-neutral-900 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
            Question #{currentIndex + 1}
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200 capitalize">
            {currentQuestion.difficulty} Difficulty
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 leading-snug">
          {currentQuestion.questionText}
        </h3>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQuestion.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isSelected = selectedAnswers[currentQuestion.id] === opt;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs'
                    : 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-white text-neutral-900'
                        : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </div>

                {isSelected && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 text-xs bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 px-4 py-2.5 rounded-xl transition disabled:opacity-40 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {currentIndex === totalQuestions - 1 ? (
          <button
            onClick={() => setShowConfirmModal(true)}
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Assessment</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6 space-y-4 border-neutral-200 bg-white shadow-xl">
            <div className="flex items-center gap-3 text-amber-700">
              <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600" />
              <h3 className="text-base font-bold text-neutral-900">Submit Assessment?</h3>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Once submitted, your answers will be evaluated by SkillCompass to determine your verified skill level. You cannot modify your answers after submission.
            </p>

            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-xs text-neutral-600 space-y-1">
              <div className="flex justify-between">
                <span>Questions Answered:</span>
                <span className="font-bold text-neutral-900">{answeredCount} of {totalQuestions}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
                className="text-xs text-neutral-600 hover:text-neutral-900 px-4 py-2 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs px-5 py-2 rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scoring Answers...</span>
                  </>
                ) : (
                  <span>Confirm & Submit</span>
                )}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

