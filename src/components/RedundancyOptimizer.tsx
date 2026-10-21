import React, { useState } from 'react';
import { MutualFund, RedundancyAlert, ConsolidatedStock } from '../types/portfolio';
import {
  AlertTriangle,
  Scissors,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Layers,
  Info,
} from 'lucide-react';

interface RedundancyOptimizerProps {
  funds: MutualFund[];
  redundancyAlerts: RedundancyAlert[];
  consolidatedStocks: ConsolidatedStock[];
  onSelectPair: (fundAId: string, fundBId: string) => void;
  onRemoveFund?: (fundId: string) => void;
}

export const RedundancyOptimizer: React.FC<RedundancyOptimizerProps> = ({
  funds,
  redundancyAlerts,
  consolidatedStocks,
  onSelectPair,
  onRemoveFund,
}) => {
  // Stock incidence counts
  const stockIncidence = React.useMemo(() => {
    let singleFundStocks = 0;
    let twoToThreeFunds = 0;
    let fourOrMoreFunds = 0;

    consolidatedStocks.forEach((s) => {
      if (s.fundCount === 1) singleFundStocks++;
      else if (s.fundCount <= 3) twoToThreeFunds++;
      else fourOrMoreFunds++;
    });

    return { singleFundStocks, twoToThreeFunds, fourOrMoreFunds };
  }, [consolidatedStocks]);

  // Simulated excluded funds
  const [excludedFundIds, setExcludedFundIds] = useState<Set<string>>(new Set());

  const toggleExclude = (id: string) => {
    const next = new Set(excludedFundIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExcludedFundIds(next);
  };

  const activeSimulatedFunds = funds.filter((f) => !excludedFundIds.has(f.id));

  return (
    <div className="space-y-6">
      {/* Redundancy Alerts Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-800 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 px-2.5 py-0.5 rounded border border-orange-200 dark:border-orange-900/40">
                Redundancy Diagnosis
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {redundancyAlerts.length} Redundant Pairs Detected
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              Portfolio Overlap &amp; Consolidation Warnings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              When funds share &gt;30% overlap, they duplicate identical underlying holdings, increasing management fees without improving diversification.
            </p>
          </div>
        </div>

        {/* Alerts List */}
        {redundancyAlerts.length === 0 ? (
          <div className="p-5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-sm">No High-Risk Redundancy Detected!</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400">
                None of your selected funds exceed the 30% overlap threshold. Your portfolio has clean diversification across segments.
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {redundancyAlerts.map((alert, idx) => (
              <div
                key={`${alert.fundAId}-${alert.fundBId}-${idx}`}
                className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                  alert.severity === 'critical'
                    ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40'
                    : 'bg-amber-50/40 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                      alert.severity === 'critical'
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {alert.overlapPercent}% Overlap
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectPair(alert.fundAId, alert.fundBId)}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-400 underline cursor-pointer"
                  >
                    Compare Pair &rarr;
                  </button>
                </div>

                <div className="font-semibold text-slate-900 dark:text-white text-sm">
                  {alert.fundAName.split(' - ')[0]} &amp; {alert.fundBName.split(' - ')[0]}
                </div>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  {alert.recommendation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock Incidence / Multi-Holding Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            True Diversifiers
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            {stockIncidence.singleFundStocks}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Stocks appearing in <strong>only 1 fund</strong>. These provide genuine non-overlapping exposure.
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Moderately Shared
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            {stockIncidence.twoToThreeFunds}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Stocks present across <strong>2 to 3 funds</strong> in your portfolio.
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Heavy Multi-Holdings
          </div>
          <div className="text-3xl font-extrabold text-amber-900 dark:text-amber-300 mt-2 font-mono">
            {stockIncidence.fourOrMoreFunds}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Stocks held in <strong>4 or more funds</strong> simultaneously (e.g. HDFC Bank, ICICI Bank).
          </div>
        </div>
      </div>

      {/* Portfolio Pruning Simulator */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2">
          <Scissors className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Portfolio Pruning &amp; Simplification Sandbox
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Click any fund below to test-remove it from the portfolio. See if eliminating overlapping funds streamlines your portfolio without sacrificing stock market breadth.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {funds.map((fund) => {
            const isExcluded = excludedFundIds.has(fund.id);
            return (
              <button
                key={`sim-${fund.id}`}
                type="button"
                onClick={() => toggleExclude(fund.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 border ${
                  isExcluded
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 line-through border-slate-200 dark:border-slate-700'
                    : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800 font-semibold shadow-2xs'
                }`}
              >
                <span>{fund.name.split(' - ')[0]}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  {isExcluded ? 'Excluded' : 'Active'}
                </span>
              </button>
            );
          })}
        </div>

        {excludedFundIds.size > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs flex flex-wrap items-center justify-between gap-3 mt-3">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Simulated Portfolio Size: {activeSimulatedFunds.length} Funds
              </span>
              <span className="text-slate-500 dark:text-slate-400 ml-2">
                ({excludedFundIds.size} funds pruned for comparison)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setExcludedFundIds(new Set())}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Reset Simulation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
