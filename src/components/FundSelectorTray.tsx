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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-5 space-y-4 transition-colors">
      {/* Tray Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Active Portfolio Schemes ({totalFunds})
            </h2>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300">
            {totalFunds >= 10 ? 'Broad Portfolio (10-15 Funds)' : `${totalFunds} Funds Selected`}
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
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60 font-semibold'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <RefreshCw className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Equal Weights ({equalWeightPercent}%)</span>
          </button>

          {/* Custom Weight editor toggle */}
          {!useEqualWeights && (
            <button
              type="button"
              onClick={() => setEditingWeights(!editingWeights)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                editingWeights
                  ? 'bg-slate-900 dark:bg-emerald-700 text-white border-slate-900 dark:border-emerald-700 font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
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
              className="px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 border bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              title="Save current fund list as a preset in IndexedDB"
            >
              <Bookmark className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Save Preset</span>
            </button>
          )}

          {/* Add Fund Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Fund</span>
          </button>
        </div>
      </div>

      {/* Fund Pills Container */}
      <div className="flex flex-wrap gap-2.5">
        {funds.map((fund, idx) => {
          const isSelectedInPair = fund.id === selectedAId || fund.id === selectedBId;
          const isFundA = fund.id === selectedAId;

          return (
            <div
              key={fund.id}
              className={`group relative pl-3 pr-2 py-2 rounded-xl border text-xs flex items-center gap-2.5 transition-all shadow-2xs ${
                isSelectedInPair
                  ? isFundA
                    ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-400 dark:border-teal-600 ring-1 ring-teal-400 dark:ring-teal-600'
                    : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 ring-1 ring-amber-400 dark:ring-amber-600'
                  : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              {/* Pair badge if currently in deep dive */}
              {isSelectedInPair && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${
                    isFundA ? 'bg-[#4d857c]' : 'bg-[#c7945d]'
                  }`}
                >
                  {isFundA ? 'SCHEME A' : 'SCHEME B'}
                </span>
              )}

              {/* Fund Name and Category */}
              <div
                className="cursor-pointer max-w-[200px]"
                onClick={() => {
                  if (fund.id !== selectedAId) {
                    onSelectPair(fund.id, selectedAId === fund.id ? selectedBId : selectedAId);
                  }
                }}
                title={fund.name}
              >
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  <span className="text-slate-400 dark:text-slate-500 mr-1 font-mono text-[10px]">#{idx + 1}</span>
                  {fund.name.split(' - ')[0]}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <span className="font-medium text-slate-600 dark:text-slate-300">{fund.category}</span>
                  <span>&bull;</span>
                  <span>{fund.totalStocksCount} stocks</span>
                </div>
              </div>

              {/* Weight badge or editable input */}
              <div className="shrink-0">
                {editingWeights && !useEqualWeights ? (
                  <div className="flex items-center gap-0.5">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={fund.portfolioWeight}
                      onChange={(e) => onUpdateWeight(fund.id, parseFloat(e.target.value) || 0)}
                      className="w-12 text-center text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded px-1 py-0.5"
                    />
                    <span className="text-[10px] text-slate-400">%</span>
                  </div>
                ) : (
                  <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {useEqualWeights ? `${equalWeightPercent}%` : `${fund.portfolioWeight}%`}
                  </span>
                )}
              </div>

              {/* Delete button (minimum 2 funds kept) */}
              {funds.length > 2 && (
                <button
                  type="button"
                  onClick={() => onRemoveFund(fund.id)}
                  className="text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-md transition-colors cursor-pointer"
                  title="Remove fund from portfolio"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
