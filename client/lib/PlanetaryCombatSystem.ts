// PlanetaryCombatSystem.ts
// OGame-style planetary combat with raids, spies, sabotage, and reports

export type CombatMissionType = 'raid' | 'attack' | 'spy' | 'sabotage' | 'espionage' | 'siege';

export interface PlanetDefense {
  id: string;
  type: 'cannon' | 'laser' | 'missile' | 'shield' | 'detector';
  level: number;
  strength: number; // How much damage it deals
  durability: number; // Current health
  maxDurability: number;
  active: boolean;
  position?: { x: number; y: number };
}

export interface PlanetaryMission {
  id: string;
  attackerId: string;
  defenderId: string;
  targetPlanetId: string;
  missionType: CombatMissionType;
  attackFleetId: string;
  status: 'pending' | 'in_transit' | 'executing' | 'returning' | 'completed' | 'failed' | 'intercepted';
  launchedAt: number;
  arrivalTime: number;
  completionTime?: number;
  resources?: Record<string, number>; // For raids
  intelligence?: string; // For spy missions
  damageInflicted?: Record<string, number>;
  losses?: { attacker: number; defender: number };
  result?: MissionResult;
}

export interface MissionResult {
  success: boolean;
  missionType: CombatMissionType;
  attackerId: string;
  defenderId: string;
  timestamp: number;
  damage: {
    toDefenses: Record<string, number>; // Defense type -> damage
    toBuildings: Record<string, number>;
    toFleets: number;
    totalCasualties: number;
  };
  stolen?: Record<string, number>; // Resources stolen in raid
  intelligence?: {
    fleetComposition: any;
    defenseStatus: any;
    resourceStorage: Record<string, number>;
  };
  sabotage?: {
    targetBuilding?: string;
    buildingLevel?: number;
    destroyed: boolean;
  };
  report: CombatReport;
}

export interface CombatReport {
  id: string;
  type: 'incoming' | 'outgoing';
  timestamp: number;
  from: string; // Player ID
  to: string; // Player ID
  targetPlanet: string;
  missionType: CombatMissionType;
  status: 'pending' | 'reported' | 'archived';
  content: {
    initial: string; // Initial report text
    update?: string; // Updated if status changes
    final?: string; // Final result report
  };
  affectedResources?: Record<string, number>;
  affectedFleet?: number;
  affectedDefenses?: string[];
  estimatedDamage?: number;
  readAt?: number;
}

export interface DefenseBonus {
  type: string;
  percentage: number;
  source: string; // "tech_level_3" or "building_shield"
  active: boolean;
}

export interface RaidReport {
  success: boolean;
  attackerFleetId: string;
  cargoCapacity: number;
  cargoUsed: number;
  resourcesStolen: Record<string, number>;
  defensesBypass?: string[];
}

export interface SpyReport {
  agentCount: number;
  missionSuccess: boolean;
  discoveryChance: number;
  intelligence: {
    fleetSize: number;
    fleetComposition: Record<string, number>; // Ship type -> count
    defenseLevel: number;
    defenseTypes: string[];
    resourcesStored: Record<string, number>;
    buildingsPresent: string[];
    buildingLevels: Record<string, number>;
    researchingTech?: string;
    constructingShips?: string[];
  };
}

export interface SabotageReport {
  success: boolean;
  targetBuilding: string;
  targetLevel: number;
  damageCaused: number;
  destroyed: boolean;
  alternateTargets?: string[];
}

// Create planetary mission
export function createPlanetaryMission(
  attackerId: string,
  defenderId: string,
  targetPlanetId: string,
  missionType: CombatMissionType,
  attackFleetId: string,
  travelTime: number
): PlanetaryMission {
  return {
    id: `mission_${attackerId}_${targetPlanetId}_${Date.now()}`,
    attackerId,
    defenderId,
    targetPlanetId,
    missionType,
    attackFleetId,
    status: 'pending',
    launchedAt: Date.now(),
    arrivalTime: Date.now() + travelTime,
  };
}

