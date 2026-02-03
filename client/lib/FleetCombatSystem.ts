// FleetCombatSystem.ts
// Fleet combat system with Stargate, Jump Gate, and Hyperspace mechanics
// Similar to OGame but for fleet-to-fleet encounters

export type FleetMissionType = 'attack' | 'defend' | 'escort' | 'blockade' | 'patrol' | 'intercept';
export type TransitMethod = 'normal' | 'stargate' | 'jumpgate' | 'hyperspace';
export type CombatPhase = 'pre_combat' | 'initial' | 'mid_combat' | 'final' | 'aftermath';
export type FleetStatusType = 'healthy' | 'damaged' | 'critical' | 'destroyed';

export interface FleetCombat {
  id: string;
  attackerId: string;
  defenderId: string;
  attackFleetId: string;
  defenseFleetId?: string;
  status: 'pending' | 'in_transit' | 'engaged' | 'completed' | 'failed' | 'intercepted';
  missionType: FleetMissionType;
  transitMethod: TransitMethod;
  location: {
    x: number;
    y: number;
    z: number;
    sectorId: string;
    starGateId?: string;
    jumpGateId?: string;
  };
  launchedAt: number;
  arrivalTime: number;
  engagementTime?: number;
  completionTime?: number;
  rounds: CombatRound[];
  result?: FleetCombatResult;
}

export interface CombatRound {
  roundNumber: number;
  timestamp: number;
  attackerActions: FleetAction[];
  defenderActions: FleetAction[];
  damageDealt: {
    toAttacker: number;
    toDefender: number;
  };
  shipsDestroyed: {
    attacker: number;
    defender: number;
  };
  summary: string;
}

export interface FleetAction {
  type: 'attack' | 'defend' | 'focus_fire' | 'tactical_retreat' | 'support_fire' | 'evasive_maneuver';
  shipClass: string;
  damage: number;
  accuracy: number;
  shieldsUsed: number;
  armorDamage: number;
}

export interface FleetCombatResult {
  success: boolean;
  winner: 'attacker' | 'defender' | 'draw';
  timestamp: number;
  totalRounds: number;
  attackerLosses: FleetLosses;
  defenderLosses: FleetLosses;
  resourcesTransferred?: Record<string, number>;
  experienceGained: {
    attacker: number;
    defender: number;
  };
  combatReport: FleetCombatReport;
}

export interface FleetLosses {
  shipsDestroyed: number;
  shipsDisabled: number;
  crewCasualties: number;
  estimatedValue: number;
  shipsRemaining: number;
}

export interface FleetCombatReport {
  id: string;
  type: 'incoming' | 'outgoing';
  timestamp: number;
  from: string;
  to: string;
  combatId: string;
  location: { x: number; y: number; z: number; sector: string };
  missionType: FleetMissionType;
  transitMethod: TransitMethod;
  status: 'pending' | 'reported' | 'archived';
  content: {
    initial: string;
    update?: string;
    final?: string;
  };
  totalShipsEngaged: {
    attacker: number;
    defender: number;
  };
  totalDamage: {
    attacker: number;
    defender: number;
  };
  duration: number; // in seconds
  readAt?: number;
}

export interface Stargate {
  id: string;
  name: string;
  location: { x: number; y: number; z: number; sector: string };
  linkedTo: string[]; // IDs of connected stargates
  level: number; // 1-10, determines capacity and speed
  owner?: string; // Player ID if owned
  controlPoints: number; // 0-100
  status: 'active' | 'damaged' | 'destroyed';
  capacity: number; // Max fleet size that can transit
  transitTime: number; // milliseconds
  maintenance: {
    health: number; // 0-100
    lastRepair: number;
    repairCost: number;
  };
  defenses?: StargateDefense[];
}

