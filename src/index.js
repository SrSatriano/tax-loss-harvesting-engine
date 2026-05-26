import express from "express";
import { buildHarvestPlan } from "./harvest.js";

const app = express();
app.use(express.json());

app.get("/health", (_, res) => res.json({ status: "ok", version: "1.0.0" }));

app.post("/api/harvest/run", (req, res) => {
  const { positions = [], tax_year = new Date().getFullYear(), marginal_rate = 0.15 } =
    req.body;
  const plan = buildHarvestPlan(positions, { tax_year, marginal_rate });
  const totalLoss = plan.reduce((s, p) => s + p.loss, 0);
  const totalSaving = plan.reduce((s, p) => s + p.estimatedTaxSaving, 0);
  res.json({
    plan,
    summary: { positions: plan.length, totalLoss, totalSaving },
    dry_run: req.body.execute !== true,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Harvest API http://localhost:${PORT}`));
