import { describe, it } from "node:test";
import assert from "node:assert";
import { findHarvestCandidates, findSubstitute } from "../src/harvest.js";

describe("harvest", () => {
  it("finds loss positions", () => {
    const c = findHarvestCandidates(
      [{ symbol: "X", pnl: -500 }, { symbol: "Y", pnl: 100 }],
      { tax_year: 2026 }
    );
    assert.equal(c.length, 1);
  });

  it("blocks wash sale same symbol substitute", () => {
    const sub = findSubstitute("HGLG11", [{ symbol: "XPLG11" }]);
    assert.equal(sub, null);
  });
});