export interface JumpGate {
  id: string;
  name: string;
  location: { x: number; y: number; z: number; sector: string };
  range: number; // Max distance it can reach
  level: number; // 1-10
  owner?: string;
  status: 'active' | 'dormant' | 'overloaded' | 'destroyed';
  energyRequired: number; // Resource cost per jump
  cooldownTime: number; // milliseconds
  lastUsed?: number;
  stability: number; // 0-100, affects success rate
  maxPayload: number; // Max fleet size
  destabilizationRisk: number; // 0-100
}

export interface HyperspaceRoute {
  id: string;
  name: string;
  startLocation: { x: number; y: number; z: number };
  endLocation: { x: number; y: number; z: number };
  distance: number;
  baseTransitTime: number;
  dangerLevel: number; // 0-100
  discovered: boolean;
  owner?: string;
  controlPoints: number; // 0-100
  knownHazards: HyperspaceHazard[];
  passageHealth: number; // 0-100
}

export interface HyperspaceHazard {
  id: string;
  type: 'asteroid_field' | 'ion_storm' | 'gravitational_anomaly' | 'subspace_tear' | 'enemy_patrol';
  severity: number; // 1-10
  location: { x: number; y: number; z: number };
  damagePercentage: number; // % of fleet health
  avoidanceDifficulty: number; // 1-10
  detectionRange: number;
}

export interface StargateDefense {
  id: string;
  type: 'shield' | 'weapon' | 'sensor';
  level: number;
  strength: number;
  status: 'active' | 'damaged' | 'offline';
}

export interface FleetEngagementStatistics {
  totalBattles: number;
  wins: number;
  losses: number;
  draws: number;
  averageFleetSize: number;
  totalShipsLost: number;
  totalShipsDestroyed: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  combatEfficiency: number; // Damage dealt / Damage taken
  winRate: number;
}

