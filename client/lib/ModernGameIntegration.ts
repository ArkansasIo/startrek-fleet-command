/**
 * STAR TREK: FLEET COMMAND - MODERN GAME INTEGRATION
 * ==================================================
 * Complete integration of all 8 game systems
 */

import {
  CrewMember,
  getCrewById,
  assignCrewToPosition,
  calculateCrewStats,
  ALL_CREW,
} from './CrewManagementSystem';

import {
  Ship,
  ShipClass,
  createShip,
  addComponentToShip,
  upgradeShip,
  calculateFleetPower,
  ALL_SHIP_CLASSES,
} from './ShipBuildingSystem';

import {
  Fleet,
  createFleet,
  addShipToFleet,
  setFormation,
  calculateFleetStats,
} from './FleetManagementSystem';

import {
  Resource,
  PlayerEconomy,
  createEconomy,
  addResource,
  removeResource,
  buyResource,
  sellResource,
  upgradeGenerator,
} from './ResourceEconomySystem';

import {
  Mission,
  getMissionById,
  startMission,
  updateMissionProgress,
  completeMission,
  ALL_MISSIONS,
} from './MissionQuestSystemEnhanced';

import {
  Technology,
  getTechnologyById,
  ALL_TECHNOLOGIES,
} from './TechnologyResearchSystem';

import {
  Achievement,
  PlayerAchievements,
  createPlayerAchievements,
  updateAchievementProgress,
  unlockAchievement,
  ALL_ACHIEVEMENTS,
} from './AchievementSystemEnhanced';

import {
  Alliance,
  Faction,
  createAlliance,
  addMemberToAlliance,
  getFactionById,
  ALL_FACTIONS,
} from './AllianceFactionSystemEnhanced';

// ============================================================================
// GAME STATE STRUCTURE
// ============================================================================

export interface GameState {
  playerId: string;
  playerName: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  
  // Core Systems
  fleet: Fleet;
  crew: CrewMember[];
  economy: PlayerEconomy;
  
  // Progress Tracking
  activeMissions: Mission[];
  completedMissions: Mission[];
  technologies: TechnologyProgress[];
  achievements: PlayerAchievements;
  
  // Social
  alliance: Alliance | null;
  faction: Faction | null;
  factionReputation: number;
  
  // Timestamps
  createdAt: number;
  lastLogin: number;
  totalPlayTime: number;
}

export interface TechnologyProgress {
  technologyId: string;
  unlocked: boolean;
  researchStartTime: number | null;
  researchEndTime: number | null;
  level: number;
}

export interface GameContext {
  gameState: GameState;
  deltaTime: number;
  timestamp: number;
}

// ============================================================================
// GAME INITIALIZATION
// ============================================================================

export function initializeGame(playerId: string, playerName?: string): GameState {
  const now = Date.now();
  
  const gameState: GameState = {
    playerId,
    playerName: playerName || `Commander_${playerId.substring(0, 8)}`,
    level: 1,
    experience: 0,
    experienceToNextLevel: 1000,
    
    fleet: createFleet(`fleet_${playerId}`, playerId, 5),
    crew: [],
    economy: createEconomy(playerId),
    
    activeMissions: [],
    completedMissions: [],
    technologies: [],
    achievements: createPlayerAchievements(playerId),
    
    alliance: null,
    faction: null,
    factionReputation: 0,
    
    createdAt: now,
    lastLogin: now,
    totalPlayTime: 0,
  };

  // Initialize starter technologies
  gameState.technologies = ALL_TECHNOLOGIES.slice(0, 5).map(tech => ({
    technologyId: tech.technologyId,
    unlocked: true,
    researchStartTime: null,
    researchEndTime: null,
    level: 1,
  }));

  return gameState;
}

// ============================================================================
// GAME LOOP & STATE UPDATES
// ============================================================================

