export type MarketCapCategory = 'Giant' | 'Large' | 'Mid' | 'Small' | 'Micro';

export interface StockHolding {
  ticker?: string;
  name: string;
  weight: number; // percentage, e.g. 7.75 for 7.75%
  sector: string;
  marketCap?: MarketCapCategory;
}

export interface MutualFund {
  id: string;
  name: string;
  code?: string;
  category: 'Flexi Cap' | 'Large Cap' | 'Large & Mid Cap' | 'Mid Cap' | 'Small Cap' | 'Thematic / Sectoral' | 'ELSS / Tax Saver' | 'Index / ETF' | 'Global / US';
  amc: string; // Asset Management Company
  expenseRatio?: number;
  aumCr?: number; // AUM in Crores (or millions)
  totalStocksCount: number;
  portfolioWeight: number; // User's allocation percentage in their portfolio (e.g. 10%)
  holdings: StockHolding[];
  isCustom?: boolean;
}

export interface PairwiseOverlap {
  fundA: MutualFund;
  fundB: MutualFund;
  overlapWeightPercent: number; // Sum of min(wA, wB)
  jaccardOverlapPercent: number; // Common / (Total Unique) * 100
  commonStocksCount: number;
  fundAUniqueCount: number;
  fundBUniqueCount: number;
  totalUniqueCount: number;
  overlapRating: 'Low' | 'Moderate' | 'High' | 'Very High';
  commonStocks: Array<{
    name: string;
    sector: string;
    weightA: number;
    weightB: number;
    overlapWeight: number; // min(wA, wB)
    diff: number; // weightA - weightB
  }>;
  uniqueToA: StockHolding[];
  uniqueToB: StockHolding[];
}

export interface ConsolidatedStock {
  name: string;
  sector: string;
  marketCap?: MarketCapCategory;
  effectivePortfolioWeight: number; // Weighted by user's fund allocations
  unweightedAverageWeight: number;
  fundsPresentIn: Array<{
    fundId: string;
    fundName: string;
    fundCategory: string;
    weightInFund: number;
    effectiveWeight: number;
  }>;
  fundCount: number;
}

export interface SectorExposure {
  sector: string;
  weight: number;
  stockCount: number;
}

export interface MarketCapExposure {
  category: MarketCapCategory;
  weight: number;
}

export interface RedundancyAlert {
  fundAId: string;
  fundAName: string;
  fundBId: string;
  fundBName: string;
  overlapPercent: number;
  recommendation: string;
  severity: 'warning' | 'critical' | 'info';
}

export interface PortfolioConcentrationSummary {
  totalFunds: number;
  totalUniqueStocks: number;
  top5Weight: number;
  top10Weight: number;
  top20Weight: number;
  averagePairwiseOverlap: number;
  maxOverlapPair: { fundA: string; fundB: string; overlap: number } | null;
  minOverlapPair: { fundA: string; fundB: string; overlap: number } | null;
  herfindahlIndex: number; // HHI metric
  diversificationScore: number; // 0 to 100 score
  diversificationLevel: 'Excellent' | 'Good' | 'Moderate Concentration' | 'High Concentration / Redundant';
  redundancyAlerts: RedundancyAlert[];
}
