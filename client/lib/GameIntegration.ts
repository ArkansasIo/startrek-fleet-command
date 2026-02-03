// GameIntegration.ts
// Example integration of all game systems into a cohesive experience

import {
  Fleet,
  createFleet,
  orderFleetMovement,
} from './FleetMovementSystem';
import {
  CombatEngagement,
  initiateCombat,
  processCombatRound,
} from './PvPCombatSystem';
import {
  ResourceProduction,
  createResourceProduction,
  processProductionCycle,
} from './ResourceGatheringSystem';
import {
  BuildingType,
  ConstructionQueue,
  startConstruction,
  createConstructionQueue,
} from './BuildingSystem';
import {
  ResearchTree,
  startResearch,
  createResearchTree,
} from './ResearchSystem';
import {
  Colony,
  Planet,
  Territory,
  establishColony,
} from './TerritorySystem';
import {
  Diplomacy,
  createDiplomacy,
  proposeAlliance,
} from './DiplomacySystem';
import {
  PlayerStats,
  createPlayerStats,
  calculatePowerLevel,
} from './LeaderboardSystem';
import {
  PlayerWallet,
  createPlayerWallet,
} from './MarketplaceSystem';

export interface GamePlayer {
  id: string;
  username: string;
  stats: PlayerStats;
  wallet: PlayerWallet;
  diplomacy: Diplomacy;
  resources: ResourceProduction;
  fleets: Fleet[];
  territories: Territory[];
  colonies: Colony[];
  buildings: any[];
  research: ResearchTree;
  constructionQueue: ConstructionQueue;
  currentCombats: CombatEngagement[];
}

export interface GameWorld {
  players: Map<string, GamePlayer>;
  activeCombats: Map<string, CombatEngagement>;
  turn: number;
  lastTurnTime: number;
  gameStarted: boolean;
}

// Initialize a new player with all systems
export function initializeNewPlayer(
  playerId: string,
  username: string
): GamePlayer {
  return {
    id: playerId,
    username,
    stats: createPlayerStats(playerId, username),
    wallet: createPlayerWallet(playerId, 1000),
    diplomacy: createDiplomacy(playerId),
    resources: createResourceProduction(playerId),
    fleets: [createFleet(playerId, 'Starter Fleet', {
      type: 'system',
      id: 'starter_system',
      x: 0,
      y: 0,
      z: 0,
    })],
    territories: [],
    colonies: [],
    buildings: [],
    research: createResearchTree(playerId),
    constructionQueue: createConstructionQueue(playerId),
    currentCombats: [],
  };
}

// Process a complete game turn for all players
export async function processTurnForAllPlayers(
  world: GameWorld,
  deltaTime: number = 3600 // 1 hour in seconds
): Promise<void> {
  for (const [playerId, player] of world.players) {
    await processTurnForPlayer(player, deltaTime);
  }

  // Process active combats
  for (const [combatId, combat] of world.activeCombats) {
    if (combat.status === 'active') {
      // Auto-process combat rounds if no player input
      // This would be customizable based on game mode
    }
  }

  world.turn++;
  world.lastTurnTime = Date.now();
}

// Process a single player's turn
export async function processTurnForPlayer(
  player: GamePlayer,
  deltaTime: number
): Promise<void> {
  // 1. Resource Production
  const produced = processProductionCycle(player.resources, deltaTime / 3600);

  // 2. Fleet Maintenance
  for (const fleet of player.fleets) {
    // Calculate and deduct maintenance costs
    const maintenanceCost = fleet.ships.length * 10; // Base cost
    if (player.wallet.credits >= maintenanceCost) {
      player.wallet.credits -= maintenanceCost;
    } else {
      // Fleet morale drops if can't afford maintenance
      fleet.morale = Math.max(0, fleet.morale - 5);
    }

    // Fuel regeneration if docked
    if (fleet.status === 'idle') {
      fleet.fuel = Math.min(fleet.maxFuel, fleet.fuel + 100);
    }
  }

  // 3. Construct buildings
  for (const project of player.constructionQueue.projects) {
    if (project.status === 'building') {
      project.progress = Math.min(
        100,
        project.progress + (deltaTime / project.completionTime) * 100
      );

      if (project.progress >= 100) {
        project.status = 'completed';
        project.completedAt = Date.now();
      }
    }
  }

  // 4. Research Progress
  for (const project of player.research.queue) {
    if (project.status === 'researching') {
      project.progress = Math.min(
        100,
        project.progress + (deltaTime / project.completionTime) * 100
      );

      if (project.progress >= 100) {
        project.status = 'completed';
        project.completedAt = Date.now();
        player.research.researchCompleted[project.researchId] =
          project.nextLevel;
      }
    }
  }

  // 5. Colony Production
  for (const colony of player.colonies) {
    // Production happens through resource system, just update morale
    colony.morale = Math.min(100, colony.morale + 1);
  }

  // 6. Combat Resolution
  // Combats are resolved by individual round processing
  // This would integrate with the PvP combat system

  // 7. Leaderboard Considerations
  // Track playtime
  player.stats.playtime += deltaTime;
  player.stats.lastActive = Date.now();
}