export function updateGameState(context: GameContext): void {
  const { gameState, deltaTime } = context;

  // 1. Update economy (resource generation)
  updateEconomy(gameState, deltaTime);

  // 2. Update active technologies (research completion)
  updateResearchProgress(gameState);

  // 3. Update active missions
  checkMissionCompletion(gameState);

  // 4. Check for level up
  checkLevelUp(gameState);

  // 5. Update play time
  gameState.totalPlayTime += deltaTime;
}

function updateEconomy(gameState: GameState, deltaSeconds: number): void {
  // Process passive income
  for (const [resourceName, generator] of gameState.economy.generators) {
    const generationPerSecond = generator.generationRate / 60;
    const generated = generationPerSecond * deltaSeconds;

    const current = gameState.economy.resources.get(resourceName) || 0;
    const max = generator.storageCapacity;
    gameState.economy.resources.set(resourceName, Math.min(current + generated, max));
  }
}

function updateResearchProgress(gameState: GameState): void {
  const now = Date.now();

  for (const tech of gameState.technologies) {
    if (!tech.unlocked && tech.researchEndTime && now >= tech.researchEndTime) {
      tech.unlocked = true;
      tech.researchEndTime = null;
      tech.researchStartTime = null;

      // Award achievement
      updateAchievementProgress(gameState.achievements, 'ach_first_research', 1);
    }
  }
}

function checkMissionCompletion(gameState: GameState): void {
  const completedMissions = gameState.activeMissions.filter(m => 
    m.objectives.every(obj => obj.completed)
  );

  for (const mission of completedMissions) {
    mission.status = 'completed';
  }
}

function checkLevelUp(gameState: GameState): void {
  while (gameState.experience >= gameState.experienceToNextLevel) {
    gameState.level++;
    gameState.experience -= gameState.experienceToNextLevel;
    gameState.experienceToNextLevel = Math.floor(1000 * Math.pow(1.15, gameState.level - 1));

    // Award level-up rewards
    const bonus = gameState.level * 1000;
    addResource(gameState.economy, 'credits', bonus);

    // Check level achievements
    if (gameState.level === 10) {
      unlockAchievement(gameState.achievements, 'ach_level_10');
    } else if (gameState.level === 50) {
      unlockAchievement(gameState.achievements, 'ach_level_50');
    } else if (gameState.level === 100) {
      unlockAchievement(gameState.achievements, 'ach_level_100');
    }
  }
}

// ============================================================================
// SHIP BUILDING WORKFLOW
// ============================================================================

export function buildShipForPlayer(
  gameState: GameState,
  shipClassId: string,
  shipName?: string
): { success: boolean; message: string; ship?: Ship } {
  const shipClass = ALL_SHIP_CLASSES.find(sc => sc.classId === shipClassId);
  if (!shipClass) {
    return { success: false, message: 'Ship class not found' };
  }

  // Check technology requirements
  for (const reqTechId of shipClass.techRequirements) {
    const tech = gameState.technologies.find(t => t.technologyId === reqTechId);
    if (!tech || !tech.unlocked) {
      const techData = getTechnologyById(reqTechId);
      return { 
        success: false, 
        message: `Missing required technology: ${techData?.name || reqTechId}` 
      };
    }
  }

  // Check resources
  const credits = gameState.economy.resources.get('credits') || 0;
  if (credits < shipClass.buildCost) {
    return { 
      success: false, 
      message: `Insufficient credits. Need ${shipClass.buildCost}, have ${credits}` 
    };
  }

  // Check fleet capacity
  if (gameState.fleet.ships.length >= gameState.fleet.capacity) {
    return { 
      success: false, 
      message: 'Fleet at maximum capacity' 
    };
  }

  // Deduct cost
  removeResource(gameState.economy, 'credits', shipClass.buildCost);

  // Create ship
  const ship = createShip(shipClassId);
  if (shipName) {
    ship.name = shipName;
  }

  // Add to fleet
  addShipToFleet(gameState.fleet, ship);

  // Award achievement
  updateAchievementProgress(gameState.achievements, 'ach_first_ship', 1);
  updateAchievementProgress(gameState.achievements, 'ach_collect_all_ships', 1);

  return { 
    success: true, 
    message: `Successfully built ${shipClass.name}!`,
    ship 
  };
}

