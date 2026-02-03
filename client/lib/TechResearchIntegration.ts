// Technology Research System - Integration Examples
// Demonstrates how to use the TechnologyResearchSystem in game code

import {
  Technology,
  getTechById,
  getTechsByCategory,
  getTechsByTier,
  getTechsByRarity,
  createResearchProject,
  updateResearchProgress,
  getRecommendedTechs,
  getTechSynergyBonus,
  calculateResearchCost,
  calculateResearchTime,
  calculateTechBonus,
  validateResearchCompletion,
  canResearchTech,
  getPathCompletionBonus,
  calculateResearchEfficiency,
  getTechUnlockChain,
  ALL_TECHNOLOGIES,
  PROGRESSION_PATHS,
  type PlayerResearchData,
  type ResearchProject,
  type ResearchLab,
} from './TechnologyResearchSystem';

// ============================================
// EXAMPLE 1: Player Research Initialization
// ============================================

export function initializePlayerResearch(playerId: string): PlayerResearchData {
  return {
    playerId,
    completedTechs: {
      'warp_core_basics': 1, // Players start with basic warp
      'phaser_emitters': 1,
      'shield_generators': 1,
    },
    activeProjects: [],
    researchQueue: [],
    totalResearchPoints: 100,
    researchSpeedBonus: 0,
    costReductionBonus: 0,
    discoveredTechs: [
      'warp_core_basics',
      'phaser_emitters',
      'shield_generators',
      'sensor_arrays',
      'impulse_drive',
    ],
    favoriteCategories: [],
  };
}

// ============================================
// EXAMPLE 2: Start Research on a Technology
// ============================================

export function startResearch(
  playerId: string,
  techId: string,
  playerData: PlayerResearchData,
  labsAvailable: number,
  playerLevel: number
): { success: boolean; message: string; project?: ResearchProject } {
  const tech = getTechById(techId);
  if (!tech) {
    return { success: false, message: `Technology ${techId} not found` };
  }

  // Check if already completed
  if (playerData.completedTechs[techId] && playerData.completedTechs[techId] >= tech.maxLevel) {
    return { success: false, message: `Technology ${techId} already maxed out` };
  }

  // Check prerequisites
  if (!canResearchTech(tech, { level: playerLevel, researchedTechs: playerData.completedTechs })) {
    return { success: false, message: `Missing prerequisites for ${tech.name}` };
  }

  // Create project
  const currentLevel = playerData.completedTechs[techId] || 0;
  const labsToUse = Math.min(labsAvailable, 3); // Max 3 labs per project

  try {
    const project = createResearchProject(playerId, techId, currentLevel, labsToUse);
    playerData.activeProjects.push(project);

    return {
      success: true,
      message: `Started researching ${tech.name}`,
      project,
    };
  } catch (error) {
    return { success: false, message: `Error creating research project: ${error}` };
  }
}

// ============================================
// EXAMPLE 3: Game Loop Research Update
// ============================================