// Create fleet combat mission
export function createFleetCombat(
  attackerId: string,
  defenderId: string,
  attackFleetId: string,
  missionType: FleetMissionType = 'attack',
  transitMethod: TransitMethod = 'normal',
  targetLocation: { x: number; y: number; z: number; sectorId: string },
  travelTime: number
): FleetCombat {
  const now = Date.now();
  return {
    id: `combat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    attackerId,
    defenderId,
    attackFleetId,
    status: 'pending',
    missionType,
    transitMethod,
    location: targetLocation,
    launchedAt: now,
    arrivalTime: now + travelTime,
    rounds: [],
  };
}

// Execute fleet combat (round-based, similar to planetary combat)
export function executeFleetCombat(
  combat: FleetCombat,
  attackerFleet: any,
  defenderFleet: any,
  maxRounds: number = 50
): FleetCombat {
  const startTime = Date.now();
  combat.engagementTime = startTime;
  combat.status = 'engaged';

  let attackerHealth = 100;
  let defenderHealth = 100;
  let round = 0;

  while (
    round < maxRounds &&
    attackerHealth > 0 &&
    defenderHealth > 0
  ) {
    round++;

    const attackerDamage = calculateFleetDamage(
      attackerFleet,
      defenderFleet,
      defenderHealth,
      combat.missionType
    );
    const defenderDamage = calculateFleetDamage(
      defenderFleet,
      attackerFleet,
      attackerHealth,
      'defend'
    );

    attackerHealth -= defenderDamage * 0.01;
    defenderHealth -= attackerDamage * 0.01;

    const combatRound: CombatRound = {
      roundNumber: round,
      timestamp: startTime + round * 1000,
      attackerActions: generateFleetActions(attackerFleet, round),
      defenderActions: generateFleetActions(defenderFleet, round),
      damageDealt: {
        toAttacker: defenderDamage,
        toDefender: attackerDamage,
      },
      shipsDestroyed: {
        attacker: Math.floor((100 - attackerHealth) / 10),
        defender: Math.floor((100 - defenderHealth) / 10),
      },
      summary: generateRoundSummary(round, attackerDamage, defenderDamage),
    };

    combat.rounds.push(combatRound);
  }

  // Determine result
  const result = determineFleetCombatResult(
    combat,
    attackerHealth,
    defenderHealth,
    attackerFleet,
    defenderFleet
  );

  combat.result = result;
  combat.completionTime = Date.now();
  combat.status = 'completed';

  return combat;
}

// Calculate fleet damage based on composition and strategy
function calculateFleetDamage(
  fleet: any,
  targetFleet: any,
  targetHealth: number,
  missionType: string
): number {
  const baseDamage = fleet.totalPower || 100;
  const fleetBonus = fleet.ships?.length || 1;
  const strategyMultiplier = missionType === 'attack' ? 1.3 : 0.8;
  const targetDefense = targetFleet.defenseRating || 50;
  const healthModifier = Math.max(0.1, targetHealth / 100);

  const damage = baseDamage * fleetBonus * strategyMultiplier * (1 - targetDefense / 200) * healthModifier;
  return Math.max(0, damage + (Math.random() - 0.5) * 20);
}

// Generate fleet action summary
function generateFleetActions(fleet: any, round: number): FleetAction[] {
  const actions: FleetAction[] = [];
  const actionTypes: FleetAction['type'][] = [
    'attack',
    'focus_fire',
    'evasive_maneuver',
    'support_fire',
  ];

  const numActions = Math.min(3, Math.floor((fleet.ships?.length || 1) / 3) + 1);

  for (let i = 0; i < numActions; i++) {
    actions.push({
      type: actionTypes[Math.floor(Math.random() * actionTypes.length)],
      shipClass: fleet.ships?.[i]?.class || 'cruiser',
      damage: Math.floor(Math.random() * 50) + 20,
      accuracy: Math.random() * 0.3 + 0.7,
      shieldsUsed: Math.floor(Math.random() * 100),
      armorDamage: Math.floor(Math.random() * 30),
    });
  }

  return actions;
}

// Generate round summary narrative
function generateRoundSummary(round: number, attackerDamage: number, defenderDamage: number): string {
  const summaries = [
    `Round ${round}: Intense firefight! Attacker dealt ${Math.floor(attackerDamage)} damage. Defender countered with ${Math.floor(defenderDamage)} damage.`,
    `Round ${round}: Combat intensifies! The battle rages on with both sides trading fire.`,
    `Round ${round}: Ships maneuver for position. Weapons fire crisscrosses the battlefield.`,
    `Round ${round}: Strategic repositioning. ${Math.floor(attackerDamage)} damage to defenders, ${Math.floor(defenderDamage)} to attackers.`,
    `Round ${round}: Shields flaring! Engines roaring! A fierce exchange of weapons fire.`,
  ];

  return summaries[Math.floor(Math.random() * summaries.length)];
}

// Determine combat result
function determineFleetCombatResult(
  combat: FleetCombat,
  attackerHealth: number,
  defenderHealth: number,
  attackerFleet: any,
  defenderFleet: any
): FleetCombatResult {
  let winner: 'attacker' | 'defender' | 'draw';
  let success = false;

  if (attackerHealth > defenderHealth) {
    winner = 'attacker';
    success = true;
  } else if (defenderHealth > attackerHealth) {
    winner = 'defender';
    success = false;
  } else {
    winner = 'draw';
    success = false;
  }

  const attackerLosses = calculateFleetLosses(attackerHealth, attackerFleet);
  const defenderLosses = calculateFleetLosses(defenderHealth, defenderFleet);

  const attackerExp = success
    ? Math.floor((defenderFleet.totalPower || 100) * (100 - defenderHealth) / 100)
    : 0;
  const defenderExp = !success && winner === 'defender'
    ? Math.floor((attackerFleet.totalPower || 100) * (100 - attackerHealth) / 100)
    : 0;

  return {
    success,
    winner,
    timestamp: Date.now(),
    totalRounds: combat.rounds.length,
    attackerLosses,
    defenderLosses,
    experienceGained: {
      attacker: attackerExp,
      defender: defenderExp,
    },
    combatReport: generateFleetCombatReport(
      'incoming',
      combat.defenderId,
      combat.attackerId,
      combat,
      attackerExp,
      defenderExp
    ),
  };
}

// Calculate fleet losses
function calculateFleetLosses(health: number, fleet: any): FleetLosses {
  const damagePercent = 100 - health;
  const shipsDestroyed = Math.floor((fleet.ships?.length || 10) * (damagePercent / 100));
  const crewCasualties = Math.floor((fleet.crewCount || 1000) * (damagePercent / 100) * 0.7);
  const estimatedValue = (fleet.totalValue || 100000) * (damagePercent / 100);

  return {
    shipsDestroyed,
    shipsDisabled: Math.floor(shipsDestroyed * 0.5),
    crewCasualties,
    estimatedValue,
    shipsRemaining: Math.max(0, (fleet.ships?.length || 10) - shipsDestroyed),
  };
}

// Generate fleet combat report
export function generateFleetCombatReport(
  type: 'incoming' | 'outgoing',
  from: string,
  to: string,
  combat: FleetCombat,
  attackerExp: number,
  defenderExp: number
): FleetCombatReport {
  const totalShipsEngaged = {
    attacker: 10, // Would come from fleet data
    defender: 8,
  };

  const totalDamage = {
    attacker: combat.rounds.reduce((sum, r) => sum + r.damageDealt.toAttacker, 0),
    defender: combat.rounds.reduce((sum, r) => sum + r.damageDealt.toDefender, 0),
  };

  const duration = (combat.completionTime || Date.now()) - (combat.engagementTime || Date.now());

  const winner = totalDamage.attacker > totalDamage.defender ? 'Attacker' : 'Defender';
  const location = `${combat.location.sectorId} (${combat.location.x}, ${combat.location.y}, ${combat.location.z})`;

  const initialReport = `
🚀 FLEET COMBAT REPORT 🚀
═══════════════════════════════════════════════════════════════

Combat Type: ${combat.missionType.toUpperCase()}
Transit Method: ${combat.transitMethod.toUpperCase()}
Location: ${location}
Time: ${new Date(combat.launchedAt).toLocaleString()}

INITIAL REPORT:
Attacker Fleet (${totalShipsEngaged.attacker} ships) engaged Defender Fleet (${totalShipsEngaged.defender} ships).

Transit Method: ${combat.transitMethod === 'stargate' ? 'Used Stargate Network' : combat.transitMethod === 'jumpgate' ? 'Jump Gate Transit' : combat.transitMethod === 'hyperspace' ? 'Hyperspace Route' : 'Standard FTL Drive'}

Combat Status: ENGAGED
Initial Contact: ${combat.rounds.length > 0 ? `${combat.rounds.length} rounds of combat` : 'Awaiting combat'}
  `;

  const finalReport = `

═══════════════════════════════════════════════════════════════
FINAL REPORT:
═══════════════════════════════════════════════════════════════

Combat Winner: ${winner}
Total Rounds: ${combat.rounds.length}
Duration: ${Math.floor(duration / 1000)} seconds

ATTACKER LOSSES:
  Ships Destroyed: ${combat.result?.attackerLosses.shipsDestroyed || 0}
  Crew Casualties: ${combat.result?.attackerLosses.crewCasualties || 0}
  Total Damage Taken: ${Math.floor(totalDamage.attacker)} points
  Estimated Loss Value: ${combat.result?.attackerLosses.estimatedValue || 0} credits

DEFENDER LOSSES:
  Ships Destroyed: ${combat.result?.defenderLosses.shipsDestroyed || 0}
  Crew Casualties: ${combat.result?.defenderLosses.crewCasualties || 0}
  Total Damage Taken: ${Math.floor(totalDamage.defender)} points
  Estimated Loss Value: ${combat.result?.defenderLosses.estimatedValue || 0} credits

EXPERIENCE GAINED:
  Attacker: +${attackerExp} XP
  Defender: +${defenderExp} XP

═══════════════════════════════════════════════════════════════
  `;

  return {
    id: `report_${Date.now()}`,
    type,
    timestamp: Date.now(),
    from,
    to,
    combatId: combat.id,
    location: {
      x: combat.location.x,
      y: combat.location.y,
      z: combat.location.z,
      sector: combat.location.sectorId,
    },
    missionType: combat.missionType,
    transitMethod: combat.transitMethod,
    status: 'reported',
    content: {
      initial: initialReport,
      final: finalReport,
    },
    totalShipsEngaged,
    totalDamage,
    duration: Math.floor(duration / 1000),
  };
}

// ===== STARGATE FUNCTIONS =====

// Create stargate
export function createStargate(
  name: string,
  location: { x: number; y: number; z: number; sector: string },
  level: number = 1,
  linkedTo: string[] = []
): Stargate {
  const capacity = level * 10; // Level 1 = 10 ships, Level 10 = 100 ships
  const transitTime = Math.max(1000, 10000 - level * 1000); // 1-9 seconds

  return {
    id: `stargate_${Date.now()}`,
    name,
    location,
    linkedTo,
    level,
    status: 'active',
    capacity,
    transitTime,
    controlPoints: 0,
    maintenance: {
      health: 100,
      lastRepair: Date.now(),
      repairCost: level * 5000,
    },
  };
}

// Transit fleet through stargate
export function transitThroughStargate(
  fleetId: string,
  stargate: Stargate,
  destinationStargateId: string,
  fleetSize: number
): { success: boolean; message: string; transitTime: number } {
  if (!stargate.linkedTo.includes(destinationStargateId)) {
    return {
      success: false,
      message: 'Destination stargate not connected to this stargate network',
      transitTime: 0,
    };
  }

  if (stargate.status !== 'active') {
    return {
      success: false,
      message: `Stargate status: ${stargate.status}. Cannot transit.`,
      transitTime: 0,
    };
  }

  if (fleetSize > stargate.capacity) {
    return {
      success: false,
      message: `Fleet too large for this stargate (${fleetSize}/${stargate.capacity} capacity)`,
      transitTime: 0,
    };
  }

  if (stargate.maintenance.health < 30) {
    return {
      success: false,
      message: 'Stargate requires maintenance before use',
      transitTime: 0,
    };
  }

  // Reduce stargate health
  stargate.maintenance.health = Math.max(0, stargate.maintenance.health - 5);

  return {
    success: true,
    message: `Fleet transiting through ${stargate.name}. ETA: ${Math.floor(stargate.transitTime / 1000)}s`,
    transitTime: stargate.transitTime,
  };
}

// Repair stargate
export function repairStargate(stargate: Stargate, repairAmount: number): Stargate {
  stargate.maintenance.health = Math.min(100, stargate.maintenance.health + repairAmount);
  stargate.maintenance.lastRepair = Date.now();

  if (stargate.maintenance.health === 100) {
    stargate.status = 'active';
  }

  return stargate;
}

// Upgrade stargate
export function upgradeStargate(stargate: Stargate): Stargate {
  if (stargate.level >= 10) {
    return stargate;
  }

  stargate.level += 1;
  stargate.capacity = stargate.level * 10;
  stargate.transitTime = Math.max(1000, 10000 - stargate.level * 1000);
  stargate.maintenance.repairCost = stargate.level * 5000;

  return stargate;
}

// ===== JUMP GATE FUNCTIONS =====

// Create jump gate
export function createJumpGate(
  name: string,
  location: { x: number; y: number; z: number; sector: string },
  range: number = 5000,
  level: number = 1
): JumpGate {
  const maxPayload = level * 8; // Level 1 = 8 ships
  const energyRequired = level * 100; // Resource cost
  const cooldownTime = Math.max(2000, 15000 - level * 1000); // 2-13 seconds

  return {
    id: `jumpgate_${Date.now()}`,
    name,
    location,
    range,
    level,
    owner: undefined,
    status: 'active',
    energyRequired,
    cooldownTime,
    stability: 100,
    maxPayload,
    destabilizationRisk: 5 * (11 - level), // Level 10 = 5% risk, Level 1 = 50% risk
  };
}

// Execute jump gate transit
export function executeJumpGateTransit(
  fleetId: string,
  jumpGate: JumpGate,
  targetLocation: { x: number; y: number; z: number },
  fleetSize: number,
  resources: Record<string, number> = {}
): { success: boolean; message: string; energyUsed: number } {
  if (jumpGate.status !== 'active') {
    return {
      success: false,
      message: `Jump Gate status: ${jumpGate.status}`,
      energyUsed: 0,
    };
  }

  if (fleetSize > jumpGate.maxPayload) {
    return {
      success: false,
      message: `Fleet exceeds jump gate capacity (${fleetSize}/${jumpGate.maxPayload})`,
      energyUsed: 0,
    };
  }

  const distance = Math.sqrt(
    Math.pow(targetLocation.x - jumpGate.location.x, 2) +
    Math.pow(targetLocation.y - jumpGate.location.y, 2) +
    Math.pow(targetLocation.z - jumpGate.location.z, 2)
  );

  if (distance > jumpGate.range) {
    return {
      success: false,
      message: `Target out of range (${Math.floor(distance)}/${jumpGate.range})`,
      energyUsed: 0,
    };
  }

  // Check if last used (cooldown)
  const timeSinceLastUse = Date.now() - (jumpGate.lastUsed || 0);
  if (timeSinceLastUse < jumpGate.cooldownTime) {
    return {
      success: false,
      message: `Jump Gate on cooldown (${Math.floor((jumpGate.cooldownTime - timeSinceLastUse) / 1000)}s remaining)`,
      energyUsed: 0,
    };
  }

  // Roll for stability
  const stabilityRoll = Math.random() * 100;
  if (stabilityRoll < jumpGate.destabilizationRisk) {
    jumpGate.status = 'overloaded';
    return {
      success: false,
      message: 'Jump Gate overloaded during transit! Fleet scattered!',
      energyUsed: jumpGate.energyRequired,
    };
  }

  jumpGate.lastUsed = Date.now();
  jumpGate.stability = Math.max(50, jumpGate.stability - 10);

  return {
    success: true,
    message: `Jumping to target location. Distance: ${Math.floor(distance)}`,
    energyUsed: jumpGate.energyRequired,
  };
}

// Stabilize jump gate
export function stabilizeJumpGate(jumpGate: JumpGate, stabilizationAmount: number = 20): JumpGate {
  jumpGate.stability = Math.min(100, jumpGate.stability + stabilizationAmount);
  if (jumpGate.stability > 70) {
    jumpGate.status = 'active';
  }
  return jumpGate;
}

// ===== HYPERSPACE ROUTE FUNCTIONS =====

// Create hyperspace route
export function createHyperspaceRoute(
  name: string,
  startLocation: { x: number; y: number; z: number },
  endLocation: { x: number; y: number; z: number }
): HyperspaceRoute {
  const distance = Math.sqrt(
    Math.pow(endLocation.x - startLocation.x, 2) +
    Math.pow(endLocation.y - startLocation.y, 2) +
    Math.pow(endLocation.z - startLocation.z, 2)
  );

  const baseTransitTime = distance * 100; // ms per unit distance
  const dangerLevel = Math.floor(Math.random() * 60) + 10; // 10-70

  return {
    id: `hyperspace_${Date.now()}`,
    name,
    startLocation,
    endLocation,
    distance,
    baseTransitTime,
    dangerLevel,
    discovered: false,
    controlPoints: 0,
    knownHazards: generateHyperspaceHazards(dangerLevel),
    passageHealth: 100,
  };
}

// Generate hyperspace hazards
function generateHyperspaceHazards(dangerLevel: number): HyperspaceHazard[] {
  const hazards: HyperspaceHazard[] = [];
  const hazardTypes: HyperspaceHazard['type'][] = [
    'asteroid_field',
    'ion_storm',
    'gravitational_anomaly',
    'subspace_tear',
    'enemy_patrol',
  ];

  const hazardCount = Math.floor(dangerLevel / 20);

  for (let i = 0; i < hazardCount; i++) {
    hazards.push({
      id: `hazard_${i}`,
      type: hazardTypes[Math.floor(Math.random() * hazardTypes.length)],
      severity: Math.floor(Math.random() * 8) + 2,
      location: { x: Math.random() * 1000, y: Math.random() * 1000, z: Math.random() * 1000 },
      damagePercentage: Math.floor(Math.random() * 20) + 10,
      avoidanceDifficulty: Math.floor(Math.random() * 8) + 1,
      detectionRange: Math.random() * 500 + 200,
    });
  }

  return hazards;
}

// Navigate hyperspace route
export function navigateHyperspaceRoute(
  fleetId: string,
  route: HyperspaceRoute,
  fleetNavigationSkill: number = 50
): {
  success: boolean;
  message: string;
  damageIncurred: number;
  transitTime: number;
} {
  let totalDamage = 0;
  let message = `Entering hyperspace route: ${route.name}\n`;

  // Check for hazard encounters
  for (const hazard of route.knownHazards) {
    const avoidanceRoll = Math.random() * 100;
    const effectiveSkill = fleetNavigationSkill + 20; // Base bonus

    if (avoidanceRoll > effectiveSkill - hazard.avoidanceDifficulty * 5) {
      // Hit by hazard
      const damageAmount = hazard.damagePercentage * (hazard.severity / 10);
      totalDamage += damageAmount;
      message += `⚠️ Encountered ${hazard.type}! Damage: ${Math.floor(damageAmount)}%\n`;
    } else {
      message += `✓ Navigated around ${hazard.type}\n`;
    }
  }

  // Random encounter chance
  if (Math.random() < 0.1) {
    totalDamage += 10;
    message += `⚠️ Unknown anomaly encountered! Damage: 10%\n`;
  }

  const adjustedTransitTime = route.baseTransitTime * (1 + totalDamage / 100);

  return {
    success: totalDamage < 50, // Failure if damage exceeds 50%
    message: message.trim(),
    damageIncurred: Math.min(100, totalDamage),
    transitTime: adjustedTransitTime,
  };
}

// Damage hyperspace route (destabilization)
export function damageHyperspaceRoute(route: HyperspaceRoute, damageAmount: number): HyperspaceRoute {
  route.passageHealth = Math.max(0, route.passageHealth - damageAmount);

  if (route.passageHealth < 30) {
    route.dangerLevel = Math.min(100, route.dangerLevel + 20);
    route.knownHazards = generateHyperspaceHazards(route.dangerLevel);
  }

  return route;
}

// Scout hyperspace route (reduce danger level)
export function scoutHyperspaceRoute(route: HyperspaceRoute, scoutingSkill: number = 50): HyperspaceRoute {
  const dangerReduction = scoutingSkill / 10;
  route.dangerLevel = Math.max(5, route.dangerLevel - dangerReduction);
  route.discovered = true;

  // Scouts reduce known hazards by identifying safer paths
  if (route.knownHazards.length > 0) {
    route.knownHazards = route.knownHazards.filter(() => Math.random() > 0.3);
  }

  return route;
}

// ===== COMBAT STATISTICS =====

// Calculate fleet engagement statistics
export function calculateFleetEngagementStatistics(
  combats: FleetCombat[]
): FleetEngagementStatistics {
  let wins = 0;
  let losses = 0;
  let draws = 0;
  let totalShipsLost = 0;
  let totalShipsDestroyed = 0;
  let totalDamageDealt = 0;
  let totalDamageTaken = 0;

  for (const combat of combats) {
    if (combat.result) {
      switch (combat.result.winner) {
        case 'attacker':
          wins++;
          break;
        case 'defender':
          losses++;
          break;
        case 'draw':
          draws++;
          break;
      }

      totalShipsLost += combat.result.attackerLosses.shipsDestroyed;
      totalShipsDestroyed += combat.result.defenderLosses.shipsDestroyed;
      totalDamageDealt += combat.rounds.reduce((sum, r) => sum + r.damageDealt.toDefender, 0);
      totalDamageTaken += combat.rounds.reduce((sum, r) => sum + r.damageDealt.toAttacker, 0);
    }
  }

  const totalBattles = combats.length;
  const winRate = totalBattles > 0 ? (wins / totalBattles) * 100 : 0;
  const combatEfficiency = totalDamageTaken > 0 ? totalDamageDealt / totalDamageTaken : 0;
  const averageFleetSize = totalBattles > 0 ? (totalShipsLost + totalShipsDestroyed) / totalBattles : 0;

  return {
    totalBattles,
    wins,
    losses,
    draws,
    averageFleetSize,
    totalShipsLost,
    totalShipsDestroyed,
    totalDamageDealt,
    totalDamageTaken,
    combatEfficiency,
    winRate,
  };
}

// Get fleet status
export function getFleetCombatStatus(combat: FleetCombat): FleetStatusType {
  if (!combat.result) return 'healthy';

  const damagePercent = (combat.result.attackerLosses.shipsDestroyed / 10) * 100; // Assuming 10 base ships

  if (damagePercent === 100) return 'destroyed';
  if (damagePercent > 60) return 'critical';
  if (damagePercent > 30) return 'damaged';
  return 'healthy';
}

// Generate combat log
export function generateFleetCombatLog(combat: FleetCombat): string {
  let log = `
╔════════════════════════════════════════════════════════════════════════════╗
║                        FLEET COMBAT LOG                                    ║
╚════════════════════════════════════════════════════════════════════════════╝

Combat ID: ${combat.id}
Mission Type: ${combat.missionType.toUpperCase()}
Transit Method: ${combat.transitMethod.toUpperCase()}
Location: ${combat.location.sectorId} (${combat.location.x}, ${combat.location.y}, ${combat.location.z})

Combat Timeline:
  Launched: ${new Date(combat.launchedAt).toLocaleString()}
  Arrival: ${new Date(combat.arrivalTime).toLocaleString()}
  ${combat.engagementTime ? `Engagement: ${new Date(combat.engagementTime).toLocaleString()}` : 'Engagement: Pending'}
  ${combat.completionTime ? `Completion: ${new Date(combat.completionTime).toLocaleString()}` : 'Completion: Ongoing'}

═══════════════════════════════════════════════════════════════════════════════

COMBAT ROUNDS (${combat.rounds.length} total):

`;

  for (const round of combat.rounds) {
    log += `
Round ${round.roundNumber}:
  Summary: ${round.summary}
  Attacker Damage: ${Math.floor(round.damageDealt.toAttacker)}
  Defender Damage: ${Math.floor(round.damageDealt.toDefender)}
  Ships Destroyed: Attacker ${round.shipsDestroyed.attacker} | Defender ${round.shipsDestroyed.defender}
  `;
  }

  if (combat.result) {
    log += `

═══════════════════════════════════════════════════════════════════════════════
FINAL RESULT:
═══════════════════════════════════════════════════════════════════════════════

Winner: ${combat.result.winner.toUpperCase()}
Success: ${combat.result.success ? 'YES' : 'NO'}

ATTACKER LOSSES:
  Ships Destroyed: ${combat.result.attackerLosses.shipsDestroyed}
  Ships Disabled: ${combat.result.attackerLosses.shipsDisabled}
  Crew Casualties: ${combat.result.attackerLosses.crewCasualties}
  Estimated Loss Value: ${Math.floor(combat.result.attackerLosses.estimatedValue)} credits

DEFENDER LOSSES:
  Ships Destroyed: ${combat.result.defenderLosses.shipsDestroyed}
  Ships Disabled: ${combat.result.defenderLosses.shipsDisabled}
  Crew Casualties: ${combat.result.defenderLosses.crewCasualties}
  Estimated Loss Value: ${Math.floor(combat.result.defenderLosses.estimatedValue)} credits

Experience Gained:
  Attacker: +${combat.result.experienceGained.attacker} XP
  Defender: +${combat.result.experienceGained.defender} XP

═══════════════════════════════════════════════════════════════════════════════
`;
  }

  return log;
}
