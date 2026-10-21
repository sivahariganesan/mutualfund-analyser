/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MutualFund } from './types/portfolio';
import { POPULAR_MUTUAL_FUNDS, PORTFOLIO_PRESETS } from './data/mockFunds';
import {
  calculateConsolidatedHoldings,
  calculateMarketCapExposure,
  calculateMultiFundMatrix,
  calculatePairwiseOverlap,
  calculatePortfolioConcentration,
  calculateSectorExposure,
} from './utils/overlapCalculator';
import { Navbar } from './components/Navbar';
import { FundSelectorTray } from './components/FundSelectorTray';
import { HeatmapMatrix } from './components/HeatmapMatrix';
import { PairwiseDeepDive } from './components/PairwiseDeepDive';
import { AggregatedHoldings } from './components/AggregatedHoldings';
import { SectorMarketCapView } from './components/SectorMarketCapView';
import { RedundancyOptimizer } from './components/RedundancyOptimizer';
import { AddFundModal } from './components/AddFundModal';
import { DataSourceModal } from './components/DataSourceModal';
import {
  Grid,
  GitCompare,
  Layers,
  PieChart,
  ShieldAlert,
  Info,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export default function App() {
  // Initialize with the user's requested 11-fund preset!
  const defaultPreset = PORTFOLIO_PRESETS[0]; // 11 funds
  const [activePresetId, setActivePresetId] = useState<string>(defaultPreset.id);

  // Active funds in user's portfolio
  const [funds, setFunds] = useState<MutualFund[]>(() => {
    return defaultPreset.fundIds
      .map((id) => POPULAR_MUTUAL_FUNDS.find((f) => f.id === id))
      .filter((f): f is MutualFund => f !== undefined);
  });

  // Pairwise selection for deep-dive (default to the two in user screenshot!)
  const [selectedAId, setSelectedAId] = useState<string>('icici-pru-opportunities');
  const [selectedBId, setSelectedBId] = useState<string>('parag-parikh-flexi-cap');

  // Weights configuration
  const [useEqualWeights, setUseEqualWeights] = useState<boolean>(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState<boolean>(false);

  // Active navigation tab
  const [activeViewTab, setActiveViewTab] = useState<
    'matrix' | 'pairwise' | 'aggregated' | 'sectors' | 'redundancy'
  >('matrix');

  // Multi-fund matrix calculation
  const { matrix, detailedPairs } = useMemo(() => {
    return calculateMultiFundMatrix(funds);
  }, [funds]);

  // Consolidated holdings calculation
  const consolidatedStocks = useMemo(() => {
    return calculateConsolidatedHoldings(funds, useEqualWeights);
  }, [funds, useEqualWeights]);

  // Concentration and portfolio summary
  const summary = useMemo(() => {
    return calculatePortfolioConcentration(funds, consolidatedStocks, matrix);
  }, [funds, consolidatedStocks, matrix]);

  // Sector and market cap allocations
  const sectorExposure = useMemo(() => {
    return calculateSectorExposure(consolidatedStocks);
  }, [consolidatedStocks]);

  const marketCapExposure = useMemo(() => {
    return calculateMarketCapExposure(consolidatedStocks);
  }, [consolidatedStocks]);

  // Pairwise overlap data for selected pair
  const currentPairOverlap = useMemo(() => {
    const fundA = funds.find((f) => f.id === selectedAId) || funds[0];
    const fundB = funds.find((f) => f.id === selectedBId) || funds[1] || funds[0];
    return calculatePairwiseOverlap(fundA, fundB);
  }, [funds, selectedAId, selectedBId]);

  // Handle preset selection
  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    const preset = PORTFOLIO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const newFunds = preset.fundIds
      .map((id) => POPULAR_MUTUAL_FUNDS.find((f) => f.id === id))
      .filter((f): f is MutualFund => f !== undefined);

    setFunds(newFunds);
    if (newFunds.length >= 2) {
      setSelectedAId(newFunds[0].id);
      setSelectedBId(newFunds[1].id);
    }
  };

  // Add fund handlers
  const handleAddExistingFund = (fund: MutualFund) => {
    if (!funds.some((f) => f.id === fund.id)) {
      setFunds([...funds, fund]);
    }
  };

  const handleAddCustomFund = (customFund: MutualFund) => {
    setFunds([...funds, customFund]);
  };

  // Remove fund
  const handleRemoveFund = (fundId: string) => {
    if (funds.length <= 2) return; // Keep at least 2 funds for comparison
    const updated = funds.filter((f) => f.id !== fundId);
    setFunds(updated);

    // If removed fund was in active pair, update selection
    if (selectedAId === fundId) {
      setSelectedAId(updated[0].id);
    }
    if (selectedBId === fundId) {
      setSelectedBId(updated[1].id);
    }
  };

  // Update fund weight
  const handleUpdateWeight = (fundId: string, newWeight: number) => {
    setFunds(
      funds.map((f) => (f.id === fundId ? { ...f, portfolioWeight: newWeight } : f))
    );
  };

  // Switch to pair and open Pairwise Deep Dive
  const handleSelectPair = (fundAId: string, fundBId: string) => {
    setSelectedAId(fundAId);
    setSelectedBId(fundBId);
    setActiveViewTab('pairwise');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar
        onSelectPreset={handleSelectPreset}
        activePresetId={activePresetId}
        totalFunds={funds.length}
        onOpenDataSources={() => setIsDataSourceModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome & Quick Summary Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-emerald-800/40 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-emerald-800/60 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 border border-emerald-700/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{funds.length} Schemes Analyzed</span>
                <span>&bull;</span>
                <span>{summary.totalUniqueStocks} Unique Companies</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Mutual Funds Overlap &amp; Concentration Engine
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Compare across 2 to 15+ mutual funds simultaneously. Detect hidden holding duplication, identify concentrated single-stock exposures, and optimize true portfolio diversification.
              </p>
            </div>

            {/* Quick KPI Pill Cluster */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] uppercase font-semibold text-emerald-300 block">Avg Overlap</span>
                <span className="text-xl font-bold font-mono">{summary.averagePairwiseOverlap}%</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] uppercase font-semibold text-emerald-300 block">Top 10 Weight</span>
                <span className="text-xl font-bold font-mono">{summary.top10Weight}%</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-semibold text-emerald-300 block">Health Score</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {summary.diversificationScore}/100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Schemes Manager Tray */}
        <FundSelectorTray
          funds={funds}
          onRemoveFund={handleRemoveFund}
          onUpdateWeight={handleUpdateWeight}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          useEqualWeights={useEqualWeights}
          onToggleEqualWeights={setUseEqualWeights}
          selectedAId={selectedAId}
          selectedBId={selectedBId}
          onSelectPair={handleSelectPair}
        />

        {/* View Navigation Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex flex-wrap items-center gap-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveViewTab('matrix')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeViewTab === 'matrix'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Overlap Heatmap Matrix</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                activeViewTab === 'matrix' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {funds.length}&times;{funds.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('pairwise')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeViewTab === 'pairwise'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>Pairwise Venn &amp; Holdings</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                activeViewTab === 'pairwise' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {currentPairOverlap.overlapWeightPercent}%
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('aggregated')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeViewTab === 'aggregated'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Consolidated Holdings</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                activeViewTab === 'aggregated' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {consolidatedStocks.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('sectors')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeViewTab === 'sectors'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Sector &amp; Market Cap</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('redundancy')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeViewTab === 'redundancy'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Redundancy Optimizer</span>
            {summary.redundancyAlerts.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-500 text-white">
                {summary.redundancyAlerts.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content Views */}
        <div>
          {activeViewTab === 'matrix' && (
            <HeatmapMatrix
              funds={funds}
              matrix={matrix}
              detailedPairs={detailedPairs}
              onSelectPair={handleSelectPair}
              selectedAId={selectedAId}
              selectedBId={selectedBId}
            />
          )}

          {activeViewTab === 'pairwise' && (
            <PairwiseDeepDive
              funds={funds}
              overlapData={currentPairOverlap}
              selectedAId={selectedAId}
              selectedBId={selectedBId}
              onSelectA={(id) => setSelectedAId(id)}
              onSelectB={(id) => setSelectedBId(id)}
            />
          )}

          {activeViewTab === 'aggregated' && (
            <AggregatedHoldings
              consolidatedStocks={consolidatedStocks}
              funds={funds}
              top5Weight={summary.top5Weight}
              top10Weight={summary.top10Weight}
              totalUniqueStocks={summary.totalUniqueStocks}
              herfindahlIndex={summary.herfindahlIndex}
              diversificationScore={summary.diversificationScore}
              diversificationLevel={summary.diversificationLevel}
            />
          )}

          {activeViewTab === 'sectors' && (
            <SectorMarketCapView
              sectorExposure={sectorExposure}
              marketCapExposure={marketCapExposure}
            />
          )}

          {activeViewTab === 'redundancy' && (
            <RedundancyOptimizer
              funds={funds}
              redundancyAlerts={summary.redundancyAlerts}
              consolidatedStocks={consolidatedStocks}
              onSelectPair={handleSelectPair}
              onRemoveFund={handleRemoveFund}
            />
          )}
        </div>
      </main>

      {/* Add Fund Modal */}
      <AddFundModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        selectedFundIds={new Set(funds.map((f) => f.id))}
        onAddExistingFund={handleAddExistingFund}
        onAddCustomFund={handleAddCustomFund}
      />

      {/* Data Sources & Open APIs Modal */}
      <DataSourceModal
        isOpen={isDataSourceModalOpen}
        onClose={() => setIsDataSourceModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">PortfolioOverlap Pro</span>
            <span>&bull;</span>
            <span>Analyzes portfolio concentration &amp; diversification risks across mutual funds</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Holdings data normalized for exact equity overlaps. Portfolio weights adjust effective stock exposures.
          </div>
        </div>
      </footer>
    </div>
  );
}
