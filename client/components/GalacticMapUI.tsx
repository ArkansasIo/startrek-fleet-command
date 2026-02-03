// GalacticMapUI.tsx
// React components for galactic map visualization and control

import React, { useState, useEffect } from 'react';
import type { GalacticMap, GalacticSector, Territory, SpaceObject } from '../lib/GalacticMapSystem';

export interface GalacticMapUIProps {
  map: GalacticMap;
  playerId: string;
  onSectorSelected?: (sector: GalacticSector) => void;
  onClaimSector?: (sectorId: string) => void;
  onNavigateToSector?: (sectorId: string) => void;
}

// Main Galactic Map Viewer
export const GalacticMapViewer: React.FC<GalacticMapUIProps> = ({
  map,
  playerId,
  onSectorSelected,
  onClaimSector,
  onNavigateToSector,
}) => {
  const [selectedSector, setSelectedSector] = useState<GalacticSector | null>(null);
  const [viewMode, setViewMode] = useState<'control' | 'danger' | 'resources'>('control');
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleSectorClick = (sector: GalacticSector) => {
    setSelectedSector(sector);
    onSectorSelected?.(sector);
  };

  const getSectorColor = (sector: GalacticSector): string => {
    switch (viewMode) {
      case 'control':
        if (sector.controlledBy === playerId) return '#2ecc71';
        if (sector.controlledBy) return '#e74c3c';
        if (sector.controlPoints > 50) return '#f39c12';
        return '#95a5a6';

      case 'danger':
        const threat = sector.threatLevel;
        if (threat < 20) return '#2ecc71';
        if (threat < 50) return '#f39c12';
        if (threat < 75) return '#e74c3c';
        return '#8b0000';

      case 'resources':
        const totalResources =
          sector.resourceDensity.credits +
          sector.resourceDensity.minerals +
          sector.resourceDensity.dilithium +
          sector.resourceDensity.energy;
        if (totalResources > 15000) return '#9b59b6';
        if (totalResources > 10000) return '#3498db';
        if (totalResources > 5000) return '#1abc9c';
        return '#ecf0f1';

      default:
        return '#95a5a6';
    }
  };

  const renderGalacticGrid = () => {
    const gridSize = Math.ceil(Math.sqrt(map.totalSectors));
    const cellSize = 60 * zoomLevel;

    return (
      <svg
        width={gridSize * cellSize}
        height={Math.ceil(map.totalSectors / gridSize) * cellSize}
        style={{
          border: '2px solid #1e3a8a',
          backgroundColor: '#0f172a',
          cursor: 'grab',
        }}
      >
        {map.sectors.map((sector, idx) => {
          const x = (idx % gridSize) * cellSize;
          const y = Math.floor(idx / gridSize) * cellSize;
          const isSelected = selectedSector?.id === sector.id;

          return (
            <g key={sector.id}>
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill={getSectorColor(sector)}
                stroke={isSelected ? '#fff' : '#444'}
                strokeWidth={isSelected ? 3 : 1}
                opacity={0.8}
                onClick={() => handleSectorClick(sector)}
                style={{ cursor: 'pointer' }}
              />
              <text
                x={x + cellSize / 2}
                y={y + cellSize / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize={Math.min(12, cellSize / 4)}
                onClick={() => handleSectorClick(sector)}
                style={{ cursor: 'pointer', pointerEvents: 'none' }}
              >
                {sector.name.split('-').pop()}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#0f172a',
        color: '#e0e7ff',
        borderRadius: '8px',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: '1px solid #1e3a8a',
        }}
      >
        <h2 style={{ margin: 0 }}>⚛️ GALACTIC MAP VIEWER</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {(['control', 'danger', 'resources'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '8px 12px',
                backgroundColor: viewMode === mode ? '#3b82f6' : '#1e293b',
                color: '#fff',
                border: `1px solid ${viewMode === mode ? '#60a5fa' : '#475569'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>
          Zoom: {(zoomLevel * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={zoomLevel}
          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
          style={{ width: '200px' }}
        />
      </div>

      <div
        style={{
          overflowX: 'auto',
          overflowY: 'auto',
          maxHeight: '500px',
          padding: '10px',
          backgroundColor: '#020617',
          borderRadius: '4px',
          marginBottom: '20px',
        }}
      >
        {renderGalacticGrid()}
      </div>

      {selectedSector && (
        <SectorDetailPanel
          sector={selectedSector}
          playerId={playerId}
          onClaim={() => {
            onClaimSector?.(selectedSector.id);
          }}
          onNavigate={() => {
            onNavigateToSector?.(selectedSector.id);
          }}
        />
      )}
    </div>
  );
};

// Sector Detail Panel
interface SectorDetailPanelProps {
  sector: GalacticSector;
  playerId: string;
  onClaim?: () => void;
  onNavigate?: () => void;
}

export const SectorDetailPanel: React.FC<SectorDetailPanelProps> = ({
  sector,
  playerId,
  onClaim,
  onNavigate,
}) => {
  const isOwner = sector.controlledBy === playerId;
  const canClaim = !sector.controlledBy || sector.controlledBy === playerId;

  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: '#1e293b',
        border: '2px solid #3b82f6',
        borderRadius: '4px',
        marginTop: '20px',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0' }}>📍 SECTOR: {sector.name}</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginBottom: '15px',
        }}
      >
        <div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Status:</strong> {isOwner ? '✓ OWNED' : '◇ ' + (sector.controlledBy || 'UNCLAIMED')}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Control Points:</strong> {sector.controlPoints}/100
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Danger Level:</strong> {sector.dangerLevel.toFixed(1)}/100
          </div>
          <div>
            <strong>Threat Level:</strong> {sector.threatLevel.toFixed(1)}/100
          </div>
        </div>

        <div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Type:</strong> {sector.type.replace(/_/g, ' ').toUpperCase()}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Active Players:</strong> {sector.activePlayers.length}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Infrastructure:</strong>{' '}
            {sector.infrastructure.stargates.length +
              sector.infrastructure.jumpgates.length +
              sector.infrastructure.stations.length}{' '}
            facilities
          </div>
          <div>
            <strong>POIs:</strong> {sector.pointsOfInterest.length}
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#0f172a',
          borderRadius: '4px',
        }}
      >
        <strong>Resources:</strong>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginTop: '5px' }}>
          <div>💰 Credits: {sector.resourceDensity.credits.toLocaleString()}</div>
          <div>⛏️ Minerals: {sector.resourceDensity.minerals.toLocaleString()}</div>
          <div>💎 Dilithium: {sector.resourceDensity.dilithium.toLocaleString()}</div>
          <div>⚡ Energy: {sector.resourceDensity.energy.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {canClaim && (
          <button
            onClick={onClaim}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {isOwner ? 'Reinforce' : 'Claim Sector'}
          </button>
        )}
        <button
          onClick={onNavigate}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Navigate
        </button>
      </div>
    </div>
  );
};

// Territory Overview
interface TerritoryOverviewProps {
  territories: Territory[];
  onSelectTerritory?: (territory: Territory) => void;
}

export const TerritoryOverview: React.FC<TerritoryOverviewProps> = ({
  territories,
  onSelectTerritory,
}) => {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#0f172a',
        color: '#e0e7ff',
        borderRadius: '8px',
        fontFamily: 'monospace',
      }}
    >
      <h2 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #1e3a8a', paddingBottom: '10px' }}>
        🗺️ TERRITORY OVERVIEW
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
        {territories.map((territory) => (
          <div
            key={territory.id}
            onClick={() => onSelectTerritory?.(territory)}
            style={{
              padding: '15px',
              backgroundColor: '#1e293b',
              border: '1px solid #3b82f6',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 10px #3b82f6';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>{territory.name}</h3>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div>🏛️ Sectors: {territory.sectorIds.length}</div>
              <div>👥 Population: {(territory.populationCount / 1000000).toFixed(1)}M</div>
              <div>💰 Income/hour: {territory.incomePerHour.toLocaleString()}</div>
              <div>🛡️ Defense: {territory.defenseRating}%</div>
              <div>
                Status:{' '}
                <span
                  style={{
                    color:
                      territory.status === 'controlled'
                        ? '#10b981'
                        : territory.status === 'disputed'
                          ? '#f59e0b'
                          : '#ef4444',
                  }}
                >
                  {territory.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Strategic Map Heatmap
interface StrategicHeatmapProps {
  map: GalacticMap;
  heatmapType: 'resources' | 'danger' | 'value';
}

export const StrategicHeatmap: React.FC<StrategicHeatmapProps> = ({ map, heatmapType }) => {
  const getHeatValue = (sector: GalacticSector): number => {
    switch (heatmapType) {
      case 'resources':
        return (
          sector.resourceDensity.credits +
          sector.resourceDensity.minerals * 2 +
          sector.resourceDensity.dilithium * 10
        );
      case 'danger':
        return sector.dangerLevel * 100 + sector.threatLevel * 50;
      case 'value':
        const resources =
          sector.resourceDensity.credits +
          sector.resourceDensity.minerals * 2 +
          sector.resourceDensity.dilithium * 10;
        const danger = sector.dangerLevel + sector.threatLevel;
        return resources / (danger + 1);
      default:
        return 0;
    }
  };

  const getColor = (value: number, max: number): string => {
    const normalized = value / max;
    if (normalized < 0.25) return '#2d3436';
    if (normalized < 0.5) return '#0984e3';
    if (normalized < 0.75) return '#fdcb6e';
    return '#d63031';
  };

  const maxValue = Math.max(...map.sectors.map(getHeatValue));

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', color: '#e0e7ff', borderRadius: '8px' }}>
      <h2 style={{ margin: '0 0 20px 0' }}>🔥 STRATEGIC HEATMAP - {heatmapType.toUpperCase()}</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(map.totalSectors))}, 1fr)`,
          gap: '2px',
          backgroundColor: '#020617',
          padding: '10px',
          borderRadius: '4px',
        }}
      >
        {map.sectors.map((sector) => (
          <div
            key={sector.id}
            title={`${sector.name}: ${getHeatValue(sector).toFixed(0)}`}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: getColor(getHeatValue(sector), maxValue),
              borderRadius: '2px',
              cursor: 'help',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Space Object Scanner
interface SpaceObjectScannerProps {
  hotspots: SpaceObject[];
  playerId: string;
  onScanned?: (objectId: string) => void;
}

export const SpaceObjectScanner: React.FC<SpaceObjectScannerProps> = ({
  hotspots,
  playerId,
  onScanned,
}) => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', color: '#e0e7ff', borderRadius: '8px' }}>
      <h2 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #1e3a8a', paddingBottom: '10px' }}>
        🔬 SPACE OBJECT SCANNER
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
        {hotspots.map((object) => {
          const isScanned = object.scannedBy?.includes(playerId);

          return (
            <div
              key={object.id}
              style={{
                padding: '15px',
                backgroundColor: '#1e293b',
                border: `2px solid ${isScanned ? '#10b981' : '#ef4444'}`,
                borderRadius: '4px',
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>
                {isScanned ? '✓' : '?'} {object.name}
              </h3>
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                <div>Type: {object.type.replace(/_/g, ' ')}</div>
                <div>Size: {object.size.toFixed(0)} km</div>
                {isScanned && object.resources && (
                  <>
                    <div style={{ marginTop: '10px', borderTop: '1px solid #475569', paddingTop: '10px' }}>
                      {object.resources.minerals && <div>⛏️ Minerals: {object.resources.minerals}</div>}
                      {object.resources.dilithium && <div>💎 Dilithium: {object.resources.dilithium}</div>}
                      {object.resources.credits && <div>💰 Credits: {object.resources.credits}</div>}
                    </div>
                  </>
                )}
                <button
                  onClick={() => onScanned?.(object.id)}
                  style={{
                    marginTop: '10px',
                    width: '100%',
                    padding: '8px',
                    backgroundColor: isScanned ? '#10b981' : '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {isScanned ? 'Rescanned' : 'Scan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
