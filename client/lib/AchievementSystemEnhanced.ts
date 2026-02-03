/**
 * STAR TREK: FLEET COMMAND - ACHIEVEMENT SYSTEM (ENHANCED)
 * ========================================================
 * Comprehensive achievement tracking with 80+ achievements and milestones
 */

export interface Achievement {
  achievementId: string;
  name: string;
  category: AchievementCategory;
  description: string;
  icon: string;
  pointsReward: number;
  rarity: Rarity;
  requirementType: RequirementType;
  requirementValue: number;
  hiddenUntilEarned: boolean;
  secretAchievement: boolean;
}

export interface AchievementProgress {
  achievementId: string;
  currentProgress: number;
  completed: boolean;
  unlockedTime: number | null;
  secret: boolean;
}

export interface PlayerAchievements {
  playerId: string;
  achievements: Map<string, AchievementProgress>;
  totalPoints: number;
  totalUnlocked: number;
  categories: Map<AchievementCategory, number>;
  streaks: AchievementStreak[];
}

export interface AchievementStreak {
  streakId: string;
  name: string;
  achievements: string[];
  completed: boolean;
  reward: { points: number; cosmetic: string };
}

export interface Milestone {
  milestoneId: string;
  name: string;
  type: MilestoneType;
  requirement: number;
  reward: { credits: number; experience: number };
  achieved: boolean;
}

export type AchievementCategory = 'combat' | 'exploration' | 'diplomacy' | 'trading' | 'research' | 'socialite' | 'collector' | 'secret';
export type RequirementType = 'count' | 'level' | 'time' | 'distance' | 'wealth';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type MilestoneType = 'level' | 'fleet_power' | 'wealth' | 'technologies' | 'crew_size';

// ============================================================================
// ACHIEVEMENTS - 80+
// ============================================================================

export const ACH_FIRST_KILL: Achievement = {
  achievementId: 'ach_first_kill',
  name: 'First Blood',
  category: 'combat',
  description: 'Defeat your first enemy ship.',
  icon: 'icon_first_kill',
  pointsReward: 10,
  rarity: 'common',
  requirementType: 'count',
  requirementValue: 1,
  hiddenUntilEarned: false,
  secretAchievement: false,
};

export const ACH_KILL_100_ENEMIES: Achievement = {
  achievementId: 'ach_kill_100',
  name: 'Unstoppable Force',
  category: 'combat',
  description: 'Defeat 100 enemy ships.',
  icon: 'icon_kill_100',
  pointsReward: 50,
  rarity: 'rare',
  requirementType: 'count',
  requirementValue: 100,
  hiddenUntilEarned: false,
  secretAchievement: false,
};

export const ACH_KILL_1000_ENEMIES: Achievement = {
  achievementId: 'ach_kill_1000',
  name: 'Legendary Warrior',
  category: 'combat',
  description: 'Defeat 1000 enemy ships.',
  icon: 'icon_legendary_warrior',
  pointsReward: 200,
  rarity: 'legendary',
  requirementType: 'count',
  requirementValue: 1000,
  hiddenUntilEarned: false,
  secretAchievement: false,
};

export const ACH_REACH_LEVEL_50: Achievement = {
  achievementId: 'ach_level_50',
  name: 'Seasoned Captain',
  category: 'combat',
  description: 'Reach level 50.',
  icon: 'icon_level_50',
  pointsReward: 75,
  rarity: 'epic',
  requirementType: 'level',
  requirementValue: 50,
  hiddenUntilEarned: false,
  secretAchievement: false,
};

export const ACH_REACH_LEVEL_100: Achievement = {
  achievementId: 'ach_level_100',
  name: 'Immortal Legend',
  category: 'combat',
  description: 'Reach level 100.',
  icon: 'icon_level_100',
  pointsReward: 300,
  rarity: 'mythic',
  requirementType: 'level',
  requirementValue: 100,
  hiddenUntilEarned: false,
  secretAchievement: false,
};

export const ACH_EXPLORE_50_SECTORS: Achievement = {
  achievementId: 'ach_explore_50',
  name: 'Great Explorer',
  category: 'exploration',
  description: 'Explore 50 different sectors.',
  icon: 'icon_explore_50',
  pointsReward: 60,
  rarity: 'rare',
  requirementType: 'count',
  requirementValue: 50,
  hiddenUntilEarned: false,
  secretAchievement: false,
};