export function updateResearchSystems(
  playerData: PlayerResearchData,
  deltaTime: number,
  labs: ResearchLab[]
): { completedProjects: ResearchProject[]; errors: string[] } {
  const completedProjects: ResearchProject[] = [];
  const errors: string[] = [];

  // Calculate total efficiency
  const labEfficiency = labs.reduce((sum, lab) => sum + lab.efficiency, 0) / Math.max(1, labs.length);
  const totalSpeedBonus = 1 + playerData.researchSpeedBonus / 100;
  const efficiency = labEfficiency * totalSpeedBonus;

  for (const project of playerData.activeProjects) {
    if (project.status === 'paused' || project.status === 'completed') continue;

    // Update progress
    const progress = updateResearchProgress(
      project,
      deltaTime,
      playerData.researchSpeedBonus
    );

    if (progress >= 100) {
      // Validate completion
      if (!validateResearchCompletion(project, playerData)) {
        errors.push(`Research ${project.techId} failed validation`);
        project.status = 'paused';
        continue;
      }

      project.status = 'completed';
      completedProjects.push(project);

      // Mark tech as completed
      const currentLevel = playerData.completedTechs[project.techId] || 0;
      playerData.completedTechs[project.techId] = currentLevel + 1;

      // Notify about unlocks
      const unlockedTechs = ALL_TECHNOLOGIES.filter(tech =>
        tech.requirements.previousTech?.includes(project.techId)
      );

      if (unlockedTechs.length > 0) {
        console.log(`Unlocked ${unlockedTechs.length} new technologies!`);
        for (const unlocked of unlockedTechs) {
          if (!playerData.discoveredTechs.includes(unlocked.id)) {
            playerData.discoveredTechs.push(unlocked.id);
          }
        }
      }
    }
  }

  // Remove completed projects from active
  playerData.activeProjects = playerData.activeProjects.filter(p => p.status !== 'completed');

  return { completedProjects, errors };
}

// ============================================
// EXAMPLE 4: Research UI - Technology Browser
// ============================================

export interface TechBrowserState {
  selectedCategory?: string;
  searchQuery: string;
  sortBy: 'name' | 'tier' | 'cost' | 'time';
  showOnlyAvailable: boolean;
}

export function getBrowserTechs(
  playerData: PlayerResearchData,
  playerLevel: number,
  state: TechBrowserState
): Technology[] {
  let techs = ALL_TECHNOLOGIES;

  // Filter by category
  if (state.selectedCategory) {
    techs = techs.filter(t => t.category === state.selectedCategory);
  }

  // Filter by search query
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    techs = techs.filter(
      t => t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
    );
  }

  // Filter by availability
  if (state.showOnlyAvailable) {
    techs = techs.filter(t => canResearchTech(t, { level: playerLevel, researchedTechs: playerData.completedTechs }));
  }

  // Sort
  switch (state.sortBy) {
    case 'name':
      techs.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'tier':
      const tierOrder = { tier1: 0, tier2: 1, tier3: 2, tier4: 3, tier5: 4 };
      techs.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);
      break;
    case 'cost':
      techs.sort((a, b) => {
        const aCost = Object.values(a.baseCost).reduce((s, v) => s + v, 0);
        const bCost = Object.values(b.baseCost).reduce((s, v) => s + v, 0);
        return aCost - bCost;
      });
      break;
    case 'time':
      techs.sort((a, b) => a.baseResearchTime - b.baseResearchTime);
      break;
  }

  return techs;
}

export function getTechDisplayInfo(
  tech: Technology,
  playerData: PlayerResearchData
): {
  name: string;
  rarity: string;
  tier: string;
  currentLevel: number;
  maxLevel: number;
  canResearch: boolean;
  nextLevelCost: Record<string, number>;
  nextLevelTime: number;
  synergies: string[];
  prerequisites: string[];
} {
  const currentLevel = playerData.completedTechs[tech.id] || 0;
  const nextLevel = currentLevel + 1;
  const nextLevelCost = nextLevel <= tech.maxLevel ? calculateResearchCost(tech, nextLevel) : {};
  const nextLevelTime = nextLevel <= tech.maxLevel ? calculateResearchTime(tech, nextLevel) : 0;

  const synergies = (tech.synergiesWith || [])
    .map(techId => getTechById(techId)?.name || techId)
    .filter((name, index) => playerData.completedTechs[(tech.synergiesWith || [])[index]]);

  const prerequisites = (tech.requirements.previousTech || [])
    .map(id => getTechById(id)?.name || id);

  return {
    name: tech.displayName,
    rarity: tech.rarity,
    tier: tech.tier,
    currentLevel,
    maxLevel: tech.maxLevel,
    canResearch: nextLevel <= tech.maxLevel && currentLevel < tech.maxLevel,
    nextLevelCost,
    nextLevelTime,
    synergies,
    prerequisites,
  };
}

