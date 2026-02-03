// FactionsSystem.ts
// Faction and reputation system

export type FactionAlignment = 'federation' | 'klingon' | 'romulan' | 'ferengi' | 'dominion' | 'neutral';
export type ReputationTier = 'enemy' | 'unfriendly' | 'neutral' | 'friendly' | 'honored' | 'revered';
export type FactionBonus = 'combat' | 'diplomacy' | 'trade' | 'exploration' | 'intel';

export interface Faction {
  id: string;
  name: string;
  alignment: FactionAlignment;
  description: string;
  headquartersSector: string;
  icon: string;
  enemies: string[]; // Faction IDs
  allies: string[]; // Faction IDs
  government: string;
  culture: string;
  strength: number; // Military strength 0-100
  influence: number; // Political influence 0-100
  treasury: number;
  territory: string[]; // Sector IDs
  objectives: FactionObjective[];
  events: FactionEvent[];
  maxReputationBonus: number;
}

export interface PlayerReputation {
  playerId: string;
  factionId: string;
  reputation: number; // -10000 to 10000
  tier: ReputationTier;
  standing: 'favorable' | 'neutral' | 'hostile';
  questsCompleted: number;
  questsFailed: number;
  lastInteraction: number;
  bonuses: ReputationBonus[];
}

export interface ReputationBonus {
  type: FactionBonus;
  modifier: number; // Percentage
  description: string;
}

export interface FactionObjective {
  id: string;
  description: string;
  type: 'military' | 'economic' | 'diplomatic' | 'exploration';
  priority: number; // 1-10
  progress: number; // 0-100
  deadline?: number;
  reward: {
    influence: number;
    treasury: number;
  };
}

export interface FactionEvent {
  id: string;
  name: string;
  description: string;
  type: 'war' | 'peace' | 'trade' | 'exploration' | 'disaster';
  impact: 'positive' | 'negative' | 'neutral';
  affectedFactions: string[];
  startTime: number;
  duration: number;
  globalEffects?: Record<string, number>;
}

export interface FactionDiplomacy {
  id: string;
  faction1: string;
  faction2: string;
  relationshipScore: number; // -100 to 100
  status: 'peace' | 'war' | 'cold_war' | 'alliance' | 'neutral';
  treatiesActive: string[];
  tradingPosts: number;
  jointOperations: number;
}

// Create faction
export function createFaction(
  name: string,
  alignment: FactionAlignment,
  governmentType: string,
  headquartersSector: string
): Faction {
  return {
    id: `faction_${alignment}_${Date.now()}`,
    name,
    alignment,
    description: `The ${name} faction`,
    headquartersSector,
    icon: `faction_${alignment}`,
    enemies: [],
    allies: [],
    government: governmentType,
    culture: `${name} Culture`,
    strength: 50,
    influence: 50,
    treasury: 100000,
    territory: [headquartersSector],
    objectives: generateFactionObjectives(),
    events: [],
    maxReputationBonus: 50,
  };
}

// Generate faction objectives
function generateFactionObjectives(): FactionObjective[] {
  return [
    {
      id: 'obj_1',
      description: 'Expand territory',
      type: 'military',
      priority: 8,
      progress: 0,
      reward: { influence: 1000, treasury: 50000 },
    },
    {
      id: 'obj_2',
      description: 'Establish trade routes',
      type: 'economic',
      priority: 6,
      progress: 0,
      reward: { influence: 500, treasury: 25000 },
    },
    {
      id: 'obj_3',
      description: 'Form diplomatic relations',
      type: 'diplomatic',
      priority: 7,
      progress: 0,
      reward: { influence: 750, treasury: 15000 },
    },
  ];
}

// Initialize player reputation
export function initializePlayerReputation(
  playerId: string,
  factionId: string
): PlayerReputation {
  return {
    playerId,
    factionId,
    reputation: 0,
    tier: 'neutral',
    standing: 'neutral',
    questsCompleted: 0,
    questsFailed: 0,
    lastInteraction: Date.now(),
    bonuses: [],
  };
}

// Add reputation
export function addReputation(
  rep: PlayerReputation,
  amount: number,
  maxReputation: number
): PlayerReputation {
  const newReputation = Math.min(rep.reputation + amount, maxReputation);
  const newTier = calculateReputationTier(newReputation);

  const bonuses = calculateReputationBonuses(newTier, maxReputation);

  return {
    ...rep,
    reputation: newReputation,
    tier: newTier,
    bonuses,
    lastInteraction: Date.now(),
  };
}

