// GuildAllianceSystem.ts
// Guild and Alliance management system

export type GuildRank = 'founder' | 'officer' | 'member' | 'recruit' | 'ally';
export type AllianceType = 'permanent' | 'temporary' | 'mercenary' | 'defensive' | 'economic';
export type GuildStatus = 'active' | 'inactive' | 'disbanded';

export interface Guild {
  id: string;
  name: string;
  tag: string;
  description: string;
  founder: string;
  foundedAt: number;
  members: GuildMember[];
  status: GuildStatus;
  treasury: {
    credits: number;
    resources: Record<string, number>;
  };
  level: number;
  experience: number;
  maxMembers: number;
  isPublic: boolean;
  logoUrl?: string;
  achievements: GuildAchievement[];
}

export interface GuildMember {
  playerId: string;
  nickname: string;
  rank: GuildRank;
  joinedAt: number;
  contribution: number; // XP contributed
  permissions: GuildPermission[];
  lastActive: number;
}

export interface GuildPermission {
  action: string;
  allowed: boolean;
}

export interface GuildAchievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: number;
  icon: string;
}

export interface Alliance {
  id: string;
  name: string;
  type: AllianceType;
  guilds: string[]; // Guild IDs
  leader: string; // Guild ID
  members: AllianceMember[];
  createdAt: number;
  expiresAt?: number;
  treasury: {
    credits: number;
    resources: Record<string, number>;
  };
  terms: AllianceTerm[];
  territory: string[]; // Sector IDs
  relationshipScore: number; // 0-100
}

export interface AllianceMember {
  guildId: string;
  joinedAt: number;
  contribution: number;
  status: 'active' | 'inactive' | 'pending';
}

export interface AllianceTerm {
  id: string;
  description: string;
  type: 'offensive' | 'defensive' | 'economic' | 'diplomatic';
  binding: boolean;
}

export interface GuildQuest {
  id: string;
  guildId: string;
  title: string;
  description: string;
  objective: string;
  rewards: {
    guildXp: number;
    credits: number;
    reputation: number;
  };
  progress: number;
  deadline?: number;
  completed: boolean;
}

export interface GuildWar {
  id: string;
  attacker: string; // Guild ID
  defender: string; // Guild ID
  startedAt: number;
  endsAt?: number;
  status: 'pending' | 'active' | 'concluded';
  objectives: WarObjective[];
  casualities: {
    attacker: number;
    defender: number;
  };
  winner?: string;
}

export interface WarObjective {
  id: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
}

