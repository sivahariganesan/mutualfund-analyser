import React, { useState } from 'react';
import { MutualFund, PairwiseOverlap } from '../types/portfolio';
import { ExternalLink, HelpCircle, Layers, TrendingUp, AlertTriangle } from 'lucide-react';

interface HeatmapMatrixProps {
  funds: MutualFund[];
  matrix: number[][];
  detailedPairs: Record<string, PairwiseOverlap>;
  onSelectPair: (fundAId: string, fundBId: string) => void;
  selectedAId: string;
  selectedBId: string;
}

export const HeatmapMatrix: React.FC<HeatmapMatrixProps> = ({
  funds,
  matrix,
  detailedPairs,
  onSelectPair,
  selectedAId,
  selectedBId,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{
    i: number;
    j: number;
    fundA: MutualFund;
    fundB: MutualFund;
    overlap: number;
  } | null>(null);

  const n = funds.length;

  const getCellColor = (i: number, j: number, val: number) => {
    if (i === j) return 'bg-slate-100 text-slate-400 font-normal';
    if (val < 15) return 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-100';
    if (val < 25) return 'bg-teal-100/70 text-teal-950 hover:bg-teal-200/70 border border-teal-200/50';
    if (val < 35) return 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-200';
    if (val < 50) return 'bg-orange-200 text-orange-950 hover:bg-orange-300 font-semibold border border-orange-300';
    return 'bg-rose-200 text-rose-950 hover:bg-rose-300 font-bold border border-rose-300';
  };

  // Find max and min overlap pairs for quick stats
  let maxVal = -1;
  let maxPair: [number, number] = [0, 1];
  let minVal = 999;
  let minPair: [number, number] = [0, 1];
  let sumOverlap = 0;
  let pairCount = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const v = matrix[i][j];
      sumOverlap += v;
      pairCount++;
      if (v > maxVal) {
        maxVal = v;
        maxPair = [i, j];
      }
      if (v < minVal) {
        minVal = v;
        minPair = [i, j];
      }
    }
  }

  const avgOverlap = pairCount > 0 ? (sumOverlap / pairCount).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header and Summary stats */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Multi-Fund Matrix
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {n} Funds &bull; {pairCount} Unique Combinations
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Pairwise Overlap Heatmap
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Click any cell to inspect common stocks, unique holdings, and Venn intersection between those two funds.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3">
            <div className="bg-white px-3.5 py-2 rounded-lg border border-slate-200 text-center">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Avg Overlap</span>
              <span className="text-base font-bold text-slate-900">{avgOverlap}%</span>
            </div>
            {maxVal >= 0 && (
              <button
                type="button"
                onClick={() => onSelectPair(funds[maxPair[0]].id, funds[maxPair[1]].id)}
                className="bg-white hover:bg-orange-50/50 px-3.5 py-2 rounded-lg border border-slate-200 text-left transition-colors cursor-pointer group"
                title="Click to compare highest overlap pair"
              >
                <div className="flex items-center gap-1 text-[11px] font-semibold text-orange-700 uppercase tracking-wider">
                  <AlertTriangle className="w-3 h-3 text-orange-600" /> Max Overlap ({maxVal}%)
                </div>
                <div className="text-xs font-medium text-slate-700 truncate max-w-[160px] group-hover:text-orange-900">
                  {funds[maxPair[0]].name.split(' ')[0]} &amp; {funds[maxPair[1]].name.split(' ')[0]}
                </div>
              </button>
            )}
            {minVal < 999 && (
              <button
                type="button"
                onClick={() => onSelectPair(funds[minPair[0]].id, funds[minPair[1]].id)}
                className="bg-white hover:bg-emerald-50/50 px-3.5 py-2 rounded-lg border border-slate-200 text-left transition-colors cursor-pointer group"
                title="Click to compare lowest overlap pair"
              >
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                  <TrendingUp className="w-3 h-3 text-emerald-600" /> Best Diversity ({minVal}%)
                </div>
                <div className="text-xs font-medium text-slate-700 truncate max-w-[160px] group-hover:text-emerald-900">
                  {funds[minPair[0]].name.split(' ')[0]} &amp; {funds[minPair[1]].name.split(' ')[0]}
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-200/60 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Overlap Scale:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
            <span>&lt; 15% (Low / Excellent Diversity)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-teal-200 border border-teal-300" />
            <span>15% - 25% (Mild Overlap)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-200 border border-amber-300" />
            <span>25% - 35% (Moderate Redundancy)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-orange-300 border border-orange-400" />
            <span>35% - 50% (High Overlap)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-300 border border-rose-400" />
            <span>&gt; 50% (Very High Duplication)</span>
          </div>
        </div>
      </div>

      {/* The Matrix Table */}
      <div className="overflow-x-auto p-6">
        <table className="w-full border-collapse select-none">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-48 min-w-[190px]">
                Funds ({n})
              </th>
              {funds.map((fund, idx) => (
                <th
                  key={fund.id}
                  className="p-2 text-center text-xs font-semibold text-slate-700 max-w-[90px] min-w-[70px]"
                  title={fund.name}
                >
                  <div className="truncate px-1 py-0.5 rounded bg-slate-100 text-[11px] font-mono">
                    #{idx + 1}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {funds.map((rowFund, i) => (
              <tr key={rowFund.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-2 text-xs font-medium text-slate-800 pr-3 border-r border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 w-4">#{i + 1}</span>
                    <div className="truncate" title={rowFund.name}>
                      <span className="font-semibold text-slate-900">{rowFund.name.split(' - ')[0]}</span>
                      <span className="block text-[10px] text-slate-500">{rowFund.category}</span>
                    </div>
                  </div>
                </td>
                {funds.map((colFund, j) => {
                  const val = matrix[i][j];
                  const isSelectedPair =
                    (rowFund.id === selectedAId && colFund.id === selectedBId) ||
                    (rowFund.id === selectedBId && colFund.id === selectedAId);

                  if (i === j) {
                    return (
                      <td key={colFund.id} className="p-1 text-center">
                        <div className="w-full py-2.5 rounded text-xs text-slate-300 font-mono bg-slate-50">
                          -
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={colFund.id} className="p-1 text-center">
                      <button
                        type="button"
                        onClick={() => onSelectPair(rowFund.id, colFund.id)}
                        onMouseEnter={() =>
                          setHoveredCell({
                            i,
                            j,
                            fundA: rowFund,
                            fundB: colFund,
                            overlap: val,
                          })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`w-full py-2.5 px-1 rounded text-xs font-mono transition-all cursor-pointer relative group ${getCellColor(
                          i,
                          j,
                          val
                        )} ${isSelectedPair ? 'ring-2 ring-emerald-600 ring-offset-1 font-bold shadow-sm' : ''}`}
                        title={`Click to analyze ${rowFund.name} vs ${colFund.name}`}
                      >
                        {val}%
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Hovered cell info panel */}
        {hoveredCell && (
          <div className="mt-4 p-3 bg-slate-900 text-white rounded-lg text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-semibold text-emerald-300">{hoveredCell.fundA.name}</span>
                <span className="text-slate-400 mx-2">&times;</span>
                <span className="font-semibold text-amber-300">{hoveredCell.fundB.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-300">
                Overlap Weight: <strong className="text-white text-sm">{hoveredCell.overlap}%</strong>
              </span>
              <span className="text-emerald-400 font-medium underline flex items-center gap-1">
                Click to inspect deep dive <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
