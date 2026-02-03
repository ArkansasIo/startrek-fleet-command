/**
 * STAR TREK: FLEET COMMAND - ALLIANCE & FACTION SYSTEM (ENHANCED)
 * ===============================================================
 * Complete guild/faction management with 8+ factions and alliance mechanics
 */

export interface Faction {
  factionId: string;
  name: string;
  description: string;
  alignment: AlignmentType;
  homeworld: string;
  icon: string;
  bonuses: FactionBonus;
  joinCost: number;
  minLevel: number;
  warEnemies: string[];
  peacedWith: string[];
  technology: string[];
}

export interface FactionBonus {
  combatBonus: number;
  resourceBonus: number;
  speedBonus: number;
  researchBonus: number;
  dipomacyBonus: number;
}

export interface Alliance {
  allianceId: string;
  name: string;
  tag: string;
  leader: string;
  description: string;
  established: number;
  members: AllianceMember[];
  level: number;
  treasury: Map<string, number>;
  technologies: string[];
  wars: AllianceWar[];
  diplomacy: AllianceDiplomacy[];
  permissions: Map<AllianceRole, PermissionSet>;
}

export interface AllianceMember {
  playerId: string;
  joinDate: number;
  role: AllianceRole;
  contribution: number;
  rank: number;
  battleCount: number;
  victories: number;
}

export interface AllianceWar {
  allianceWarId: string;
  opponent: string;
  startDate: number;
  endDate: number | null;
  victoryPoints: number;
  opponentVictoryPoints: number;
  status: 'active' | 'ended' | 'truce';
}

export interface AllianceDiplomacy {
  allianceId: string;
  relation: DiplomaticRelation;
  status: DiplomaticStatus;
  since: number;
  treaty: string;
}

export interface PlayerFactionProgress {
  playerId: string;
  faction: string;
  level: number;
  reputation: number;
  reputationMax: number;
  benefits: FactionBenefit[];
  unlocked: boolean;
}

export interface FactionBenefit {
  benefitId: string;
  name: string;
  type: string;
  bonus: number;
  unlocked: boolean;
}

export interface PermissionSet {
  invite: boolean;
  remove: boolean;
  manage: boolean;
  withdraw: boolean;
  diplomacy: boolean;
  war: boolean;
  technology: boolean;
  treasury: boolean;
}

export type AlignmentType = 'federation' | 'klingon' | 'romulan' | 'dominion' | 'neutral' | 'borg' | 'independent';
export type AllianceRole = 'leader' | 'officer' | 'member' | 'recruiter' | 'diplomat';
export type DiplomaticRelation = 'allied' | 'friendly' | 'neutral' | 'hostile' | 'enemy';
export type DiplomaticStatus = 'active' | 'broken' | 'pending';

// ============================================================================
// FACTIONS - 8+
// ============================================================================

export const FACTION_FEDERATION: Faction = {
  factionId: 'faction_federation',
  name: 'United Federation of Planets',
  description: 'The noble alliance of peaceful worlds seeking knowledge and diplomacy.',
  alignment: 'federation',
  homeworld: 'Earth',
  icon: 'icon_federation',
  bonuses: {
    combatBonus: 0.15,
    resourceBonus: 0.10,
    speedBonus: 0.10,
    researchBonus: 0.25,
    dipomacyBonus: 0.30,
  },
  joinCost: 10000,
  minLevel: 5,
  warEnemies: ['faction_dominion', 'faction_borg'],
  peacedWith: ['faction_klingon'],
  technology: ['tech_warp_drive', 'tech_dilithium_refinement', 'tech_holodeck'],
};

export const FACTION_KLINGON: Faction = {
  factionId: 'faction_klingon',
  name: 'Klingon Empire',
  description: 'Warriors of honor seeking glory through conquest and battle.',
  alignment: 'klingon',
  homeworld: 'Qo\'noS',
  icon: 'icon_klingon',
  bonuses: {
    combatBonus: 0.35,
    resourceBonus: 0.05,
    speedBonus: 0.15,
    researchBonus: 0.10,
    dipomacyBonus: 0.05,
  },
  joinCost: 15000,
  minLevel: 10,
  warEnemies: ['faction_romulan'],
  peacedWith: ['faction_federation', 'faction_gorn'],
  technology: ['tech_disruptor_weapons', 'tech_cloaking', 'tech_honor_system'],
};

export const FACTION_ROMULAN: Faction = {
  factionId: 'faction_romulan',
  name: 'Romulan Star Empire',
  description: 'Cunning strategists operating in shadow and deception.',
  alignment: 'romulan',
  homeworld: 'Romulus',
  icon: 'icon_romulan',
  bonuses: {
    combatBonus: 0.20,
    resourceBonus: 0.20,
    speedBonus: 0.20,
    researchBonus: 0.15,
    dipomacyBonus: 0.15,
  },
  joinCost: 12000,
  minLevel: 8,
  warEnemies: ['faction_klingon', 'faction_federation'],
  peacedWith: [],
  technology: ['tech_cloaking', 'tech_deception', 'tech_espionage'],
};