// Handle player attack on another player's fleet
export async function initiateFleetAttack(
  attacker: GamePlayer,
  defender: GamePlayer,
  attackerFleetId: string,
  defenderFleetId: string,
  world: GameWorld
): Promise<CombatEngagement | null> {
  const attackerFleet = attacker.fleets.find((f) => f.id === attackerFleetId);
  const defenderFleet = defender.fleets.find((f) => f.id === defenderFleetId);

  if (!attackerFleet || !defenderFleet) return null;

  const engagement = initiateCombat(
    attacker.id,
    defender.id,
    attackerFleet,
    defenderFleet
  );

  attacker.currentCombats.push(engagement);
  defender.currentCombats.push(engagement);
  world.activeCombats.set(engagement.id, engagement);

  return engagement;
}

// Handle diplomacy change
export function updateDiplomaticRelations(
  player1: GamePlayer,
  player2: GamePlayer,
  status: 'ally' | 'enemy' | 'neutral'
): void {
  const existing1 = player1.diplomacy.relations.find(
    (r) =>
      (r.player1Id === player2.id && r.player2Id === player1.id) ||
      (r.player1Id === player1.id && r.player2Id === player2.id)
  );

  if (existing1) {
    existing1.status = status;
    existing1.lastModified = Date.now();
  } else {
    player1.diplomacy.relations.push({
      id: `rel_${player1.id}_${player2.id}`,
      player1Id: player1.id,
      player2Id: player2.id,
      status,
      establishedAt: Date.now(),
      lastModified: Date.now(),
    });
  }
}

// Calculate player power level for matchmaking
export function getPlayerPowerRating(player: GamePlayer): {
  level: number;
  fleetPower: number;
  defensePower: number;
  totalPower: number;
  rating: string;
} {
  let fleetPower = 0;
  for (const fleet of player.fleets) {
    for (const ship of fleet.ships) {
      fleetPower += ship.attack + ship.defense;
    }
  }

  let defensePower = 0;
  for (const colony of player.colonies) {
    defensePower += colony.defenses;
  }

  const totalPower = calculatePowerLevel(player.stats) + fleetPower + defensePower;

  let rating = 'Novice';
  if (totalPower > 10000) rating = 'Expert';
  else if (totalPower > 5000) rating = 'Veteran';
  else if (totalPower > 2500) rating = 'Experienced';
  else if (totalPower > 1000) rating = 'Trained';

  return {
    level: player.stats.level,
    fleetPower,
    defensePower,
    totalPower,
    rating,
  };
}

// Save player state (for persistence)
export function serializePlayerState(player: GamePlayer): string {
  return JSON.stringify({
    id: player.id,
    username: player.username,
    stats: player.stats,
    wallet: player.wallet,
    diplomacy: player.diplomacy,
    resources: player.resources,
    territories: player.territories.map((t) => t.id),
    fleetCount: player.fleets.length,
    colonyCount: player.colonies.length,
  });
}

// Load player state
export function deserializePlayerState(
  data: string,
  playerId: string,
  username: string
): GamePlayer {
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    fleets: [],
    territories: [],
    colonies: [],
    buildings: [],
    constructionQueue: createConstructionQueue(playerId),
    currentCombats: [],
  };
}

// Example game loop
export async function runGameLoop(
  world: GameWorld,
  tickInterval: number = 3600000 // 1 hour in milliseconds
) {
  setInterval(async () => {
    await processTurnForAllPlayers(world, tickInterval / 1000);
    console.log(`[GAME] Turn ${world.turn} processed`);
  }, tickInterval);
}

// Initialize game world
export function initializeGameWorld(): GameWorld {
  return {
    players: new Map(),
    activeCombats: new Map(),
    turn: 1,
    lastTurnTime: Date.now(),
    gameStarted: true,
  };
}
