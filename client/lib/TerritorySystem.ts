// TerritorySystem.ts
// Handles planets, colonies, and territorial control

export interface Planet {
  id: string;
  name: string;
  type: 'terrestrial' | 'gas_giant' | 'ice' | 'desert' | 'volcanic';
  systemId: string;
  coordinates: { x: number; y: number; z: number };
  resources: {
    dilithium: number;
    tritanium: number;
    deuterium: number;
    latinum: number;
  };
  habitability: number; // 0-100
  maxPopulation: number;
  defenses: PlanetDefense[];
  baseProduction: {
    dilithium: number;
    tritanium: number;
    deuterium: number;
    credits: number;
  };
}

export interface Colony {
  id: string;
  playerId: string;
  planetId: string;
  name: string;
  level: number; // 1-5 colony maturity
  population: number;
  morale: number; // 0-100
  buildingSlots: number;
  buildings: ColonyBuilding[];
  defenses: number; // Total defense strength
  productionBonuses: Record<string, number>;
  status: 'developing' | 'established' | 'thriving' | 'declining';
  foundedAt: number;
  lastAttackAt?: number;
}

export interface ColonyBuilding {
  id: string;
  buildingType: 'mine' | 'factory' | 'lab' | 'barracks' | 'spaceport' | 'defense';
  level: number;
  constructedAt: number;
  productionRate: number;
  defenseRating?: number;
}

export interface PlanetDefense {
  id: string;
  type: 'shield' | 'turret' | 'satellite';
  level: number;
  strength: number;
}

export interface Territory {
  id: string;
  playerId: string;
  name: string;
  planets: string[]; // planet IDs
  systems: string[]; // star system IDs
  controlPoints: number;
  taxRate: number; // 0-50% of production
  status: 'claimed' | 'disputed' | 'conquered';
  createdAt: number;
  alliesCanUse: boolean; // Alliance members can use territory
}

// Create a new colony
export function establishColony(
  playerId: string,
  planetId: string,
  planetName: string
): Colony {
  return {
    id: `colony_${playerId}_${planetId}_${Date.now()}`,
    playerId,
    planetId,
    name: `${planetName} Settlement`,
    level: 1,
    population: 100,
    morale: 75,
    buildingSlots: 5,
    buildings: [
      {
        id: `building_main_${Date.now()}`,
        buildingType: 'mine',
        level: 1,
        constructedAt: Date.now(),
        productionRate: 10,
      },
    ],
    defenses: 5,
    productionBonuses: {},
    status: 'developing',
    foundedAt: Date.now(),
  };
}

// Upgrade colony
export function upgradeColony(
  colony: Colony,
  resourcesCost: Record<string, number>
): { success: boolean; newLevel?: number; message: string } {
  if (colony.level >= 5) {
    return { success: false, message: 'Colony is already at maximum level' };
  }

  return {
    success: true,
    newLevel: colony.level + 1,
    message: `Colony upgraded to level ${colony.level + 1}`,
  };
}

// Add building to colony
export function addBuilding(
  colony: Colony,
  buildingType: 'mine' | 'factory' | 'lab' | 'barracks' | 'spaceport' | 'defense'
): { success: boolean; building?: ColonyBuilding; message: string } {
  if (colony.buildings.length >= colony.buildingSlots) {
    return { success: false, message: 'No available building slots' };
  }

  const building: ColonyBuilding = {
    id: `building_${buildingType}_${Date.now()}`,
    buildingType,
    level: 1,
    constructedAt: Date.now(),
    productionRate: 10,
  };

  if (buildingType === 'defense') {
    building.defenseRating = 5;
  }

  return { success: true, building, message: `${buildingType} constructed` };
}

// Calculate production
export function calculateColonyProduction(colony: Colony, planet: Planet): Record<string, number> {
  const production: Record<string, number> = {
    dilithium: 0,
    tritanium: 0,
    deuterium: 0,
    credits: 0,
  };

  // Base production from planet
  production.dilithium += planet.baseProduction.dilithium;
  production.tritanium += planet.baseProduction.tritanium;
  production.deuterium += planet.baseProduction.deuterium;
  production.credits += planet.baseProduction.credits;

  // Bonuses from buildings
  colony.buildings.forEach((building) => {
    if (building.buildingType === 'mine') {
      production.dilithium += building.productionRate * building.level;
    } else if (building.buildingType === 'factory') {
      production.tritanium += building.productionRate * building.level;
    }
  });

  // Morale affects production
  const moraleFactor = colony.morale / 100;
  Object.keys(production).forEach((key) => {
    production[key] = Math.floor(production[key] * moraleFactor);
  });

  return production;
}

// Update colony morale
export function updateColonyMorale(
  colony: Colony,
  change: number
): { newMorale: number; status: string } {
  const newMorale = Math.max(0, Math.min(100, colony.morale + change));

  let status = 'stable';
  if (newMorale >= 90) status = 'thriving';
  else if (newMorale >= 70) status = 'established';
  else if (newMorale >= 40) status = 'developing';
  else status = 'declining';

  return { newMorale, status };
}

// Create territory from colonies
export function createTerritory(
  playerId: string,
  name: string,
  colonizedPlanets: string[]
): Territory {
  return {
    id: `territory_${playerId}_${Date.now()}`,
    playerId,
    name,
    planets: colonizedPlanets,
    systems: [],
    controlPoints: colonizedPlanets.length * 10,
    taxRate: 10,
    status: 'claimed',
    createdAt: Date.now(),
    alliesCanUse: true,
  };
}

// Calculate territory tax income
export function calculateTaxIncome(
  territory: Territory,
  coloniesProduction: Record<string, Record<string, number>>
): Record<string, number> {
  const income: Record<string, number> = {
    dilithium: 0,
    tritanium: 0,
    deuterium: 0,
    credits: 0,
  };

  const taxFactor = territory.taxRate / 100;

  territory.planets.forEach((planetId) => {
    const production = coloniesProduction[planetId] || {};
    Object.keys(income).forEach((key) => {
      income[key] += (production[key] || 0) * taxFactor;
    });
  });

  return income;
}

// Contest territory (PvP mechanic)
export function contestTerritory(
  territory: Territory,
  attackerId: string,
  defenderPower: number,
  attackerPower: number
): {
  success: boolean;
  winner: string;
  controlPointsChange: number;
  message: string;
} {
  const powerRatio = attackerPower / (defenderPower || 1);
  const success = powerRatio > 1.2; // Attacker needs 20% advantage

  let controlPointsChange = 0;
  if (success) {
    controlPointsChange = Math.floor((powerRatio - 1) * 20);
  }

  return {
    success,
    winner: success ? attackerId : territory.playerId,
    controlPointsChange,
    message: success ? 'Territory conquered!' : 'Territory defense held!',
  };
}
