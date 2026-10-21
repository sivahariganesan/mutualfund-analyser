import React from 'react';
import { PORTFOLIO_PRESETS } from '../data/mockFunds';
import { Layers, Printer, Sparkles, PieChart, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  onSelectPreset: (presetId: string) => void;
  activePresetId?: string;
  totalFunds: number;
  onOpenDataSources: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectPreset,
  activePresetId,
  totalFunds,
  onOpenDataSources,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  PortfolioOverlap<span className="text-emerald-700">Pro</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider hidden sm:inline-block">
                  Multi-Fund Analytics
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Mutual Fund Overlap &bull; Concentration Risk &bull; Redundancy Matrix
              </p>
            </div>
          </div>

          {/* Preset Selector & Print Tools */}
          <div className="flex items-center gap-3">
            {/* Presets dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium hidden md:inline">Presets:</span>
              <select
                value={activePresetId || ''}
                onChange={(e) => onSelectPreset(e.target.value)}
                className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-emerald-600 cursor-pointer max-w-[200px] sm:max-w-[240px] truncate"
              >
                {PORTFOLIO_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Sources & Open APIs info button */}
            <button
              type="button"
              onClick={onOpenDataSources}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="View Open APIs and data sources"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">AMFI Open API</span>
              <span className="text-[10px] text-slate-400">&bull; Sources</span>
            </button>

            {/* Print / Export Report Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="text-xs font-semibold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Print or Save PDF report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
