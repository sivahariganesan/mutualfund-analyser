import {
  ConsolidatedStock,
  MarketCapCategory,
  MarketCapExposure,
  MutualFund,
  PairwiseOverlap,
  PortfolioConcentrationSummary,
  RedundancyAlert,
  SectorExposure,
  StockHolding,
} from '../types/portfolio';

// Normalize stock names for exact matching across AMC naming differences
export function normalizeStockName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(ltd|limited|inc|corporation|corp|technologies|tech)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Calculates pairwise overlap between two mutual funds.
 * Follows the industry standard weight-based formula: sum(min(wA_i, wB_i))
 */
export function calculatePairwiseOverlap(
  fundA: MutualFund,
  fundB: MutualFund
): PairwiseOverlap {
  const mapA = new Map<string, StockHolding>();
  fundA.holdings.forEach((h) => {
    mapA.set(normalizeStockName(h.name), h);
  });

  const mapB = new Map<string, StockHolding>();
  fundB.holdings.forEach((h) => {
    mapB.set(normalizeStockName(h.name), h);
  });

  const commonStocks: PairwiseOverlap['commonStocks'] = [];
  const uniqueToA: StockHolding[] = [];
  const uniqueToB: StockHolding[] = [];

  let overlapWeightSum = 0;

  // Process A's holdings
  mapA.forEach((holdingA, key) => {
    if (mapB.has(key)) {
      const holdingB = mapB.get(key)!;
      const minWeight = Math.min(holdingA.weight, holdingB.weight);
      overlapWeightSum += minWeight;

      commonStocks.push({
        name: holdingA.name,
        sector: holdingA.sector,
        weightA: holdingA.weight,
        weightB: holdingB.weight,
        overlapWeight: Number(minWeight.toFixed(2)),
        diff: Number((holdingA.weight - holdingB.weight).toFixed(2)),
      });
    } else {
      uniqueToA.push(holdingA);
    }
  });

  // Process B's unique holdings
  mapB.forEach((holdingB, key) => {
    if (!mapA.has(key)) {
      uniqueToB.push(holdingB);
    }
  });

  // Sort common stocks by overlap weight descending
  commonStocks.sort((a, b) => b.overlapWeight - a.overlapWeight);
  uniqueToA.sort((a, b) => b.weight - a.weight);
  uniqueToB.sort((a, b) => b.weight - a.weight);

  const commonStocksCount = commonStocks.length;
  // If actual total stocks count of fund is larger than displayed list, calculate true unique count
  const fundAUniqueCount = Math.max(0, fundA.totalStocksCount - commonStocksCount);
  const fundBUniqueCount = Math.max(0, fundB.totalStocksCount - commonStocksCount);
  const totalUniqueCount = fundAUniqueCount + fundBUniqueCount + commonStocksCount;

  const overlapWeightPercent = Number(overlapWeightSum.toFixed(1));
  const jaccardOverlapPercent = totalUniqueCount > 0
    ? Number(((commonStocksCount / totalUniqueCount) * 100).toFixed(1))
    : 0;

  let overlapRating: PairwiseOverlap['overlapRating'] = 'Low';
  if (overlapWeightPercent >= 45) {
    overlapRating = 'Very High';
  } else if (overlapWeightPercent >= 35) {
    overlapRating = 'High';
  } else if (overlapWeightPercent >= 18) {
    overlapRating = 'Moderate';
  } else {
    overlapRating = 'Low';
  }

  return {
    fundA,
    fundB,
    overlapWeightPercent,
    jaccardOverlapPercent,
    commonStocksCount,
    fundAUniqueCount,
    fundBUniqueCount,
    totalUniqueCount,
    overlapRating,
    commonStocks,
    uniqueToA,
    uniqueToB,
  };
}

/**
 * Computes an N x N overlap matrix across any number of funds (e.g. 2 to 15+).
 */
export function calculateMultiFundMatrix(funds: MutualFund[]) {
  const n = funds.length;
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const detailedPairs: Record<string, PairwiseOverlap> = {};

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 100;
      } else if (i < j) {
        const pair = calculatePairwiseOverlap(funds[i], funds[j]);
        matrix[i][j] = pair.overlapWeightPercent;
        matrix[j][i] = pair.overlapWeightPercent;
        const key = `${funds[i].id}__${funds[j].id}`;
        const reverseKey = `${funds[j].id}__${funds[i].id}`;
        detailedPairs[key] = pair;
        detailedPairs[reverseKey] = pair;
      }
    }
  }

  return { matrix, detailedPairs };
}

/**
 * Consolidates all holdings across selected funds into an aggregate portfolio view
 * taking into account custom fund portfolio allocation weights.
 */
