/**
 * STAR TREK: FLEET COMMAND - RESOURCE ECONOMY SYSTEM
 * ==================================================
 * Comprehensive resource management with 10+ resource types and economy mechanics
 */

export interface Resource {
  resourceId: string;
  name: string;
  type: ResourceType;
  amount: number;
  maxStorage: number;
  generationRate: number; // Per minute
  description: string;
}

export interface ResourceGenerator {
  generatorId: string;
  name: string;
  type: ResourceType;
  level: number;
  maxLevel: number;
  baseGeneration: number;
  efficiency: number;
  buildTime: number;
  buildCost: number;
  upkeepCost: number;
}

export interface PlayerEconomy {
  playerId: string;
  resources: Map<ResourceType, number>;
  maxStorage: Map<ResourceType, number>;
  generators: Map<string, ResourceGenerator>;
  tradeHistory: TradeRecord[];
  marketPrices: Map<ResourceType, number>;
  totalWealth: number;
}

export interface TradeRecord {
  tradeId: string;
  timestamp: number;
  type: 'buy' | 'sell';
  resource: ResourceType;
  amount: number;
  pricePerUnit: number;
  totalPrice: number;
}

export type ResourceType = 'dilithium' | 'tritanium' | 'latinum' | 'lobi' | 'isotopes' | 'nanoprobes' | 'deuterium' | 'energy' | 'credits' | 'datacore';

// ============================================================================
// RESOURCE DEFINITIONS
// ============================================================================

export const RESOURCE_CREDITS: Resource = {
  resourceId: 'res_credits',
  name: 'Credits',
  type: 'credits',
  amount: 5000,
  maxStorage: 1000000,
  generationRate: 100,
  description: 'Federation currency for trade and transactions.',
};

export const RESOURCE_DILITHIUM: Resource = {
  resourceId: 'res_dilithium',
  name: 'Dilithium',
  type: 'dilithium',
  amount: 500,
  maxStorage: 50000,
  generationRate: 5,
  description: 'Essential for warp core stabilization.',
};

export const RESOURCE_TRITANIUM: Resource = {
  resourceId: 'res_tritanium',
  name: 'Tritanium',
  type: 'tritanium',
  amount: 1000,
  maxStorage: 100000,
  generationRate: 10,
  description: 'Alloy for starship hull construction.',
};

export const RESOURCE_LATINUM: Resource = {
  resourceId: 'res_latinum',
  name: 'Latinum',
  type: 'latinum',
  amount: 100,
  maxStorage: 10000,
  generationRate: 1,
  description: 'Rare currency with intrinsic value.',
};

export const RESOURCE_LOBI: Resource = {
  resourceId: 'res_lobi',
  name: 'Lobi Crystals',
  type: 'lobi',
  amount: 50,
  maxStorage: 5000,
  generationRate: 0.5,
  description: 'Exotic material for advanced technology.',
};

export const RESOURCE_ISOTOPES: Resource = {
  resourceId: 'res_isotopes',
  name: 'Isotopes',
  type: 'isotopes',
  amount: 2000,
  maxStorage: 200000,
  generationRate: 20,
  description: 'Essential for energy systems and weapons.',
};

export const RESOURCE_NANOPROBES: Resource = {
  resourceId: 'res_nanoprobes',
  name: 'Nanoprobes',
  type: 'nanoprobes',
  amount: 100,
  maxStorage: 10000,
  generationRate: 2,
  description: 'Borg technology for repairs and enhancements.',
};

export const RESOURCE_DEUTERIUM: Resource = {
  resourceId: 'res_deuterium',
  name: 'Deuterium',
  type: 'deuterium',
  amount: 3000,
  maxStorage: 300000,
  generationRate: 30,
  description: 'Fuel for warp engines.',
};

export const RESOURCE_ENERGY: Resource = {
  resourceId: 'res_energy',
  name: 'Energy Credits',
  type: 'energy',
  amount: 5000,
  maxStorage: 500000,
  generationRate: 50,
  description: 'General power for ship systems.',
};

export const RESOURCE_DATACORE: Resource = {
  resourceId: 'res_datacore',
  name: 'Datacore Modules',
  type: 'datacore',
  amount: 50,
  maxStorage: 5000,
  generationRate: 1,
  description: 'Advanced computing components.',
};

export const ALL_RESOURCES: Resource[] = [
  RESOURCE_CREDITS, RESOURCE_DILITHIUM, RESOURCE_TRITANIUM, RESOURCE_LATINUM,
  RESOURCE_LOBI, RESOURCE_ISOTOPES, RESOURCE_NANOPROBES, RESOURCE_DEUTERIUM,
  RESOURCE_ENERGY, RESOURCE_DATACORE,
];

// ============================================================================
// GENERATORS
// ============================================================================

export const GENERATOR_CREDITS: ResourceGenerator = {
  generatorId: 'gen_credits',
  name: 'Trading Post',
  type: 'credits',
  level: 1,
  maxLevel: 10,
  baseGeneration: 100,
  efficiency: 1.0,
  buildTime: 600,
  buildCost: 1000,
  upkeepCost: 50,
};

export const GENERATOR_DILITHIUM: ResourceGenerator = {
  generatorId: 'gen_dilithium',
  name: 'Mining Station',
  type: 'dilithium',
  level: 1,
  maxLevel: 10,
  baseGeneration: 5,
  efficiency: 1.0,
  buildTime: 1200,
  buildCost: 5000,
  upkeepCost: 200,
};