// Create guild
export function createGuild(
  name: string,
  tag: string,
  founder: string,
  description: string = ''
): Guild {
  return {
    id: `guild_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    tag,
    description,
    founder,
    foundedAt: Date.now(),
    members: [
      {
        playerId: founder,
        nickname: founder,
        rank: 'founder',
        joinedAt: Date.now(),
        contribution: 0,
        permissions: getAllPermissions(),
        lastActive: Date.now(),
      },
    ],
    status: 'active',
    treasury: {
      credits: 10000,
      resources: {
        minerals: 1000,
        dilithium: 100,
      },
    },
    level: 1,
    experience: 0,
    maxMembers: 50,
    isPublic: true,
    achievements: [],
  };
}

// Get all permissions
function getAllPermissions(): GuildPermission[] {
  return [
    { action: 'manage_members', allowed: false },
    { action: 'manage_treasury', allowed: false },
    { action: 'create_quests', allowed: false },
    { action: 'declare_war', allowed: false },
    { action: 'form_alliance', allowed: false },
  ];
}

// Add guild member
export function addGuildMember(guild: Guild, playerId: string, nickname: string): Guild {
  if (guild.members.length >= guild.maxMembers) {
    throw new Error('Guild is at max capacity');
  }

  const newMember: GuildMember = {
    playerId,
    nickname,
    rank: 'recruit',
    joinedAt: Date.now(),
    contribution: 0,
    permissions: [
      { action: 'manage_members', allowed: false },
      { action: 'manage_treasury', allowed: false },
      { action: 'create_quests', allowed: false },
      { action: 'declare_war', allowed: false },
      { action: 'form_alliance', allowed: false },
    ],
    lastActive: Date.now(),
  };

  return {
    ...guild,
    members: [...guild.members, newMember],
  };
}

// Remove guild member
export function removeGuildMember(guild: Guild, playerId: string): Guild {
  return {
    ...guild,
    members: guild.members.filter((m) => m.playerId !== playerId),
  };
}

// Update member rank
export function updateMemberRank(guild: Guild, playerId: string, newRank: GuildRank): Guild {
  return {
    ...guild,
    members: guild.members.map((m) =>
      m.playerId === playerId ? { ...m, rank: newRank } : m
    ),
  };
}

// Add guild funds
export function addGuildFunds(guild: Guild, credits: number, resources: Record<string, number> = {}): Guild {
  const newTreasury = {
    credits: guild.treasury.credits + credits,
    resources: { ...guild.treasury.resources },
  };

  Object.entries(resources).forEach(([resource, amount]) => {
    newTreasury.resources[resource] = (newTreasury.resources[resource] || 0) + amount;
  });

  return {
    ...guild,
    treasury: newTreasury,
  };
}

// Withdraw guild funds
export function withdrawGuildFunds(
  guild: Guild,
  credits: number,
  resources: Record<string, number> = {}
): Guild {
  if (guild.treasury.credits < credits) {
    throw new Error('Insufficient guild funds');
  }

  const newTreasury = {
    credits: guild.treasury.credits - credits,
    resources: { ...guild.treasury.resources },
  };

  Object.entries(resources).forEach(([resource, amount]) => {
    if ((newTreasury.resources[resource] || 0) < amount) {
      throw new Error(`Insufficient ${resource}`);
    }
    newTreasury.resources[resource] -= amount;
  });

  return {
    ...guild,
    treasury: newTreasury,
  };
}

// Create alliance
export function createAlliance(
  name: string,
  type: AllianceType,
  leaderGuildId: string,
  memberGuildIds: string[] = []
): Alliance {
  const allGuildIds = [leaderGuildId, ...memberGuildIds];

  return {
    id: `alliance_${Date.now()}`,
    name,
    type,
    guilds: allGuildIds,
    leader: leaderGuildId,
    members: allGuildIds.map((guildId) => ({
      guildId,
      joinedAt: Date.now(),
      contribution: 0,
      status: 'active',
    })),
    createdAt: Date.now(),
    expiresAt: type === 'temporary' ? Date.now() + 30 * 24 * 60 * 60 * 1000 : undefined,
    treasury: {
      credits: 50000,
      resources: {},
    },
    terms: [],
    territory: [],
    relationshipScore: 100,
  };
}

// Add guild to alliance
export function addGuildToAlliance(alliance: Alliance, guildId: string): Alliance {
  if (alliance.guilds.includes(guildId)) {
    return alliance;
  }

  return {
    ...alliance,
    guilds: [...alliance.guilds, guildId],
    members: [
      ...alliance.members,
      {
        guildId,
        joinedAt: Date.now(),
        contribution: 0,
        status: 'pending',
      },
    ],
  };
}

// Remove guild from alliance
export function removeGuildFromAlliance(alliance: Alliance, guildId: string): Alliance {
  if (alliance.leader === guildId) {
    throw new Error('Cannot remove alliance leader');
  }

  return {
    ...alliance,
    guilds: alliance.guilds.filter((g) => g !== guildId),
    members: alliance.members.filter((m) => m.guildId !== guildId),
  };
}

// Create guild quest
export function createGuildQuest(
  guildId: string,
  title: string,
  description: string,
  objective: string,
  deadline?: number
): GuildQuest {
  return {
    id: `gquest_${Date.now()}`,
    guildId,
    title,
    description,
    objective,
    rewards: {
      guildXp: 1000,
      credits: 5000,
      reputation: 100,
    },
    progress: 0,
    deadline,
    completed: false,
  };
}

// Complete guild quest
export function completeGuildQuest(quest: GuildQuest, guild: Guild): { quest: GuildQuest; guild: Guild } {
  const updatedQuest = {
    ...quest,
    completed: true,
    progress: 100,
  };

  const updatedGuild = {
    ...guild,
    experience: guild.experience + quest.rewards.guildXp,
    treasury: {
      ...guild.treasury,
      credits: guild.treasury.credits + quest.rewards.credits,
    },
  };

  // Check for level up
  const newLevel = Math.floor(updatedGuild.experience / 10000) + 1;
  if (newLevel > guild.level) {
    updatedGuild.level = newLevel;
    updatedGuild.maxMembers += 10;
  }

  return {
    quest: updatedQuest,
    guild: updatedGuild,
  };
}

// Declare guild war
export function declareGuildWar(attacker: string, defender: string): GuildWar {
  return {
    id: `war_${Date.now()}`,
    attacker,
    defender,
    startedAt: Date.now(),
    endsAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    status: 'pending',
    objectives: [
      {
        id: `obj_1`,
        description: 'Win fleet battles',
        progress: 0,
        target: 10,
        completed: false,
      },
      {
        id: `obj_2`,
        description: 'Control territory',
        progress: 0,
        target: 5,
        completed: false,
      },
    ],
    casualities: {
      attacker: 0,
      defender: 0,
    },
  };
}

// Update war objective
export function updateWarObjective(war: GuildWar, objectiveId: string, progress: number): GuildWar {
  return {
    ...war,
    objectives: war.objectives.map((obj) => {
      if (obj.id === objectiveId) {
        return {
          ...obj,
          progress: Math.min(progress, obj.target),
          completed: progress >= obj.target,
        };
      }
      return obj;
    }),
  };
}

// Record war casualties
export function recordWarCasualties(
  war: GuildWar,
  side: 'attacker' | 'defender',
  casualties: number
): GuildWar {
  return {
    ...war,
    casualities: {
      ...war.casualities,
      [side]: war.casualities[side] + casualties,
    },
  };
}

// Conclude guild war
export function concludeGuildWar(
  war: GuildWar,
  winner: 'attacker' | 'defender'
): GuildWar {
  return {
    ...war,
    status: 'concluded',
    winner,
    endsAt: Date.now(),
  };
}

// Get guild statistics
export interface GuildStatistics {
  memberCount: number;
  averageLevel: number;
  totalContribution: number;
  treasury: number;
  territories: number;
  warWins: number;
  achievements: number;
}

export function getGuildStatistics(guild: Guild): GuildStatistics {
  return {
    memberCount: guild.members.length,
    averageLevel: Math.floor(guild.level),
    totalContribution: guild.members.reduce((sum, m) => sum + m.contribution, 0),
    treasury: guild.treasury.credits,
    territories: 0, // Would be calculated from actual territory data
    warWins: 0, // Would be calculated from war history
    achievements: guild.achievements.length,
  };
}

// Generate guild profile
export function generateGuildProfile(guild: Guild): string {
  const stats = getGuildStatistics(guild);

  return `
╔════════════════════════════════════════════════════════════════╗
║                     GUILD PROFILE                              ║
╚════════════════════════════════════════════════════════════════╝

GUILD INFORMATION:
  Name: ${guild.name}
  Tag: [${guild.tag}]
  Founder: ${guild.founder}
  Status: ${guild.status.toUpperCase()}
  Founded: ${new Date(guild.foundedAt).toLocaleDateString()}

STATISTICS:
  Level: ${guild.level}
  Members: ${stats.memberCount}/${guild.maxMembers}
  Treasury: ${stats.treasury.toLocaleString()} credits
  Experience: ${guild.experience.toLocaleString()}

MEMBER BREAKDOWN:
${guild.members.map((m) => `  • ${m.nickname} (${m.rank.toUpperCase()})`).join('\n')}

ACHIEVEMENTS: ${stats.achievements}

═══════════════════════════════════════════════════════════════════
`;
}

// Generate alliance summary
export function generateAllianceSummary(alliance: Alliance): string {
  return `
╔════════════════════════════════════════════════════════════════╗
║                  ALLIANCE SUMMARY                              ║
╚════════════════════════════════════════════════════════════════╝

ALLIANCE: ${alliance.name}
Type: ${alliance.type.toUpperCase()}
Created: ${new Date(alliance.createdAt).toLocaleDateString()}
${alliance.expiresAt ? `Expires: ${new Date(alliance.expiresAt).toLocaleDateString()}` : ''}

MEMBER GUILDS: ${alliance.guilds.length}
${alliance.guilds.map((guildId) => `  • Guild: ${guildId}`).join('\n')}

TREASURY: ${alliance.treasury.credits.toLocaleString()} credits
TERRITORY: ${alliance.territory.length} sectors
RELATIONSHIP: ${alliance.relationshipScore}/100

═══════════════════════════════════════════════════════════════════
`;
}