// Remove reputation
export function removeReputation(rep: PlayerReputation, amount: number): PlayerReputation {
  const newReputation = Math.max(rep.reputation - amount, -10000);
  const newTier = calculateReputationTier(newReputation);
  const newStanding = newReputation > 0 ? 'favorable' : newReputation < 0 ? 'hostile' : 'neutral';

  const bonuses = calculateReputationBonuses(newTier, 10000);

  return {
    ...rep,
    reputation: newReputation,
    tier: newTier,
    standing: newStanding,
    bonuses,
    lastInteraction: Date.now(),
  };
}

// Calculate reputation tier
function calculateReputationTier(reputation: number): ReputationTier {
  if (reputation < -5000) return 'enemy';
  if (reputation < -2500) return 'unfriendly';
  if (reputation < 2500) return 'neutral';
  if (reputation < 5000) return 'friendly';
  if (reputation < 7500) return 'honored';
  return 'revered';
}

// Calculate reputation bonuses
function calculateReputationBonuses(tier: ReputationTier, maxReputation: number): ReputationBonus[] {
  const bonuses: ReputationBonus[] = [];

  const bonusMap: Record<ReputationTier, ReputationBonus[]> = {
    enemy: [
      { type: 'trade', modifier: -50, description: 'Trade prices increased' },
    ],
    unfriendly: [
      { type: 'trade', modifier: -25, description: 'Trade prices increased' },
    ],
    neutral: [],
    friendly: [
      { type: 'trade', modifier: 10, description: 'Trade prices reduced' },
      { type: 'exploration', modifier: 5, description: 'Slightly better discoveries' },
    ],
    honored: [
      { type: 'combat', modifier: 15, description: 'Combat bonus' },
      { type: 'trade', modifier: 20, description: 'Trade prices reduced' },
      { type: 'diplomacy', modifier: 10, description: 'Diplomatic bonus' },
    ],
    revered: [
      { type: 'combat', modifier: 25, description: 'Combat bonus' },
      { type: 'trade', modifier: 30, description: 'Trade prices reduced' },
      { type: 'diplomacy', modifier: 20, description: 'Diplomatic bonus' },
      { type: 'exploration', modifier: 15, description: 'Better discoveries' },
      { type: 'intel', modifier: 10, description: 'Better intel' },
    ],
  };

  return bonusMap[tier] || [];
}

// Complete faction quest
export function completeFactionQuest(rep: PlayerReputation, reputationGain: number): PlayerReputation {
  const updated = addReputation(rep, reputationGain, 10000);
  return {
    ...updated,
    questsCompleted: rep.questsCompleted + 1,
  };
}

// Fail faction quest
export function failFactionQuest(rep: PlayerReputation, reputationLoss: number): PlayerReputation {
  const updated = removeReputation(rep, reputationLoss);
  return {
    ...updated,
    questsFailed: rep.questsFailed + 1,
  };
}

// Create faction diplomacy
export function createFactionDiplomacy(
  faction1: string,
  faction2: string,
  initialStatus: FactionDiplomacy['status'] = 'neutral'
): FactionDiplomacy {
  return {
    id: `diplo_${Date.now()}`,
    faction1,
    faction2,
    relationshipScore: 50,
    status: initialStatus,
    treatiesActive: [],
    tradingPosts: 0,
    jointOperations: 0,
  };
}

// Modify relationship
export function modifyRelationship(
  diplomacy: FactionDiplomacy,
  amount: number
): FactionDiplomacy {
  const newScore = Math.max(-100, Math.min(100, diplomacy.relationshipScore + amount));

  let newStatus = diplomacy.status;
  if (newScore < -75) newStatus = 'war';
  else if (newScore < -25) newStatus = 'cold_war';
  else if (newScore > 75) newStatus = 'alliance';
  else if (newScore < -10 || newScore > 10) newStatus = 'peace';
  else newStatus = 'neutral';

  return {
    ...diplomacy,
    relationshipScore: newScore,
    status: newStatus,
  };
}

// Form treaty
export function formTreaty(diplomacy: FactionDiplomacy, treatyName: string): FactionDiplomacy {
  return {
    ...diplomacy,
    treatiesActive: [...diplomacy.treatiesActive, treatyName],
  };
}

