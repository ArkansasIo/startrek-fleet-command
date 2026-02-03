// ResearchSystem.ts
// Handles technology research and advancement

export interface Research {
  id: string;
  name: string;
  category: 'weapon' | 'defense' | 'engine' | 'economy' | 'utility' | 'special';
  description: string;
  level: number;
  maxLevel: number;
  baseCost: Record<string, number>;
  costMultiplier: number;
  researchTime: number; // seconds
  requirements: {
    previousLevel?: number;
    buildings?: string[]; // Required buildings
    otherResearch?: string[]; // Prerequisite research
  };
  effects: ResearchEffect[];
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface ResearchEffect {
  type: string;
  affectedAttribute: string;
  value: number; // Percentage or absolute change
  description: string;
}

export interface ResearchProject {
  id: string;
  playerId: string;
  researchId: string;
  researchName: string;
  currentLevel: number;
  nextLevel: number;
  status: 'queued' | 'researching' | 'completed' | 'paused';
  startedAt: number;
  completedAt?: number;
  completionTime: number;
  resourcesRequired: Record<string, number>;
  resourcesInvested: Record<string, number>;
  progress: number; // 0-100
  labsAssigned: number; // How many labs are working on this
}

export interface ResearchTree {
  playerId: string;
  researchCompleted: Record<string, number>; // research id -> level
  researchQueueIndex: number;
  queue: ResearchProject[];
  maxQueueSize: number;
}

export interface TechBoost {
  type: 'permanent' | 'temporary';
  researchSpeedBonus: number; // Percentage
  resourceCostReduction: number;
  duration?: number;
  source: string;
}

// Define research technologies
export const RESEARCH_TECHNOLOGIES: Research[] = [
  {
    id: 'basic_warp_drive',
    name: 'Basic Warp Drive',
    category: 'engine',
    description: 'Enables faster-than-light travel',
    level: 1,
    maxLevel: 5,
    baseCost: { dilithium: 500, credits: 2000 },
    costMultiplier: 1.5,
    researchTime: 3600,
    requirements: {},
    effects: [
      {
        type: 'fleet_speed',
        affectedAttribute: 'ship_speed',
        value: 20,
        description: '+20% ship speed per level',
      },
    ],
    rarity: 'uncommon',
  },
  {
    id: 'advanced_weapons',
    name: 'Advanced Weapons Systems',
    category: 'weapon',
    description: 'Increases weapon damage',
    level: 1,
    maxLevel: 5,
    baseCost: { tritanium: 300, credits: 1500 },
    costMultiplier: 1.6,
    researchTime: 4000,
    requirements: {},
    effects: [
      {
        type: 'combat_damage',
        affectedAttribute: 'attack_power',
        value: 15,
        description: '+15% weapon damage per level',
      },
    ],
    rarity: 'rare',
  },
  {
    id: 'shield_technology',
    name: 'Shield Technology',
    category: 'defense',
    description: 'Develops advanced shield systems',
    level: 1,
    maxLevel: 5,
    baseCost: { dilithium: 400, credits: 2000 },
    costMultiplier: 1.5,
    researchTime: 4500,
    requirements: {},
    effects: [
      {
        type: 'defense_strength',
        affectedAttribute: 'shield_strength',
        value: 25,
        description: '+25% shield strength per level',
      },
    ],
    rarity: 'epic',
  },
  {
    id: 'resource_gathering',
    name: 'Resource Gathering Techniques',
    category: 'economy',
    description: 'Improves resource extraction efficiency',
    level: 1,
    maxLevel: 5,
    baseCost: { credits: 1000, tritanium: 100 },
    costMultiplier: 1.4,
    researchTime: 3000,
    requirements: {},
    effects: [
      {
        type: 'production_efficiency',
        affectedAttribute: 'resource_production',
        value: 20,
        description: '+20% resource production per level',
      },
    ],
    rarity: 'common',
  },
  {
    id: 'diplomacy_science',
    name: 'Diplomatic Sciences',
    category: 'utility',
    description: 'Improves diplomatic relations',
    level: 1,
    maxLevel: 3,
    baseCost: { credits: 2000 },
    costMultiplier: 1.7,
    researchTime: 5000,
    requirements: {},
    effects: [
      {
        type: 'diplomatic_gain',
        affectedAttribute: 'reputation_gain',
        value: 50,
        description: '+50% reputation gains per level',
      },
    ],
    rarity: 'uncommon',
  },
  {
    id: 'borg_assimilation_defense',
    name: 'Borg Assimilation Defense',
    category: 'defense',
    description: 'Defense against Borg technology',
    level: 1,
    maxLevel: 3,
    baseCost: { dilithium: 1000, credits: 5000, tritanium: 500 },
    costMultiplier: 2.0,
    researchTime: 10000,
    requirements: { otherResearch: ['shield_technology'] },
    effects: [
      {
        type: 'borg_resistance',
        affectedAttribute: 'assimilation_resistance',
        value: 100,
        description: 'Complete protection against Borg assimilation',
      },
    ],
    rarity: 'legendary',
  },
  {
    id: 'time_dilation_field',
    name: 'Time Dilation Field',
    category: 'special',
    description: 'Manipulates localized time',
    level: 1,
    maxLevel: 2,
    baseCost: { dilithium: 2000, credits: 10000 },
    costMultiplier: 3.0,
    researchTime: 20000,
    requirements: { otherResearch: ['basic_warp_drive'] },
    effects: [
      {
        type: 'time_bonus',
        affectedAttribute: 'research_speed',
        value: 200,
        description: 'Double research and construction speed',
      },
    ],
    rarity: 'legendary',
  },
];

// Start research
export function startResearch(
  playerId: string,
  researchId: string,
  currentLevel: number = 0
): {
  success: boolean;
  project?: ResearchProject;
  costRequired?: Record<string, number>;
  message: string;
} {
  const research = RESEARCH_TECHNOLOGIES.find((r) => r.id === researchId);
  if (!research) return { success: false, message: 'Research not found' };

  if (currentLevel >= research.maxLevel) {
    return { success: false, message: 'Research is already at max level' };
  }

  // Calculate cost
  const nextLevel = currentLevel + 1;
  const costRequired: Record<string, number> = {};

  Object.entries(research.baseCost).forEach(([resource, baseCost]) => {
    costRequired[resource] = Math.floor(
      baseCost * Math.pow(research.costMultiplier, nextLevel - 1)
    );
  });

  const project: ResearchProject = {
    id: `res_${playerId}_${researchId}_${Date.now()}`,
    playerId,
    researchId,
    researchName: research.name,
    currentLevel,
    nextLevel,
    status: 'researching',
    startedAt: Date.now(),
    completionTime: research.researchTime * nextLevel,
    resourcesRequired: costRequired,
    resourcesInvested: costRequired,
    progress: 0,
    labsAssigned: 1,
  };

  return {
    success: true,
    project,
    costRequired,
    message: `Research started: ${research.name} Level ${nextLevel}`,
  };
}

// Complete research
export function completeResearch(project: ResearchProject): { success: boolean; effects?: ResearchEffect[] } {
  const research = RESEARCH_TECHNOLOGIES.find((r) => r.id === project.researchId);
  if (!research) return { success: false };

  return { success: true, effects: research.effects };
}

// Create research tree
export function createResearchTree(playerId: string): ResearchTree {
  return {
    playerId,
    researchCompleted: {},
    researchQueueIndex: 0,
    queue: [],
    maxQueueSize: 3,
  };
}

// Add to research queue
export function addToResearchQueue(
  tree: ResearchTree,
  project: ResearchProject
): { success: boolean; message: string } {
  if (tree.queue.length >= tree.maxQueueSize) {
    return {
      success: false,
      message: `Research queue is full (max ${tree.maxQueueSize} projects)`,
    };
  }

  tree.queue.push(project);
  return { success: true, message: 'Added to research queue' };
}

// Apply lab bonus
export function applyLabBonus(
  project: ResearchProject,
  additionalLabs: number
): { success: boolean; speedBonus?: number; message: string } {
  const oldTime = project.completionTime;
  project.labsAssigned += additionalLabs;

  // Each additional lab reduces time by 25%
  const speedBonus = additionalLabs * 0.25;
  project.completionTime = Math.floor(oldTime * (1 - speedBonus));

  return {
    success: true,
    speedBonus: speedBonus * 100,
    message: `Research speed increased by ${speedBonus * 100}%`,
  };
}

// Pause research
export function pauseResearch(project: ResearchProject): void {
  if (project.status === 'researching') {
    project.status = 'paused';
  }
}

// Resume research
export function resumeResearch(project: ResearchProject): void {
  if (project.status === 'paused') {
    project.status = 'researching';
  }
}

// Calculate research effect bonus
export function getResearchBonus(
  tree: ResearchTree,
  effectType: string
): number {
  let bonus = 0;

  Object.entries(tree.researchCompleted).forEach(([researchId, level]) => {
    const research = RESEARCH_TECHNOLOGIES.find((r) => r.id === researchId);
    if (research) {
      const effect = research.effects.find((e) => e.type === effectType);
      if (effect) {
        bonus += effect.value * level;
      }
    }
  });

  return bonus;
}

// Get available research
export function getAvailableResearch(
  tree: ResearchTree,
  buildings?: string[]
): Research[] {
  return RESEARCH_TECHNOLOGIES.filter((research) => {
    // Check if already at max level
    const currentLevel = tree.researchCompleted[research.id] || 0;
    if (currentLevel >= research.maxLevel) return false;

    // Check building requirements
    if (research.requirements.buildings && buildings) {
      const hasRequiredBuildings = research.requirements.buildings.every((b) =>
        buildings.includes(b)
      );
      if (!hasRequiredBuildings) return false;
    }

    // Check prerequisite research
    if (research.requirements.otherResearch) {
      const hasPrerequisites = research.requirements.otherResearch.every(
        (r) => (tree.researchCompleted[r] || 0) > 0
      );
      if (!hasPrerequisites) return false;
    }

    return true;
  });
}

// Boost research speed
export function applyTechBoost(
  project: ResearchProject,
  boost: TechBoost
): { success: boolean; newTime?: number } {
  if (boost.type === 'temporary' && !boost.duration) {
    return { success: false };
  }

  const reduction = 1 - boost.resourceCostReduction;
  project.completionTime = Math.floor(project.completionTime * reduction);

  return { success: true, newTime: project.completionTime };
}

// Calculate research queue total time
export function calculateQueueTime(queue: ResearchProject[]): number {
  return queue.reduce((total, project) => total + project.completionTime, 0);
}
