import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { getAllMarketSkills, getPersonalizedMarketView } from '../services/market.service';
import { MarketSkillSignal, PersonalizedMarketResponse } from '../types/market';
import { MarketSignalCard } from '../components/market/MarketSignalCard';
import {
  TrendingUp,
  Database,
  Info,
  Loader2,
  Target,
  Search,
  ExternalLink,
  X,
} from 'lucide-react';

export const MarketTrendsPage: React.FC = () => {
  const [signals, setSignals] = useState<MarketSkillSignal[]>([]);
  const [personalizedView, setPersonalizedView] = useState<PersonalizedMarketResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedSource, setInspectedSource] = useState<MarketSkillSignal | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [allSignals, meData] = await Promise.all([
          getAllMarketSkills(),
          getPersonalizedMarketView().catch(() => null),
        ]);
        setSignals(allSignals);
        if (meData) {
          setPersonalizedView(meData);
        }
      } catch (err) {
        console.error('Failed to load market trends page data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredSignals = signals.filter(
    (s) =>
      s.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-xl shrink-0">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Market Intelligence & Demand Signals</h1>
              <span className="bg-neutral-100 text-neutral-700 border border-neutral-200 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold">
                Imported Data Signals
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
              Explore dataset-specific mention rates, trend directions, and empirical evidence for key software engineering skills across imported historical periods.
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Data Disclaimer Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-xs shadow-xs">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-neutral-900">Market Data & Transparency Disclaimer</p>
          <p className="text-neutral-700 leading-relaxed">
            Market signals are calculated directly from imported reference datasets and depend on source coverage. Mention rates reflect occurrence in specified sample records (e.g. 12% in the imported dataset) and should not be interpreted as a complete or total representation of the global labor market.
          </p>
        </div>
      </div>

      {/* Personalized Target Career Market View */}
      {personalizedView && (
        <Card className="border-neutral-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-neutral-900" />
              <h2 className="text-base font-bold text-neutral-900">
                Market Signals for Your Target Career ({personalizedView.targetCareer.name})
              </h2>
            </div>
            <span className="text-xs text-neutral-500 font-mono">Personalized Alignment</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalizedView.items.map((item, idx) => (
              <div key={idx} className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-neutral-900 text-sm">{item.skillName}</h3>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200 font-semibold">
                    {item.careerImportance} Importance
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                  <div>
                    <span className="text-[10px] text-neutral-500 font-mono block">Your Level</span>
                    <span className="font-semibold text-neutral-800">Level {item.userCurrentLevel}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 font-mono block">Required Level</span>
                    <span className="font-semibold text-neutral-900">Level {item.requiredLevelNumber}</span>
                  </div>
                </div>

                {item.marketSignal ? (
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-200">
                    <span className="text-neutral-500">Dataset Mention Rate:</span>
                    <span className="font-bold text-emerald-700">{item.marketSignal.mentionRate}%</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-neutral-500 pt-1">No market signal data in current dataset</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* All Market Signals Section */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-neutral-900" />
            <h2 className="text-base font-bold text-neutral-900">Imported Skill Signals Library</h2>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search market skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-neutral-900 animate-spin mx-auto" />
            <p className="text-xs text-neutral-500">Loading market skill signals...</p>
          </div>
        ) : filteredSignals.length === 0 ? (
          <p className="text-xs text-neutral-500 py-6 text-center">No market skills match your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSignals.map((sig) => (
              <MarketSignalCard
                key={sig.skillId}
                signal={sig}
                onInspectSource={(s) => setInspectedSource(s)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Source Info Modal */}
      {inspectedSource && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="max-w-lg w-full p-6 space-y-4 border-neutral-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-neutral-900" />
                <h3 className="text-base font-bold text-neutral-900">Market Source Inspector</h3>
              </div>
              <button
                onClick={() => setInspectedSource(null)}
                className="text-neutral-400 hover:text-neutral-900 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 font-mono uppercase block">Target Skill</span>
                <p className="text-sm font-bold text-neutral-900 mt-0.5">{inspectedSource.skillName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                <div>
                  <span className="text-[10px] text-neutral-500 font-mono uppercase block">Data Period</span>
                  <span className="font-semibold text-neutral-900">{inspectedSource.timePeriod}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 font-mono uppercase block">Collection Date</span>
                  <span className="font-medium text-neutral-800">
                    {new Date(inspectedSource.collectedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-1">
                <span className="text-[10px] text-neutral-500 font-mono uppercase block">Source Name</span>
                <p className="font-semibold text-neutral-900">{inspectedSource.source}</p>
                {inspectedSource.sourceUrl && (
                  <a
                    href={inspectedSource.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-neutral-900 underline font-medium mt-1 hover:text-black"
                  >
                    <span>View Dataset URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectedSource(null)}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