export const FACTION_DOMINION: Faction = {
  factionId: 'faction_dominion',
  name: 'The Dominion',
  description: 'An all-powerful empire from another galaxy seeking order through control.',
  alignment: 'dominion',
  homeworld: 'The Gamma Quadrant',
  icon: 'icon_dominion',
  bonuses: {
    combatBonus: 0.40,
    resourceBonus: 0.25,
    speedBonus: 0.05,
    researchBonus: 0.20,
    dipomacyBonus: 0.10,
  },
  joinCost: 50000,
  minLevel: 30,
  warEnemies: ['faction_federation', 'faction_borg'],
  peacedWith: [],
  technology: ['tech_genetic_engineering', 'tech_shapeshifting', 'tech_dominion_weapons'],
};

export const FACTION_BORG_COLLECTIVE: Faction = {
  factionId: 'faction_borg',
  name: 'Borg Collective',
  description: 'The hive mind seeking perfection through assimilation.',
  alignment: 'borg',
  homeworld: 'Transwarp Hub',
  icon: 'icon_borg',
  bonuses: {
    combatBonus: 0.50,
    resourceBonus: 0.40,
    speedBonus: 0.35,
    researchBonus: 0.50,
    dipomacyBonus: 0.00,
  },
  joinCost: 100000,
  minLevel: 50,
  warEnemies: ['faction_federation', 'faction_dominion', 'faction_klingon'],
  peacedWith: [],
  technology: ['tech_assimilation', 'tech_nanoprobes', 'tech_transwarp', 'tech_temporal_mechanics'],
};

export const FACTION_FERENGI: Faction = {
  factionId: 'faction_ferengi',
  name: 'Ferengi Alliance',
  description: 'Shrewd traders seeking profit and economic dominance.',
  alignment: 'neutral',
  homeworld: 'Ferenginar',
  icon: 'icon_ferengi',
  bonuses: {
    combatBonus: 0.05,
    resourceBonus: 0.50,
    speedBonus: 0.10,
    researchBonus: 0.10,
    dipomacyBonus: 0.25,
  },
  joinCost: 20000,
  minLevel: 6,
  warEnemies: [],
  peacedWith: ['faction_federation', 'faction_klingon', 'faction_romulan'],
  technology: ['tech_warp_commerce', 'tech_trading_routes', 'tech_profit_maximization'],
};

export const FACTION_CARDASSIAN: Faction = {
  factionId: 'faction_cardassian',
  name: 'Cardassian Union',
  description: 'Militaristic expansionists seeking territorial conquest.',
  alignment: 'independent',
  homeworld: 'Cardassia Prime',
  icon: 'icon_cardassian',
  bonuses: {
    combatBonus: 0.25,
    resourceBonus: 0.15,
    speedBonus: 0.12,
    researchBonus: 0.12,
    dipomacyBonus: 0.08,
  },
  joinCost: 18000,
  minLevel: 12,
  warEnemies: ['faction_federation'],
  peacedWith: ['faction_dominion'],
  technology: ['tech_military_expansion', 'tech_enforcer_ships', 'tech_occupation'],
};

export const FACTION_GORN_HEGEMONY: Faction = {
  factionId: 'faction_gorn',
  name: 'Gorn Hegemony',
  description: 'Reptilian warriors defending their territorial expanses.',
  alignment: 'independent',
  homeworld: 'Gorn Homeworld',
  icon: 'icon_gorn',
  bonuses: {
    combatBonus: 0.30,
    resourceBonus: 0.10,
    speedBonus: 0.08,
    researchBonus: 0.08,
    dipomacyBonus: 0.12,
  },
  joinCost: 16000,
  minLevel: 10,
  warEnemies: ['faction_federation'],
  peacedWith: ['faction_klingon'],
  technology: ['tech_territorial_defense', 'tech_reptilian_biology', 'tech_egg_protection'],
};

export const ALL_FACTIONS: Faction[] = [
  FACTION_FEDERATION,
  FACTION_KLINGON,
  FACTION_ROMULAN,
  FACTION_DOMINION,
  FACTION_BORG_COLLECTIVE,
  FACTION_FERENGI,
  FACTION_CARDASSIAN,
  FACTION_GORN_HEGEMONY,
];

// ============================================================================
// ALLIANCE ROLE PERMISSIONS
// ============================================================================

