import React from "react";
import { Magastructer } from "../lib/Magastructers";

export interface MagastructersDashboardProps {
  magastructers: Magastructer[];
  onUpgrade: (index: number) => void;
  onActivateStealth: (index: number) => void;
}

export const MagastructersDashboard: React.FC<MagastructersDashboardProps> = ({
  magastructers,
  onUpgrade,
  onActivateStealth,
}) => {
  return (
    <div className="magastructers-dashboard">
      <h2>Magastructers</h2>
      {magastructers.length === 0 ? (
        <p>No Magastructers available.</p>
      ) : (
        <ul>
          {magastructers.map((m, idx) => (
            <li key={m.details.name + idx} className="magastructer-card">
              <h3>{m.details.name} (Level {m.details.level})</h3>
              <p>{m.details.description}</p>
              <div>
                <strong>Stats:</strong> Power: {m.stats.power}, Defense: {m.stats.defense}, Speed: {m.stats.speed}, Capacity: {m.stats.capacity}
              </div>
              <div>
                <strong>Sub Stats:</strong> Shield: {m.subStats.shield}, Energy Efficiency: {m.subStats.energyEfficiency}, Repair Rate: {m.subStats.repairRate}, Stealth: {m.subStats.stealth}
              </div>
              <div>
                <strong>Attributes:</strong> Rarity: {m.attributes.rarity}, Faction: {m.attributes.faction}, Location: {m.attributes.location}, Active: {m.attributes.isActive ? "Yes" : "No"}
              </div>
              <button onClick={() => onUpgrade(idx)} disabled={!m.features.canUpgrade}>Upgrade</button>
              <button onClick={() => onActivateStealth(idx)} disabled={!m.features.canStealth}>Activate Stealth</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