// Establish trading post
export function establishTradingPost(diplomacy: FactionDiplomacy): FactionDiplomacy {
  return {
    ...diplomacy,
    tradingPosts: diplomacy.tradingPosts + 1,
  };
}

// Create faction event
export function createFactionEvent(
  name: string,
  type: FactionEvent['type'],
  affectedFactions: string[],
  duration: number = 604800000 // 1 week
): FactionEvent {
  return {
    id: `event_${Date.now()}`,
    name,
    description: `A ${type} event involving ${affectedFactions.join(', ')}`,
    type,
    impact: type === 'disaster' || type === 'war' ? 'negative' : 'positive',
    affectedFactions,
    startTime: Date.now(),
    duration,
    globalEffects: generateEventEffects(type),
  };
}

// Generate event effects
function generateEventEffects(type: FactionEvent['type']): Record<string, number> {
  switch (type) {
    case 'war':
      return { influence: -20, strength: 30, treasury: -10000 };
    case 'peace':
      return { influence: 20, treasury: 5000, tradeBonus: 10 };
    case 'trade':
      return { treasury: 20000, tradeBonus: 25 };
    case 'exploration':
      return { territory: 1, influence: 10 };
    case 'disaster':
      return { strength: -15, treasury: -50000, influence: -30 };
    default:
      return {};
  }
}

// Update faction objective
export function updateFactionObjective(
  faction: Faction,
  objectiveId: string,
  progress: number
): Faction {
  return {
    ...faction,
    objectives: faction.objectives.map((obj) => {
      if (obj.id === objectiveId) {
        const newProgress = Math.min(progress, 100);
        if (newProgress === 100) {
          faction.influence += obj.reward.influence;
          faction.treasury += obj.reward.treasury;
        }
        return {
          ...obj,
          progress: newProgress,
        };
      }
      return obj;
    }),
  };
}

// Get faction alignment bonuses
export function getFactionAlignmentBonuses(alignment: FactionAlignment): Record<string, number> {
  const bonusMap: Record<FactionAlignment, Record<string, number>> = {
    federation: { diplomacy: 20, exploration: 15, defense: 10 },
    klingon: { combat: 25, strength: 20, honor: 15 },
    romulan: { intel: 25, stealth: 20, deception: 15 },
    ferengi: { trade: 30, profit: 25, commerce: 20 },
    dominion: { combat: 30, hierarchy: 20, dominion_bonus: 25 },
    neutral: { flexibility: 10 },
  };

  return bonusMap[alignment] || {};
}

// Generate faction report
export function generateFactionReport(faction: Faction): string {
  return `
╔════════════════════════════════════════════════════════════════╗
║                    FACTION REPORT                              ║
╚════════════════════════════════════════════════════════════════╝

FACTION: ${faction.name}
Government: ${faction.government}
Alignment: ${faction.alignment.toUpperCase()}
Status: ACTIVE

POWER STATISTICS:
  Military Strength: ${faction.strength}/100
  Political Influence: ${faction.influence}/100
  Treasury: ${faction.treasury.toLocaleString()} credits
  Territory: ${faction.territory.length} sectors

ALLIES: ${faction.allies.length}
ENEMIES: ${faction.enemies.length}

OBJECTIVES:
${faction.objectives.map((obj) => `  • ${obj.description} [${obj.progress}%]`).join('\n')}

═══════════════════════════════════════════════════════════════════
`;
}

// Generate reputation summary
export function generateReputationSummary(rep: PlayerReputation, factionName: string): string {
  return `
╔════════════════════════════════════════════════════════════════╗
║                  REPUTATION SUMMARY                            ║
╚════════════════════════════════════════════════════════════════╝

FACTION: ${factionName}
Standing: ${rep.standing.toUpperCase()}
Tier: ${rep.tier.toUpperCase()}
Reputation: ${rep.reputation} / 10000

STATISTICS:
  Quests Completed: ${rep.questsCompleted}
  Quests Failed: ${rep.questsFailed}
  Last Interaction: ${new Date(rep.lastInteraction).toLocaleDateString()}

BONUSES:
${rep.bonuses.map((b) => `  ${b.type.toUpperCase()}: +${b.modifier}% - ${b.description}`).join('\n')}

═══════════════════════════════════════════════════════════════════
`;
}