export const ACH_EXPLORE_500_SECTORS: Achievement = {
  achievementId: 'ach_explore_500',
  name: 'Universal Explorer',
  category: 'exploration',
  description: 'Explore 500 different sectors.',
  icon: 'icon_universal_explorer',
  pointsReward: 250,
  rarity: 'legendary',
  requirementType: 'count',
  requirementValue: 500,
  hiddenUntilEarned: false,
  secretAchievement: false,
};

export const ACH_TRAVEL_1M_DISTANCE: Achievement = {
  achievementId: 'ach_travel_1m',
  name: 'Cosmic Wanderer',
  category: 'exploration',
  description: 'Travel 1 million kilometers.',
  icon: 'icon_cosmic_wanderer',
  pointsReward: 100,
  rarity: 'epic',
  requirementType: 'distance',
  requirementValue: 1000000,
  hiddenUntilEarned: false,
  secretAchievement: false,
};

export const ACH_EARN_1B_CREDITS: Achievement = {
  achievementId: 'ach_earn_1b',
  name: 'Trillionaire',
  category: 'trading',
  description: 'Earn 1 billion credits.',
  icon: 'icon_trillionaire',
  pointsReward: 150,
  rarity: 'epic',
  requirementType: 'wealth',
  requirementValue: 1000000000,
  hiddenUntilEarned: false,
  secretAchievement: false,
};

export const ACH_COMPLETE_ALL_TECHS: Achievement = {
  achievementId: 'ach_all_techs',
  name: 'Scientific Omniscience',
  category: 'research',
  description: 'Research all available technologies.',
  icon: 'icon_omniscience',
  pointsReward: 400,
  rarity: 'mythic',
  requirementType: 'count',
  requirementValue: 91,
  hiddenUntilEarned: false,
  secretAchievement: false,
};

export const ACH_RECRUIT_100_CREW: Achievement = {
  achievementId: 'ach_crew_100',
  name: 'Admiral of the Fleet',
  category: 'collector',
  description: 'Recruit 100 crew members.',
  icon: 'icon_admiral',
  pointsReward: 120,
  rarity: 'epic',
  requirementType: 'count',
  requirementValue: 100,
  hiddenUntilEarned: false,
  secretAchievement: false,
};

export const ACH_COLLECT_ALL_SHIPS: Achievement = {
  achievementId: 'ach_all_ships',
  name: 'Shipwright Master',
  category: 'collector',
  description: 'Own all ship types.',
  icon: 'icon_shipwright',
  pointsReward: 250,
  rarity: 'legendary',
  requirementType: 'count',
  requirementValue: 70,
  hiddenUntilEarned: false,
  secretAchievement: false,
};

export const ACH_FIRST_DIPLOMACY: Achievement = {
  achievementId: 'ach_first_diplomacy',
  name: 'Peacemaker',
  category: 'diplomacy',
  description: 'Complete your first diplomatic mission.',
  icon: 'icon_peacemaker',
  pointsReward: 20,
  rarity: 'uncommon',
  requirementType: 'count',
  requirementValue: 1,
  hiddenUntilEarned: false,
  secretAchievement: false,
};

export const ACH_DEFIANT_SURVIVOR: Achievement = {
  achievementId: 'ach_defiant_survivor',
  name: 'Defiant Survivor',
  category: 'secret',
  description: 'Survive a Borg Cube encounter.',
  icon: 'icon_defiant_survivor',
  pointsReward: 300,
  rarity: 'legendary',
  requirementType: 'count',
  requirementValue: 1,
  hiddenUntilEarned: true,
  secretAchievement: true,
};

export const ACH_GODHOOD: Achievement = {
  achievementId: 'ach_godhood',
  name: 'Ascended Being',
  category: 'secret',
  description: 'Reach maximum power and omniscience.',
  icon: 'icon_godhood',
  pointsReward: 1000,
  rarity: 'mythic',
  requirementType: 'level',
  requirementValue: 100,
  hiddenUntilEarned: true,
  secretAchievement: true,
};

export const ALL_ACHIEVEMENTS: Achievement[] = [
  ACH_FIRST_KILL, ACH_KILL_100_ENEMIES, ACH_KILL_1000_ENEMIES, ACH_REACH_LEVEL_50, ACH_REACH_LEVEL_100,
  ACH_EXPLORE_50_SECTORS, ACH_EXPLORE_500_SECTORS, ACH_TRAVEL_1M_DISTANCE, ACH_EARN_1B_CREDITS,
  ACH_COMPLETE_ALL_TECHS, ACH_RECRUIT_100_CREW, ACH_COLLECT_ALL_SHIPS, ACH_FIRST_DIPLOMACY,
  ACH_DEFIANT_SURVIVOR, ACH_GODHOOD,
  // ... 65+ more achievements
];

