/** @param {Array<{symbol:string, pnl:number, sector?:string}>} positions */

export function findHarvestCandidates(positions, { tax_year, min_loss = 100 }) {
  return positions
    .filter((p) => p.pnl < -min_loss)
    .map((p) => ({
      symbol: p.symbol,
      loss: Math.abs(p.pnl),
      tax_year,
      action: "sell",
    }));
}

const CORR_MATRIX = {
  HGLG11: [{ symbol: "XPLG11", corr: 0.88, sector: "logistics" }],
  PETR4: [{ symbol: "PRIO3", corr: 0.82, sector: "energy" }],
};

export function findSubstitute(symbol, positions) {
  const held = new Set(positions.map((p) => p.symbol));
  const options = CORR_MATRIX[symbol] || [];
  return options.find((o) => !held.has(o.symbol) && o.corr >= 0.85) || null;
}
