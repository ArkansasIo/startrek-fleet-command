// ResourceGatheringSystem.ts
// Handles resource production, gathering, and management

export type ResourceType = 'dilithium' | 'tritanium' | 'deuterium' | 'latinum' | 'credits';

export interface ResourceNode {
  id: string;
  type: ResourceType;
  amount: number;
  maxAmount: number;
  location: { systemId: string; x: number; y: number; z: number };
  respawnRate: number; // Per hour
  difficulty: 1 | 2 | 3 | 4 | 5; // Determines pirates/resistance
  discoveredBy?: string;
  discoveredAt?: number;
  lastHarvested?: { playerId: string; amount: number; time: number };
}

export interface HarvestingMission {
  id: string;
  playerId: string;
  resourceNodeId: string;
  fleetId: string;
  status: 'pending' | 'harvesting' | 'returning' | 'completed' | 'failed';
  startedAt: number;
  completionTime?: number;
  harvestedAmount: number;
  targetAmount: number;
  resistance?: { amount: number; defeated: boolean };
}

export interface ResourceProduction {
  playerId: string;
  production: Record<ResourceType, number>; // Per turn/hour
  storage: Record<ResourceType, number>;
  maxStorage: Record<ResourceType, number>;
  sources: ProductionSource[];
}

export interface ProductionSource {
  id: string;
  type: 'building' | 'research' | 'trade' | 'extraction' | 'bonus';
  name: string;
  rate: number; // Units per turn
  resourceType: ResourceType;
  level?: number;
}

export interface GatheringBonus {
  type: 'multiplier' | 'flat_increase';
  resourceType: ResourceType | 'all';
  value: number;
  duration: number;
  source: string;
}

// Create resource node
export function createResourceNode(
  type: ResourceType,
  location: { systemId: string; x: number; y: number; z: number }
): ResourceNode {
  const amounts = {
    dilithium: 5000,
    tritanium: 4000,
    deuterium: 3000,
    latinum: 1000,
    credits: 2000,
  };

  return {
    id: `node_${type}_${Date.now()}`,
    type,
    amount: amounts[type],
    maxAmount: amounts[type],
    location,
    respawnRate: 10, // 10% per hour
    difficulty: Math.floor(Math.random() * 5) + 1,
  };
}

// Start harvesting mission
export function startHarvestingMission(
  playerId: string,
  resourceNodeId: string,
  fleetId: string,
  targetAmount: number
): HarvestingMission {
  return {
    id: `harvest_${playerId}_${Date.now()}`,
    playerId,
    resourceNodeId,
    fleetId,
    status: 'pending',
    startedAt: Date.now(),
    harvestedAmount: 0,
    targetAmount,
  };
}

// Execute harvesting
export function executeHarvesting(
  mission: HarvestingMission,
  node: ResourceNode,
  fleetStrength: number
): { success: boolean; harvestedAmount: number; message: string } {
  if (node.amount <= 0) {
    return { success: false, harvestedAmount: 0, message: 'Resource node is depleted' };
  }

  // Calculate harvest rate based on fleet strength vs node difficulty
  const harvestRate = Math.max(0.1, 1 - (node.difficulty / fleetStrength) * 0.1);
  const harvestedAmount = Math.floor(node.amount * harvestRate * 0.2); // Extract 20% per attempt

  // Check for resistance
  const hasResistance = Math.random() < 0.3 * node.difficulty; // Higher difficulty = more pirates

  if (hasResistance && fleetStrength < node.difficulty * 50) {
    return {
      success: false,
      harvestedAmount: 0,
      message: `Resistance encountered! Fleet too weak for difficulty ${node.difficulty}`,
    };
  }

  // Reduce node amount
  node.amount = Math.max(0, node.amount - harvestedAmount);
  mission.harvestedAmount += harvestedAmount;
  mission.lastHarvested = { playerId: mission.playerId, amount: harvestedAmount, time: Date.now() };

  return {
    success: true,
    harvestedAmount,
    message: `Successfully harvested ${harvestedAmount} ${node.type}`,
  };
}

// Regenerate resource node
export function regenerateResourceNode(node: ResourceNode, hoursPassed: number): void {
  const regenerated = (node.maxAmount * node.respawnRate * hoursPassed) / 100;
  node.amount = Math.min(node.maxAmount, node.amount + regenerated);
}

// Create resource production record
export function createResourceProduction(playerId: string): ResourceProduction {
  return {
    playerId,
    production: {
      dilithium: 10,
      tritanium: 8,
      deuterium: 5,
      latinum: 2,
      credits: 50,
    },
    storage: {
      dilithium: 1000,
      tritanium: 800,
      deuterium: 500,
      latinum: 200,
      credits: 5000,
    },
    maxStorage: {
      dilithium: 10000,
      tritanium: 8000,
      deuterium: 5000,
      latinum: 2000,
      credits: 50000,
    },
    sources: [],
  };
}

