// GalacticMapSystem.ts
// Galaxy/Space Map System with sector management and territorial control

export type TerritoryStatus = 'neutral' | 'disputed' | 'controlled' | 'contested';
export type PointOfInterest = 'star' | 'planet' | 'asteroid_field' | 'nebula' | 'anomaly' | 'station';

export interface GalacticSector {
  id: string;
  name: string;
  coordinateX: number;
  coordinateY: number;
  coordinateZ: number;
  type: 'empty' | 'populated' | 'hostile' | 'resource_rich' | 'sacred';
  dangerLevel: number; // 0-100
  controlledBy?: string; // Player ID
  controlPoints: number; // 0-100
  resourceDensity: {
    credits: number;
    minerals: number;
    dilithium: number;
    energy: number;
  };
  pointsOfInterest: PointOfInterest[];
  adjacentSectors: string[]; // IDs of connected sectors
  infrastructure: {
    stargates: string[];
    jumpgates: string[];
    stations: string[];
    mines: string[];
  };
  activePlayers: string[];
  lastClaimed?: {
    by: string;
    at: number;
  };
  threatLevel: number; // 0-100 based on active fleets
}

export interface SpaceObject {
  id: string;
  name: string;
  type: PointOfInterest;
  sectorId: string;
  position: { x: number; y: number; z: number };
  size: number; // km
  resources?: {
    credits?: number;
    minerals?: number;
    dilithium?: number;
    energy?: number;
  };
  scannable: boolean;
  scannedBy?: string[];
}

export interface GalacticMap {
  id: string;
  name: string;
  sectors: GalacticSector[];
  mapVersion: number;
  created: number;
  updated: number;
  totalSectors: number;
  controlledSectors: Map<string, number>; // Player ID -> sector count
  neutralSectors: number;
  hotspots: SpaceObject[];
}

export interface Territory {
  id: string;
  ownerId: string;
  name: string;
  sectorIds: string[];
  controlPoints: number;
  status: TerritoryStatus;
  defenseRating: number;
  populationCount: number;
  incomePerHour: number;
  lastDefense?: {
    defendedAgainst: string;
    at: number;
    success: boolean;
  };
}

export interface SectorControlBattle {
  id: string;
  sectorId: string;
  attackerId: string;
  defenderId: string;
  status: 'pending' | 'in_progress' | 'completed';
  startTime: number;
  endTime?: number;
  attackerFleets: string[];
  defenderFleets: string[];
  controlPointsAtStake: number;
  winner?: string;
  newController?: string;
}