// Execute raid mission
export function executeRaidMission(
  mission: PlanetaryMission,
  defenses: PlanetDefense[],
  cargoCapacity: number,
  storedResources: Record<string, number>,
  defenseBonus: number = 1.0
): RaidReport {
  if (mission.missionType !== 'raid') {
    return { success: false, attackerFleetId: mission.attackFleetId, cargoCapacity, cargoUsed: 0, resourcesStolen: {} };
  }

  // Calculate defense interception
  const totalDefenseStrength = defenses
    .filter((d) => d.active)
    .reduce((sum, d) => sum + d.strength * defenseBonus, 0);

  const raidStrength = 100; // Base raid strength (should scale with fleet)

  // Defend against raid
  if (totalDefenseStrength > raidStrength * 0.7) {
    // Raid partially intercepted
    const interceptRate = Math.min(0.9, totalDefenseStrength / (raidStrength * 2));
    return {
      success: false,
      attackerFleetId: mission.attackFleetId,
      cargoCapacity,
      cargoUsed: 0,
      resourcesStolen: {},
      defensesBypass: defenses.filter((d) => d.active).map((d) => d.id),
    };
  }

  // Raid succeeds - steal resources
  const stolenResources: Record<string, number> = {};
  let cargoUsed = 0;

  for (const [resourceType, amount] of Object.entries(storedResources)) {
    const stealAmount = Math.min(
      amount * 0.3, // Can steal up to 30% of stored resources
      cargoCapacity - cargoUsed
    );

    if (stealAmount > 0) {
      stolenResources[resourceType] = Math.floor(stealAmount);
      cargoUsed += stealAmount;
    }

    if (cargoUsed >= cargoCapacity) break;
  }

  // Damage some defenses
  defenses.forEach((d) => {
    if (Math.random() > 0.7 && d.active) {
      d.durability = Math.max(0, d.durability - d.maxDurability * 0.2);
      if (d.durability <= 0) d.active = false;
    }
  });

  return {
    success: true,
    attackerFleetId: mission.attackFleetId,
    cargoCapacity,
    cargoUsed,
    resourcesStolen: stolenResources,
  };
}

// Execute spy mission
export function executeSpyMission(
  mission: PlanetaryMission,
  targetFleet: any,
  targetDefenses: PlanetDefense[],
  targetBuildings: Record<string, number>,
  targetResources: Record<string, number>,
  defenseBonus: number = 1.0
): SpyReport {
  if (mission.missionType !== 'spy' && mission.missionType !== 'espionage') {
    return {
      agentCount: 0,
      missionSuccess: false,
      discoveryChance: 0,
      intelligence: {
        fleetSize: 0,
        fleetComposition: {},
        defenseLevel: 0,
        defenseTypes: [],
        resourcesStored: {},
        buildingsPresent: [],
        buildingLevels: {},
      },
    };
  }

  // Detection chance increases with defender's detection tech
  const baseDetectionChance = 0.3; // 30% base chance to be detected
  const detectionChance = baseDetectionChance * defenseBonus;
  const discovered = Math.random() < detectionChance;

  if (discovered && Math.random() > 0.5) {
    // Spy caught!
    return {
      agentCount: 0,
      missionSuccess: false,
      discoveryChance: detectionChance,
      intelligence: {
        fleetSize: 0,
        fleetComposition: {},
        defenseLevel: 0,
        defenseTypes: [],
        resourcesStored: {},
        buildingsPresent: [],
        buildingLevels: {},
      },
    };
  }

  // Gather intelligence
  return {
    agentCount: 3, // Agent count
    missionSuccess: true,
    discoveryChance: detectionChance,
    intelligence: {
      fleetSize: targetFleet.ships.length || 0,
      fleetComposition: targetFleet.ships?.reduce(
        (acc: any, ship: any) => {
          acc[ship.shipType] = (acc[ship.shipType] || 0) + 1;
          return acc;
        },
        {}
      ) || {},
      defenseLevel: targetDefenses.reduce((sum, d) => sum + d.level, 0),
      defenseTypes: targetDefenses.map((d) => d.type),
      resourcesStored: { ...targetResources },
      buildingsPresent: Object.keys(targetBuildings),
      buildingLevels: { ...targetBuildings },
    },
  };
}

// Execute attack mission
export function executeAttackMission(
  mission: PlanetaryMission,
  attackFleet: any,
  defenseFleet: any,
  planetDefenses: PlanetDefense[],
  defenseBonus: number = 1.0
): MissionResult {
  const timestamp = Date.now();
  const totalDefenses = planetDefenses
    .filter((d) => d.active)
    .reduce((sum, d) => sum + d.strength * defenseBonus, 0);

  const totalAttack = (attackFleet?.ships?.length || 0) * 50; // Base attack per ship

  let success = totalAttack > totalDefenses * 0.8;
  let damageTaken = 0;

  if (!success) {
    damageTaken = (totalDefenses / totalAttack) * 100;
  }

  // Damage defenses
  const damageToDefenses: Record<string, number> = {};
  planetDefenses.forEach((d) => {
    const dmg = Math.floor(Math.random() * 50);
    d.durability = Math.max(0, d.durability - dmg);
    damageToDefenses[d.type] = (damageToDefenses[d.type] || 0) + dmg;
    if (d.durability <= 0) d.active = false;
  });

  return {
    success,
    missionType: 'attack',
    attackerId: mission.attackerId,
    defenderId: mission.defenderId,
    timestamp,
    damage: {
      toDefenses: damageToDefenses,
      toBuildings: {},
      toFleets: Math.floor(damageTaken),
      totalCasualties: Math.floor((damageTaken / 100) * (attackFleet?.ships?.length || 1)),
    },
    report: generateCombatReport('outgoing', mission.attackerId, mission.defenderId, mission.targetPlanetId, 'attack', success),
  };
}