// ============================================
// EXAMPLE 5: Progression Path Tracking
// ============================================

export function getProgressionPathStatus(
  playerData: PlayerResearchData,
  pathId: string
): {
  name: string;
  completedCount: number;
  totalCount: number;
  completionPercentage: number;
  nextTech?: string;
  bonus: number;
  estimatedTimeRemaining: number;
} {
  const path = PROGRESSION_PATHS.find(p => p.id === pathId);
  if (!path) {
    return {
      name: 'Unknown',
      completedCount: 0,
      totalCount: 0,
      completionPercentage: 0,
      bonus: 0,
      estimatedTimeRemaining: 0,
    };
  }

  const completedCount = path.techs.filter(techId => playerData.completedTechs[techId]).length;
  const completionPercentage = (completedCount / path.techs.length) * 100;

  // Find next incomplete tech
  let nextTech: string | undefined;
  let estimatedTimeRemaining = 0;
  for (const techId of path.techs) {
    if (!playerData.completedTechs[techId]) {
      nextTech = techId;
      const tech = getTechById(techId);
      if (tech) {
        estimatedTimeRemaining = calculateResearchTime(tech, 1);
      }
      break;
    }
  }

  const bonus = getPathCompletionBonus(playerData, pathId);

  return {
    name: path.name,
    completedCount,
    totalCount: path.techs.length,
    completionPercentage,
    nextTech,
    bonus,
    estimatedTimeRemaining,
  };
}

// ============================================
// EXAMPLE 6: Combat Integration
// ============================================

export function calculateCombatStats(playerData: PlayerResearchData): {
  damageBonus: number;
  defenseBonus: number;
  speedBonus: number;
  accuracy: number;
} {
  let damageBonus = 0;
  let defenseBonus = 0;
  let speedBonus = 0;
  let accuracy = 85;

  // Apply weapon tech bonuses
  const weaponTechs = getTechsByCategory('weapons');
  for (const tech of weaponTechs) {
    const level = playerData.completedTechs[tech.id] || 0;
    if (level > 0) {
      const bonus = calculateTechBonus(tech, level);
      damageBonus += bonus.attack_power || 0;
    }
  }

  // Apply defense tech bonuses
  const defenseTechs = getTechsByCategory('defense');
  for (const tech of defenseTechs) {
    const level = playerData.completedTechs[tech.id] || 0;
    if (level > 0) {
      const bonus = calculateTechBonus(tech, level);
      defenseBonus += bonus.shield_strength || 0;
    }
  }

  // Apply propulsion tech bonuses
  const propulsionTechs = getTechsByCategory('propulsion');
  for (const tech of propulsionTechs) {
    const level = playerData.completedTechs[tech.id] || 0;
    if (level > 0) {
      const bonus = calculateTechBonus(tech, level);
      speedBonus += bonus.ship_speed || 0;
    }
  }

  // Apply sensor tech bonuses
  const sensorTechs = getTechsByCategory('sensors');
  for (const tech of sensorTechs) {
    const level = playerData.completedTechs[tech.id] || 0;
    if (level > 0) {
      const bonus = calculateTechBonus(tech, level);
      accuracy += bonus.accuracy || 0;
    }
  }

  return {
    damageBonus: 1 + damageBonus,
    defenseBonus: 1 + defenseBonus,
    speedBonus: 1 + speedBonus,
    accuracy: Math.min(100, accuracy),
  };
}

// ============================================
// EXAMPLE 7: Resource Management
// ============================================

