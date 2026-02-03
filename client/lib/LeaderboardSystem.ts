// LeaderboardSystem.ts
// Handles rankings, statistics, and leaderboards

export interface PlayerStats {
  playerId: string;
  username: string;
  level: number;
  experience: number;
  battlesWon: number;
  battlesLost: number;
  territoriesControlled: number;
  planetsColonized: number;
  totalResourcesGained: number;
  alliesCount: number;
  defeatedBosses: number;
  questsCompleted: number;
  playtime: number; // in seconds
  lastActive: number;
  joinedAt: number;
}

export interface Leaderboard {
  id: string;
  name: string;
  category: 'level' | 'power' | 'wealth' | 'territory' | 'battles' | 'pvp' | 'alliances';
  entries: LeaderboardEntry[];
  lastUpdated: number;
  season?: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  username: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  badge?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  condition: (stats: PlayerStats) => boolean;
  rewards: { experience: number; credits: number };
  unlockedAt?: number;
}

export interface Rank {
  id: string;
  name: string;
  minLevel: number;
  minExperience: number;
  icon: string;
  perks: string[];
  salary: number; // Credits per turn
}

// Create initial player stats
export function createPlayerStats(playerId: string, username: string): PlayerStats {
  return {
    playerId,
    username,
    level: 1,
    experience: 0,
    battlesWon: 0,
    battlesLost: 0,
    territoriesControlled: 0,
    planetsColonized: 0,
    totalResourcesGained: 0,
    alliesCount: 0,
    defeatedBosses: 0,
    questsCompleted: 0,
    playtime: 0,
    lastActive: Date.now(),
    joinedAt: Date.now(),
  };
}

// Calculate power level
export function calculatePowerLevel(stats: PlayerStats): number {
  return (
    stats.level * 100 +
    stats.battlesWon * 50 -
    stats.battlesLost * 10 +
    stats.territoriesControlled * 200 +
    stats.planetsColonized * 50 +
    stats.defeatedBosses * 500
  );
}

// Update player stats
export function updatePlayerStats(
  stats: PlayerStats,
  changes: Partial<PlayerStats>
): PlayerStats {
  return { ...stats, ...changes, lastActive: Date.now() };
}

// Award experience
export function grantExperience(
  stats: PlayerStats,
  amount: number
): { leveledUp: boolean; newLevel?: number; message: string } {
  stats.experience += amount;

  // Level up formula: 1000 * level XP to next level
  const xpForNextLevel = 1000 * stats.level;

  if (stats.experience >= xpForNextLevel) {
    stats.level++;
    stats.experience = stats.experience - xpForNextLevel;

    return {
      leveledUp: true,
      newLevel: stats.level,
      message: `Level up! You are now level ${stats.level}`,
    };
  }

  return {
    leveledUp: false,
    message: `Gained ${amount} experience`,
  };
}

// Get player rank
export function getPlayerRank(stats: PlayerStats): Rank {
  const ranks: Rank[] = [
    {
      id: 'ensign',
      name: 'Ensign',
      minLevel: 1,
      minExperience: 0,
      icon: '⭐',
      perks: ['Basic ship access'],
      salary: 100,
    },
    {
      id: 'lieutenant',
      name: 'Lieutenant',
      minLevel: 10,
      minExperience: 50000,
      icon: '⭐⭐',
      perks: ['Better ships', '+10% resource production'],
      salary: 250,
    },
    {
      id: 'commander',
      name: 'Commander',
      minLevel: 25,
      minExperience: 500000,
      icon: '⭐⭐⭐',
      perks: ['Advanced ships', '+20% resource production', 'Alliance leader'],
      salary: 500,
    },
    {
      id: 'captain',
      name: 'Captain',
      minLevel: 50,
      minExperience: 2000000,
      icon: '⭐⭐⭐⭐',
      perks: ['Elite ships', '+50% resource production', 'Territory control'],
      salary: 1000,
    },
    {
      id: 'admiral',
      name: 'Admiral',
      minLevel: 100,
      minExperience: 10000000,
      icon: '⭐⭐⭐⭐⭐',
      perks: ['Legendary ships', '+100% resources', 'Alliance exclusive'],
      salary: 5000,
    },
  ];

  // Find highest applicable rank
  const rank = ranks
    .reverse()
    .find((r) => stats.level >= r.minLevel && stats.experience >= r.minExperience);

  return rank || ranks[0];
}

