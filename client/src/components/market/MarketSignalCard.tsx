import React from 'react';
import { MarketSkillSignal } from '../../types/market';
import { TrendingUp, TrendingDown, Minus, HelpCircle, ExternalLink, Database } from 'lucide-react';

interface MarketSignalCardProps {
  signal: MarketSkillSignal;
  onInspectSource?: (signal: MarketSkillSignal) => void;
}

export const MarketSignalCard: React.FC<MarketSignalCardProps> = ({
  signal,
  onInspectSource,
}) => {
  const getTrendBadge = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'increasing':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>Increasing</span>
          </span>
        );
      case 'decreasing':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-semibold">
            <TrendingDown className="w-3 h-3" />
            <span>Decreasing</span>
          </span>
        );
      case 'stable':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-neutral-100 text-neutral-700 border border-neutral-200 px-2 py-0.5 rounded font-semibold">
            <Minus className="w-3 h-3" />
            <span>Stable</span>
          </span>
        );
      case 'insufficient_data':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-neutral-100 text-neutral-500 border border-neutral-200 px-2 py-0.5 rounded">
            <HelpCircle className="w-3 h-3" />
            <span>No Trend Data</span>
          </span>
        );
    }
  };

  // Inline SVG Sparkline Chart for History
  const renderSparkline = () => {
    if (!signal.history || signal.history.length < 2) return null;

    const rates = signal.history.map((h) => h.mentionRate);
    const maxRate = Math.max(...rates, 1);
    const minRate = Math.min(...rates, 0);
    const range = maxRate - minRate || 1;

    const width = 120;
    const height = 32;

    const points = signal.history
      .map((h, i) => {
        const x = (i / (signal.history!.length - 1)) * width;
        const y = height - ((h.mentionRate - minRate) / range) * (height - 8) - 4;
        return `${x},${y}`;
      })
      .join(' ');

    const strokeColor =
      signal.trendDirection === 'increasing'
        ? '#10b981'
        : signal.trendDirection === 'decreasing'
        ? '#ef4444'
        : '#111111';

    return (
      <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-lg border border-neutral-200">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-neutral-500 font-mono uppercase">Historical Trend</p>
          <p className="text-[11px] text-neutral-700 font-medium truncate">
            {signal.history[0].timePeriod} ➔ {signal.history[signal.history.length - 1].timePeriod}
          </p>
        </div>
        <svg className="w-28 h-8 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
          <polyline
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
          {signal.history.map((h, i) => {
            const x = (i / (signal.history!.length - 1)) * width;
            const y = height - ((h.mentionRate - minRate) / range) * (height - 8) - 4;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                className={signal.trendDirection === 'increasing' ? 'fill-emerald-600' : 'fill-neutral-900'}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3 hover:border-neutral-300 transition shadow-xs flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 font-medium">
            {signal.category}
          </span>
          {getTrendBadge(signal.trendDirection)}
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <h3 className="font-bold text-neutral-900 text-base">{signal.skillName}</h3>
          <div className="text-right">
            <span className="text-lg font-extrabold text-neutral-900">{signal.mentionRate}%</span>
            <span className="text-[10px] text-neutral-500 block font-mono">mention rate</span>
          </div>
        </div>

        <p className="text-xs text-neutral-600 leading-normal">
          Mentioned in <strong className="text-neutral-900">{signal.mentions}</strong> out of{' '}
          <strong className="text-neutral-900">{signal.totalRecords}</strong> records in dataset period{' '}
          <span className="font-mono text-neutral-800">{signal.timePeriod}</span>.
        </p>
      </div>

      {/* Sparkline Chart */}
      {renderSparkline()}

      {/* Source Footer */}
      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
        <div className="flex items-center gap-1.5 truncate pr-2">
          <Database className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="truncate">{signal.source}</span>
        </div>

        {onInspectSource && (
          <button
            onClick={() => onInspectSource(signal)}
            className="text-neutral-900 hover:text-black font-medium shrink-0 flex items-center gap-1 cursor-pointer hover:underline"
          >
            <span>Source Info</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

