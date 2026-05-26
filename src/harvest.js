import { filterSubstitutes } from "./wash_sale.js";

/** @param {Array<{symbol:string, pnl:number, sector?:string, acquiredAt?:number}>} positions */

export function findHarvestCandidates(positions, { tax_year, min_loss = 100 }) {
  return positions
    .filter((p) => p.pnl < -min_loss)
    .map((p) => ({
      symbol: p.symbol,
      loss: Math.abs(p.pnl),
      tax_year,
      action: "sell",
      acquiredAt: p.acquiredAt ?? Date.now() - 90 * 86400000,
    }));
}

const CORR_MATRIX = {
  HGLG11: [
    { symbol: "XPLG11", corr: 0.88, sector: "logistics" },
    { symbol: "LVBI11", corr: 0.86, sector: "logistics" },
  ],
  PETR4: [
    { symbol: "PRIO3", corr: 0.82, sector: "energy" },
    { symbol: "RRRP3", corr: 0.8, sector: "energy" },
  ],
  VALE3: [{ symbol: "CMIN3", corr: 0.87, sector: "mining" }],
};

export function findSubstitute(symbol, positions, soldAt) {
  const held = new Set(positions.map((p) => p.symbol));
  const options = CORR_MATRIX[symbol] || [];
  const eligible = filterSubstitutes(
    options.filter((o) => o.corr >= 0.85),
    symbol,
    soldAt
  );
  return eligible.find((o) => !held.has(o.symbol)) || null;
}

export function buildHarvestPlan(positions, opts) {
  const candidates = findHarvestCandidates(positions, opts);
  return candidates.map((c) => ({
    ...c,
    substitute: findSubstitute(c.symbol, positions, c.acquiredAt),
    estimatedTaxSaving: c.loss * (opts.marginal_rate ?? 0.15),
  }));
}
