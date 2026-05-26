import express from "express";
import { findHarvestCandidates, findSubstitute } from "./harvest.js";

const app = express();
app.use(express.json());

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.post("/api/harvest/run", async (req, res) => {
  const { positions = [], tax_year } = req.body;
  const candidates = findHarvestCandidates(positions, { tax_year });
  const plan = candidates.map((c) => ({
    ...c,
    substitute: findSubstitute(c.symbol, positions),
  }));
  res.json({ plan, dry_run: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Harvest API :${PORT}`));
