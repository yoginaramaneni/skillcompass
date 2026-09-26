import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { careersService } from '../services/careers.service';
import { ArrowRightLeft, CheckCircle2, AlertCircle, Award, Target, Sparkles, Layers } from 'lucide-react';

export const CareerComparisonPage: React.FC = () => {
  const [careersList, setCareersList] = useState<any[]>([]);
  const [firstId, setFirstId] = useState<string>('');
  const [secondId, setSecondId] = useState<string>('');
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [comparing, setComparing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setLoading(true);
        const res = await careersService.getCareers();
        const roles = res.data || [];
        setCareersList(roles);

        if (roles.length >= 2) {
          setFirstId(roles[0].id);
          setSecondId(roles[1].id);
          runComparison(roles[0].id, roles[1].id);
        } else if (roles.length === 1) {
          setFirstId(roles[0].id);
        }
      } catch (err: any) {
        setError('Failed to load career roles for comparison.');
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  const runComparison = async (fId: string, sId: string) => {
    if (!fId || !sId || fId === sId) {
      setError('Please select two distinct career roles to compare.');
      return;
    }

    setComparing(true);
    setError(null);
    try {
      const res = await careersService.compareCareers(fId, sId);
      setComparisonData(res);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to compare selected careers.');
    } finally {
      setComparing(false);
    }
  };

  const handleCompareClick = () => {
    runComparison(firstId, secondId);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-neutral-600">
        <div className="w-8 h-8 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium">Loading career reference roles...</p>
      </div>
    );
  }

  const { firstCareer, secondCareer, comparison } = comparisonData || {};

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <ArrowRightLeft className="w-32 h-32 text-neutral-900" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Role Intelligence Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Career Role Comparison
          </h1>
          <p className="text-neutral-600 text-xs sm:text-sm max-w-2xl">
            Compare skill requirements, importance levels, and your personal skill coverage between two target career paths.
          </p>
        </div>
      </div>

      {/* Selector Controls Bar */}
      <Card className="p-6 border-neutral-200 bg-white shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              First Career Role
            </label>
            <select
              value={firstId}
              onChange={(e) => setFirstId(e.target.value)}
              className="w-full bg-white border border-neutral-200 text-neutral-900 text-xs rounded-xl px-3.5 py-2.5 focus:border-neutral-900 focus:outline-none"
            >
              {careersList.map((c) => (
                <option key={c.id} value={c.id} disabled={c.id === secondId}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center">
            <div className="p-2.5 bg-neutral-100 rounded-full border border-neutral-200 text-neutral-600">
              <ArrowRightLeft className="w-4 h-4 text-neutral-900" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Second Career Role
            </label>
            <select
              value={secondId}
              onChange={(e) => setSecondId(e.target.value)}
              className="w-full bg-white border border-neutral-200 text-neutral-900 text-xs rounded-xl px-3.5 py-2.5 focus:border-neutral-900 focus:outline-none"
            >
              {careersList.map((c) => (
                <option key={c.id} value={c.id} disabled={c.id === firstId}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCompareClick}
            disabled={comparing || firstId === secondId}
            className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {comparing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Comparing Roles...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Compare Skill Requirements</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </Card>

      {/* Comparison Results */}
      {comparisonData && (
        <div className="space-y-6">
          {/* Side-by-Side Role Overview & User Readiness */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Career Role Card */}
            <Card className="border-neutral-200 bg-white relative shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">
                    Role #1 • {firstCareer.category}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 mt-1">{firstCareer.name}</h3>
                </div>
                <div className="p-2 bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-900">
                  <Target className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{firstCareer.description}</p>

              <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Your Demonstrated Skill Readiness:</span>
                  <span className="font-bold font-mono text-neutral-900">
                    {comparison.userCoverageFirst.percentage}% ({comparison.userCoverageFirst.matched}/{comparison.userCoverageFirst.total} skills)
                  </span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden border border-neutral-200">
                  <div
                    className="bg-neutral-900 h-full rounded-full transition-all duration-500"
                    style={{ width: `${comparison.userCoverageFirst.percentage}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Second Career Role Card */}
            <Card className="border-neutral-200 bg-white relative shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">
                    Role #2 • {secondCareer.category}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 mt-1">{secondCareer.name}</h3>
                </div>
                <div className="p-2 bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-900">
                  <Target className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{secondCareer.description}</p>

              <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Your Demonstrated Skill Readiness:</span>
                  <span className="font-bold font-mono text-neutral-900">
                    {comparison.userCoverageSecond.percentage}% ({comparison.userCoverageSecond.matched}/{comparison.userCoverageSecond.total} skills)
                  </span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden border border-neutral-200">
                  <div
                    className="bg-neutral-900 h-full rounded-full transition-all duration-500"
                    style={{ width: `${comparison.userCoverageSecond.percentage}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Shared Required Skills Table */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-neutral-900">
                SHARED REQUIRED SKILLS ({comparison.commonSkills.length})
              </h3>
            </div>
            {comparison.commonSkills.length === 0 ? (
              <p className="text-xs text-neutral-500 py-4 text-center">
                No overlapping core skills required by both roles.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500 font-mono uppercase text-[10px]">
                      <th className="py-2.5 px-3">Skill Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Importance</th>
                      <th className="py-2.5 px-3">Min Level Required</th>
                      <th className="py-2.5 px-3">Your Current Level</th>
                      <th className="py-2.5 px-3">Your Verified Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {comparison.commonSkills.map((sk: any, idx: number) => (
                      <tr key={idx} className="hover:bg-neutral-50 transition">
                        <td className="py-3 px-3 font-semibold text-neutral-900">{sk.skillName}</td>
                        <td className="py-3 px-3 text-neutral-500">{sk.category || 'General'}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              sk.importance === 'critical'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : sk.importance === 'high'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {sk.importance}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-neutral-700 capitalize">
                          {sk.minimumLevel}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`font-semibold capitalize ${
                              sk.isUserProficient ? 'text-emerald-700' : 'text-neutral-500'
                            }`}
                          >
                            {sk.userSelfLevel}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {sk.userVerifiedLevel !== 'unverified' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="capitalize">{sk.userVerifiedLevel}</span>
                            </span>
                          ) : (
                            <span className="text-neutral-400 font-mono text-[10px]">Unverified</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Unique Skill Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exclusive to First Role */}
            <Card>
              <h4 className="text-sm font-bold text-neutral-900 mb-3 flex items-center justify-between">
                <span>EXCLUSIVE TO {firstCareer.name} ({comparison.firstOnlySkills.length})</span>
              </h4>
              <div className="space-y-2.5">
                {comparison.firstOnlySkills.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-3 text-center">No unique requirements.</p>
                ) : (
                  comparison.firstOnlySkills.map((sk: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-neutral-200 rounded-xl flex items-center justify-between text-xs shadow-xs"
                    >
                      <div>
                        <span className="font-semibold text-neutral-900">{sk.skillName}</span>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          Min Req: <span className="capitalize">{sk.minimumLevel}</span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border capitalize ${
                          sk.isUserProficient
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                        }`}
                      >
                        {sk.userSelfLevel !== 'none' ? `Have: ${sk.userSelfLevel}` : 'Gap'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Exclusive to Second Role */}
            <Card>
              <h4 className="text-sm font-bold text-neutral-900 mb-3 flex items-center justify-between">
                <span>EXCLUSIVE TO {secondCareer.name} ({comparison.secondOnlySkills.length})</span>
              </h4>
              <div className="space-y-2.5">
                {comparison.secondOnlySkills.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-3 text-center">No unique requirements.</p>
                ) : (
                  comparison.secondOnlySkills.map((sk: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-neutral-200 rounded-xl flex items-center justify-between text-xs shadow-xs"
                    >
                      <div>
                        <span className="font-semibold text-neutral-900">{sk.skillName}</span>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          Min Req: <span className="capitalize">{sk.minimumLevel}</span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border capitalize ${
                          sk.isUserProficient
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                        }`}
                      >
                        {sk.userSelfLevel !== 'none' ? `Have: ${sk.userSelfLevel}` : 'Gap'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

