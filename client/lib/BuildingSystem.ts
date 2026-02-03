// BuildingSystem.ts
// Handles construction, building management, and upgrades

export type BuildingType = 'mine' | 'factory' | 'lab' | 'barracks' | 'spaceport' | 'defense' | 'academy' | 'shipyard';

export interface BuildingDefinition {
  id: string;
  type: BuildingType;
  name: string;
  description: string;
  baseLevel: number;
  maxLevel: number;
  baseCost: Record<string, number>;
  costMultiplier: number;
  buildTime: number; // seconds
  productionRate?: number;
  defensePower?: number;
  capacity?: number;
  preRequisites?: string[]; // Required buildings/research
}

export interface ConstructionProject {
  id: string;
  playerId: string;
  buildingId: string;
  buildingType: BuildingType;
  buildingLevel: number;
  locationId: string; // Planet/Station ID
  status: 'queued' | 'building' | 'completed' | 'cancelled';
  startedAt: number;
  completedAt?: number;
  completionTime: number;
  resourcesRequired: Record<string, number>;
  resourcesInvested: Record<string, number>;
  progress: number; // 0-100
}

export interface Building {
  id: string;
  type: BuildingType;
  name: string;
  level: number;
  locationId: string;
  builtAt: number;
  lastUpgraded?: number;
  condition: number; // 0-100 (damage)
  active: boolean;
  stats: Record<string, number>;
}

export interface ConstructionQueue {
  playerId: string;
  projects: ConstructionProject[];
  maxParallelProjects: number; // Can build multiple at once
  totalCapacity: number; // Based on spaceports/shipyards
}

export interface BuildingBonus {
  type: 'production' | 'defense' | 'storage' | 'speed';
  value: number;
  buildingType: BuildingType;
}

// Define building types
export const BUILDING_DEFINITIONS: BuildingDefinition[] = [
  {
    id: 'dilithium_mine',
    type: 'mine',
    name: 'Dilithium Mine',
    description: 'Extracts dilithium crystals',
    baseLevel: 1,
    maxLevel: 20,
    baseCost: { dilithium: 100, credits: 500 },
    costMultiplier: 1.5,
    buildTime: 3600, // 1 hour
    productionRate: 10,
    preRequisites: [],
  },
  {
    id: 'tritanium_factory',
    type: 'factory',
    name: 'Tritanium Factory',
    description: 'Processes tritanium ore',
    baseLevel: 1,
    maxLevel: 20,
    baseCost: { tritanium: 50, credits: 500 },
    costMultiplier: 1.5,
    buildTime: 4000,
    productionRate: 8,
    preRequisites: [],
  },
  {
    id: 'research_lab',
    type: 'lab',
    name: 'Research Laboratory',
    description: 'Accelerates research speed',
    baseLevel: 1,
    maxLevel: 15,
    baseCost: { dilithium: 200, credits: 1000 },
    costMultiplier: 1.6,
    buildTime: 5000,
    preRequisites: [],
  },
  {
    id: 'military_barracks',
    type: 'barracks',
    name: 'Military Barracks',
    description: 'Trains starfleet personnel',
    baseLevel: 1,
    maxLevel: 15,
    baseCost: { credits: 800, tritanium: 100 },
    costMultiplier: 1.5,
    buildTime: 4500,
    defensePower: 20,
    preRequisites: [],
  },
  {
    id: 'space_station',
    type: 'spaceport',
    name: 'Space Station',
    description: 'Enables fleet construction',
    baseLevel: 1,
    maxLevel: 10,
    baseCost: { tritanium: 500, dilithium: 300, credits: 5000 },
    costMultiplier: 2.0,
    buildTime: 10000,
    capacity: 10, // Can build 10 ships at once
    preRequisites: [],
  },
  {
    id: 'planetary_shield',
    type: 'defense',
    name: 'Planetary Shield Generator',
    description: 'Protects against orbital attacks',
    baseLevel: 1,
    maxLevel: 20,
    baseCost: { dilithium: 300, credits: 2000 },
    costMultiplier: 1.7,
    buildTime: 6000,
    defensePower: 50,
    preRequisites: [],
  },
  {
    id: 'academy',
    type: 'academy',
    name: 'Starfleet Academy',
    description: 'Improves officer skills and training',
    baseLevel: 1,
    maxLevel: 10,
    baseCost: { credits: 3000, dilithium: 500 },
    costMultiplier: 1.8,
    buildTime: 8000,
    preRequisites: ['research_lab'],
  },
  {
    id: 'advanced_shipyard',
    type: 'shipyard',
    name: 'Advanced Shipyard',
    description: 'Construct advanced starships',
    baseLevel: 1,
    maxLevel: 10,
    baseCost: { tritanium: 1000, dilithium: 500, credits: 10000 },
    costMultiplier: 2.0,
    buildTime: 15000,
    capacity: 5,
    preRequisites: ['space_station'],
  },
];

