// PvPCombatSystem.ts
// Enhanced PvP and fleet combat system

import { Fleet, calculateFleetAttack, calculateFleetDefense } from './FleetMovementSystem';
import { PlayerStats } from './LeaderboardSystem';

export interface CombatEngagement {
  id: string;
  attackerId: string;
  defenderId: string;
  attackerFleet: Fleet;
  defenderFleet: Fleet;
  startedAt: number;
  endsAt?: number;
  status: 'active' | 'concluded' | 'mutual_cease';
  rounds: CombatRound[];
  result?: CombatResult;
}

export interface CombatRound {
  roundNumber: number;
  attackerAction: AttackAction;
  defenderAction: DefenseAction;
  damage: { attacker: number; defender: number };
  log: string[];
  timestamp: number;
}

export interface AttackAction {
  type: 'aggressive' | 'balanced' | 'defensive';
  targetShips?: string[]; // Specific target ships
  power: number; // 0-100
  riskLevel: number; // 0-100
}

export interface DefenseAction {
  type: 'hold' | 'evasive' | 'counterattack' | 'retreat';
  targetShips?: string[]; // Specific ships to defend
  power: number; // 0-100
}

export interface CombatResult {
  winnerId: string;
  loserId: string;
  attacker: {
    shipsLost: number;
    crewLost: number;
    moraleImpact: number;
    damage: number;
  };
  defender: {
    shipsLost: number;
    crewLost: number;
    moraleImpact: number;
    damage: number;
  };
  loot: {
    resources: Record<string, number>;
    experience: number;
    damaged_ships?: string[];
  };
  statistics: {
    totalRounds: number;
    totalDamage: number;
    crewLosses: number;
    duration: number;
  };
}

export interface SkillEffect {
  id: string;
  name: string;
  type: 'attack' | 'defense' | 'utility';
  cooldown: number; // milliseconds
  cost: { morale?: number; fuel?: number; credits?: number };
  effect: (power: number, target?: any) => number;
}

// Initiate combat
export function initiateCombat(
  attackerId: string,
  defenderId: string,
  attackerFleet: Fleet,
  defenderFleet: Fleet
): CombatEngagement {
  return {
    id: `combat_${attackerId}_${defenderId}_${Date.now()}`,
    attackerId,
    defenderId,
    attackerFleet,
    defenderFleet,
    startedAt: Date.now(),
    status: 'active',
    rounds: [],
  };
}

// Process combat round
export function processCombatRound(
  engagement: CombatEngagement,
  attackerAction: AttackAction,
  defenderAction: DefenseAction
): CombatRound {
  const roundNumber = engagement.rounds.length + 1;
  const log: string[] = [];

  // Calculate base damage
  const attackerFleetPower = calculateFleetAttack(engagement.attackerFleet.ships);
  const defenderFleetPower = calculateFleetDefense(engagement.defenderFleet.ships);

  // Calculate damage with modifiers
  let attackerDamage = calculateDamage(
    attackerFleetPower,
    attackerAction,
    defenderAction
  );

  let defenderDamage = 0;
  if (defenderAction.type === 'counterattack') {
    defenderDamage = calculateDamage(
      defenderFleetPower,
      defenderAction as any,
      attackerAction
    );
    log.push(`Defender counterattacks for ${defenderDamage} damage!`);
  }

  log.push(`Round ${roundNumber}: Attacker deals ${attackerDamage} damage`);

  // Apply damage
  applyDamageToFleet(engagement.attackerFleet, defenderDamage);
  applyDamageToFleet(engagement.defenderFleet, attackerDamage);

  const round: CombatRound = {
    roundNumber,
    attackerAction,
    defenderAction,
    damage: { attacker: attackerDamage, defender: defenderDamage },
    log,
    timestamp: Date.now(),
  };

  engagement.rounds.push(round);

  // Check combat end conditions
  if (isFleetDefeated(engagement.attackerFleet) || 
      isFleetDefeated(engagement.defenderFleet) ||
      roundNumber >= 50) {
    endCombat(engagement);
  }

  return round;
}

// Calculate damage with modifiers
function calculateDamage(
  basePower: number,
  attackAction: AttackAction | DefenseAction,
  defenseAction: AttackAction | DefenseAction
): number {
  let damage = basePower * (attackAction.power / 100);

  // Defense modifiers
  const defenseRating = defenseAction.power / 100;
  damage = damage * (1 - defenseRating * 0.5); // Defense reduces 50% max

  // Action type modifiers
  if (attackAction.type === 'aggressive') {
    damage *= 1.3;
  } else if (attackAction.type === 'balanced') {
    damage *= 1.0;
  } else if (attackAction.type === 'defensive') {
    damage *= 0.7;
  }

  return Math.ceil(damage);
}