export function calculateConsolidatedHoldings(
  funds: MutualFund[],
  useEqualWeights: boolean = true
): ConsolidatedStock[] {
  if (funds.length === 0) return [];

  // Determine normalized allocation weights for each fund
  let fundWeights: number[] = [];
  if (useEqualWeights) {
    const eqWeight = 100 / funds.length;
    fundWeights = funds.map(() => eqWeight);
  } else {
    const sumUserWeights = funds.reduce((acc, f) => acc + (f.portfolioWeight || 0), 0);
    fundWeights = funds.map((f) =>
      sumUserWeights > 0 ? ((f.portfolioWeight || 0) / sumUserWeights) * 100 : 100 / funds.length
    );
  }

  const stockMap = new Map<string, ConsolidatedStock>();

  funds.forEach((fund, fundIdx) => {
    const fundAllocationPercent = fundWeights[fundIdx]; // e.g. 10%

    fund.holdings.forEach((holding) => {
      const key = normalizeStockName(holding.name);
      // Effective portfolio weight = (weightInFund * fundAllocation) / 100
      const effectiveContribution = (holding.weight * fundAllocationPercent) / 100;

      if (!stockMap.has(key)) {
        stockMap.set(key, {
          name: holding.name,
          sector: holding.sector,
          marketCap: holding.marketCap,
          effectivePortfolioWeight: effectiveContribution,
          unweightedAverageWeight: holding.weight / funds.length,
          fundsPresentIn: [
            {
              fundId: fund.id,
              fundName: fund.name,
              fundCategory: fund.category,
              weightInFund: holding.weight,
              effectiveWeight: Number(effectiveContribution.toFixed(2)),
            },
          ],
          fundCount: 1,
        });
      } else {
        const existing = stockMap.get(key)!;
        existing.effectivePortfolioWeight += effectiveContribution;
        existing.unweightedAverageWeight += holding.weight / funds.length;
        existing.fundCount += 1;
        existing.fundsPresentIn.push({
          fundId: fund.id,
          fundName: fund.name,
          fundCategory: fund.category,
          weightInFund: holding.weight,
          effectiveWeight: Number(effectiveContribution.toFixed(2)),
        });
      }
    });
  });

  const list = Array.from(stockMap.values()).map((stock) => ({
    ...stock,
    effectivePortfolioWeight: Number(stock.effectivePortfolioWeight.toFixed(2)),
    unweightedAverageWeight: Number(stock.unweightedAverageWeight.toFixed(2)),
  }));

  // Sort descending by effective portfolio weight
  list.sort((a, b) => b.effectivePortfolioWeight - a.effectivePortfolioWeight);
  return list;
}

/**
 * Calculates portfolio sector breakdown
 */
export function calculateSectorExposure(consolidatedStocks: ConsolidatedStock[]): SectorExposure[] {
  const map = new Map<string, { weight: number; count: number }>();

  consolidatedStocks.forEach((stk) => {
    const s = stk.sector || 'Others';
    if (!map.has(s)) {
      map.set(s, { weight: stk.effectivePortfolioWeight, count: 1 });
    } else {
      const curr = map.get(s)!;
      curr.weight += stk.effectivePortfolioWeight;
      curr.count += 1;
    }
  });

  return Array.from(map.entries())
    .map(([sector, data]) => ({
      sector,
      weight: Number(data.weight.toFixed(1)),
      stockCount: data.count,
    }))
    .sort((a, b) => b.weight - a.weight);
}

/**
 * Calculates market cap exposure breakdown (Giant, Large, Mid, Small)
 */
export function calculateMarketCapExposure(consolidatedStocks: ConsolidatedStock[]): MarketCapExposure[] {
  const categories: MarketCapCategory[] = ['Giant', 'Large', 'Mid', 'Small', 'Micro'];
  const totals: Record<MarketCapCategory, number> = {
    Giant: 0,
    Large: 0,
    Mid: 0,
    Small: 0,
    Micro: 0,
  };

  consolidatedStocks.forEach((stk) => {
    const cat = stk.marketCap || 'Mid';
    totals[cat] = (totals[cat] || 0) + stk.effectivePortfolioWeight;
  });

  return categories
    .map((category) => ({
      category,
      weight: Number(totals[category].toFixed(1)),
    }))
    .filter((c) => c.weight > 0);
}

/**
 * Calculates full portfolio concentration summary, Herfindahl Index, and redundancy alerts.
 */