export const DEFAULT_PERMISSIONS: Map<AllianceRole, PermissionSet> = new Map([
  ['leader', {
    invite: true, remove: true, manage: true, withdraw: true,
    diplomacy: true, war: true, technology: true, treasury: true,
  }],
  ['officer', {
    invite: true, remove: false, manage: true, withdraw: true,
    diplomacy: true, war: true, technology: false, treasury: true,
  }],
  ['member', {
    invite: false, remove: false, manage: false, withdraw: false,
    diplomacy: false, war: false, technology: false, treasury: false,
  }],
  ['recruiter', {
    invite: true, remove: false, manage: false, withdraw: false,
    diplomacy: false, war: false, technology: false, treasury: false,
  }],
  ['diplomat', {
    invite: false, remove: false, manage: false, withdraw: false,
    diplomacy: true, war: false, technology: false, treasury: false,
  }],
]);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getFactionById(factionId: string): Faction | undefined {
  return ALL_FACTIONS.find(f => f.factionId === factionId);
}

export function getFactionsByAlignment(alignment: AlignmentType): Faction[] {
  return ALL_FACTIONS.filter(f => f.alignment === alignment);
}

export function getFactionBonusMultiplier(faction: Faction, bonusType: keyof FactionBonus): number {
  return 1 + faction.bonuses[bonusType];
}

export function createAlliance(
  name: string,
  tag: string,
  leaderId: string,
  description: string
): Alliance {
  const alliance: Alliance = {
    allianceId: `alliance_${Date.now()}`,
    name,
    tag,
    leader: leaderId,
    description,
    established: Date.now(),
    members: [
      {
        playerId: leaderId,
        joinDate: Date.now(),
        role: 'leader',
        contribution: 0,
        rank: 1,
        battleCount: 0,
        victories: 0,
      },
    ],
    level: 1,
    treasury: new Map([['credits', 0], ['dilithium', 0]]),
    technologies: [],
    wars: [],
    diplomacy: [],
    permissions: DEFAULT_PERMISSIONS,
  };
  return alliance;
}

export function addMemberToAlliance(
  alliance: Alliance,
  playerId: string,
  role: AllianceRole = 'member'
): boolean {
  if (alliance.members.find(m => m.playerId === playerId)) return false;

  alliance.members.push({
    playerId,
    joinDate: Date.now(),
    role,
    contribution: 0,
    rank: alliance.members.length + 1,
    battleCount: 0,
    victories: 0,
  });

  return true;
}

export function removeMemberFromAlliance(alliance: Alliance, playerId: string): boolean {
  const index = alliance.members.findIndex(m => m.playerId === playerId);
  if (index === -1) return false;

  alliance.members.splice(index, 1);
  return true;
}

export function createPlayerFactionProgress(playerId: string, factionId: string): PlayerFactionProgress {
  return {
    playerId,
    faction: factionId,
    level: 1,
    reputation: 0,
    reputationMax: 1000,
    benefits: [],
    unlocked: false,
  };
}

export function addFactionReputation(progress: PlayerFactionProgress, amount: number): boolean {
  progress.reputation = Math.min(progress.reputationMax, progress.reputation + amount);

  if (progress.reputation >= progress.reputationMax && progress.level < 10) {
    progress.level++;
    progress.reputationMax = 1000 * progress.level;
    progress.reputation = 0;
    return true;
  }

  return false;
}

export function declareWar(alliance1: Alliance, alliance2Id: string): AllianceWar {
  const war: AllianceWar = {
    allianceWarId: `war_${Date.now()}`,
    opponent: alliance2Id,
    startDate: Date.now(),
    endDate: null,
    victoryPoints: 0,
    opponentVictoryPoints: 0,
    status: 'active',
  };

  alliance1.wars.push(war);
  return war;
}

export function updateAllianceWarPoints(
  alliance: Alliance,
  warId: string,
  points: number,
  forAlliance: boolean = true
): void {
  const war = alliance.wars.find(w => w.allianceWarId === warId);
  if (!war) return;

  if (forAlliance) {
    war.victoryPoints += points;
  } else {
    war.opponentVictoryPoints += points;
  }
}

export function getAllianceStats(alliance: Alliance): {
  memberCount: number;
  totalBattles: number;
  totalVictories: number;
  treasury: number;
  level: number;
  avgVictoryRate: number;
} {
  const totalBattles = alliance.members.reduce((sum, m) => sum + m.battleCount, 0);
  const totalVictories = alliance.members.reduce((sum, m) => sum + m.victories, 0);
  const treasury = alliance.treasury.get('credits') || 0;

  return {
    memberCount: alliance.members.length,
    totalBattles,
    totalVictories,
    treasury,
    level: alliance.level,
    avgVictoryRate: totalBattles > 0 ? totalVictories / totalBattles : 0,
  };
}

export function establishDiplomacy(
  alliance1: Alliance,
  alliance2Id: string,
  relation: DiplomaticRelation,
  treaty: string = ''
): AllianceDiplomacy {
  const diplomacy: AllianceDiplomacy = {
    allianceId: alliance2Id,
    relation,
    status: 'active',
    since: Date.now(),
    treaty,
  };

  alliance1.diplomacy.push(diplomacy);
  return diplomacy;
}
