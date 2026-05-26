import { describe, it } from "node:test";
import assert from "node:assert";
import { findHarvestCandidates, findSubstitute, buildHarvestPlan } from "../src/harvest.js";
import { isWashSaleRisk } from "../src/wash_sale.js";

describe("harvest", () => {
  it("finds loss positions", () => {
    const c = findHarvestCandidates(
      [{ symbol: "X", pnl: -500 }, { symbol: "Y", pnl: 100 }],
      { tax_year: 2026 }
    );
    assert.equal(c.length, 1);
  });

  it("skips substitute already in portfolio", () => {
    const sub = findSubstitute(
      "HGLG11",
      [{ symbol: "XPLG11" }, { symbol: "LVBI11" }],
      Date.now()
    );
    assert.equal(sub, null);
  });

  it("picks next correlated substitute when first is held", () => {
    const sub = findSubstitute("HGLG11", [{ symbol: "XPLG11" }], Date.now());
    assert.equal(sub?.symbol, "LVBI11");
  });

  it("builds plan with tax saving", () => {
    const plan = buildHarvestPlan([{ symbol: "PETR4", pnl: -1000 }], {
      tax_year: 2026,
      marginal_rate: 0.15,
    });
    assert.equal(plan.length, 1);
    assert.ok(plan[0].estimatedTaxSaving > 0);
  });

  it("wash sale detects same ticker", () => {
    assert.ok(isWashSaleRisk("PETR4", "PETR4", Date.now(), Date.now()));
  });
});