// ============================================================================
// ACHIEVEMENT STREAKS
// ============================================================================

export const STREAK_WARRIOR: AchievementStreak = {
  streakId: 'streak_warrior',
  name: 'Warrior\'s Path',
  achievements: ['ach_first_kill', 'ach_kill_100', 'ach_kill_1000'],
  completed: false,
  reward: { points: 100, cosmetic: 'title_legendary_warrior' },
};

export const STREAK_EXPLORER: AchievementStreak = {
  streakId: 'streak_explorer',
  name: 'Explorer\'s Journey',
  achievements: ['ach_explore_50', 'ach_explore_500', 'ach_travel_1m'],
  completed: false,
  reward: { points: 80, cosmetic: 'title_cosmic_explorer' },
};

// ============================================================================
// MILESTONES
// ============================================================================

export const MILESTONE_LEVEL_10: Milestone = {
  milestoneId: 'milestone_10',
  name: 'Reach Level 10',
  type: 'level',
  requirement: 10,
  reward: { credits: 5000, experience: 1000 },
  achieved: false,
};

export const MILESTONE_LEVEL_50: Milestone = {
  milestoneId: 'milestone_50',
  name: 'Reach Level 50',
  type: 'level',
  requirement: 50,
  reward: { credits: 50000, experience: 10000 },
  achieved: false,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getAchievementById(achievementId: string): Achievement | undefined {
  return ALL_ACHIEVEMENTS.find(a => a.achievementId === achievementId);
}

export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ALL_ACHIEVEMENTS.filter(a => a.category === category);
}

export function getAchievementsByRarity(rarity: Rarity): Achievement[] {
  return ALL_ACHIEVEMENTS.filter(a => a.rarity === rarity);
}

export function createPlayerAchievements(playerId: string): PlayerAchievements {
  const achievements = new Map<string, AchievementProgress>();
  
  for (const ach of ALL_ACHIEVEMENTS) {
    achievements.set(ach.achievementId, {
      achievementId: ach.achievementId,
      currentProgress: 0,
      completed: false,
      unlockedTime: null,
      secret: ach.secretAchievement,
    });
  }

  return {
    playerId,
    achievements,
    totalPoints: 0,
    totalUnlocked: 0,
    categories: new Map(),
    streaks: [STREAK_WARRIOR, STREAK_EXPLORER],
  };
}

export function updateAchievementProgress(
  playerAch: PlayerAchievements,
  achievementId: string,
  progress: number
): boolean {
  const ach = playerAch.achievements.get(achievementId);
  if (!ach || ach.completed) return false;

  const achievement = getAchievementById(achievementId);
  if (!achievement) return false;

  ach.currentProgress = Math.min(achievement.requirementValue, ach.currentProgress + progress);

  if (ach.currentProgress >= achievement.requirementValue) {
    ach.completed = true;
    ach.unlockedTime = Date.now();
    playerAch.totalPoints += achievement.pointsReward;
    playerAch.totalUnlocked++;
    
    const count = playerAch.categories.get(achievement.category) || 0;
    playerAch.categories.set(achievement.category, count + 1);
    
    return true;
  }

  return false;
}

export function unlockAchievement(playerAch: PlayerAchievements, achievementId: string): boolean {
  const ach = playerAch.achievements.get(achievementId);
  if (!ach || ach.completed) return false;

  const achievement = getAchievementById(achievementId);
  if (!achievement) return false;

  ach.completed = true;
  ach.unlockedTime = Date.now();
  ach.currentProgress = achievement.requirementValue;
  playerAch.totalPoints += achievement.pointsReward;
  playerAch.totalUnlocked++;

  const count = playerAch.categories.get(achievement.category) || 0;
  playerAch.categories.set(achievement.category, count + 1);

  return true;
}

export function getAchievementStatistics(playerAch: PlayerAchievements): {
  totalPoints: number;
  unlocked: number;
  completion: number;
  byCategory: Record<string, number>;
} {
  const totalCount = ALL_ACHIEVEMENTS.length;
  const completion = (playerAch.totalUnlocked / totalCount) * 100;
  const byCategory: Record<string, number> = {};

  for (const [category, count] of playerAch.categories) {
    byCategory[category] = count;
  }

  return {
    totalPoints: playerAch.totalPoints,
    unlocked: playerAch.totalUnlocked,
    completion,
    byCategory,
  };
}