// Start construction
export function startConstruction(
  playerId: string,
  buildingDefId: string,
  locationId: string,
  currentLevel: number = 0
): {
  success: boolean;
  project?: ConstructionProject;
  costRequired?: Record<string, number>;
  message: string;
} {
  const def = BUILDING_DEFINITIONS.find((b) => b.id === buildingDefId);
  if (!def) return { success: false, message: 'Building definition not found' };

  if (currentLevel >= def.maxLevel) {
    return { success: false, message: 'Building is already at max level' };
  }

  // Calculate cost for next level
  const nextLevel = currentLevel + 1;
  const costRequired: Record<string, number> = {};

  Object.entries(def.baseCost).forEach(([resource, baseCost]) => {
    costRequired[resource] = Math.floor(
      baseCost * Math.pow(def.costMultiplier, nextLevel - 1)
    );
  });

  const project: ConstructionProject = {
    id: `proj_${playerId}_${buildingDefId}_${Date.now()}`,
    playerId,
    buildingId: buildingDefId,
    buildingType: def.type,
    buildingLevel: nextLevel,
    locationId,
    status: 'building',
    startedAt: Date.now(),
    completionTime: def.buildTime * nextLevel,
    resourcesRequired: costRequired,
    resourcesInvested: costRequired,
    progress: 0,
  };

  return {
    success: true,
    project,
    costRequired,
    message: `Construction started: ${def.name} Level ${nextLevel}`,
  };
}

// Complete construction
export function completeConstruction(project: ConstructionProject): Building {
  return {
    id: `building_${project.buildingId}_${project.locationId}`,
    type: project.buildingType,
    name: BUILDING_DEFINITIONS.find((b) => b.id === project.buildingId)?.name || 'Unknown',
    level: project.buildingLevel,
    locationId: project.locationId,
    builtAt: Date.now(),
    condition: 100,
    active: true,
    stats: {
      production: 0,
      defense: 0,
      capacity: 0,
    },
  };
}

// Cancel construction
export function cancelConstruction(
  project: ConstructionProject,
  refundPercentage: number = 0.75
): Record<string, number> {
  const refund: Record<string, number> = {};

  Object.entries(project.resourcesInvested).forEach(([resource, amount]) => {
    refund[resource] = Math.floor(amount * refundPercentage);
  });

  return refund;
}

// Accelerate construction
export function accelerateConstruction(
  project: ConstructionProject,
  speedUpCost: Record<string, number>
): { success: boolean; message: string } {
  const timeRemaining =
    project.completionTime - (Date.now() - project.startedAt);
  const acceleration = 0.5; // 50% faster

  project.completionTime = Math.floor(
    project.completionTime - timeRemaining * acceleration
  );

  return {
    success: true,
    message: `Construction accelerated by ${acceleration * 100}%`,
  };
}

// Create construction queue
export function createConstructionQueue(playerId: string): ConstructionQueue {
  return {
    playerId,
    projects: [],
    maxParallelProjects: 1, // Can upgrade with spaceports
    totalCapacity: 1,
  };
}

// Add to queue
export function addToConstructionQueue(
  queue: ConstructionQueue,
  project: ConstructionProject
): { success: boolean; message: string } {
  if (queue.projects.length >= queue.maxParallelProjects) {
    return {
      success: false,
      message: 'Construction queue is full. Upgrade spaceports to build more simultaneously.',
    };
  }

  queue.projects.push(project);
  return { success: true, message: 'Added to construction queue' };
}

// Get building bonus
export function getBuildingBonus(
  buildingType: BuildingType,
  level: number
): number {
  const baseBonus = 10; // 10% per level
  return baseBonus * level;
}

// Repair building
export function repairBuilding(
  building: Building,
  repairCost: Record<string, number>
): { success: boolean; newCondition?: number; message: string } {
  const damagePercentage = 100 - building.condition;
  const repairAmount = Math.min(50, damagePercentage); // Repair up to 50% per action

  building.condition = Math.min(100, building.condition + repairAmount);

  return {
    success: true,
    newCondition: building.condition,
    message: `Building repaired to ${building.condition}% condition`,
  };
}

// Get building efficiency
export function getBuildingEfficiency(building: Building): number {
  // Damaged buildings are less efficient
  return building.condition / 100;
}

// Upgrade queue capacity
export function upgradeQueueCapacity(queue: ConstructionQueue): { success: boolean; newCapacity?: number } {
  queue.maxParallelProjects = Math.min(5, queue.maxParallelProjects + 1);
  return { success: true, newCapacity: queue.maxParallelProjects };
}

// Calculate building output
export function calculateBuildingOutput(
  building: Building,
  baseRate: number
): number {
  const levelBonus = building.level * baseRate * 0.1;
  const efficiency = getBuildingEfficiency(building);

  return Math.floor((baseRate + levelBonus) * efficiency);
}
