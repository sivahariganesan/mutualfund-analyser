import React, { useState } from 'react';
import { MutualFund } from '../types/portfolio';
import { Plus, X, Sliders, RefreshCw, Bookmark } from 'lucide-react';

interface FundSelectorTrayProps {
  funds: MutualFund[];
  onRemoveFund: (fundId: string) => void;
  onUpdateWeight: (fundId: string, newWeight: number) => void;
  onOpenAddModal: () => void;
  useEqualWeights: boolean;
  onToggleEqualWeights: (val: boolean) => void;
  selectedAId: string;
  selectedBId: string;
  onSelectPair: (a: string, b: string) => void;
  onOpenSavePreset?: () => void;
}

export const FundSelectorTray: React.FC<FundSelectorTrayProps> = ({
  funds,
  onRemoveFund,
  onUpdateWeight,
  onOpenAddModal,
  useEqualWeights,
  onToggleEqualWeights,
  selectedAId,
  selectedBId,
  onSelectPair,
  onOpenSavePreset,
}) => {
  const [editingWeights, setEditingWeights] = useState(false);

  const totalFunds = funds.length;
  const equalWeightPercent = totalFunds > 0 ? (100 / totalFunds).toFixed(1) : '0';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-4 sm:p-5 space-y-4 transition-colors max-w-full overflow-hidden">
      {/* Tray Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>Active Portfolio Schemes</span>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {totalFunds}
            </span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {totalFunds >= 10 ? 'Broad Portfolio (10–15 Funds)' : `${totalFunds} Funds Selected`}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Equal Weight Toggle */}
          <button
            type="button"
            onClick={() => onToggleEqualWeights(!useEqualWeights)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
              useEqualWeights
                ? 'bg-emerald-50 dark:bg-[#16261e] text-emerald-800 dark:text-[#98c379] border-emerald-300 dark:border-[#264434] font-semibold'
                : 'bg-white dark:bg-[#1e1e24] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2c2c36] hover:bg-slate-50 dark:hover:bg-[#25252e]'
            }`}
          >
            <RefreshCw className="w-3 h-3 text-emerald-600 dark:text-[#98c379]" />
            <span>Equal Weights ({equalWeightPercent}%)</span>
          </button>

          {/* Custom Weight editor toggle */}
          {!useEqualWeights && (
            <button
              type="button"
              onClick={() => setEditingWeights(!editingWeights)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                editingWeights
                  ? 'bg-slate-900 dark:bg-[#272c3a] text-white dark:text-[#61afef] border-slate-900 dark:border-[#3a4156] font-semibold'
                  : 'bg-white dark:bg-[#1e1e24] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2c2c36] hover:bg-slate-50 dark:hover:bg-[#25252e]'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>{editingWeights ? 'Done Editing' : 'Adjust Weights'}</span>
            </button>
          )}

          {/* Save Preset Button */}
          {onOpenSavePreset && (
            <button
              type="button"
              onClick={onOpenSavePreset}
              className="px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 border bg-white dark:bg-[#1e1e24] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2c2c36] hover:bg-slate-50 dark:hover:bg-[#25252e]"
              title="Save current fund list as a preset in IndexedDB"
            >
              <Bookmark className="w-3 h-3 text-emerald-600 dark:text-[#98c379]" />
              <span>Save Preset</span>
            </button>
          )}

          {/* Add Fund Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="bg-emerald-700 dark:bg-[#1e2f25] hover:bg-emerald-800 dark:hover:bg-[#263c30] text-white dark:text-[#98c379] border border-transparent dark:border-[#325240] font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Fund</span>
          </button>
        </div>
      </div>

      {/* Fund Cards Grid: Uniform, responsive layout with zero zig-zag or overflow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {funds.map((fund, idx) => {
          const isSelectedInPair = fund.id === selectedAId || fund.id === selectedBId;
          const isFundA = fund.id === selectedAId;
          const isFundB = fund.id === selectedBId;

          return (
            <div
              key={fund.id}
              className={`group relative w-full min-w-0 px-3 py-2.5 rounded-xl border text-xs flex items-center justify-between gap-2.5 transition-all shadow-2xs ${
                isSelectedInPair
                  ? isFundA
                    ? 'bg-teal-50/80 dark:bg-[#162329] border-teal-500/80 dark:border-[#56b6c2]/60 ring-1 ring-teal-500/50 dark:ring-[#56b6c2]/40'
                    : 'bg-amber-50/80 dark:bg-[#262016] border-amber-500/80 dark:border-[#e5c07b]/60 ring-1 ring-amber-500/50 dark:ring-[#e5c07b]/40'
                  : 'bg-slate-50/80 dark:bg-[#1b1b20] border-slate-200 dark:border-[#272730] hover:border-slate-300 dark:hover:border-[#383846] hover:bg-white dark:hover:bg-[#202027]'
              }`}
            >
              {/* Left Zone: Pair Badge / Index + Fund Name & Details */}
              <div
                className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                onClick={() => {
                  if (fund.id !== selectedAId) {
                    onSelectPair(fund.id, selectedAId === fund.id ? selectedBId : selectedAId);
                  }
                }}
                title={`Click to analyze ${fund.name} in Pairwise Deep Dive`}
              >
                {/* Scheme Pair Badge or Clean Index Number */}
                {isSelectedInPair ? (
                  <span
                    className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider ${
                      isFundA
                        ? 'bg-[#4d857c] dark:bg-[#56b6c2] text-white dark:text-[#141416]'
                        : 'bg-[#c7945d] dark:bg-[#e5c07b] text-white dark:text-[#141416]'
                    }`}
                  >
                    {isFundA ? 'SCHEME A' : 'SCHEME B'}
                  </span>
                ) : (
                  <span className="shrink-0 font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 w-5 text-center">
                    #{idx + 1}
                  </span>
                )}

                {/* Fund Name and Category */}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 truncate text-xs">
                    {fund.name.split(' - ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate mt-0.5">
                    <span className="font-medium text-slate-600 dark:text-slate-300 truncate">
                      {fund.category}
                    </span>
                    <span className="shrink-0 text-slate-300 dark:text-slate-600">·</span>
                    <span className="shrink-0 font-mono">{fund.totalStocksCount} stocks</span>
                  </div>
                </div>
              </div>

              {/* Right Zone: Weight Badge / Input + Remove Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                {editingWeights && !useEqualWeights ? (
                  <div className="flex items-center gap-0.5">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={fund.portfolioWeight}
                      onChange={(e) => onUpdateWeight(fund.id, parseFloat(e.target.value) || 0)}
                      className="w-11 text-center text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded px-1 py-0.5"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">%</span>
                  </div>
                ) : (
                  <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {useEqualWeights ? `${equalWeightPercent}%` : `${fund.portfolioWeight}%`}
                  </span>
                )}

                {/* Delete button (minimum 2 funds kept) */}
                {funds.length > 2 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFund(fund.id);
                    }}
                    className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-md transition-colors cursor-pointer"
                    title="Remove fund from portfolio"
                    aria-label={`Remove ${fund.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
