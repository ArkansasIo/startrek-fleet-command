import React from "react";
import { Magastructer } from "../lib/Magastructers";

export interface MagastructersTechCenterProps {
  magastructers: Magastructer[];
  onResearch: (index: number, tech: string) => void;
}

export const MagastructersTechCenter: React.FC<MagastructersTechCenterProps> = ({
  magastructers,
  onResearch,
}) => {
  return (
    <div className="magastructers-tech-center">
      <h2>Magastructers Technology & Research Center</h2>
      {magastructers.length === 0 ? (
        <p>No Magastructers available for research.</p>
      ) : (
        <ul>
          {magastructers.map((m, idx) => (
            <li key={m.details.name + idx} className="magastructer-tech-card">
              <h3>{m.details.name} (Level {m.details.level})</h3>
              <div>
                <strong>Current Research:</strong> {m.details.description}
              </div>
              <div>
                <strong>Available Technologies:</strong>
                <ul>
                  <li>Shield Enhancement</li>
                  <li>Energy Optimization</li>
                  <li>Stealth Systems</li>
                  <li>Repair Automation</li>
                  <li>Capacity Expansion</li>
                </ul>
              </div>
              <button onClick={() => onResearch(idx, "Shield Enhancement")}>Research Shield Enhancement</button>
              <button onClick={() => onResearch(idx, "Energy Optimization")}>Research Energy Optimization</button>
              <button onClick={() => onResearch(idx, "Stealth Systems")}>Research Stealth Systems</button>
              <button onClick={() => onResearch(idx, "Repair Automation")}>Research Repair Automation</button>
              <button onClick={() => onResearch(idx, "Capacity Expansion")}>Research Capacity Expansion</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