// Execute sabotage mission
export function executeSabotageMission(
  mission: PlanetaryMission,
  targetBuildings: Record<string, number>,
  defenseBonus: number = 1.0
): SabotageReport {
  const buildingIds = Object.keys(targetBuildings);
  if (buildingIds.length === 0) {
    return {
      success: false,
      targetBuilding: 'none',
      targetLevel: 0,
      damageCaused: 0,
      destroyed: false,
    };
  }

  // Select random building to sabotage
  const targetBuilding = buildingIds[Math.floor(Math.random() * buildingIds.length)];
  const buildingLevel = targetBuildings[targetBuilding] || 1;

  // Success chance decreases with defense bonus
  const baseSuccessChance = 0.6;
  const successChance = Math.max(0.2, baseSuccessChance - defenseBonus * 0.1);
  const success = Math.random() < successChance;

  if (!success) {
    return {
      success: false,
      targetBuilding,
      targetLevel: buildingLevel,
      damageCaused: 0,
      destroyed: false,
      alternateTargets: buildingIds.filter((b) => b !== targetBuilding).slice(0, 3),
    };
  }

  // Sabotage successful
  const damage = Math.floor(buildingLevel * 15 * (0.8 + Math.random() * 0.4));
  const destroyed = damage > buildingLevel * 20;

  return {
    success: true,
    targetBuilding,
    targetLevel: buildingLevel,
    damageCaused: damage,
    destroyed,
  };
}

// Create combat report
export function generateCombatReport(
  type: 'incoming' | 'outgoing',
  fromPlayerId: string,
  toPlayerId: string,
  targetPlanet: string,
  missionType: CombatMissionType,
  success: boolean
): CombatReport {
  const reportTexts: Record<CombatMissionType, (success: boolean) => string> = {
    raid: (success) =>
      success
        ? `Successful raid on planet ${targetPlanet}. Resources stolen!`
        : `Raid failed! Planet defenses held strong.`,
    attack: (success) =>
      success
        ? `Planetary assault successful! Defenses destroyed.`
        : `Attack repelled! Defenders held the line.`,
    spy: (success) =>
      success
        ? `Spy mission successful. Intelligence gathered.`
        : `Spy mission failed. Agents captured or turned back.`,
    sabotage: (success) =>
      success
        ? `Sabotage mission successful! Buildings damaged.`
        : `Sabotage attempt failed. Target defended.`,
    espionage: (success) =>
      success
        ? `Espionage gathering complete. Full intel obtained.`
        : `Espionage mission compromised.`,
    siege: (success) =>
      success
        ? `Siege underway. Planet blockaded.`
        : `Siege attempt failed. Enemy reinforcements arrived.`,
  };

  return {
    id: `report_${fromPlayerId}_${toPlayerId}_${Date.now()}`,
    type,
    timestamp: Date.now(),
    from: fromPlayerId,
    to: toPlayerId,
    targetPlanet,
    missionType,
    status: 'pending',
    content: {
      initial: `[${missionType.toUpperCase()}] Fleet from ${fromPlayerId} detected heading to ${targetPlanet}!`,
      update: `Mission in progress...`,
      final: reportTexts[missionType](success),
    },
  };
}

// Add planet defense
export function addPlanetDefense(
  planet: any,
  defenseType: 'cannon' | 'laser' | 'missile' | 'shield' | 'detector',
  level: number
): PlanetDefense {
  const strengths: Record<string, number> = {
    cannon: 50,
    laser: 75,
    missile: 100,
    shield: 150,
    detector: 25,
  };

  const defense: PlanetDefense = {
    id: `def_${defenseType}_${Date.now()}`,
    type: defenseType,
    level,
    strength: strengths[defenseType] * level,
    durability: 100 * level,
    maxDurability: 100 * level,
    active: true,
  };

  if (!planet.defenses) planet.defenses = [];
  planet.defenses.push(defense);

  return defense;
}

// Repair defense
export function repairDefense(defense: PlanetDefense, repairAmount: number): { repaired: number; newHealth: number } {
  const repaired = Math.min(repairAmount, defense.maxDurability - defense.durability);
  defense.durability += repaired;

  return {
    repaired,
    newHealth: defense.durability,
  };
}

// Upgrade defense
export function upgradeDefense(defense: PlanetDefense, upgradeCost: Record<string, number>): PlanetDefense {
  defense.level++;
  defense.strength = defense.strength * 1.3; // 30% stronger per level
  defense.maxDurability = defense.maxDurability * 1.2; // 20% more durability
  defense.durability = defense.maxDurability;

  return defense;
}