// Apply damage to fleet
function applyDamageToFleet(fleet: Fleet, damage: number): void {
  let remaining = damage;

  for (const ship of fleet.ships) {
    if (remaining <= 0) break;

    const shipDamage = Math.min(remaining, ship.health);
    ship.health -= shipDamage;
    remaining -= shipDamage;

    // Crew losses if ship is destroyed
    if (ship.health <= 0) {
      ship.crew = 0;
    }
  }

  // Remove destroyed ships
  fleet.ships = fleet.ships.filter((ship) => ship.health > 0);
}

// Check if fleet is defeated
function isFleetDefeated(fleet: Fleet): boolean {
  return fleet.ships.length === 0 || fleet.ships.every((s) => s.health <= 0);
}

// End combat
export function endCombat(engagement: CombatEngagement): void {
  engagement.endsAt = Date.now();

  const attackerDefeated = isFleetDefeated(engagement.attackerFleet);
  const defenderDefeated = isFleetDefeated(engagement.defenderFleet);

  if (attackerDefeated && defenderDefeated) {
    engagement.status = 'mutual_cease';
  } else if (attackerDefeated) {
    engagement.status = 'concluded';
  } else if (defenderDefeated) {
    engagement.status = 'concluded';
  }

  // Generate combat result
  engagement.result = generateCombatResult(engagement);
}

// Generate combat result
export function generateCombatResult(engagement: CombatEngagement): CombatResult {
  const totalDamageDealt = engagement.rounds.reduce(
    (sum, r) => sum + r.damage.attacker + r.damage.defender,
    0
  );

  const attackerInitialShips = Math.floor(
    engagement.attackerFleet.ships.length * 1.5
  );
  const defenderInitialShips = Math.floor(
    engagement.defenderFleet.ships.length * 1.5
  );

  const attackerShipsLost = attackerInitialShips - engagement.attackerFleet.ships.length;
  const defenderShipsLost = defenderInitialShips - engagement.defenderFleet.ships.length;

  const attackerDefended = defenderShipsLost < defenderInitialShips;

  return {
    winnerId: attackerDefended
      ? engagement.defenderId
      : engagement.attackerId,
    loserId: attackerDefended
      ? engagement.attackerId
      : engagement.defenderId,
    attacker: {
      shipsLost: attackerShipsLost,
      crewLost: Math.floor(attackerShipsLost * 50),
      moraleImpact: attackerDefended ? -20 : 15,
      damage: engagement.rounds.reduce((sum, r) => sum + r.damage.defender, 0),
    },
    defender: {
      shipsLost: defenderShipsLost,
      crewLost: Math.floor(defenderShipsLost * 50),
      moraleImpact: attackerDefended ? 20 : -15,
      damage: engagement.rounds.reduce((sum, r) => sum + r.damage.attacker, 0),
    },
    loot: {
      resources: {
        dilithium: Math.floor(Math.random() * 500),
        credits: Math.floor(Math.random() * 2000),
      },
      experience: Math.floor(totalDamageDealt / 10),
    },
    statistics: {
      totalRounds: engagement.rounds.length,
      totalDamage: totalDamageDealt,
      crewLosses: attackerShipsLost * 50 + defenderShipsLost * 50,
      duration: (engagement.endsAt || Date.now()) - engagement.startedAt,
    },
  };
}

// Combat skills
export const COMBAT_SKILLS: SkillEffect[] = [
  {
    id: 'focus_fire',
    name: 'Focus Fire',
    type: 'attack',
    cooldown: 5000,
    cost: { morale: 10 },
    effect: (power: number) => power * 1.5,
  },
  {
    id: 'evasive_maneuvers',
    name: 'Evasive Maneuvers',
    type: 'defense',
    cooldown: 3000,
    cost: { fuel: 50, morale: 5 },
    effect: (power: number) => power * 0.6,
  },
  {
    id: 'shield_overload',
    name: 'Shield Overload',
    type: 'defense',
    cooldown: 10000,
    cost: { morale: 20 },
    effect: (power: number) => power * 0.3,
  },
  {
    id: 'tractor_beam',
    name: 'Tractor Beam',
    type: 'utility',
    cooldown: 8000,
    cost: { morale: 15 },
    effect: (power: number) => power * 0.8,
  },
];

// Get combat summary
export function getCombatSummary(engagement: CombatEngagement): string {
  const result = engagement.result;
  if (!result) return 'Combat ongoing...';

  return `
    Combat Result: ${result.winnerId} vs ${result.loserId}
    Winner: ${result.winnerId}
    Duration: ${result.statistics.duration / 1000}s
    Rounds: ${result.statistics.totalRounds}
    Total Damage: ${result.statistics.totalDamage}
    Crew Losses: ${result.statistics.crewLosses}
  `;
}

// Calculate battle odds
export function calculateBattleOdds(
  attackerPower: number,
  defenderPower: number
): { attackerWinChance: number; defenderWinChance: number } {
  const totalPower = attackerPower + defenderPower;
  if (totalPower === 0) return { attackerWinChance: 50, defenderWinChance: 50 };

  return {
    attackerWinChance: (attackerPower / totalPower) * 100,
    defenderWinChance: (defenderPower / totalPower) * 100,
  };
}
