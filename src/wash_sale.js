/** Regras wash sale — janela configurável em dias */

export function isWashSaleRisk(soldSymbol, candidateSymbol, soldAt, now, windowDays = 30) {
  if (soldSymbol === candidateSymbol) return true;
  const ms = windowDays * 24 * 60 * 60 * 1000;
  return now - soldAt < ms && soldSymbol.split(".")[0] === candidateSymbol.split(".")[0];
}

export function filterSubstitutes(substitutes, soldSymbol, soldAt, now = Date.now()) {
  return substitutes.filter((s) => !isWashSaleRisk(soldSymbol, s.symbol, soldAt, now));
}