export function calculatePortfolioConcentration(
  funds: MutualFund[],
  consolidatedStocks: ConsolidatedStock[],
  matrix: number[][]
): PortfolioConcentrationSummary {
  const n = funds.length;
  if (n === 0) {
    return {
      totalFunds: 0,
      totalUniqueStocks: 0,
      top5Weight: 0,
      top10Weight: 0,
      top20Weight: 0,
      averagePairwiseOverlap: 0,
      maxOverlapPair: null,
      minOverlapPair: null,
      herfindahlIndex: 0,
      diversificationScore: 0,
      diversificationLevel: 'Moderate Concentration',
      redundancyAlerts: [],
    };
  }

  const top5Weight = Number(
    consolidatedStocks.slice(0, 5).reduce((acc, s) => acc + s.effectivePortfolioWeight, 0).toFixed(1)
  );
  const top10Weight = Number(
    consolidatedStocks.slice(0, 10).reduce((acc, s) => acc + s.effectivePortfolioWeight, 0).toFixed(1)
  );
  const top20Weight = Number(
    consolidatedStocks.slice(0, 20).reduce((acc, s) => acc + s.effectivePortfolioWeight, 0).toFixed(1)
  );

  // Pairwise stats (off-diagonal)
  let pairCount = 0;
  let overlapSum = 0;
  let maxOverlap = -1;
  let minOverlap = 999;
  let maxPair: { fundA: string; fundB: string; overlap: number } | null = null;
  let minPair: { fundA: string; fundB: string; overlap: number } | null = null;
  const redundancyAlerts: RedundancyAlert[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const val = matrix[i][j];
      overlapSum += val;
      pairCount++;

      if (val > maxOverlap) {
        maxOverlap = val;
        maxPair = { fundA: funds[i].name, fundB: funds[j].name, overlap: val };
      }
      if (val < minOverlap) {
        minOverlap = val;
        minPair = { fundA: funds[i].name, fundB: funds[j].name, overlap: val };
      }

      // Check redundancy
      if (val >= 40) {
        redundancyAlerts.push({
          fundAId: funds[i].id,
          fundAName: funds[i].name,
          fundBId: funds[j].id,
          fundBName: funds[j].name,
          overlapPercent: val,
          severity: val >= 50 ? 'critical' : 'warning',
          recommendation: `High overlap of ${val}%. Both funds invest in near-identical large holdings. Consolidating into one may save expense ratios without reducing true diversification.`,
        });
      } else if (val >= 30) {
        redundancyAlerts.push({
          fundAId: funds[i].id,
          fundAName: funds[i].name,
          fundBId: funds[j].id,
          fundBName: funds[j].name,
          overlapPercent: val,
          severity: 'info',
          recommendation: `Moderate overlap of ${val}%. Some redundancy exists between these funds (e.g. key banking & IT giants).`,
        });
      }
    }
  }

  const averagePairwiseOverlap = pairCount > 0 ? Number((overlapSum / pairCount).toFixed(1)) : 0;

  // Herfindahl-Hirschman Index (HHI)
  // Sum of squared weights in percentage: e.g. 8.5% -> 8.5^2 = 72.25
  const hhi = Math.round(
    consolidatedStocks.reduce((sum, s) => sum + Math.pow(s.effectivePortfolioWeight, 2), 0)
  );

  // Diversification score from 0 to 100:
  // Lower overlap + lower top-10 concentration + healthy stock count => higher score
  let score = 100;
  // Penalty for high average overlap
  score -= Math.min(35, averagePairwiseOverlap * 0.8);
  // Penalty for top 10 concentration
  if (top10Weight > 50) {
    score -= (top10Weight - 50) * 0.8;
  }
  // Penalty if redundant pairs exist
  score -= Math.min(20, redundancyAlerts.filter((r) => r.severity === 'critical').length * 8);

  score = Math.max(10, Math.min(98, Math.round(score)));

  let diversificationLevel: PortfolioConcentrationSummary['diversificationLevel'] = 'Good';
  if (score >= 80) diversificationLevel = 'Excellent';
  else if (score >= 65) diversificationLevel = 'Good';
  else if (score >= 45) diversificationLevel = 'Moderate Concentration';
  else diversificationLevel = 'High Concentration / Redundant';

  redundancyAlerts.sort((a, b) => b.overlapPercent - a.overlapPercent);

  return {
    totalFunds: n,
    totalUniqueStocks: consolidatedStocks.length,
    top5Weight,
    top10Weight,
    top20Weight,
    averagePairwiseOverlap,
    maxOverlapPair: maxPair,
    minOverlapPair: minPair,
    herfindahlIndex: hhi,
    diversificationScore: score,
    diversificationLevel,
    redundancyAlerts,
  };
}
