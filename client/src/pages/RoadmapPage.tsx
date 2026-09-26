import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { generateRoadmap, getLatestRoadmap, updateRoadmapItemStatus } from '../services/roadmap.service';
import { profileService } from '../services/profile.service';
import { LearningRoadmap, ItemStatusType } from '../types/roadmap';
import { StudentProfileData } from '../types';
import {
  MapPin,
  Sparkles,
  Clock,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RoadmapPage: React.FC = () => {
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoadingInitial(true);
      setError(null);

      try {
        const [profileRes, roadmapData] = await Promise.all([
          profileService.getProfile(),
          getLatestRoadmap(),
        ]);

        if (profileRes.data) {
          setProfileData(profileRes.data);
        }

        if (roadmapData) {
          setRoadmap(roadmapData);
        }
      } catch (err: any) {
        console.error('Error fetching roadmap page data:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    loadData();
  }, []);

  const handleGenerateRoadmap = async () => {
    setGenerating(true);
    setError(null);

    try {
      const data = await generateRoadmap();
      setRoadmap(data);
    } catch (err: any) {
      console.error('Failed to generate roadmap:', err);
      setError(
        err.response?.data?.message ||
          'Failed to generate Learning Roadmap. Please complete your profile with at least 1 demonstrated skill.'
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleStatusChange = async (itemId: string, newStatus: ItemStatusType) => {
    setUpdatingItemId(itemId);
    try {
      const updated = await updateRoadmapItemStatus(itemId, newStatus);
      setRoadmap(updated);
    } catch (err: any) {
      console.error('Failed to update roadmap item status:', err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const toggleTaskCheck = (taskKey: string) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskKey]: !prev[taskKey],
    }));
  };

  const targetRoleName = profileData?.targetCareer?.name || 'Target Role Not Selected';
  const skillsCount = profileData?.skills?.length || 0;
  const isProfileComplete = skillsCount > 0 && profileData?.targetCareer !== null;

  // Compute metrics
  const items = roadmap?.items || [];
  const totalItems = items.length;
  const completedItems = items.filter((it) => it.status === 'completed').length;
  const inProgressItems = items.filter((it) => it.status === 'in_progress').length;
  const completionPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const totalHours = roadmap?.totalEstimatedHours || items.reduce((acc, it) => acc + it.estimatedHours, 0);
  const remainingHours = items
    .filter((it) => it.status !== 'completed' && it.status !== 'skipped')
    .reduce((acc, it) => acc + it.estimatedHours, 0);

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'medium':
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      case 'low':
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const getStatusBadge = (status: ItemStatusType) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in_progress':
        return 'bg-neutral-900 text-white border-neutral-900';
      case 'skipped':
        return 'bg-neutral-100 text-neutral-500 border-neutral-200';
      case 'pending':
      default:
        return 'bg-white text-neutral-700 border-neutral-200';
    }
  };

  if (loadingInitial) {
    return (
      <div className="py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-neutral-900 animate-spin mx-auto" />
        <p className="text-xs text-neutral-500">Loading your personalized learning roadmap...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-xl shrink-0">
            <MapPin className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Personalized Learning Roadmap</h1>
              <span className="bg-neutral-100 text-neutral-700 border border-neutral-200 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold">
                Gemini AI Curriculum
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              Sequenced step-by-step curriculum targeting{' '}
              <strong className="text-neutral-900">{targetRoleName}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateRoadmap}
          disabled={generating}
          className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-xs transition disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Roadmap...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{roadmap ? 'Re-Generate Roadmap with AI' : 'Generate Roadmap with AI'}</span>
            </>
          )}
        </button>
      </div>

      {/* Error Alert Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-rose-800 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          {!isProfileComplete && (
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-1 text-rose-800 underline font-medium hover:text-black shrink-0 ml-2"
            >
              Complete Onboarding <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}

      {/* Active AI Generation Loading Card */}
      {generating && (
        <Card className="border-neutral-200 bg-white p-8 text-center shadow-xs">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-neutral-900 border-t-transparent animate-spin" />
              <MapPin className="w-6 h-6 text-neutral-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Synthesizing Your Custom Learning Path</h3>
              <p className="text-xs text-neutral-600 mt-1 max-w-md">
                Analyzing self-reported skills, verified assessment scores, and target career requirements for{' '}
                <span className="text-neutral-900 font-semibold">{targetRoleName}</span>...
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Roadmap Progress Summary Bar */}
      {roadmap && !generating && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Completion Progress Card */}
          <Card className="md:col-span-2 bg-white border-neutral-200 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Overall Roadmap Progress
                </span>
                <span className="text-xs font-bold text-emerald-700">{completionPercent}% Complete</span>
              </div>

              <div className="w-full bg-neutral-100 rounded-full h-3 p-0.5 border border-neutral-200">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(3, completionPercent)}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
              <span>{completedItems} of {totalItems} modules completed</span>
              <span className="text-neutral-900 font-semibold">{inProgressItems} in progress</span>
            </div>
          </Card>

          {/* Total Effort Estimate Card */}
          <Card className="bg-white border-neutral-200 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Effort Commitment
              </span>
              <Clock className="w-4 h-4 text-neutral-900" />
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-neutral-900">{remainingHours}</span>
                <span className="text-xs text-neutral-500 font-medium">hrs remaining</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">Out of {totalHours} total estimated hours</p>
            </div>

            <div className="mt-3 pt-3 border-t border-neutral-200 text-[11px] text-neutral-500">
              Tailored sequence based on skill gaps.
            </div>
          </Card>
        </div>
      )}

      {/* Sequenced Timeline Steps */}
      {roadmap && !generating && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-neutral-900">Curriculum Timeline & Practice Modules</h2>
            <span className="text-xs text-neutral-500 font-mono">{items.length} Sequenced Steps</span>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => {
              const isUpdating = updatingItemId === item.id || updatingItemId === `item-${item.sequenceNumber}`;

              return (
                <Card
                  key={idx}
                  className={`bg-white border transition-all shadow-xs ${
                    item.status === 'completed'
                      ? 'border-emerald-200 opacity-90'
                      : item.status === 'in_progress'
                      ? 'border-neutral-900'
                      : 'border-neutral-200'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Module Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-900 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          #{item.sequenceNumber}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-neutral-900 text-base">{item.title}</h3>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 font-medium">
                              {item.skillName}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3 text-neutral-400" />
                              <span>{item.estimatedHours} hrs effort</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start sm:self-auto">
                        <span
                          className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded border font-semibold capitalize shrink-0 ${getPriorityBadge(
                            item.priority
                          )}`}
                        >
                          {item.priority} Priority
                        </span>

                        {/* Status Select Control */}
                        <select
                          value={item.status}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleStatusChange(
                              item.id || `item-${item.sequenceNumber}`,
                              e.target.value as ItemStatusType
                            )
                          }
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none transition cursor-pointer ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          <option value="pending" className="bg-white text-neutral-700">
                            Pending
                          </option>
                          <option value="in_progress" className="bg-white text-neutral-900 font-bold">
                            In Progress
                          </option>
                          <option value="completed" className="bg-white text-emerald-700 font-bold">
                            Completed
                          </option>
                          <option value="skipped" className="bg-white text-neutral-500">
                            Skipped
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Why to Learn Rationale */}
                    <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                        Why Learn This Module:
                      </span>
                      <p className="text-xs text-neutral-800 leading-relaxed">{item.whyToLearn}</p>
                    </div>

                    {/* Practice Tasks Checklist */}
                    {item.practiceTasks && item.practiceTasks.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-semibold text-neutral-800 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-neutral-900" />
                          <span>Hands-On Practice Tasks & Projects</span>
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {item.practiceTasks.map((task, tIdx) => {
                            const taskKey = `${item.sequenceNumber}_${tIdx}`;
                            const isChecked = checkedTasks[taskKey] || item.status === 'completed';

                            return (
                              <label
                                key={tIdx}
                                onClick={() => toggleTaskCheck(taskKey)}
                                className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition select-none ${
                                  isChecked
                                    ? 'bg-emerald-50/50 border-emerald-200 text-neutral-700'
                                    : 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {}}
                                  className="mt-0.5 rounded border-neutral-300 text-neutral-900 focus:ring-0 cursor-pointer"
                                />
                                <span className={isChecked ? 'line-through text-neutral-500' : ''}>
                                  {task}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State when no roadmap is ready */}
      {!roadmap && !generating && (
        <Card className="border-dashed border-neutral-300 bg-neutral-50/50 p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-neutral-100 text-neutral-900 rounded-full border border-neutral-200">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">No Learning Roadmap Generated Yet</h3>
            <p className="text-xs text-neutral-600 max-w-md leading-relaxed">
              Click the <strong className="text-neutral-900">"Generate Roadmap with AI"</strong> button above to synthesize a personalized, sequenced curriculum based on your skill gaps and target career requirements.
            </p>
            <div className="pt-2">
              <button
                onClick={handleGenerateRoadmap}
                disabled={generating}
                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Roadmap with AI</span>
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

