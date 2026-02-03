// OGameMechanics.ts
// Core OGame-style logic and gameplay mechanics for Star Trek Fleet Command

export type ResourceType = 'dilithium' | 'tritanium' | 'deuterium' | 'energy' | 'credits';

export interface ResourceState {
  dilithium: number;
  tritanium: number;
  deuterium: number;
  energy: number;
  credits: number;
}

export interface Building {
  id: string;
  name: string;
  level: number;
  baseCost: Partial<ResourceState>;
  costMultiplier: number;
  buildTime: number; // seconds
  effect: (level: number) => Partial<ResourceState>;
}

export interface FleetUnit {
  id: string;
  name: string;
  attack: number;
  defense: number;
  speed: number;
  cargo: number;
  cost: Partial<ResourceState>;
  buildTime: number; // seconds
}

export interface Research {
  id: string;
  name: string;
  level: number;
  baseCost: Partial<ResourceState>;
  costMultiplier: number;
  researchTime: number; // seconds
  effect: (level: number) => any;
}

// Example resource state
export const initialResources: ResourceState = {
  dilithium: 1000,
  tritanium: 1000,
  deuterium: 500,
  energy: 500,
  credits: 1000,
};

// Example building definitions
export const BUILDINGS: Building[] = [
  {
    id: 'mine_dilithium',
    name: 'Dilithium Mine',
    level: 1,
    baseCost: { credits: 100, energy: 50 },
    costMultiplier: 1.5,
    buildTime: 60,
    effect: (level) => ({ dilithium: 10 * level }),
  },
  {
    id: 'mine_tritanium',
    name: 'Tritanium Mine',
    level: 1,
    baseCost: { credits: 100, energy: 50 },
    costMultiplier: 1.5,
    buildTime: 60,
    effect: (level) => ({ tritanium: 10 * level }),
  },
  {
    id: 'power_plant',
    name: 'Fusion Power Plant',
    level: 1,
    baseCost: { credits: 200, dilithium: 50 },
    costMultiplier: 1.6,
    buildTime: 90,
    effect: (level) => ({ energy: 20 * level }),
  },
  // ...add more buildings
];

// Example fleet unit definitions
export const FLEET_UNITS: FleetUnit[] = [
  {
    id: 'scout',
    name: 'Federation Scout',
    attack: 10,
    defense: 5,
    speed: 20,
    cargo: 50,
    cost: { credits: 200, dilithium: 50 },
    buildTime: 30,
  },
  {
    id: 'cruiser',
    name: 'Starfleet Cruiser',
    attack: 40,
    defense: 30,
    speed: 10,
    cargo: 200,
    cost: { credits: 800, dilithium: 200, tritanium: 100 },
    buildTime: 120,
  },
  // ...add more units
];

// Example research definitions
export const RESEARCHES: Research[] = [
  {
    id: 'warp_drive',
    name: 'Warp Drive Technology',
    level: 1,
    baseCost: { credits: 500, dilithium: 200 },
    costMultiplier: 2.0,
    researchTime: 180,
    effect: (level) => ({ speedBonus: 5 * level }),
  },
  // ...add more research
];

// Utility: Calculate next level cost for a building or research
export function getNextLevelCost<T extends { baseCost: Partial<ResourceState>; costMultiplier: number; level: number }>(item: T): Partial<ResourceState> {
  const cost: Partial<ResourceState> = {};
  for (const key in item.baseCost) {
    cost[key as ResourceType] = Math.floor((item.baseCost[key as ResourceType] || 0) * Math.pow(item.costMultiplier, item.level));
  }
  return cost;
}

// Utility: Apply building effect to resource state
export function applyBuildingEffect(resources: ResourceState, building: Building): ResourceState {
  const effect = building.effect(building.level);
  return { ...resources, ...Object.fromEntries(Object.entries(effect).map(([k, v]) => [k, (resources as any)[k] + (v as number)])) };
}

// ...add more OGame-style logic as needed (combat, fleet movement, alliance, etc.)