export const GENERATOR_ENERGY: ResourceGenerator = {
  generatorId: 'gen_energy',
  name: 'Power Plant',
  type: 'energy',
  level: 1,
  maxLevel: 10,
  baseGeneration: 50,
  efficiency: 1.0,
  buildTime: 900,
  buildCost: 2000,
  upkeepCost: 100,
};

export function createEconomy(playerId: string): PlayerEconomy {
  const resources = new Map<ResourceType, number>();
  const maxStorage = new Map<ResourceType, number>();

  for (const resource of ALL_RESOURCES) {
    resources.set(resource.type, resource.amount);
    maxStorage.set(resource.type, resource.maxStorage);
  }

  const prices = new Map<ResourceType, number>();
  prices.set('credits', 1);
  prices.set('dilithium', 50);
  prices.set('tritanium', 10);
  prices.set('latinum', 500);
  prices.set('lobi', 1000);
  prices.set('isotopes', 5);
  prices.set('nanoprobes', 100);
  prices.set('deuterium', 3);
  prices.set('energy', 0.5);
  prices.set('datacore', 200);

  return {
    playerId,
    resources,
    maxStorage,
    generators: new Map(),
    tradeHistory: [],
    marketPrices: prices,
    totalWealth: 0,
  };
}

export function addResource(economy: PlayerEconomy, resourceType: ResourceType, amount: number): number {
  const current = economy.resources.get(resourceType) || 0;
  const max = economy.maxStorage.get(resourceType) || 10000;
  const newAmount = Math.min(current + amount, max);
  economy.resources.set(resourceType, newAmount);
  return newAmount;
}

export function removeResource(economy: PlayerEconomy, resourceType: ResourceType, amount: number): boolean {
  const current = economy.resources.get(resourceType) || 0;
  if (current < amount) return false;
  economy.resources.set(resourceType, current - amount);
  return true;
}

export function getResource(economy: PlayerEconomy, resourceType: ResourceType): number {
  return economy.resources.get(resourceType) || 0;
}

export function buyResource(economy: PlayerEconomy, resourceType: ResourceType, amount: number): boolean {
  const price = economy.marketPrices.get(resourceType) || 100;
  const totalCost = price * amount;
  
  if (removeResource(economy, 'credits', totalCost)) {
    addResource(economy, resourceType, amount);
    economy.tradeHistory.push({
      tradeId: `trade_${Date.now()}`,
      timestamp: Date.now(),
      type: 'buy',
      resource: resourceType,
      amount,
      pricePerUnit: price,
      totalPrice: totalCost,
    });
    return true;
  }
  return false;
}

export function sellResource(economy: PlayerEconomy, resourceType: ResourceType, amount: number): boolean {
  if (!removeResource(economy, resourceType, amount)) return false;
  
  const price = economy.marketPrices.get(resourceType) || 100;
  const totalPrice = price * amount;
  addResource(economy, 'credits', totalPrice);
  
  economy.tradeHistory.push({
    tradeId: `trade_${Date.now()}`,
    timestamp: Date.now(),
    type: 'sell',
    resource: resourceType,
    amount,
    pricePerUnit: price,
    totalPrice,
  });
  return true;
}

export function updateEconomyGeneration(economy: PlayerEconomy, deltaTime: number): void {
  // Generate resources from generators
  for (const generator of economy.generators.values()) {
    const generation = generator.baseGeneration * generator.efficiency * (deltaTime / 60);
    addResource(economy, generator.type, Math.floor(generation));
  }

  // Update market prices (simplified)
  for (const [resourceType, price] of economy.marketPrices) {
    const currentAmount = getResource(economy, resourceType);
    const maxStorage = economy.maxStorage.get(resourceType) || 10000;
    const storagePercent = currentAmount / maxStorage;

    if (storagePercent > 0.8) {
      economy.marketPrices.set(resourceType, Math.floor(price * 0.95));
    } else if (storagePercent < 0.2) {
      economy.marketPrices.set(resourceType, Math.floor(price * 1.1));
    }
  }
}

export function calculateTotalWealth(economy: PlayerEconomy): number {
  let wealth = 0;
  for (const [resourceType, amount] of economy.resources) {
    const price = economy.marketPrices.get(resourceType) || 1;
    wealth += amount * price;
  }
  economy.totalWealth = wealth;
  return wealth;
}

export function upgadeGenerator(generator: ResourceGenerator): boolean {
  if (generator.level >= generator.maxLevel) return false;
  generator.level++;
  generator.baseGeneration = Math.floor(generator.baseGeneration * 1.2);
  generator.upkeepCost = Math.floor(generator.upkeepCost * 1.15);
  return true;
}

export function getResourceStatistics(economy: PlayerEconomy): {
  totalResources: number;
  byType: Record<ResourceType, number>;
  totalValue: number;
  storageUsage: number;
} {
  let totalResources = 0;
  let totalStorage = 0;
  let totalValue = 0;
  const byType: Record<ResourceType, number> = {} as any;

  for (const resource of ALL_RESOURCES) {
    const amount = getResource(economy, resource.type);
    const price = economy.marketPrices.get(resource.type) || 1;
    byType[resource.type] = amount;
    totalResources += amount;
    totalValue += amount * price;
    totalStorage += economy.maxStorage.get(resource.type) || 0;
  }

  return {
    totalResources,
    byType,
    totalValue,
    storageUsage: (totalResources / totalStorage) * 100,
  };
}