// Add production source
export function addProductionSource(
  production: ResourceProduction,
  source: ProductionSource
): void {
  production.sources.push(source);

  // Update production rate
  if (source.resourceType === 'all') {
    Object.keys(production.production).forEach((type) => {
      production.production[type as ResourceType] += source.rate;
    });
  } else {
    production.production[source.resourceType] += source.rate;
  }
}

// Process production cycle
export function processProductionCycle(
  production: ResourceProduction,
  hours: number = 1,
  bonuses: GatheringBonus[] = []
): Record<ResourceType, number> {
  const produced: Record<ResourceType, number> = {
    dilithium: 0,
    tritanium: 0,
    deuterium: 0,
    latinum: 0,
    credits: 0,
  };

  Object.keys(production.production).forEach((type) => {
    let rate = production.production[type as ResourceType] * hours;

    // Apply bonuses
    bonuses.forEach((bonus) => {
      if (
        bonus.resourceType === type ||
        bonus.resourceType === 'all'
      ) {
        if (bonus.type === 'multiplier') {
          rate *= bonus.value;
        } else {
          rate += bonus.value;
        }
      }
    });

    // Store in inventory
    const storage = production.storage[type as ResourceType];
    const maxStorage = production.maxStorage[type as ResourceType];
    const amount = Math.min(rate, maxStorage - storage);

    production.storage[type as ResourceType] += amount;
    produced[type as ResourceType] = amount;
  });

  return produced;
}

// Upgrade storage
export function upgradeStorage(
  production: ResourceProduction,
  resourceType: ResourceType,
  multiplier: number = 1.5
): { success: boolean; newCapacity: number; message: string } {
  const oldCapacity = production.maxStorage[resourceType];
  const newCapacity = Math.floor(oldCapacity * multiplier);

  production.maxStorage[resourceType] = newCapacity;

  return {
    success: true,
    newCapacity,
    message: `${resourceType} storage upgraded to ${newCapacity}`,
  };
}

// Consume resources
export function consumeResources(
  production: ResourceProduction,
  requirements: Partial<Record<ResourceType, number>>
): { success: boolean; message: string } {
  // Check availability
  for (const [type, amount] of Object.entries(requirements)) {
    if ((production.storage[type as ResourceType] || 0) < (amount || 0)) {
      return {
        success: false,
        message: `Insufficient ${type}: need ${amount}, have ${production.storage[type as ResourceType]}`,
      };
    }
  }

  // Consume
  for (const [type, amount] of Object.entries(requirements)) {
    if (amount) {
      production.storage[type as ResourceType] -= amount;
    }
  }

  return { success: true, message: 'Resources consumed successfully' };
}

// Apply gathering bonus
export function applyGatheringBonus(
  production: ResourceProduction,
  bonus: GatheringBonus
): GatheringBonus {
  const bonusWithId = {
    ...bonus,
  };

  return bonusWithId;
}

// Calculate resource efficiency
export function calculateEfficiency(
  production: ResourceProduction
): Record<ResourceType, number> {
  const efficiency: Record<ResourceType, number> = {
    dilithium: 0,
    tritanium: 0,
    deuterium: 0,
    latinum: 0,
    credits: 0,
  };

  Object.keys(efficiency).forEach((type) => {
    const current = production.storage[type as ResourceType];
    const max = production.maxStorage[type as ResourceType];
    efficiency[type as ResourceType] = (current / max) * 100;
  });

  return efficiency;
}

// Get resource shortage warnings
export function getResourceWarnings(
  production: ResourceProduction
): string[] {
  const warnings: string[] = [];
  const efficiency = calculateEfficiency(production);

  Object.entries(efficiency).forEach(([type, percent]) => {
    if (percent >= 95) {
      warnings.push(`${type} storage almost full!`);
    } else if (percent <= 10) {
      warnings.push(`${type} running critically low!`);
    }
  });

  return warnings;
}

// Trade resources at market rate
export function convertResources(
  from: ResourceType,
  to: ResourceType,
  amount: number
): number {
  const exchangeRates: Record<ResourceType, number> = {
    dilithium: 100,
    tritanium: 80,
    deuterium: 60,
    latinum: 500,
    credits: 1,
  };

  const fromValue = exchangeRates[from] * amount;
  const toAmount = Math.floor(fromValue / exchangeRates[to]);

  return toAmount;
}