// ============================================================================
// CREW RECRUITMENT WORKFLOW
// ============================================================================

export function recruitCrew(
  gameState: GameState,
  crewId: string
): { success: boolean; message: string; crew?: CrewMember } {
  const crew = getCrewById(crewId);
  if (!crew) {
    return { success: false, message: 'Crew member not found' };
  }

  // Check if already recruited
  if (gameState.crew.find(c => c.crewId === crewId)) {
    return { success: false, message: 'Crew member already recruited' };
  }

  // Check level requirement
  if (gameState.level < crew.level) {
    return { 
      success: false, 
      message: `Requires level ${crew.level}. Current level: ${gameState.level}` 
    };
  }

  // Check cost (based on tier)
  const costs: Record<string, number> = {
    'common': 1000,
    'uncommon': 5000,
    'rare': 15000,
    'epic': 50000,
    'legendary': 150000,
  };
  const cost = costs[crew.tier] || 1000;

  const credits = gameState.economy.resources.get('credits') || 0;
  if (credits < cost) {
    return { 
      success: false, 
      message: `Insufficient credits. Need ${cost}, have ${credits}` 
    };
  }

  // Deduct cost
  removeResource(gameState.economy, 'credits', cost);

  // Add crew
  gameState.crew.push(crew);

  // Award achievements
  updateAchievementProgress(gameState.achievements, 'ach_crew_100', 1);

  return { 
    success: true, 
    message: `Successfully recruited ${crew.name}!`,
    crew 
  };
}

// ============================================================================
// MISSION WORKFLOW
// ============================================================================

export function startMissionForPlayer(
  gameState: GameState,
  missionId: string
): { success: boolean; message: string; mission?: Mission } {
  const mission = getMissionById(missionId);
  if (!mission) {
    return { success: false, message: 'Mission not found' };
  }

  // Check level requirement
  if (gameState.level < mission.level) {
    return { 
      success: false, 
      message: `Requires level ${mission.level}. Current level: ${gameState.level}` 
    };
  }

  // Check technology requirements
  for (const reqTechId of mission.techRequirements) {
    const tech = gameState.technologies.find(t => t.technologyId === reqTechId);
    if (!tech || !tech.unlocked) {
      return { success: false, message: 'Missing required technology' };
    }
  }

  // Check if already active
  if (gameState.activeMissions.find(m => m.missionId === missionId)) {
    return { success: false, message: 'Mission already active' };
  }

  // Start mission
  const activeMission = startMission(mission);
  gameState.activeMissions.push(activeMission);

  return { 
    success: true, 
    message: `Mission "${mission.name}" started!`,
    mission: activeMission 
  };
}

export function completeMissionForPlayer(
  gameState: GameState,
  missionId: string
): { success: boolean; message: string; rewards?: any } {
  const missionIndex = gameState.activeMissions.findIndex(m => m.missionId === missionId);
  if (missionIndex === -1) {
    return { success: false, message: 'Mission not active' };
  }

  const mission = gameState.activeMissions[missionIndex];

  // Check if all objectives are complete
  if (!mission.objectives.every(obj => obj.completed)) {
    return { success: false, message: 'Not all objectives completed' };
  }

  // Award rewards
  const rewards = mission.rewards;
  
  // Credits
  addResource(gameState.economy, 'credits', rewards.credits);
  
  // Experience
  gameState.experience += rewards.experience;
  
  // Resources
  for (const [resourceName, amount] of rewards.resources) {
    addResource(gameState.economy, resourceName, amount);
  }
  
  // Technology unlocks
  for (const techId of rewards.techUnlocks) {
    const tech = gameState.technologies.find(t => t.technologyId === techId);
    if (tech && !tech.unlocked) {
      tech.unlocked = true;
    }
  }

  // Move to completed
  gameState.activeMissions.splice(missionIndex, 1);
  gameState.completedMissions.push(mission);

  // Award achievements
  updateAchievementProgress(gameState.achievements, 'ach_first_mission', 1);

  return { 
    success: true, 
    message: `Mission "${mission.name}" completed!`,
    rewards 
  };
}

