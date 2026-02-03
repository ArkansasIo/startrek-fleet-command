import { Router } from "express";
import { Magastructer } from "../../client/lib/Magastructers";

const router = Router();

// In-memory store for demo purposes
let magastructers: Magastructer[] = [];

router.get("/magastructers", (req, res) => {
  res.json(magastructers.map((m) => m.getSummary()));
});

router.post("/magastructers", (req, res) => {
  try {
    const { details, stats, subStats, attributes, features } = req.body;
    const newMagastructer = new Magastructer(details, stats, subStats, attributes, features);
    magastructers.push(newMagastructer);
    res.status(201).json(newMagastructer.getSummary());
  } catch (err) {
    res.status(400).json({ error: "Invalid Magastructer data" });
  }
});

router.post("/magastructers/:index/upgrade", (req, res) => {
  const idx = parseInt(req.params.index, 10);
  if (magastructers[idx]) {
    magastructers[idx].upgrade();
    res.json(magastructers[idx].getSummary());
  } else {
    res.status(404).json({ error: "Magastructer not found" });
  }
});

router.post("/magastructers/:index/stealth", (req, res) => {
  const idx = parseInt(req.params.index, 10);
  if (magastructers[idx]) {
    magastructers[idx].activateStealth();
    res.json(magastructers[idx].getSummary());
  } else {
    res.status(404).json({ error: "Magastructer not found" });
  }
});

export default router;
