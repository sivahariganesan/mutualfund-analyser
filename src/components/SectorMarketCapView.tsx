import React from 'react';
import { MarketCapExposure, SectorExposure } from '../types/portfolio';
import { PieChart, AlertCircle, CheckCircle2, TrendingUp, ShieldAlert } from 'lucide-react';

interface SectorMarketCapViewProps {
  sectorExposure: SectorExposure[];
  marketCapExposure: MarketCapExposure[];
}

export const SectorMarketCapView: React.FC<SectorMarketCapViewProps> = ({
  sectorExposure,
  marketCapExposure,
}) => {
  const topSector = sectorExposure[0];
  const isHighSectorConcentration = topSector && topSector.weight > 30;

  // Colors for market cap categories
  const getCapColor = (cat: string) => {
    switch (cat) {
      case 'Giant':
        return { bg: 'bg-indigo-600 dark:bg-[#61afef]', text: 'text-indigo-900 dark:text-[#61afef]', border: 'border-indigo-200 dark:border-[#2d4566]' };
      case 'Large':
        return { bg: 'bg-blue-600 dark:bg-[#56b6c2]', text: 'text-blue-900 dark:text-[#56b6c2]', border: 'border-blue-200 dark:border-[#204a52]' };
      case 'Mid':
        return { bg: 'bg-purple-600 dark:bg-[#c678dd]', text: 'text-purple-900 dark:text-[#c678dd]', border: 'border-purple-200 dark:border-[#523360]' };
      case 'Small':
        return { bg: 'bg-emerald-600 dark:bg-[#98c379]', text: 'text-emerald-900 dark:text-[#98c379]', border: 'border-emerald-200 dark:border-[#2b4c37]' };
      default:
        return { bg: 'bg-slate-600 dark:bg-[#e5c07b]', text: 'text-slate-900 dark:text-[#e5c07b]', border: 'border-slate-200 dark:border-[#544321]' };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sector Exposure Column */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Portfolio Sector Exposure</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Consolidated industry weighting across all your funds
            </p>
          </div>
          {isHighSectorConcentration ? (
            <div className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-[#e5c07b] bg-amber-50 dark:bg-[#282115] px-2.5 py-1 rounded-md border border-amber-200 dark:border-[#473a1e] font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-[#e5c07b]" />
              <span>Heavy {topSector.sector} weight ({topSector.weight}%)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-[#98c379] bg-emerald-50 dark:bg-[#15251d] px-2.5 py-1 rounded-md border border-emerald-200 dark:border-[#224230] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#98c379]" />
              <span>Healthy sector spread</span>
            </div>
          )}
        </div>

        {/* Sector Bars */}
        <div className="space-y-3 pt-2">
          {sectorExposure.slice(0, 10).map((sec, idx) => (
            <div key={sec.sector} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 w-4">#{idx + 1}</span>
                  <span>{sec.sector}</span>
                  <span className="text-slate-400 dark:text-slate-500 font-normal text-[11px]">({sec.stockCount} stocks)</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{sec.weight}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#212128] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    idx === 0
                      ? 'bg-emerald-700 dark:bg-[#56b6c2]'
                      : idx === 1
                      ? 'bg-teal-600 dark:bg-[#61afef]'
                      : idx === 2
                      ? 'bg-cyan-600 dark:bg-[#98c379]'
                      : idx === 3
                      ? 'bg-indigo-600 dark:bg-[#e5c07b]'
                      : idx === 4
                      ? 'bg-purple-600 dark:bg-[#c678dd]'
                      : 'bg-slate-500 dark:bg-[#3f4454]'
                  }`}
                  style={{ width: `${Math.min(100, sec.weight * 2.5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Cap Breakdown Column */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 flex flex-col justify-between transition-colors">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Market Capitalization Allocation</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Distribution across Large, Mid, and Small Cap segments
          </p>

          {/* Segmented Progress Bar */}
          <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex mt-4 shadow-inner">
            {marketCapExposure.map((cap) => {
              const color = getCapColor(cap.category);
              return (
                <div
                  key={cap.category}
                  className={`${color.bg} transition-all duration-500`}
                  style={{ width: `${cap.weight}%` }}
                  title={`${cap.category}: ${cap.weight}%`}
                />
              );
            })}
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {marketCapExposure.map((cap) => {
              const color = getCapColor(cap.category);
              return (
                <div key={cap.category} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${color.bg}`} />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{cap.category} Cap</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {cap.weight}%
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {cap.category === 'Giant' || cap.category === 'Large'
                      ? 'Top 100 leaders'
                      : cap.category === 'Mid'
                      ? 'Rank 101-250 growth'
                      : 'High-growth alpha'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pro Tip Callout */}
        <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-1 mt-4">
          <div className="font-semibold flex items-center gap-1.5 text-blue-950 dark:text-blue-200">
            <TrendingUp className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>Portfolio Diversification Insight</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
            Holding 10-15 funds often creates high overlap in <strong>Giant &amp; Large Cap</strong> bluechips (HDFC Bank, Reliance, ICICI Bank, Infosys), while Mid &amp; Small caps offer lower pairwise overlap.
          </p>
        </div>
      </div>
    </div>
  );
};
