import React, { useState, useMemo } from 'react';
import { MutualFund, PairwiseOverlap, StockHolding } from '../types/portfolio';
import { VennDiagram } from './VennDiagram';
import {
  Search,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface PairwiseDeepDiveProps {
  funds: MutualFund[];
  overlapData: PairwiseOverlap;
  selectedAId: string;
  selectedBId: string;
  onSelectA: (id: string) => void;
  onSelectB: (id: string) => void;
}

type TabType = 'common' | 'schemeA' | 'schemeB' | 'overall';

export const PairwiseDeepDive: React.FC<PairwiseDeepDiveProps> = ({
  funds,
  overlapData,
  selectedAId,
  selectedBId,
  onSelectA,
  onSelectB,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'weightA' | 'weightB' | 'overlap'>('overlap');
  const [sortAsc, setSortAsc] = useState(false);

  const {
    fundA,
    fundB,
    overlapWeightPercent,
    commonStocksCount,
    fundAUniqueCount,
    fundBUniqueCount,
    totalUniqueCount,
    commonStocks,
    uniqueToA,
    uniqueToB,
  } = overlapData;

  // Determine badge styling based on overlap percentage
  const getBadgeDetails = (overlap: number) => {
    if (overlap >= 45) {
      return {
        label: 'HIGH OVERLAP',
        bg: 'bg-rose-600 dark:bg-[#e06c75] dark:text-[#141416]',
        textColor: 'text-rose-700 dark:text-[#e06c75]',
        subtext: 'High redundancy exists between these funds. Most holdings duplicate each other.',
      };
    }
    if (overlap >= 25) {
      return {
        label: 'MODERATE OVERLAP',
        bg: 'bg-[#1864ab] dark:bg-[#61afef] dark:text-[#141416]',
        textColor: 'text-[#1864ab] dark:text-[#61afef]',
        subtext: 'Some redundancy exists between these funds.',
      };
    }
    return {
      label: 'LOW OVERLAP',
      bg: 'bg-emerald-600 dark:bg-[#98c379] dark:text-[#141416]',
      textColor: 'text-emerald-700 dark:text-[#98c379]',
      subtext: 'Good diversification with minimal holding overlap.',
    };
  };

  const badge = getBadgeDetails(overlapWeightPercent);

  // Compute overall union list
  const overallHoldings = useMemo(() => {
    const list: Array<{
      name: string;
      sector: string;
      weightA: number;
      weightB: number;
      overlapWeight: number;
      isCommon: boolean;
    }> = [];

    commonStocks.forEach((cs) => {
      list.push({
        name: cs.name,
        sector: cs.sector,
        weightA: cs.weightA,
        weightB: cs.weightB,
        overlapWeight: cs.overlapWeight,
        isCommon: true,
      });
    });

    uniqueToA.forEach((u) => {
      list.push({
        name: u.name,
        sector: u.sector,
        weightA: u.weight,
        weightB: 0,
        overlapWeight: 0,
        isCommon: false,
      });
    });

    uniqueToB.forEach((u) => {
      list.push({
        name: u.name,
        sector: u.sector,
        weightA: 0,
        weightB: u.weight,
        overlapWeight: 0,
        isCommon: false,
      });
    });

    return list;
  }, [commonStocks, uniqueToA, uniqueToB]);

  // Filter and sort items based on active tab
  const displayedItems = useMemo(() => {
    let items: Array<{
      name: string;
      sector: string;
      weightA: number;
      weightB: number;
      overlapWeight: number;
    }> = [];

    if (activeTab === 'common') {
      items = commonStocks.map((cs) => ({
        name: cs.name,
        sector: cs.sector,
        weightA: cs.weightA,
        weightB: cs.weightB,
        overlapWeight: cs.overlapWeight,
      }));
    } else if (activeTab === 'schemeA') {
      items = uniqueToA.map((u) => ({
        name: u.name,
        sector: u.sector,
        weightA: u.weight,
        weightB: 0,
        overlapWeight: 0,
      }));
    } else if (activeTab === 'schemeB') {
      items = uniqueToB.map((u) => ({
        name: u.name,
        sector: u.sector,
        weightA: 0,
        weightB: u.weight,
        overlapWeight: 0,
      }));
    } else {
      items = overallHoldings;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (it) => it.name.toLowerCase().includes(q) || it.sector.toLowerCase().includes(q)
      );
    }

    // Sort
    return [...items].sort((a, b) => {
      let diff = 0;
      if (sortField === 'name') {
        diff = a.name.localeCompare(b.name);
      } else if (sortField === 'weightA') {
        diff = a.weightA - b.weightA;
      } else if (sortField === 'weightB') {
        diff = a.weightB - b.weightB;
      } else {
        diff = a.overlapWeight - b.overlapWeight;
      }
      return sortAsc ? diff : -diff;
    });
  }, [activeTab, commonStocks, uniqueToA, uniqueToB, overallHoldings, searchQuery, sortField, sortAsc]);

  const toggleSort = (field: 'name' | 'weightA' | 'weightB' | 'overlap') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pair Switcher Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 transition-colors max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0">
            Compare Pair:
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
            <select
              value={selectedAId}
              onChange={(e) => onSelectA(e.target.value)}
              className="text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-emerald-600 cursor-pointer w-full sm:w-auto max-w-full sm:max-w-[210px] truncate"
              aria-label="Select Scheme A"
            >
              {funds.map((f) => (
                <option key={`a-${f.id}`} value={f.id} disabled={f.id === selectedBId}>
                  Scheme A: {f.name}
                </option>
              ))}
            </select>

            <span className="text-xs font-bold text-slate-400 self-center">vs</span>

            <select
              value={selectedBId}
              onChange={(e) => onSelectB(e.target.value)}
              className="text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-emerald-600 cursor-pointer w-full sm:w-auto max-w-full sm:max-w-[210px] truncate"
              aria-label="Select Scheme B"
            >
              {funds.map((f) => (
                <option key={`b-${f.id}`} value={f.id} disabled={f.id === selectedAId}>
                  Scheme B: {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
          Showing pairwise holding breakdown for <strong>{fundA.name.split(' - ')[0]}</strong> &amp; <strong>{fundB.name.split(' - ')[0]}</strong>
        </div>
      </div>

      {/* Main Pairwise Showcase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Stats Section */}
        <div className="lg:col-span-5 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div>
            <span
              className={`inline-block px-3 py-1 text-xs font-bold text-white tracking-wider rounded-sm ${badge.bg}`}
            >
              {badge.label}
            </span>

            <div className="mt-3">
              <span className="text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
                {overlapWeightPercent}%
              </span>
            </div>

            <p className="text-base text-slate-600 dark:text-slate-300 mt-2 font-normal">
              {badge.subtext}
            </p>
          </div>

          {/* Fund A Card */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4d857c] dark:bg-[#56b6c2]" />
              <span className="truncate">{fundA.name}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-normal shrink-0 font-mono">
                {fundA.totalStocksCount} stocks
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#2f855a] dark:bg-[#162920] text-white dark:text-[#98c379] border border-transparent dark:border-[#264836] px-5 py-2.5 rounded-lg text-center min-w-[90px]">
                <div className="text-xl font-bold leading-none font-mono">{commonStocksCount}</div>
                <div className="text-[10px] font-medium tracking-wider uppercase mt-1">COMMON</div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 leading-none font-mono">{fundAUniqueCount}</div>
                <div className="text-[10px] font-medium tracking-wider uppercase text-slate-400 dark:text-slate-500 mt-1">UNIQUE</div>
              </div>
            </div>
          </div>

          {/* Fund B Card */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c7945d] dark:bg-[#e5c07b]" />
              <span className="truncate">{fundB.name}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-normal shrink-0 font-mono">
                {fundB.totalStocksCount} stocks
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#2f855a] dark:bg-[#162920] text-white dark:text-[#98c379] border border-transparent dark:border-[#264836] px-5 py-2.5 rounded-lg text-center min-w-[90px]">
                <div className="text-xl font-bold leading-none font-mono">{commonStocksCount}</div>
                <div className="text-[10px] font-medium tracking-wider uppercase mt-1">COMMON</div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 leading-none font-mono">{fundBUniqueCount}</div>
                <div className="text-[10px] font-medium tracking-wider uppercase text-slate-400 dark:text-slate-500 mt-1">UNIQUE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Venn Diagram Section */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-center">
          <VennDiagram
            fundAName={fundA.name}
            fundBName={fundB.name}
            overlapPercent={overlapWeightPercent}
            commonStocksCount={commonStocksCount}
            totalUniqueCount={totalUniqueCount}
          />
        </div>
      </div>

      {/* Holdings Breakdown Table with Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        {/* Tab Header bar */}
        <div className="bg-slate-50/80 dark:bg-slate-800/60 p-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('common')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'common'
                  ? 'bg-white dark:bg-[#252834] text-emerald-800 dark:text-[#98c379] shadow-xs border border-slate-200 dark:border-[#383d50]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>COMMON STOCKS</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                  activeTab === 'common'
                    ? 'bg-emerald-700 dark:bg-[#1a3325] text-white dark:text-[#98c379]'
                    : 'bg-slate-200 dark:bg-[#22222a] text-slate-700 dark:text-slate-300'
                }`}
              >
                {commonStocksCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('schemeA')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'schemeA'
                  ? 'bg-white dark:bg-[#1a252c] text-teal-800 dark:text-[#56b6c2] shadow-xs border border-slate-200 dark:border-[#2a404c]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>SCHEME A</span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">{fundAUniqueCount}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('schemeB')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'schemeB'
                  ? 'bg-white dark:bg-[#272218] text-amber-800 dark:text-[#e5c07b] shadow-xs border border-slate-200 dark:border-[#423824]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>SCHEME B</span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">{fundBUniqueCount}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('overall')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'overall'
                  ? 'bg-white dark:bg-[#22222a] text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-[#333342]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>OVERALL</span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">{totalUniqueCount}</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stock or sector..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#141416] border border-slate-300 dark:border-[#2e2e38] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-emerald-600 dark:focus:outline-[#56b6c2]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#272731] bg-slate-50/50 dark:bg-[#1c1d24] text-slate-500 dark:text-slate-400 select-none">
                <th className="py-3 px-4 w-12 font-medium">#</th>
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    Stocks <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 font-medium text-slate-500 dark:text-slate-400">Sector</th>
                <th
                  onClick={() => toggleSort('weightA')}
                  className="py-3 px-4 text-right font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#4d857c] dark:bg-[#56b6c2]" />
                    <span>Scheme A (%)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('weightB')}
                  className="py-3 px-4 text-right font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#c7945d] dark:bg-[#e5c07b]" />
                    <span>Scheme B (%)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('overlap')}
                  className="py-3 px-4 text-right font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-[#98c379]" />
                    <span>Min Overlap (%)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#252530] font-sans">
              {displayedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 dark:text-slate-500">
                    No holdings match your search query.
                  </td>
                </tr>
              ) : (
                displayedItems.map((item, idx) => (
                  <tr key={`${item.name}-${idx}`} className="hover:bg-slate-50/70 dark:hover:bg-[#202028] transition-colors">
                    <td className="py-3 px-4 text-slate-400 dark:text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                      <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#212128] text-slate-600 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-[#2d2d38]">
                        {item.sector}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-[#2f855a] dark:text-[#56b6c2]">
                      {item.weightA > 0 ? `${item.weightA.toFixed(2)}%` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-[#b7791f] dark:text-[#e5c07b]">
                      {item.weightB > 0 ? `${item.weightB.toFixed(2)}%` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 dark:text-[#98c379]">
                      {item.overlapWeight > 0 ? (
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 dark:bg-[#24242e] rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full bg-emerald-600 dark:bg-[#98c379] rounded-full"
                              style={{ width: `${Math.min(100, item.overlapWeight * 10)}%` }}
                            />
                          </div>
                          <span>{item.overlapWeight.toFixed(2)}%</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
