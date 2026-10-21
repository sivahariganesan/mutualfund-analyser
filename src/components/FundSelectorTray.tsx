import React, { useState } from 'react';
import { MutualFund } from '../types/portfolio';
import { Plus, X, Sliders, Check, RefreshCw, Layers } from 'lucide-react';

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
}) => {
  const [editingWeights, setEditingWeights] = useState(false);

  const totalFunds = funds.length;
  const equalWeightPercent = totalFunds > 0 ? (100 / totalFunds).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
      {/* Tray Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <h2 className="text-sm font-bold text-slate-900">
              Active Portfolio Schemes ({totalFunds})
            </h2>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 font-medium text-slate-600">
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
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <RefreshCw className="w-3 h-3 text-emerald-600" />
            <span>Equal Weights ({equalWeightPercent}%)</span>
          </button>

          {/* Custom Weight editor toggle */}
          {!useEqualWeights && (
            <button
              type="button"
              onClick={() => setEditingWeights(!editingWeights)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                editingWeights
                  ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>{editingWeights ? 'Done Editing' : 'Adjust Weights'}</span>
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
          const isFundB = fund.id === selectedBId;

          return (
            <div
              key={fund.id}
              className={`group relative pl-3 pr-2 py-2 rounded-xl border text-xs flex items-center gap-2.5 transition-all shadow-2xs ${
                isSelectedInPair
                  ? isFundA
                    ? 'bg-teal-50/70 border-teal-400 ring-1 ring-teal-400'
                    : 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-400'
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-white'
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
                <div className="font-semibold text-slate-900 truncate">
                  <span className="text-slate-400 mr-1 font-mono text-[10px]">#{idx + 1}</span>
                  {fund.name.split(' - ')[0]}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <span className="font-medium text-slate-600">{fund.category}</span>
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
                      className="w-12 text-center text-xs font-mono font-bold bg-white border border-slate-300 rounded px-1 py-0.5"
                    />
                    <span className="text-[10px] text-slate-400">%</span>
                  </div>
                ) : (
                  <span className="font-mono text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {useEqualWeights ? `${equalWeightPercent}%` : `${fund.portfolioWeight}%`}
                  </span>
                )}
              </div>

              {/* Delete button (minimum 2 funds kept) */}
              {funds.length > 2 && (
                <button
                  type="button"
                  onClick={() => onRemoveFund(fund.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
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