export function calculateResearchBudget(
  playerData: PlayerResearchData,
  availableResources: Record<string, number>
): {
  canAfford: string[];
  tooExpensive: string[];
  recommendations: string[];
} {
  const canAfford: string[] = [];
  const tooExpensive: string[] = [];
  const recommendations: string[] = [];

  for (const tech of playerData.discoveredTechs) {
    const techObj = getTechById(tech);
    if (!techObj) continue;

    const currentLevel = playerData.completedTechs[tech] || 0;
    if (currentLevel >= techObj.maxLevel) continue;

    const nextLevelCost = calculateResearchCost(techObj, currentLevel + 1);
    let canAffordTech = true;

    for (const [resource, required] of Object.entries(nextLevelCost)) {
      if ((availableResources[resource] || 0) < required) {
        canAffordTech = false;
        break;
      }
    }

    if (canAffordTech) {
      canAfford.push(tech);
    } else {
      tooExpensive.push(tech);
    }

    // Get recommendations for efficient research
    if (techObj.rarity === 'uncommon' && currentLevel < 3) {
      recommendations.push(tech);
    }
  }

  return { canAfford, tooExpensive, recommendations };
}

// ============================================
// EXAMPLE 8: Research Lab Management
// ============================================

export function optimizeLabAssignments(
  projects: ResearchProject[],
  availableLabs: ResearchLab[]
): ResearchProject[] {
  // Sort projects by priority (higher tier = higher priority)
  const tierOrder = { tier1: 0, tier2: 1, tier3: 2, tier4: 3, tier5: 4 };
  projects.sort((a, b) => {
    const techA = getTechById(a.techId);
    const techB = getTechById(b.techId);
    return (tierOrder[techB?.tier || 'tier1'] || 0) - (tierOrder[techA?.tier || 'tier1'] || 0);
  });

  // Assign labs based on specialization
  for (const project of projects) {
    const tech = getTechById(project.techId);
    if (!tech) continue;

    // Find best matching lab
    const specializedLabs = availableLabs.filter(
      lab => !lab.currentProject && (lab.specialization === tech.category || !lab.specialization)
    );

    if (specializedLabs.length > 0) {
      const bestLab = specializedLabs.reduce((best, lab) =>
        lab.efficiency > best.efficiency ? lab : best
      );
      bestLab.currentProject = project.id;
      project.labsAssigned = 1;
      project.bonusMultiplier = 1 + bestLab.efficiency * 0.1;
    }
  }

  return projects;
}

// ============================================
// EXAMPLE 9: Achievement/Milestone Tracking
// ============================================

export function checkResearchMilestones(playerData: PlayerResearchData): string[] {
  const achievements: string[] = [];

  // Check total tech count
  const totalCompleted = Object.keys(playerData.completedTechs).length;
  if (totalCompleted === 10) achievements.push('Early Explorer');
  if (totalCompleted === 25) achievements.push('Tech Enthusiast');
  if (totalCompleted === 50) achievements.push('Technology Master');
  if (totalCompleted === 91) achievements.push('Ultimate Researcher - ALL TECHS UNLOCKED!');

  // Check progression paths
  for (const path of PROGRESSION_PATHS) {
    const completedInPath = path.techs.filter(id => playerData.completedTechs[id]).length;
    if (completedInPath === path.techs.length) {
      achievements.push(`${path.name} Complete!`);
    }
  }

  // Check rarity milestones
  const legendaryCount = ALL_TECHNOLOGIES.filter(
    t => t.rarity === 'legendary' && playerData.completedTechs[t.id]
  ).length;
  if (legendaryCount >= 5) achievements.push('Legendary Collector');

  const mythicCount = ALL_TECHNOLOGIES.filter(
    t => t.rarity === 'mythic' && playerData.completedTechs[t.id]
  ).length;
  if (mythicCount >= 1) achievements.push('Achieved Godhood!');

  return achievements;
}

// Export for use in game
export const TechResearchIntegration = {
  initializePlayerResearch,
  startResearch,
  updateResearchSystems,
  getBrowserTechs,
  getTechDisplayInfo,
  getProgressionPathStatus,
  calculateCombatStats,
  calculateResearchBudget,
  optimizeLabAssignments,
  checkResearchMilestones,
};
