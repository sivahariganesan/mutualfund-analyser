import React, { useState } from 'react';
import { MutualFund, PairwiseOverlap } from '../types/portfolio';
import { ExternalLink, Layers, TrendingUp, AlertTriangle } from 'lucide-react';

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
    if (i === j) return 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 font-normal';
    if (val < 15) return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-100 dark:border-emerald-800/60';
    if (val < 25) return 'bg-teal-100/70 dark:bg-teal-950/50 text-teal-950 dark:text-teal-200 hover:bg-teal-200/70 dark:hover:bg-teal-900/60 border border-teal-200/50 dark:border-teal-800/60';
    if (val < 35) return 'bg-amber-100 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60';
    if (val < 50) return 'bg-orange-200 dark:bg-orange-950/60 text-orange-950 dark:text-orange-200 hover:bg-orange-300 dark:hover:bg-orange-900/70 font-semibold border border-orange-300 dark:border-orange-800/60';
    return 'bg-rose-200 dark:bg-rose-950/70 text-rose-950 dark:text-rose-200 hover:bg-rose-300 dark:hover:bg-rose-900/80 font-bold border border-rose-300 dark:border-rose-800/60';
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
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Header and Summary stats */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Multi-Fund Matrix
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {n} Funds &bull; {pairCount} Unique Combinations
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Pairwise Overlap Heatmap
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Click any cell to inspect common stocks, unique holdings, and Venn intersection between those two funds.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Avg Overlap</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">{avgOverlap}%</span>
            </div>
            {maxVal >= 0 && (
              <button
                type="button"
                onClick={() => onSelectPair(funds[maxPair[0]].id, funds[maxPair[1]].id)}
                className="bg-white dark:bg-slate-800 hover:bg-orange-50/50 dark:hover:bg-slate-700/80 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-left transition-colors cursor-pointer group"
                title="Click to compare highest overlap pair"
              >
                <div className="flex items-center gap-1 text-[11px] font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
                  <AlertTriangle className="w-3 h-3 text-orange-600 dark:text-orange-400" /> Max Overlap ({maxVal}%)
                </div>
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[160px] group-hover:text-orange-900 dark:group-hover:text-orange-300">
                  {funds[maxPair[0]].name.split(' ')[0]} &amp; {funds[maxPair[1]].name.split(' ')[0]}
                </div>
              </button>
            )}
            {minVal < 999 && (
              <button
                type="button"
                onClick={() => onSelectPair(funds[minPair[0]].id, funds[minPair[1]].id)}
                className="bg-white dark:bg-slate-800 hover:bg-emerald-50/50 dark:hover:bg-slate-700/80 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-left transition-colors cursor-pointer group"
                title="Click to compare lowest overlap pair"
              >
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Best Diversity ({minVal}%)
                </div>
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[160px] group-hover:text-emerald-900 dark:group-hover:text-emerald-300">
                  {funds[minPair[0]].name.split(' ')[0]} &amp; {funds[minPair[1]].name.split(' ')[0]}
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Overlap Scale:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700" />
            <span>&lt; 15% (Low / High Diversity)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-teal-200 dark:bg-teal-900 border border-teal-300 dark:border-teal-700" />
            <span>15% - 25% (Mild Overlap)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-200 dark:bg-amber-900 border border-amber-300 dark:border-amber-700" />
            <span>25% - 35% (Moderate Redundancy)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-orange-300 dark:bg-orange-900 border border-orange-400 dark:border-orange-700" />
            <span>35% - 50% (High Overlap)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-300 dark:bg-rose-900 border border-rose-400 dark:border-rose-700" />
            <span>&gt; 50% (Very High Duplication)</span>
          </div>
        </div>
      </div>

      {/* The Matrix Table */}
      <div className="overflow-x-auto p-6">
        <table className="w-full border-collapse select-none">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-48 min-w-[190px]">
                Funds ({n})
              </th>
              {funds.map((fund, idx) => (
                <th
                  key={fund.id}
                  className="p-2 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[90px] min-w-[70px]"
                  title={fund.name}
                >
                  <div className="truncate px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono">
                    #{idx + 1}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {funds.map((rowFund, i) => (
              <tr key={rowFund.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-2 text-xs font-medium text-slate-800 dark:text-slate-200 pr-3 border-r border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 w-4">#{i + 1}</span>
                    <div className="truncate" title={rowFund.name}>
                      <span className="font-semibold text-slate-900 dark:text-white">{rowFund.name.split(' - ')[0]}</span>
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400">{rowFund.category}</span>
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
                        <div className="w-full py-2.5 rounded text-xs text-slate-300 dark:text-slate-600 font-mono bg-slate-50 dark:bg-slate-800/60">
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
                        )} ${isSelectedPair ? 'ring-2 ring-emerald-600 ring-offset-1 dark:ring-offset-slate-900 font-bold shadow-sm' : ''}`}
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
          <div className="mt-4 p-3 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-xs flex items-center justify-between border border-slate-700 shadow-md">
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