// Create galactic sector
export function createSector(
  name: string,
  coordinateX: number,
  coordinateY: number,
  coordinateZ: number,
  type: GalacticSector['type'] = 'empty'
): GalacticSector {
  const dangerLevel = Math.random() * 100;
  const resourceDensity = {
    credits: Math.floor(Math.random() * 10000),
    minerals: Math.floor(Math.random() * 5000),
    dilithium: Math.floor(Math.random() * 1000),
    energy: Math.floor(Math.random() * 2000),
  };

  return {
    id: `sector_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    coordinateX,
    coordinateY,
    coordinateZ,
    type,
    dangerLevel,
    controlPoints: 0,
    resourceDensity,
    pointsOfInterest: generatePointsOfInterest(type),
    adjacentSectors: [],
    infrastructure: {
      stargates: [],
      jumpgates: [],
      stations: [],
      mines: [],
    },
    activePlayers: [],
    threatLevel: 0,
  };
}

// Generate points of interest for sector
function generatePointsOfInterest(type: GalacticSector['type']): PointOfInterest[] {
  const pois: PointOfInterest[] = [];

  if (type === 'populated') {
    pois.push('star', 'planet', 'station');
  } else if (type === 'resource_rich') {
    pois.push('asteroid_field', 'nebula');
  } else if (type === 'hostile') {
    pois.push('anomaly');
  } else {
    if (Math.random() > 0.5) pois.push('star');
    if (Math.random() > 0.7) pois.push('nebula');
  }

  return pois;
}

// Create galactic map
export function createGalacticMap(
  name: string,
  gridSize: number = 10
): GalacticMap {
  const sectors: GalacticSector[] = [];
  const controlledSectors = new Map<string, number>();

  // Generate sectors in a grid
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < Math.ceil(gridSize / 2); z++) {
        const type = selectSectorType();
        const sector = createSector(
          `Sector-${x}-${y}-${z}`,
          x * 100,
          y * 100,
          z * 100,
          type
        );
        sectors.push(sector);
      }
    }
  }

  // Connect adjacent sectors
  connectAdjacentSectors(sectors);

  return {
    id: `map_${Date.now()}`,
    name,
    sectors,
    mapVersion: 1,
    created: Date.now(),
    updated: Date.now(),
    totalSectors: sectors.length,
    controlledSectors,
    neutralSectors: sectors.length,
    hotspots: generateHotspots(sectors),
  };
}

// Select random sector type
function selectSectorType(): GalacticSector['type'] {
  const rand = Math.random();
  if (rand < 0.3) return 'empty';
  if (rand < 0.5) return 'populated';
  if (rand < 0.7) return 'resource_rich';
  if (rand < 0.9) return 'hostile';
  return 'sacred';
}

// Connect adjacent sectors
function connectAdjacentSectors(sectors: GalacticSector[]): void {
  sectors.forEach((sector) => {
    sectors.forEach((other) => {
      const distance = Math.sqrt(
        Math.pow(sector.coordinateX - other.coordinateX, 2) +
        Math.pow(sector.coordinateY - other.coordinateY, 2) +
        Math.pow(sector.coordinateZ - other.coordinateZ, 2)
      );

      if (distance < 150 && distance > 0) {
        sector.adjacentSectors.push(other.id);
      }
    });
  });
}

// Generate hotspots (interesting objects)
function generateHotspots(sectors: GalacticSector[]): SpaceObject[] {
  const hotspots: SpaceObject[] = [];
  const hotspotCount = Math.floor(sectors.length * 0.1);

  for (let i = 0; i < hotspotCount; i++) {
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const poiType = sector.pointsOfInterest[
      Math.floor(Math.random() * sector.pointsOfInterest.length)
    ] || 'star';

    hotspots.push({
      id: `object_${i}`,
      name: `${poiType.replace(/_/g, ' ')} Alpha-${i}`,
      type: poiType,
      sectorId: sector.id,
      position: {
        x: sector.coordinateX + Math.random() * 50 - 25,
        y: sector.coordinateY + Math.random() * 50 - 25,
        z: sector.coordinateZ + Math.random() * 50 - 25,
      },
      size: Math.random() * 100 + 10,
      resources:
        poiType === 'asteroid_field'
          ? {
              minerals: Math.floor(Math.random() * 10000),
              dilithium: Math.floor(Math.random() * 2000),
            }
          : undefined,
      scannable: true,
    });
  }

  return hotspots;
}

// Claim sector
export function claimSector(
  sector: GalacticSector,
  playerId: string,
  controlPoints: number
): GalacticSector {
  if (sector.controlledBy && sector.controlledBy !== playerId) {
    // Already controlled - initiate dispute
    return {
      ...sector,
      controlPoints: Math.min(100, sector.controlPoints + controlPoints),
    };
  }

  return {
    ...sector,
    controlledBy: playerId,
    controlPoints: Math.min(100, controlPoints),
    lastClaimed: {
      by: playerId,
      at: Date.now(),
    },
  };
}

// Contest sector (reduce control points)
export function contestSector(
  sector: GalacticSector,
  playerId: string,
  contestAmount: number
): GalacticSector {
  const newControlPoints = Math.max(0, sector.controlPoints - contestAmount);

  if (newControlPoints === 0) {
    return {
      ...sector,
      controlledBy: undefined,
      controlPoints: 0,
    };
  }

  return {
    ...sector,
    controlPoints: newControlPoints,
  };
}

// Create territory
export function createTerritory(
  ownerId: string,
  name: string,
  sectorIds: string[]
): Territory {
  return {
    id: `territory_${Date.now()}`,
    ownerId,
    name,
    sectorIds,
    controlPoints: sectorIds.length * 50,
    status: 'controlled',
    defenseRating: calculateDefenseRating(sectorIds.length),
    populationCount: Math.floor(sectorIds.length * 10000000),
    incomePerHour: sectorIds.length * 1000,
  };
}

// Calculate defense rating
function calculateDefenseRating(sectorCount: number): number {
  return Math.min(100, sectorCount * 10);
}

// Update threat level
export function updateSectorThreatLevel(
  sector: GalacticSector,
  activeFleetCount: number,
  enemyFleetCount: number
): GalacticSector {
  const threatLevel = Math.min(100, (enemyFleetCount / Math.max(1, activeFleetCount)) * 100);

  return {
    ...sector,
    threatLevel,
  };
}

// Scan space object
export function scanSpaceObject(
  object: SpaceObject,
  scannerId: string
): SpaceObject {
  const scannedBy = object.scannedBy || [];

  if (!scannedBy.includes(scannerId)) {
    scannedBy.push(scannerId);
  }

  return {
    ...object,
    scannedBy,
  };
}

// Initiate sector control battle
export function initiateSectorControlBattle(
  sectorId: string,
  attackerId: string,
  defenderId: string,
  attackerFleets: string[],
  defenderFleets: string[]
): SectorControlBattle {
  return {
    id: `battle_${Date.now()}`,
    sectorId,
    attackerId,
    defenderId,
    status: 'pending',
    startTime: Date.now(),
    attackerFleets,
    defenderFleets,
    controlPointsAtStake: 25,
  };
}

// Resolve sector control battle
export function resolveSectorControlBattle(
  battle: SectorControlBattle,
  winner: 'attacker' | 'defender',
  damagePercentage: number
): SectorControlBattle {
  const winnerPlayerId = winner === 'attacker' ? battle.attackerId : battle.defenderId;

  // Calculate control points gained/lost
  const controlPointsTransfer = Math.floor(
    (battle.controlPointsAtStake * damagePercentage) / 100
  );

  return {
    ...battle,
    status: 'completed',
    endTime: Date.now(),
    winner,
    newController: winnerPlayerId,
  };
}

// Get sector neighbors
export function getSectorNeighbors(
  sector: GalacticSector,
  allSectors: GalacticSector[]
): GalacticSector[] {
  return allSectors.filter((s) => sector.adjacentSectors.includes(s.id));
}

// Calculate territory statistics
export interface TerritoryStatistics {
  totalSectors: number;
  totalPopulation: number;
  totalIncome: number;
  averageDangerLevel: number;
  totalResources: {
    credits: number;
    minerals: number;
    dilithium: number;
    energy: number;
  };
  defendedCount: number;
  disputedCount: number;
}

export function calculateTerritoryStatistics(
  territory: Territory,
  sectors: GalacticSector[]
): TerritoryStatistics {
  const territorySectors = sectors.filter((s) => territory.sectorIds.includes(s.id));

  const totalResources = {
    credits: 0,
    minerals: 0,
    dilithium: 0,
    energy: 0,
  };

  let totalDangerLevel = 0;

  territorySectors.forEach((sector) => {
    totalDangerLevel += sector.dangerLevel;
    totalResources.credits += sector.resourceDensity.credits;
    totalResources.minerals += sector.resourceDensity.minerals;
    totalResources.dilithium += sector.resourceDensity.dilithium;
    totalResources.energy += sector.resourceDensity.energy;
  });

  return {
    totalSectors: territorySectors.length,
    totalPopulation: territory.populationCount,
    totalIncome: territory.incomePerHour * 24,
    averageDangerLevel: territorySectors.length > 0 ? totalDangerLevel / territorySectors.length : 0,
    totalResources,
    defendedCount: territorySectors.filter((s) => s.controlPoints > 75).length,
    disputedCount: territorySectors.filter((s) => s.controlPoints > 25 && s.controlPoints < 75).length,
  };
}

// Find nearest sector
export function findNearestSector(
  position: { x: number; y: number; z: number },
  sectors: GalacticSector[]
): GalacticSector | null {
  if (sectors.length === 0) return null;

  let nearest = sectors[0];
  let minDistance = Infinity;

  sectors.forEach((sector) => {
    const distance = Math.sqrt(
      Math.pow(sector.coordinateX - position.x, 2) +
      Math.pow(sector.coordinateY - position.y, 2) +
      Math.pow(sector.coordinateZ - position.z, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = sector;
    }
  });

  return nearest;
}

// Get route between sectors
export function getRouteBetweenSectors(
  startSectorId: string,
  endSectorId: string,
  allSectors: GalacticSector[]
): string[] | null {
  // Simple pathfinding (BFS)
  const queue = [[startSectorId]];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];

    if (current === endSectorId) {
      return path;
    }

    if (visited.has(current)) continue;
    visited.add(current);

    const sector = allSectors.find((s) => s.id === current);
    if (!sector) continue;

    for (const neighborId of sector.adjacentSectors) {
      if (!visited.has(neighborId)) {
        queue.push([...path, neighborId]);
      }
    }
  }

  return null;
}

// Generate sector report
export function generateSectorReport(sector: GalacticSector): string {
  return `
╔════════════════════════════════════════════════════════════════╗
║                      SECTOR REPORT                             ║
╚════════════════════════════════════════════════════════════════╝

SECTOR INFORMATION:
  Name: ${sector.name}
  Coordinates: (${sector.coordinateX}, ${sector.coordinateY}, ${sector.coordinateZ})
  Type: ${sector.type.toUpperCase()}
  ID: ${sector.id}

STATUS:
  Controller: ${sector.controlledBy || 'UNCLAIMED'}
  Control Points: ${sector.controlPoints}/100
  Threat Level: ${sector.threatLevel}/100
  Danger Level: ${sector.dangerLevel.toFixed(1)}/100
  Active Players: ${sector.activePlayers.length}

RESOURCES:
  Credits: ${sector.resourceDensity.credits.toLocaleString()}
  Minerals: ${sector.resourceDensity.minerals.toLocaleString()} tons
  Dilithium: ${sector.resourceDensity.dilithium.toLocaleString()} units
  Energy: ${sector.resourceDensity.energy.toLocaleString()} units

INFRASTRUCTURE:
  Stargates: ${sector.infrastructure.stargates.length}
  Jump Gates: ${sector.infrastructure.jumpgates.length}
  Stations: ${sector.infrastructure.stations.length}
  Mining Facilities: ${sector.infrastructure.mines.length}

POINTS OF INTEREST:
  ${sector.pointsOfInterest.map((poi) => `• ${poi.replace(/_/g, ' ')}`).join('\n  ')}

ADJACENT SECTORS:
  ${sector.adjacentSectors.length} connected sectors

═══════════════════════════════════════════════════════════════════
`;
}
