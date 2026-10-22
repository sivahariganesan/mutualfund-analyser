import React, { useState, useMemo } from 'react';
import { ConsolidatedStock, MutualFund } from '../types/portfolio';
import {
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Layers,
  Building,
} from 'lucide-react';

interface AggregatedHoldingsProps {
  consolidatedStocks: ConsolidatedStock[];
  funds: MutualFund[];
  top5Weight: number;
  top10Weight: number;
  totalUniqueStocks: number;
  herfindahlIndex: number;
  diversificationScore: number;
  diversificationLevel: string;
}

export const AggregatedHoldings: React.FC<AggregatedHoldingsProps> = ({
  consolidatedStocks,
  funds,
  top5Weight,
  top10Weight,
  totalUniqueStocks,
  herfindahlIndex,
  diversificationScore,
  diversificationLevel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedMarketCap, setSelectedMarketCap] = useState<string>('All');
  const [expandedStock, setExpandedStock] = useState<string | null>(null);

  // Get unique sectors
  const sectors = useMemo(() => {
    const set = new Set<string>();
    consolidatedStocks.forEach((s) => set.add(s.sector));
    return ['All', ...Array.from(set).sort()];
  }, [consolidatedStocks]);

  const filteredStocks = useMemo(() => {
    return consolidatedStocks.filter((stk) => {
      const matchSearch =
        stk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stk.sector.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSector = selectedSector === 'All' || stk.sector === selectedSector;
      const matchMarketCap = selectedMarketCap === 'All' || stk.marketCap === selectedMarketCap;
      return matchSearch && matchSector && matchMarketCap;
    });
  }, [consolidatedStocks, searchQuery, selectedSector, selectedMarketCap]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Stock Name', 'Sector', 'Market Cap', 'Effective Weight (%)', 'Fund Incidence Count', 'Funds List'];
    const rows = filteredStocks.map((s) => [
      `"${s.name}"`,
      `"${s.sector}"`,
      s.marketCap || 'N/A',
      s.effectivePortfolioWeight.toFixed(2),
      s.fundCount,
      `"${s.fundsPresentIn.map((f) => `${f.fundName} (${f.weightInFund}%)`).join('; ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `portfolio_holdings_overlap_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Concentration KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <span>Top 5 Concentration</span>
            <span className="text-emerald-700 dark:text-[#98c379] bg-emerald-50 dark:bg-[#15251d] border border-transparent dark:border-[#244533] px-2 py-0.5 rounded text-[11px]">
              {top5Weight < 25 ? 'Low Risk' : top5Weight < 35 ? 'Moderate' : 'Concentrated'}
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            {top5Weight}%
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Exposure in your 5 largest underlying companies
          </div>
          <div className="w-full bg-slate-100 dark:bg-[#212128] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full ${
                top5Weight > 35 ? 'bg-orange-500 dark:bg-[#e58a70]' : 'bg-emerald-600 dark:bg-[#98c379]'
              }`}
              style={{ width: `${Math.min(100, top5Weight * 2)}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <span>Top 10 Holdings</span>
            <span className="text-slate-500 dark:text-zinc-400 text-[11px] font-mono">10 Companies</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            {top10Weight}%
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Combined weight of top 10 stocks across all {funds.length} funds
          </div>
          <div className="w-full bg-slate-100 dark:bg-[#212128] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-teal-600 dark:bg-[#56b6c2]"
              style={{ width: `${Math.min(100, top10Weight * 1.5)}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <span>Unique Stocks</span>
            <span className="text-slate-500 dark:text-zinc-400 text-[11px] font-mono">{funds.length} Funds</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            {totalUniqueStocks}
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Distinct companies held across your total portfolio
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-700 dark:text-[#98c379] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> High breadth across sectors
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <span>Diversification Health</span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-[#98c379] font-mono">{diversificationScore}/100</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {diversificationLevel}
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            HHI Index: <strong className="text-slate-700 dark:text-slate-300 font-mono">{herfindahlIndex}</strong> (&lt;300 is optimal)
          </div>
          <div className="w-full bg-slate-100 dark:bg-[#212128] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-600 dark:bg-[#98c379]"
              style={{ width: `${diversificationScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Aggregated Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        {/* Filter bar */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stock..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#141416] border border-slate-300 dark:border-[#2e2e38] rounded-lg text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-emerald-600 dark:focus:outline-[#56b6c2]"
              />
            </div>

            {/* Sector filter */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="text-xs text-slate-700 dark:text-zinc-200 bg-white dark:bg-[#141416] border border-slate-300 dark:border-[#2e2e38] rounded-lg px-2.5 py-1.5 focus:outline-emerald-600 dark:focus:outline-[#56b6c2]"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec} className="bg-white dark:bg-[#18181b] text-slate-800 dark:text-zinc-200">
                  Sector: {sec}
                </option>
              ))}
            </select>

            {/* Market Cap filter */}
            <select
              value={selectedMarketCap}
              onChange={(e) => setSelectedMarketCap(e.target.value)}
              className="text-xs text-slate-700 dark:text-zinc-200 bg-white dark:bg-[#141416] border border-slate-300 dark:border-[#2e2e38] rounded-lg px-2.5 py-1.5 focus:outline-emerald-600 dark:focus:outline-[#56b6c2]"
            >
              <option value="All" className="bg-white dark:bg-[#18181b] text-slate-800 dark:text-zinc-200">All Market Caps</option>
              <option value="Giant" className="bg-white dark:bg-[#18181b] text-slate-800 dark:text-zinc-200">Giant Cap</option>
              <option value="Large" className="bg-white dark:bg-[#18181b] text-slate-800 dark:text-zinc-200">Large Cap</option>
              <option value="Mid" className="bg-white dark:bg-[#18181b] text-slate-800 dark:text-zinc-200">Mid Cap</option>
              <option value="Small" className="bg-white dark:bg-[#18181b] text-slate-800 dark:text-zinc-200">Small Cap</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Showing {filteredStocks.length} of {consolidatedStocks.length} holdings
            </span>
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-emerald-800 dark:hover:text-[#56b6c2] bg-white dark:bg-[#1e1e24] hover:bg-slate-50 dark:hover:bg-[#262630] border border-slate-300 dark:border-[#2e2e38] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#272731] bg-slate-50 dark:bg-[#1a1b22] text-slate-600 dark:text-zinc-400 font-semibold select-none">
                <th className="py-3 px-4 w-12 text-slate-400 dark:text-zinc-500 font-mono">#</th>
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Market Cap</th>
                <th className="py-3 px-4 text-center">Fund Incidence</th>
                <th className="py-3 px-4 text-right">Effective Weight (%)</th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#252530]">
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 dark:text-zinc-500">
                    No holdings match your filters.
                  </td>
                </tr>
              ) : (
                filteredStocks.map((stock, idx) => {
                  const isExpanded = expandedStock === stock.name;
                  const isHighIncidence = stock.fundCount >= Math.ceil(funds.length * 0.4);

                  return (
                    <React.Fragment key={stock.name}>
                      <tr
                        onClick={() => setExpandedStock(isExpanded ? null : stock.name)}
                        className={`hover:bg-slate-50/80 dark:hover:bg-[#202028] transition-colors cursor-pointer ${
                          isExpanded ? 'bg-slate-50/90 dark:bg-[#1c202a]' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-slate-400 dark:text-zinc-500 font-mono text-[11px]">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                          <div className="flex items-center gap-2">
                            <span>{stock.name}</span>
                            {isHighIncidence && (
                              <span className="text-[10px] font-bold text-amber-800 dark:text-[#e5c07b] bg-amber-100 dark:bg-[#282114] border border-amber-300/30 dark:border-[#473a1e] px-1.5 py-0.5 rounded" title={`Held across ${stock.fundCount} of your funds!`}>
                                {stock.fundCount} Funds
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">{stock.sector}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                              stock.marketCap === 'Giant' || stock.marketCap === 'Large'
                                ? 'bg-blue-50 dark:bg-[#15232d] text-blue-700 dark:text-[#61afef] border border-blue-200 dark:border-[#203a4c]'
                                : stock.marketCap === 'Mid'
                                ? 'bg-purple-50 dark:bg-[#251a2d] text-purple-700 dark:text-[#c678dd] border border-purple-200 dark:border-[#432352]'
                                : 'bg-emerald-50 dark:bg-[#15251d] text-emerald-700 dark:text-[#98c379] border border-emerald-200 dark:border-[#244533]'
                            }`}
                          >
                            {stock.marketCap || 'Mid'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200">
                              {stock.fundCount} / {funds.length}
                            </span>
                            <div className="w-12 h-1.5 bg-slate-200 dark:bg-[#262630] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-600 dark:bg-[#56b6c2] rounded-full"
                                style={{ width: `${(stock.fundCount / funds.length) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2 font-mono font-bold text-slate-900 dark:text-slate-100">
                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-[#262630] rounded-full overflow-hidden hidden sm:block">
                              <div
                                className="h-full bg-emerald-600 dark:bg-[#98c379] rounded-full"
                                style={{ width: `${Math.min(100, stock.effectivePortfolioWeight * 12)}%` }}
                              />
                            </div>
                            <span>{stock.effectivePortfolioWeight.toFixed(2)}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-emerald-600 dark:text-[#56b6c2]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300" />
                          )}
                        </td>
                      </tr>

                      {/* Expanded row showing breakdown of which funds hold this stock */}
                      {isExpanded && (
                        <tr className="bg-emerald-50/30 dark:bg-[#171a22]">
                          <td colSpan={7} className="px-6 py-4 border-y border-slate-200/80 dark:border-[#2a2c38]">
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                              <Layers className="w-3.5 h-3.5 text-emerald-700 dark:text-[#56b6c2]" />
                              <span>
                                Contributing Funds for <strong className="text-emerald-900 dark:text-[#56b6c2]">{stock.name}</strong> ({stock.effectivePortfolioWeight.toFixed(2)}% total portfolio exposure):
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                              {stock.fundsPresentIn.map((fundContrib) => (
                                <div
                                  key={fundContrib.fundId}
                                  className="bg-white dark:bg-[#1c1d25] p-2.5 rounded-lg border border-slate-200 dark:border-[#2b2d3c] text-xs shadow-2xs"
                                >
                                  <div className="font-semibold text-slate-900 dark:text-zinc-100 truncate" title={fundContrib.fundName}>
                                    {fundContrib.fundName}
                                  </div>
                                  <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mt-1">
                                    <span>Weight in fund:</span>
                                    <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">
                                      {fundContrib.weightInFund.toFixed(2)}%
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-emerald-700 dark:text-[#98c379] font-medium">
                                    <span>Portfolio impact:</span>
                                    <span className="font-mono font-bold">
                                      +{fundContrib.effectiveWeight.toFixed(2)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
