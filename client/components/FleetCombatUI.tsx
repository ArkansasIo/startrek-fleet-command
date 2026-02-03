// FleetCombatUI.tsx
// React components for fleet combat visualization and interaction

import React, { useState, useEffect } from 'react';
import {
  FleetCombat,
  CombatRound,
  FleetCombatResult,
  Stargate,
  JumpGate,
  HyperspaceRoute,
  createFleetCombat,
  executeFleetCombat,
  generateFleetCombatReport,
  transitThroughStargate,
  createStargate,
  createJumpGate,
  createHyperspaceRoute,
} from './GameSystems';

// ===== FLEET COMBAT VIEWER COMPONENT =====

interface FleetCombatViewerProps {
  combat: FleetCombat;
  onClose: () => void;
  onReportGenerated?: (report: any) => void;
}

export const FleetCombatViewer: React.FC<FleetCombatViewerProps> = ({
  combat,
  onClose,
  onReportGenerated,
}) => {
  const [selectedRound, setSelectedRound] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setSelectedRound((prev) =>
        prev < combat.rounds.length - 1 ? prev + 1 : prev
      );
    }, 1000 / playSpeed);

    return () => clearInterval(timer);
  }, [autoPlay, playSpeed, combat.rounds.length]);

  const currentRound = combat.rounds[selectedRound];
  const progress = ((selectedRound + 1) / combat.rounds.length) * 100;

  return (
    <div className="fleet-combat-viewer">
      <div className="combat-header">
        <h2>Fleet Combat Report</h2>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>

      <div className="combat-info">
        <div className="info-section">
          <label>Combat ID:</label>
          <span>{combat.id.substring(0, 16)}...</span>
        </div>
        <div className="info-section">
          <label>Mission Type:</label>
          <span className="mission-type">{combat.missionType.toUpperCase()}</span>
        </div>
        <div className="info-section">
          <label>Transit Method:</label>
          <span className="transit-method">{combat.transitMethod.toUpperCase()}</span>
        </div>
        <div className="info-section">
          <label>Location:</label>
          <span>
            {combat.location.sectorId} ({combat.location.x}, {combat.location.y}, {combat.location.z})
          </span>
        </div>
      </div>

      <div className="combat-timeline">
        <div className="timeline-header">
          <h3>Combat Progress</h3>
          <span className="round-counter">
            Round {selectedRound + 1} / {combat.rounds.length}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {currentRound && (
        <div className="round-details">
          <div className="round-header">
            <h4>Round {currentRound.roundNumber}</h4>
            <p className="summary">{currentRound.summary}</p>
          </div>

          <div className="round-stats">
            <div className="damage-stat">
              <label>Attacker Damage Taken:</label>
              <span className="damage-amount red">
                {Math.floor(currentRound.damageDealt.toAttacker)}
              </span>
            </div>
            <div className="damage-stat">
              <label>Defender Damage Taken:</label>
              <span className="damage-amount red">
                {Math.floor(currentRound.damageDealt.toDefender)}
              </span>
            </div>
          </div>

          <div className="ships-destroyed">
            <div className="destroyed-stat">
              <label>Attacker Ships Lost:</label>
              <span className="lost-count">{currentRound.shipsDestroyed.attacker}</span>
            </div>
            <div className="destroyed-stat">
              <label>Defender Ships Lost:</label>
              <span className="lost-count">{currentRound.shipsDestroyed.defender}</span>
            </div>
          </div>

          <div className="actions-display">
            <div className="action-column">
              <h5>Attacker Actions</h5>
              {currentRound.attackerActions.map((action, idx) => (
                <div key={idx} className="action-item">
                  <span className="action-type">{action.type}</span>
                  <span className="action-ship">{action.shipClass}</span>
                  <span className="action-damage">DMG: {Math.floor(action.damage)}</span>
                </div>
              ))}
            </div>
            <div className="action-column">
              <h5>Defender Actions</h5>
              {currentRound.defenderActions.map((action, idx) => (
                <div key={idx} className="action-item">
                  <span className="action-type">{action.type}</span>
                  <span className="action-ship">{action.shipClass}</span>
                  <span className="action-damage">DMG: {Math.floor(action.damage)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="combat-controls">
        <button
          onClick={() => setSelectedRound(Math.max(0, selectedRound - 1))}
          className="nav-btn prev"
          disabled={selectedRound === 0}
        >
          ← Previous
        </button>

        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className={`play-btn ${autoPlay ? 'playing' : ''}`}
        >
          {autoPlay ? '⏸ Pause' : '▶ Play'}
        </button>

        <select
          value={playSpeed}
          onChange={(e) => setPlaySpeed(Number(e.target.value))}
          className="speed-control"
        >
          <option value={0.5}>0.5x Speed</option>
          <option value={1}>1x Speed</option>
          <option value={2}>2x Speed</option>
          <option value={4}>4x Speed</option>
        </select>

        <button
          onClick={() => setSelectedRound(Math.min(combat.rounds.length - 1, selectedRound + 1))}
          className="nav-btn next"
          disabled={selectedRound >= combat.rounds.length - 1}
        >
          Next →
        </button>
      </div>

      {combat.result && (
        <div className="combat-result">
          <h3>Combat Result</h3>
          <div className="result-content">
            <div className="winner-section">
              <span className="winner-label">Winner:</span>
              <span className={`winner ${combat.result.winner}`}>
                {combat.result.winner.toUpperCase()}
              </span>
            </div>

            <div className="losses-section">
              <div className="losses-column">
                <h4>Attacker Losses</h4>
                <div className="loss-stat">
                  <label>Ships Destroyed:</label>
                  <span>{combat.result.attackerLosses.shipsDestroyed}</span>
                </div>
                <div className="loss-stat">
                  <label>Crew Casualties:</label>
                  <span>{combat.result.attackerLosses.crewCasualties}</span>
                </div>
                <div className="loss-stat">
                  <label>Estimated Loss:</label>
                  <span className="credit-value">
                    {combat.result.attackerLosses.estimatedValue.toLocaleString()} credits
                  </span>
                </div>
              </div>

              <div className="losses-column">
                <h4>Defender Losses</h4>
                <div className="loss-stat">
                  <label>Ships Destroyed:</label>
                  <span>{combat.result.defenderLosses.shipsDestroyed}</span>
                </div>
                <div className="loss-stat">
                  <label>Crew Casualties:</label>
                  <span>{combat.result.defenderLosses.crewCasualties}</span>
                </div>
                <div className="loss-stat">
                  <label>Estimated Loss:</label>
                  <span className="credit-value">
                    {combat.result.defenderLosses.estimatedValue.toLocaleString()} credits
                  </span>
                </div>
              </div>
            </div>

            <div className="experience-section">
              <div className="xp-item">
                <label>Attacker XP Gained:</label>
                <span className="xp-amount">+{combat.result.experienceGained.attacker} XP</span>
              </div>
              <div className="xp-item">
                <label>Defender XP Gained:</label>
                <span className="xp-amount">+{combat.result.experienceGained.defender} XP</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onReportGenerated) {
                const report = generateFleetCombatReport(
                  'incoming',
                  combat.defenderId,
                  combat.attackerId,
                  combat,
                  combat.result.experienceGained.attacker,
                  combat.result.experienceGained.defender
                );
                onReportGenerated(report);
              }
            }}
            className="generate-report-btn"
          >
            Generate Report
          </button>
        </div>
      )}

      <style jsx>{`
        .fleet-combat-viewer {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 2px solid #00ff88;
          border-radius: 8px;
          padding: 20px;
          color: #00ff88;
          font-family: 'Courier New', monospace;
          max-width: 900px;
          margin: 20px auto;
        }

        .combat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #00ff88;
          padding-bottom: 10px;
        }

        .combat-header h2 {
          margin: 0;
          color: #00ff88;
        }

        .close-btn {
          background: #ff4444;
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
        }

        .combat-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
          background: rgba(0, 255, 136, 0.05);
          padding: 15px;
          border-radius: 4px;
        }

        .info-section {
          display: flex;
          justify-content: space-between;
        }

        .info-section label {
          font-weight: bold;
        }

        .mission-type,
        .transit-method {
          color: #ffff00;
        }

        .combat-timeline {
          margin-bottom: 20px;
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .timeline-header h3 {
          margin: 0;
        }

        .round-counter {
          background: rgba(0, 255, 136, 0.2);
          padding: 4px 12px;
          border-radius: 4px;
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid #00ff88;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00ff88, #00cc88);
          transition: width 0.3s ease;
        }

        .round-details {
          background: rgba(0, 255, 136, 0.05);
          border: 1px solid #00ff88;
          border-radius: 4px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .round-header h4 {
          margin: 0 0 10px 0;
          color: #ffff00;
        }

        .summary {
          margin: 0;
          font-size: 14px;
          font-style: italic;
          color: #aaaaaa;
        }

        .round-stats,
        .ships-destroyed {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 15px;
        }

        .damage-stat,
        .destroyed-stat {
          background: rgba(0, 0, 0, 0.3);
          padding: 10px;
          border-radius: 4px;
        }

        .damage-stat label,
        .destroyed-stat label {
          display: block;
          font-size: 12px;
          margin-bottom: 5px;
          opacity: 0.8;
        }

        .damage-amount.red {
          font-size: 18px;
          color: #ff4444;
          font-weight: bold;
        }

        .lost-count {
          font-size: 18px;
          color: #ff8844;
          font-weight: bold;
        }

        .actions-display {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 15px;
        }

        .action-column h5 {
          margin: 0 0 10px 0;
          color: #ffff00;
          border-bottom: 1px solid #00ff88;
          padding-bottom: 5px;
        }

        .action-item {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          margin-bottom: 5px;
          font-size: 12px;
        }

        .action-type {
          color: #ffff00;
          font-weight: bold;
          flex: 1;
        }

        .action-ship {
          color: #00ff88;
          flex: 1;
        }

        .action-damage {
          color: #ff4444;
          text-align: right;
        }

        .combat-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .nav-btn,
        .play-btn,
        .speed-control,
        .generate-report-btn {
          background: #00ff88;
          border: none;
          color: #1a1a2e;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-family: inherit;
        }

        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .play-btn.playing {
          background: #ff8844;
        }

        .speed-control {
          padding: 8px 12px;
        }

        .combat-result {
          background: rgba(0, 255, 136, 0.1);
          border: 2px solid #00ff88;
          border-radius: 4px;
          padding: 15px;
        }

        .combat-result h3 {
          margin: 0 0 15px 0;
          color: #ffff00;
        }

        .result-content {
          background: rgba(0, 0, 0, 0.3);
          padding: 15px;
          border-radius: 4px;
        }

        .winner-section {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          font-size: 18px;
        }

        .winner-label {
          font-weight: bold;
        }

        .winner {
          font-weight: bold;
          padding: 5px 15px;
          border-radius: 4px;
        }

        .winner.attacker {
          background: #00ff88;
          color: #1a1a2e;
        }

        .winner.defender {
          background: #ff8844;
          color: white;
        }

        .winner.draw {
          background: #ffff00;
          color: #1a1a2e;
        }

        .losses-section {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .losses-column h4 {
          margin: 0 0 10px 0;
          color: #ffff00;
        }

        .loss-stat {
          background: rgba(0, 255, 136, 0.05);
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
        }

        .loss-stat label {
          opacity: 0.8;
        }

        .credit-value {
          color: #ffff00;
          font-weight: bold;
        }

        .experience-section {
          background: rgba(0, 255, 136, 0.05);
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }

        .xp-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }

        .xp-amount {
          color: #ffff00;
          font-weight: bold;
        }

        .generate-report-btn {
          width: 100%;
          padding: 12px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

// ===== STARGATE NETWORK MAP COMPONENT =====

interface StargateNetworkProps {
  stargates: Stargate[];
  selectedGate?: string;
  onGateSelected?: (gateId: string) => void;
  onTransit?: (fromId: string, toId: string, fleetSize: number) => void;
}

export const StargateNetworkMap: React.FC<StargateNetworkProps> = ({
  stargates,
  selectedGate,
  onGateSelected,
  onTransit,
}) => {
  const [fleetSize, setFleetSize] = useState(10);
  const [targetGate, setTargetGate] = useState<string>('');

  const selectedStargate = stargates.find((g) => g.id === selectedGate);

  return (
    <div className="stargate-network">
      <h2>Stargate Network</h2>

      <div className="network-canvas">
        <svg width="600" height="400" viewBox="0 0 600 400">
          {/* Draw connections */}
          {selectedStargate?.linkedTo.map((linkedId) => {
            const linked = stargates.find((g) => g.id === linkedId);
            if (!linked) return null;

            return (
              <line
                key={`line-${selectedGate}-${linkedId}`}
                x1={selectedStargate.location.x * 2}
                y1={selectedStargate.location.y * 2}
                x2={linked.location.x * 2}
                y2={linked.location.y * 2}
                stroke="#00ff88"
                strokeWidth="2"
                opacity="0.5"
              />
            );
          })}

          {/* Draw gates */}
          {stargates.map((gate) => (
            <g key={gate.id}>
              <circle
                cx={gate.location.x * 2}
                cy={gate.location.y * 2}
                r={15}
                fill={selectedGate === gate.id ? '#ffff00' : '#00ff88'}
                stroke="#00ff88"
                strokeWidth="2"
                cursor="pointer"
                onClick={() => onGateSelected?.(gate.id)}
              />
              <text
                x={gate.location.x * 2}
                y={gate.location.y * 2 + 25}
                textAnchor="middle"
                fill="#00ff88"
                fontSize="12"
              >
                {gate.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {selectedStargate && (
        <div className="gate-details">
          <h3>{selectedStargate.name}</h3>
          <div className="details-grid">
            <div className="detail-item">
              <label>Level:</label>
              <span>{selectedStargate.level}</span>
            </div>
            <div className="detail-item">
              <label>Capacity:</label>
              <span>{selectedStargate.capacity} ships</span>
            </div>
            <div className="detail-item">
              <label>Transit Time:</label>
              <span>{Math.floor(selectedStargate.transitTime / 1000)}s</span>
            </div>
            <div className="detail-item">
              <label>Health:</label>
              <span>{selectedStargate.maintenance.health}%</span>
            </div>
          </div>

          {selectedStargate.linkedTo.length > 0 && (
            <div className="transit-controls">
              <label>Destination Gate:</label>
              <select value={targetGate} onChange={(e) => setTargetGate(e.target.value)}>
                <option value="">Select destination...</option>
                {selectedStargate.linkedTo.map((linkedId) => {
                  const linked = stargates.find((g) => g.id === linkedId);
                  return (
                    <option key={linkedId} value={linkedId}>
                      {linked?.name}
                    </option>
                  );
                })}
              </select>

              <label>Fleet Size:</label>
              <input
                type="range"
                min="1"
                max={selectedStargate.capacity}
                value={fleetSize}
                onChange={(e) => setFleetSize(Number(e.target.value))}
              />
              <span>{fleetSize} ships</span>

              <button
                onClick={() => {
                  if (targetGate) {
                    onTransit?.(selectedGate!, targetGate, fleetSize);
                  }
                }}
                disabled={!targetGate}
              >
                Transit Fleet
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .stargate-network {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 2px solid #00ff88;
          border-radius: 8px;
          padding: 20px;
          color: #00ff88;
          font-family: 'Courier New', monospace;
        }

        .stargate-network h2 {
          margin: 0 0 20px 0;
          color: #ffff00;
        }

        .network-canvas {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid #00ff88;
          border-radius: 4px;
          padding: 10px;
          margin-bottom: 20px;
        }

        .gate-details {
          background: rgba(0, 255, 136, 0.05);
          border: 1px solid #00ff88;
          border-radius: 4px;
          padding: 15px;
        }

        .gate-details h3 {
          margin: 0 0 15px 0;
          color: #ffff00;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }

        .detail-item label {
          font-weight: bold;
        }

        .transit-controls {
          background: rgba(0, 0, 0, 0.3);
          padding: 15px;
          border-radius: 4px;
        }

        .transit-controls label {
          display: block;
          margin-top: 10px;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .transit-controls select,
        .transit-controls input {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          background: #1a1a2e;
          border: 1px solid #00ff88;
          color: #00ff88;
          font-family: inherit;
          border-radius: 4px;
        }

        .transit-controls button {
          width: 100%;
          padding: 10px;
          background: #00ff88;
          border: none;
          color: #1a1a2e;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
        }

        .transit-controls button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

// ===== JUMP GATE SELECTOR COMPONENT =====

interface JumpGateSelectorProps {
  jumpGates: JumpGate[];
  onJump?: (gateId: string, targetX: number, targetY: number, targetZ: number) => void;
}

export const JumpGateSelector: React.FC<JumpGateSelectorProps> = ({ jumpGates, onJump }) => {
  const [selectedGate, setSelectedGate] = useState<string>('');
  const [targetCoords, setTargetCoords] = useState({ x: 0, y: 0, z: 0 });

  const gate = jumpGates.find((g) => g.id === selectedGate);

  return (
    <div className="jump-gate-selector">
      <h2>Jump Gate Control</h2>

      <div className="gate-selection">
        <label>Select Jump Gate:</label>
        <select value={selectedGate} onChange={(e) => setSelectedGate(e.target.value)}>
          <option value="">Choose a jump gate...</option>
          {jumpGates.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name} (Status: {g.status})
            </option>
          ))}
        </select>
      </div>

      {gate && (
        <div className="gate-info">
          <div className="info-grid">
            <div className="info-item">
              <label>Max Range:</label>
              <span>{gate.range} units</span>
            </div>
            <div className="info-item">
              <label>Stability:</label>
              <span className={gate.stability < 50 ? 'danger' : 'ok'}>{gate.stability}%</span>
            </div>
            <div className="info-item">
              <label>Energy Cost:</label>
              <span>{gate.energyRequired}</span>
            </div>
            <div className="info-item">
              <label>Cooldown:</label>
              <span>{Math.floor(gate.cooldownTime / 1000)}s</span>
            </div>
          </div>

          <div className="coordinates-input">
            <h4>Target Coordinates</h4>
            <div className="coord-group">
              <label>X:</label>
              <input
                type="number"
                value={targetCoords.x}
                onChange={(e) => setTargetCoords({ ...targetCoords, x: Number(e.target.value) })}
              />
            </div>
            <div className="coord-group">
              <label>Y:</label>
              <input
                type="number"
                value={targetCoords.y}
                onChange={(e) => setTargetCoords({ ...targetCoords, y: Number(e.target.value) })}
              />
            </div>
            <div className="coord-group">
              <label>Z:</label>
              <input
                type="number"
                value={targetCoords.z}
                onChange={(e) => setTargetCoords({ ...targetCoords, z: Number(e.target.value) })}
              />
            </div>

            <button
              onClick={() => onJump?.(selectedGate, targetCoords.x, targetCoords.y, targetCoords.z)}
              disabled={gate.status !== 'active'}
            >
              Execute Jump
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .jump-gate-selector {
          background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
          border: 2px solid #ff8844;
          border-radius: 8px;
          padding: 20px;
          color: #ff8844;
          font-family: 'Courier New', monospace;
        }

        .jump-gate-selector h2 {
          margin: 0 0 20px 0;
          color: #ffff00;
        }

        .gate-selection {
          margin-bottom: 20px;
        }

        .gate-selection label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }

        .gate-selection select {
          width: 100%;
          padding: 10px;
          background: #1a1a2e;
          border: 1px solid #ff8844;
          color: #ff8844;
          font-family: inherit;
          border-radius: 4px;
        }

        .gate-info {
          background: rgba(255, 136, 68, 0.05);
          border: 1px solid #ff8844;
          border-radius: 4px;
          padding: 15px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .info-item {
          background: rgba(0, 0, 0, 0.3);
          padding: 10px;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
        }

        .info-item label {
          font-weight: bold;
        }

        .info-item span.danger {
          color: #ff4444;
          font-weight: bold;
        }

        .info-item span.ok {
          color: #00ff88;
        }

        .coordinates-input {
          background: rgba(0, 0, 0, 0.3);
          padding: 15px;
          border-radius: 4px;
        }

        .coordinates-input h4 {
          margin: 0 0 15px 0;
          color: #ffff00;
        }

        .coord-group {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .coord-group label {
          width: 40px;
          font-weight: bold;
        }

        .coord-group input {
          flex: 1;
          padding: 8px;
          background: #1a1a2e;
          border: 1px solid #ff8844;
          color: #ff8844;
          font-family: inherit;
          border-radius: 4px;
        }

        .coordinates-input button {
          width: 100%;
          padding: 10px;
          margin-top: 15px;
          background: #ff8844;
          border: none;
          color: white;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
        }

        .coordinates-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

// ===== HYPERSPACE ROUTE EXPLORER =====

interface HyperspaceExplorerProps {
  routes: HyperspaceRoute[];
  onNavigate?: (routeId: string) => void;
}

export const HyperspaceExplorer: React.FC<HyperspaceExplorerProps> = ({ routes, onNavigate }) => {
  const [selectedRoute, setSelectedRoute] = useState<string>('');

  const route = routes.find((r) => r.id === selectedRoute);

  return (
    <div className="hyperspace-explorer">
      <h2>Hyperspace Route Explorer</h2>

      <div className="routes-list">
        <label>Available Routes:</label>
        <select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)}>
          <option value="">Select a route...</option>
          {routes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} - Danger: {r.dangerLevel}%
            </option>
          ))}
        </select>
      </div>

      {route && (
        <div className="route-details">
          <h3>{route.name}</h3>

          <div className="route-stats">
            <div className="stat-item">
              <label>Distance:</label>
              <span>{Math.floor(route.distance)} units</span>
            </div>
            <div className="stat-item">
              <label>Base Transit Time:</label>
              <span>{Math.floor(route.baseTransitTime / 1000)}s</span>
            </div>
            <div className="stat-item">
              <label>Danger Level:</label>
              <div className="danger-bar">
                <div className="danger-fill" style={{ width: `${route.dangerLevel}%` }} />
              </div>
            </div>
            <div className="stat-item">
              <label>Passage Health:</label>
              <div className="health-bar">
                <div className="health-fill" style={{ width: `${route.passageHealth}%` }} />
              </div>
            </div>
          </div>

          <div className="hazards-section">
            <h4>Known Hazards ({route.knownHazards.length})</h4>
            {route.knownHazards.length > 0 ? (
              route.knownHazards.map((hazard) => (
                <div key={hazard.id} className="hazard-item">
                  <span className="hazard-type">{hazard.type.replace(/_/g, ' ')}</span>
                  <span className="hazard-severity">Severity: {hazard.severity}/10</span>
                  <span className="hazard-damage">Damage: {hazard.damagePercentage}%</span>
                </div>
              ))
            ) : (
              <p className="no-hazards">No known hazards detected</p>
            )}
          </div>

          <button onClick={() => onNavigate?.(selectedRoute)} className="navigate-btn">
            Navigate Route
          </button>
        </div>
      )}

      <style jsx>{`
        .hyperspace-explorer {
          background: linear-gradient(135deg, #2a2a1e 0%, #1a1a0e 100%);
          border: 2px solid #ffaa00;
          border-radius: 8px;
          padding: 20px;
          color: #ffaa00;
          font-family: 'Courier New', monospace;
        }

        .hyperspace-explorer h2 {
          margin: 0 0 20px 0;
          color: #ffff00;
        }

        .routes-list {
          margin-bottom: 20px;
        }

        .routes-list label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
        }

        .routes-list select {
          width: 100%;
          padding: 10px;
          background: #1a1a0e;
          border: 1px solid #ffaa00;
          color: #ffaa00;
          font-family: inherit;
          border-radius: 4px;
        }

        .route-details {
          background: rgba(255, 170, 0, 0.05);
          border: 1px solid #ffaa00;
          border-radius: 4px;
          padding: 15px;
        }

        .route-details h3 {
          margin: 0 0 15px 0;
          color: #ffff00;
        }

        .route-stats {
          margin-bottom: 20px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .stat-item label {
          font-weight: bold;
          min-width: 150px;
        }

        .danger-bar,
        .health-bar {
          flex: 1;
          height: 20px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid #ffaa00;
          border-radius: 4px;
          overflow: hidden;
        }

        .danger-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff8844, #ff4444);
        }

        .health-fill {
          height: 100%;
          background: linear-gradient(90deg, #00ff88, #00cc88);
        }

        .hazards-section {
          background: rgba(0, 0, 0, 0.3);
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 15px;
        }

        .hazards-section h4 {
          margin: 0 0 10px 0;
          color: #ffff00;
        }

        .hazard-item {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          background: rgba(255, 170, 0, 0.05);
          border: 1px solid #ffaa00;
          border-radius: 4px;
          margin-bottom: 5px;
          font-size: 12px;
        }

        .hazard-type {
          font-weight: bold;
          text-transform: capitalize;
        }

        .hazard-severity,
        .hazard-damage {
          color: #ff8844;
        }

        .no-hazards {
          color: #00ff88;
          font-style: italic;
          margin: 0;
        }

        .navigate-btn {
          width: 100%;
          padding: 10px;
          background: #ffaa00;
          border: none;
          color: #1a1a0e;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default {
  FleetCombatViewer,
  StargateNetworkMap,
  JumpGateSelector,
  HyperspaceExplorer,
};
