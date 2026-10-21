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
        return { bg: 'bg-indigo-600', text: 'text-indigo-900', border: 'border-indigo-200' };
      case 'Large':
        return { bg: 'bg-blue-600', text: 'text-blue-900', border: 'border-blue-200' };
      case 'Mid':
        return { bg: 'bg-purple-600', text: 'text-purple-900', border: 'border-purple-200' };
      case 'Small':
        return { bg: 'bg-emerald-600', text: 'text-emerald-900', border: 'border-emerald-200' };
      default:
        return { bg: 'bg-slate-600', text: 'text-slate-900', border: 'border-slate-200' };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sector Exposure Column */}
      <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Portfolio Sector Exposure</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Consolidated industry weighting across all your funds
            </p>
          </div>
          {isHighSectorConcentration ? (
            <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Heavy {topSector.sector} weight ({topSector.weight}%)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Healthy sector spread</span>
            </div>
          )}
        </div>

        {/* Sector Bars */}
        <div className="space-y-3 pt-2">
          {sectorExposure.slice(0, 10).map((sec, idx) => (
            <div key={sec.sector} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-slate-400 w-4">#{idx + 1}</span>
                  <span>{sec.sector}</span>
                  <span className="text-slate-400 font-normal text-[11px]">({sec.stockCount} stocks)</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{sec.weight}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    idx === 0
                      ? 'bg-emerald-700'
                      : idx === 1
                      ? 'bg-teal-600'
                      : idx === 2
                      ? 'bg-cyan-600'
                      : 'bg-slate-500'
                  }`}
                  style={{ width: `${Math.min(100, sec.weight * 2.5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Cap Breakdown Column */}
      <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Market Capitalization Allocation</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribution across Large, Mid, and Small Cap segments
          </p>

          {/* Segmented Progress Bar */}
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex mt-4 shadow-inner">
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
                <div key={cap.category} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${color.bg}`} />
                    <span className="text-xs font-semibold text-slate-700">{cap.category} Cap</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                    {cap.weight}%
                  </div>
                  <div className="text-[11px] text-slate-500">
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
        <div className="p-3.5 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-blue-900 space-y-1 mt-4">
          <div className="font-semibold flex items-center gap-1.5 text-blue-950">
            <TrendingUp className="w-4 h-4 text-blue-700" />
            <span>Portfolio Diversification Insight</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Holding 10-15 funds often creates high overlap in <strong>Giant &amp; Large Cap</strong> bluechips (HDFC Bank, Reliance, ICICI Bank, Infosys), while Mid &amp; Small caps offer lower pairwise overlap.
          </p>
        </div>
      </div>
    </div>
  );
};