// Create leaderboard
export function createLeaderboard(category: string, entries: LeaderboardEntry[]): Leaderboard {
  return {
    id: `leaderboard_${category}_${Date.now()}`,
    name: `${category.charAt(0).toUpperCase() + category.slice(1)} Leaderboard`,
    category: category as any,
    entries: entries.sort((a, b) => b.value - a.value).slice(0, 100), // Top 100
    lastUpdated: Date.now(),
  };
}

// Build leaderboards from player stats
export function buildLeaderboards(allStats: PlayerStats[]): Leaderboard[] {
  const leaderboards: Leaderboard[] = [];

  // Level leaderboard
  const levelEntries = allStats
    .sort((a, b) => b.level - a.level)
    .slice(0, 100)
    .map((stats, index) => ({
      rank: index + 1,
      playerId: stats.playerId,
      username: stats.username,
      value: stats.level,
      trend: 'stable' as const,
      badge: index < 10 ? '🏆' : undefined,
    }));

  leaderboards.push({
    id: `leaderboard_level_${Date.now()}`,
    name: 'Level Leaderboard',
    category: 'level',
    entries: levelEntries,
    lastUpdated: Date.now(),
  });

  // Power leaderboard
  const powerEntries = allStats
    .map((stats) => ({
      playerId: stats.playerId,
      username: stats.username,
      power: calculatePowerLevel(stats),
    }))
    .sort((a, b) => b.power - a.power)
    .slice(0, 100)
    .map((entry, index) => ({
      rank: index + 1,
      playerId: entry.playerId,
      username: entry.username,
      value: entry.power,
      trend: 'stable' as const,
      badge: index < 10 ? '💪' : undefined,
    }));

  leaderboards.push({
    id: `leaderboard_power_${Date.now()}`,
    name: 'Power Leaderboard',
    category: 'power',
    entries: powerEntries,
    lastUpdated: Date.now(),
  });

  // Battles won leaderboard
  const battlesEntries = allStats
    .sort((a, b) => b.battlesWon - a.battlesWon)
    .slice(0, 100)
    .map((stats, index) => ({
      rank: index + 1,
      playerId: stats.playerId,
      username: stats.username,
      value: stats.battlesWon,
      trend: 'stable' as const,
      badge: index < 10 ? '⚔️' : undefined,
    }));

  leaderboards.push({
    id: `leaderboard_battles_${Date.now()}`,
    name: 'Battles Won Leaderboard',
    category: 'battles',
    entries: battlesEntries,
    lastUpdated: Date.now(),
  });

  return leaderboards;
}

// Define achievements
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Win your first battle',
    icon: '⚔️',
    rarity: 'common',
    condition: (stats) => stats.battlesWon >= 1,
    rewards: { experience: 100, credits: 500 },
  },
  {
    id: 'war_hero',
    name: 'War Hero',
    description: 'Win 50 battles',
    icon: '🏆',
    rarity: 'epic',
    condition: (stats) => stats.battlesWon >= 50,
    rewards: { experience: 5000, credits: 25000 },
  },
  {
    id: 'empire_builder',
    name: 'Empire Builder',
    description: 'Control 10 territories',
    icon: '🏛️',
    rarity: 'epic',
    condition: (stats) => stats.territoriesControlled >= 10,
    rewards: { experience: 5000, credits: 25000 },
  },
  {
    id: 'boss_slayer',
    name: 'Boss Slayer',
    description: 'Defeat 10 bosses',
    icon: '👹',
    rarity: 'rare',
    condition: (stats) => stats.defeatedBosses >= 10,
    rewards: { experience: 2000, credits: 10000 },
  },
  {
    id: 'diplomat',
    name: 'Diplomat',
    description: 'Form 5 alliances',
    icon: '🤝',
    rarity: 'uncommon',
    condition: (stats) => stats.alliesCount >= 5,
    rewards: { experience: 500, credits: 2500 },
  },
];

// Check achievements
export function checkAchievements(stats: PlayerStats): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => achievement.condition(stats));
}

// Calculate win rate
export function calculateWinRate(stats: PlayerStats): number {
  const totalBattles = stats.battlesWon + stats.battlesLost;
  if (totalBattles === 0) return 0;
  return (stats.battlesWon / totalBattles) * 100;
}

// Get player ranking
export function getPlayerRanking(playerId: string, leaderboards: Leaderboard[]): number {
  for (const board of leaderboards) {
    const entry = board.entries.find((e) => e.playerId === playerId);
    if (entry) return entry.rank;
  }
  return -1; // Not ranked
}