// Calculate total planet defense strength
export function calculateTotalDefenseStrength(
  defenses: PlanetDefense[],
  defenseBonus: number = 1.0
): number {
  return defenses
    .filter((d) => d.active)
    .reduce((sum, d) => sum + d.strength * defenseBonus, 0);
}

// Get mission report
export function getMissionReport(mission: PlanetaryMission): CombatReport | null {
  return mission.result?.report || null;
}

// Intercept incoming mission
export function interceptMission(
  mission: PlanetaryMission,
  defenseFleet: any,
  availableInterceptors: number
): { intercepted: boolean; shipsLost: number } {
  const interceptChance = (availableInterceptors / (mission.attackFleetId.length + 1)) * 0.5;

  if (Math.random() < interceptChance) {
    const shipsLost = Math.floor(Math.random() * availableInterceptors * 0.3);
    return {
      intercepted: true,
      shipsLost,
    };
  }

  return {
    intercepted: false,
    shipsLost: 0,
  };
}

// Create spy counter-measure
export function implementCounterIntelligence(
  planet: any,
  investmentLevel: number
): { detectionBonus: number; description: string } {
  return {
    detectionBonus: investmentLevel * 0.15, // 15% detection per investment level
    description: `Defense networks upgraded. Spy detection increased by ${investmentLevel * 15}%.`,
  };
}

// Schedule mission alarm
export function scheduleArrivalAlarm(mission: PlanetaryMission): { alarmTime: number; minutesUntilArrival: number } {
  const minutesUntilArrival = (mission.arrivalTime - Date.now()) / 60000;

  return {
    alarmTime: mission.arrivalTime,
    minutesUntilArrival: Math.ceil(minutesUntilArrival),
  };
}

// Generate full combat log
export function generateCombatLog(mission: PlanetaryMission): string {
  if (!mission.result) return 'Mission still in progress...';

  const result = mission.result;
  const log: string[] = [];

  log.push(`=== ${result.missionType.toUpperCase()} REPORT ===`);
  log.push(`Time: ${new Date(result.timestamp).toLocaleString()}`);
  log.push(`Attacker: ${result.attackerId}`);
  log.push(`Defender: ${result.defenderId}`);
  log.push(`Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  log.push('');

  log.push('DAMAGE REPORT:');
  if (Object.keys(result.damage.toDefenses).length > 0) {
    log.push(`  Defense Losses: ${JSON.stringify(result.damage.toDefenses)}`);
  }
  log.push(`  Fleet Casualties: ${result.damage.toFleets}`);
  log.push(`  Total Casualties: ${result.damage.totalCasualties}`);
  log.push('');

  if (result.stolen) {
    log.push('STOLEN RESOURCES:');
    log.push(`  ${JSON.stringify(result.stolen)}`);
    log.push('');
  }

  if (result.intelligence) {
    log.push('INTELLIGENCE GATHERED:');
    log.push(`  Enemy Fleet Size: ${result.intelligence.fleetComposition}`);
    log.push(`  Stored Resources: ${JSON.stringify(result.intelligence.resourcesStored)}`);
    log.push('');
  }

  if (result.sabotage) {
    log.push('SABOTAGE RESULTS:');
    log.push(`  Target: ${result.sabotage.targetBuilding}`);
    log.push(`  Status: ${result.sabotage.destroyed ? 'DESTROYED' : 'DAMAGED'}`);
    log.push('');
  }

  return log.join('\n');
}

// Mission timeline helpers
export function getMissionETA(mission: PlanetaryMission): { status: string; timeRemaining: number } {
  const now = Date.now();

  if (mission.status === 'completed' || mission.status === 'failed') {
    return { status: mission.status, timeRemaining: 0 };
  }

  if (now < mission.arrivalTime) {
    return { status: 'in_transit', timeRemaining: mission.arrivalTime - now };
  }

  if (!mission.completionTime) {
    return { status: 'executing', timeRemaining: 0 };
  }

  if (now < mission.completionTime) {
    return { status: 'executing', timeRemaining: mission.completionTime - now };
  }

  return { status: 'returning', timeRemaining: 0 };
}

// Defense level rating
export function getPlanetDefenseRating(planet: any): { rating: string; strength: number; level: number } {
  const strength = calculateTotalDefenseStrength(planet.defenses || []);
  let level = 0;
  let rating = 'Undefended';

  if (strength < 100) {
    rating = 'Vulnerable';
    level = 0;
  } else if (strength < 500) {
    rating = 'Light';
    level = 1;
  } else if (strength < 1500) {
    rating = 'Moderate';
    level = 2;
  } else if (strength < 3500) {
    rating = 'Strong';
    level = 3;
  } else if (strength < 7000) {
    rating = 'Very Strong';
    level = 4;
  } else {
    rating = 'Fortress';
    level = 5;
  }

  return { rating, strength, level };
}