// ============================================================================
// RESEARCH WORKFLOW
// ============================================================================

export function startResearch(
  gameState: GameState,
  technologyId: string
): { success: boolean; message: string } {
  const tech = getTechnologyById(technologyId);
  if (!tech) {
    return { success: false, message: 'Technology not found' };
  }

  // Check if already researched
  const existing = gameState.technologies.find(t => t.technologyId === technologyId);
  if (existing && existing.unlocked) {
    return { success: false, message: 'Technology already researched' };
  }

  // Check prerequisites
  for (const prereqId of tech.prerequisites) {
    const prereq = gameState.technologies.find(t => t.technologyId === prereqId);
    if (!prereq || !prereq.unlocked) {
      return { success: false, message: 'Missing prerequisite technologies' };
    }
  }

  // Check resources
  for (const [resourceName, cost] of tech.resourceCost) {
    const available = gameState.economy.resources.get(resourceName) || 0;
    if (available < cost) {
      return { 
        success: false, 
        message: `Insufficient ${resourceName}. Need ${cost}, have ${available}` 
      };
    }
  }

  // Deduct resources
  for (const [resourceName, cost] of tech.resourceCost) {
    removeResource(gameState.economy, resourceName, cost);
  }

  // Start research
  const now = Date.now();
  if (existing) {
    existing.researchStartTime = now;
    existing.researchEndTime = now + (tech.researchTime * 1000);
  } else {
    gameState.technologies.push({
      technologyId,
      unlocked: false,
      researchStartTime: now,
      researchEndTime: now + (tech.researchTime * 1000),
      level: 1,
    });
  }

  return { 
    success: true, 
    message: `Research started on ${tech.name}!` 
  };
}

// ============================================================================
// FACTION & ALLIANCE
// ============================================================================

export function joinFactionForPlayer(
  gameState: GameState,
  factionId: string
): { success: boolean; message: string } {
  const faction = getFactionById(factionId);
  if (!faction) {
    return { success: false, message: 'Faction not found' };
  }

  // Check level requirement
  if (gameState.level < faction.minLevel) {
    return { 
      success: false, 
      message: `Requires level ${faction.minLevel}. Current level: ${gameState.level}` 
    };
  }

  // Check cost
  const credits = gameState.economy.resources.get('credits') || 0;
  if (credits < faction.joinCost) {
    return { 
      success: false, 
      message: `Insufficient credits. Need ${faction.joinCost}, have ${credits}` 
    };
  }

  // Deduct cost
  removeResource(gameState.economy, 'credits', faction.joinCost);

  // Join faction
  gameState.faction = faction;
  gameState.factionReputation = 0;

  return { 
    success: true, 
    message: `Joined ${faction.name}!` 
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getGameStatistics(gameState: GameState) {
  return {
    level: gameState.level,
    experience: gameState.experience,
    fleetPower: calculateFleetPower(gameState.fleet),
    crewCount: gameState.crew.length,
    wealth: gameState.economy.resources.get('credits') || 0,
    achievementsUnlocked: gameState.achievements.totalUnlocked,
    missionsCompleted: gameState.completedMissions.length,
    technologiesResearched: gameState.technologies.filter(t => t.unlocked).length,
    playTime: gameState.totalPlayTime,
  };
}

export function saveGameState(gameState: GameState): void {
  localStorage.setItem(`gameState_${gameState.playerId}`, JSON.stringify(gameState));
}

export function loadGameState(playerId: string): GameState | null {
  const saved = localStorage.getItem(`gameState_${playerId}`);
  if (!saved) return null;
  
  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

// Export all for use in components
export {
  ALL_CREW,
  ALL_SHIP_CLASSES,
  ALL_MISSIONS,
  ALL_TECHNOLOGIES,
  ALL_ACHIEVEMENTS,
  ALL_FACTIONS,
};
